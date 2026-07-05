'use client';

import { useEffect, useRef, useState } from 'react';

const MAX_POINTS = 5;
const BGM_PATH = '/games/chargeBurst/bgm.mp3';
const START_SOUND_PATH = '/games/chargeBurst/start.mp3';
const CHARGE_SOUND_PATH = '/games/chargeBurst/charge.mp3';
const BARRIER_SOUND_PATH = '/games/chargeBurst/barrier.mp3';
const BURST_SOUND_PATH = '/games/chargeBurst/burst.mp3';
const DAMAGE_SOUND_PATH = '/games/chargeBurst/damage.mp3';
const CHARGE_EFFECT_PATH = '/games/chargeBurst/charge.png';
const BARRIER_EFFECT_PATH = '/games/chargeBurst/barrier.png';
const BURST_EFFECT_PATH = '/games/chargeBurst/burst.png';
const CHARGE_EFFECT_FRAME_COUNT = 10;
const BARRIER_EFFECT_FRAME_COUNT = 5;
const BURST_EFFECT_FRAME_COUNT = 7;
const CHARGE_EFFECT_FRAME_MS = 60;
const BARRIER_EFFECT_FRAME_MS = 80;
const BURST_EFFECT_FRAME_MS = 70;

type Action = 'charge' | 'barrier' | 'burst';
type CharacterSide = 'enemy' | 'player';
type EffectType = 'charge' | 'barrier' | 'burst';

const actionSoundPaths: Record<Action, string> = {
  charge: CHARGE_SOUND_PATH,
  barrier: BARRIER_SOUND_PATH,
  burst: BURST_SOUND_PATH,
};

const actionButtonClass =
  'block cursor-pointer hover:underline disabled:cursor-not-allowed disabled:text-slate-400 disabled:hover:no-underline';

const getBlinkClassName = (isBlinking: boolean, isVisible: boolean) =>
  isBlinking && !isVisible ? 'opacity-0' : '';

type GaugeProps = {
  label: string;
  points: number;
  maxPoints?: number;
  fillClassName: string;
  isBlinking?: boolean;
  isBlinkVisible?: boolean;
};

type BgmToggleProps = {
  isEnabled: boolean;
  onToggle: () => void;
};

type SpriteEffectProps = {
  frame: number | null;
  side: CharacterSide;
  type: EffectType;
};

const effectConfigs: Record<
  EffectType,
  {
    path: string;
    frameCount: number;
    frameMs: number;
    classNames: Record<CharacterSide, string>;
  }
> = {
  charge: {
    path: CHARGE_EFFECT_PATH,
    frameCount: CHARGE_EFFECT_FRAME_COUNT,
    frameMs: CHARGE_EFFECT_FRAME_MS,
    classNames: {
      enemy: 'left-[0%] translate-y-[-45%] mix-blend-screen',
      player: 'left-[110%] translate-y-[-45%] mix-blend-screen',
    },
  },
  barrier: {
    path: BARRIER_EFFECT_PATH,
    frameCount: BARRIER_EFFECT_FRAME_COUNT,
    frameMs: BARRIER_EFFECT_FRAME_MS,
    classNames: {
      enemy: 'left-[45%] translate-y-[-30%] -rotate-90',
      player: 'left-[120%] translate-y-[-65%] rotate-90',
    },
  },
  burst: {
    path: BURST_EFFECT_PATH,
    frameCount: BURST_EFFECT_FRAME_COUNT,
    frameMs: BURST_EFFECT_FRAME_MS,
    classNames: {
      enemy: 'right-[20%] translate-y-[-40%] -rotate-[135deg]',
      player: 'left-[210%] translate-y-[-100%] rotate-45',
    },
  },
};

const initialEffectSideFrames: Record<CharacterSide, number | null> = {
  enemy: null,
  player: null,
};

const initialEffectFrames: Record<
  EffectType,
  Record<CharacterSide, number | null>
> = {
  charge: { ...initialEffectSideFrames },
  barrier: { ...initialEffectSideFrames },
  burst: { ...initialEffectSideFrames },
};

const BgmToggle = ({ isEnabled, onToggle }: BgmToggleProps) => {
  return (
    <button
      type="button"
      className="flex items-center gap-2 text-sm"
      onClick={onToggle}
    >
      <span>BGM</span>
      <span
        className={`relative inline-block h-5 w-10 shrink-0 border ${
          isEnabled ? 'bg-amber-500' : 'bg-slate-700'
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-4 w-4 bg-white transition-transform ${
            isEnabled ? 'translate-x-[18px]' : 'translate-x-0'
          }`}
        />
      </span>
      <span>{isEnabled ? 'ON' : 'OFF'}</span>
    </button>
  );
};

const SpriteEffect = ({ frame, side, type }: SpriteEffectProps) => {
  if (frame === null) {
    return null;
  }

  const config = effectConfigs[type];

  return (
    <div
      className={`pointer-events-none absolute top-1/2 h-32 w-32 bg-no-repeat ${config.classNames[side]}`}
      style={{
        backgroundImage: `url(${config.path})`,
        backgroundSize: `${config.frameCount * 100}% 100%`,
        backgroundPosition: `${(frame / (config.frameCount - 1)) * 100}% 0`,
      }}
    />
  );
};

const Gauge = ({
  label,
  points,
  maxPoints = 5,
  fillClassName,
  isBlinking = false,
  isBlinkVisible = true,
}: GaugeProps) => {
  const filledPoints = Math.max(0, Math.min(points, maxPoints));

  return (
    <div className={getBlinkClassName(isBlinking, isBlinkVisible)}>
      <span className="text-sm">{label}</span>
      <div className="flex w-24 gap-0.5">
        {Array.from({ length: maxPoints }, (_, index) => (
          <div
            key={`${label}-${index}`}
            className={`h-2 flex-1 ${
              index < filledPoints ? fillClassName : 'bg-slate-800'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

type WeightedAction = {
  action: Action;
  weight: number;
};

const chooseWeightedAction = (actions: WeightedAction[]) => {
  const totalWeight = actions.reduce((sum, item) => sum + item.weight, 0);
  let randomValue = Math.random() * totalWeight;

  for (const item of actions) {
    randomValue -= item.weight;

    if (randomValue <= 0) {
      return item.action;
    }
  }

  return actions[actions.length - 1].action;
};

const decideEnemyAction = ({
  playerHp,
  playerEnergy,
  enemyHp,
  enemyEnergy,
}: {
  playerHp: number;
  playerEnergy: number;
  enemyHp: number;
  enemyEnergy: number;
}): Action => {
  if (enemyEnergy === 0) {
    if (playerEnergy === 0) {
      return 'charge';
    }

    return chooseWeightedAction([
      { action: 'barrier', weight: 7 },
      { action: 'charge', weight: 3 },
    ]);
  }

  if (playerHp === 1) {
    return chooseWeightedAction([
      { action: 'burst', weight: 6 },
      { action: 'barrier', weight: 3 },
      { action: 'charge', weight: 1 },
    ]);
  }

  if (enemyHp === 1 && playerEnergy > 0) {
    return chooseWeightedAction([
      { action: 'barrier', weight: 7 },
      { action: 'burst', weight: 2 },
      { action: 'charge', weight: 1 },
    ]);
  }

  if (playerEnergy === 0) {
    return chooseWeightedAction([
      { action: enemyEnergy < MAX_POINTS ? 'charge' : 'burst', weight: 6 },
      { action: 'burst', weight: 4 },
    ]);
  }

  if (playerEnergy >= 3) {
    return chooseWeightedAction([
      { action: 'barrier', weight: 5 },
      { action: 'burst', weight: 4 },
      { action: 'charge', weight: 1 },
    ]);
  }

  return chooseWeightedAction([
    { action: 'burst', weight: 5 },
    { action: 'barrier', weight: 4 },
    { action: 'charge', weight: 1 },
  ]);
};

const ChargeBurst = () => {
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const isResolvingTurnRef = useRef(false);
  const damageBlinkIntervalRef = useRef<number | null>(null);
  const effectIntervalRefs = useRef<
    Record<EffectType, Record<CharacterSide, number | null>>
  >({
    charge: {
      enemy: null,
      player: null,
    },
    barrier: {
      enemy: null,
      player: null,
    },
    burst: {
      enemy: null,
      player: null,
    },
  });
  const [isStarted, setIsStarted] = useState(false);
  const [playerHp, setPlayerHp] = useState(MAX_POINTS);
  const [playerEnergy, setPlayerEnergy] = useState(0);
  const [enemyHp, setEnemyHp] = useState(MAX_POINTS);
  const [enemyEnergy, setEnemyEnergy] = useState(0);
  const [message, setMessage] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);
  const [showRetry, setShowRetry] = useState(false);
  const [isResolvingTurn, setIsResolvingTurn] = useState(false);
  const [isPlayerHpBlinking, setIsPlayerHpBlinking] = useState(false);
  const [isEnemyHpBlinking, setIsEnemyHpBlinking] = useState(false);
  const [isDamageBlinkVisible, setIsDamageBlinkVisible] = useState(true);
  const [isBgmEnabled, setIsBgmEnabled] = useState(true);
  const [effectFrames, setEffectFrames] = useState(initialEffectFrames);

  const stopBgm = () => {
    const bgm = bgmRef.current;

    if (!bgm) {
      return;
    }

    bgm.pause();
    bgm.currentTime = 0;
  };

  const stopDamageBlink = () => {
    if (damageBlinkIntervalRef.current !== null) {
      window.clearInterval(damageBlinkIntervalRef.current);
      damageBlinkIntervalRef.current = null;
    }

    setIsDamageBlinkVisible(true);
    setIsPlayerHpBlinking(false);
    setIsEnemyHpBlinking(false);
  };

  const clearEffect = (type: EffectType, target: CharacterSide) => {
    const intervalId = effectIntervalRefs.current[type][target];

    if (intervalId !== null) {
      window.clearInterval(intervalId);
      effectIntervalRefs.current[type][target] = null;
    }

    setEffectFrames((currentFrames) => ({
      ...currentFrames,
      [type]: {
        ...currentFrames[type],
        [target]: null,
      },
    }));
  };

  const startEffect = (type: EffectType, target: CharacterSide) => {
    clearEffect(type, target);

    const config = effectConfigs[type];

    setEffectFrames((currentFrames) => ({
      ...currentFrames,
      [type]: {
        ...currentFrames[type],
        [target]: 0,
      },
    }));

    effectIntervalRefs.current[type][target] = window.setInterval(() => {
      setEffectFrames((currentFrames) => {
        const currentFrame = currentFrames[type][target];
        const nextFrame = currentFrame === null ? 0 : currentFrame + 1;

        if (nextFrame >= config.frameCount) {
          const intervalId = effectIntervalRefs.current[type][target];

          if (intervalId !== null) {
            window.clearInterval(intervalId);
            effectIntervalRefs.current[type][target] = null;
          }

          return {
            ...currentFrames,
            [type]: {
              ...currentFrames[type],
              [target]: null,
            },
          };
        }

        return {
          ...currentFrames,
          [type]: {
            ...currentFrames[type],
            [target]: nextFrame,
          },
        };
      });
    }, config.frameMs);
  };

  const playBgm = () => {
    if (!bgmRef.current) {
      bgmRef.current = new Audio(BGM_PATH);
      bgmRef.current.loop = true;
      bgmRef.current.volume = 0.5;
    }

    const bgm = bgmRef.current;
    bgm.currentTime = 0;
    bgm.play().catch(() => {
      setMessage('BGMを再生できませんでした');
    });
  };

  const playSound = (src: string) => {
    return new Promise<void>((resolve) => {
      const audio = new Audio(src);
      audio.volume = 0.7;

      const cleanup = () => {
        audio.onended = null;
        audio.onerror = null;
        resolve();
      };

      audio.onended = cleanup;
      audio.onerror = cleanup;
      audio.play().catch(() => {
        setMessage('効果音を再生できませんでした');
        cleanup();
      });
    });
  };

  const playStartSound = () => {
    return playSound(START_SOUND_PATH);
  };

  const playActionSound = (action: Action) => {
    return playSound(actionSoundPaths[action]);
  };

  const playTurnSounds = async ({
    playerAction,
    enemyAction,
    playerDamaged,
    enemyDamaged,
  }: {
    playerAction: Action;
    enemyAction: Action;
    playerDamaged: boolean;
    enemyDamaged: boolean;
  }) => {
    isResolvingTurnRef.current = true;
    setIsResolvingTurn(true);

    startEffect(playerAction, 'player');
    startEffect(enemyAction, 'enemy');

    await Promise.all([
      playActionSound(playerAction),
      playActionSound(enemyAction),
    ]);

    if (playerDamaged || enemyDamaged) {
      damageBlinkIntervalRef.current = window.setInterval(() => {
        setIsDamageBlinkVisible((current) => !current);
      }, 120);

      setIsPlayerHpBlinking(playerDamaged);
      setIsEnemyHpBlinking(enemyDamaged);
      await playSound(DAMAGE_SOUND_PATH);
      stopDamageBlink();
    }

    isResolvingTurnRef.current = false;
    setIsResolvingTurn(false);
  };

  const resetGame = () => {
    setPlayerHp(MAX_POINTS);
    setPlayerEnergy(0);
    setEnemyHp(MAX_POINTS);
    setEnemyEnergy(0);
    setMessage('');
    setIsGameOver(false);
    setShowRetry(false);
    setIsResolvingTurn(false);
    stopDamageBlink();
    Object.keys(effectConfigs).forEach((type) => {
      clearEffect(type as EffectType, 'player');
      clearEffect(type as EffectType, 'enemy');
    });
    isResolvingTurnRef.current = false;
  };

  const startGame = () => {
    void playStartSound();
    resetGame();
    setIsStarted(true);
    if (isBgmEnabled) {
      playBgm();
    }
  };

  const toggleBgm = () => {
    const nextIsEnabled = !isBgmEnabled;

    setIsBgmEnabled(nextIsEnabled);

    if (!nextIsEnabled) {
      stopBgm();
      return;
    }

    if (isStarted && !isGameOver) {
      playBgm();
    }
  };

  const handleAction = (playerAction: Action) => {
    if (
      !isStarted ||
      isGameOver ||
      isResolvingTurnRef.current ||
      (playerAction === 'burst' && playerEnergy === 0)
    ) {
      return;
    }

    const enemyAction = decideEnemyAction({
      playerHp,
      playerEnergy,
      enemyHp,
      enemyEnergy,
    });

    let nextPlayerHp = playerHp;
    let nextPlayerEnergy = playerEnergy;
    let nextEnemyHp = enemyHp;
    let nextEnemyEnergy = enemyEnergy;

    if (playerAction === 'charge') {
      nextPlayerEnergy = Math.min(MAX_POINTS, nextPlayerEnergy + 1);
    }

    if (enemyAction === 'charge') {
      nextEnemyEnergy = Math.min(MAX_POINTS, nextEnemyEnergy + 1);
    }

    if (playerAction === 'burst') {
      nextPlayerEnergy -= 1;
    }

    if (enemyAction === 'burst') {
      nextEnemyEnergy -= 1;
    }

    if (playerAction === 'burst' && enemyAction === 'charge') {
      nextEnemyHp -= 1;
    }

    if (enemyAction === 'burst' && playerAction === 'charge') {
      nextPlayerHp -= 1;
    }

    const playerDamaged = nextPlayerHp < playerHp;
    const enemyDamaged = nextEnemyHp < enemyHp;
    const turnSoundsPromise = playTurnSounds({
      playerAction,
      enemyAction,
      playerDamaged,
      enemyDamaged,
    });

    setPlayerEnergy(nextPlayerEnergy);
    setEnemyEnergy(nextEnemyEnergy);
    void turnSoundsPromise.then(() => {
      setPlayerHp(nextPlayerHp);
      setEnemyHp(nextEnemyHp);

      if (nextEnemyHp <= 0) {
        setIsGameOver(true);
        stopBgm();
        setTimeout(() => {
          window.confirm('勝利しました');
          resetGame();
          setIsStarted(false);
        }, 0);
        return;
      }

      if (nextPlayerHp <= 0) {
        setIsGameOver(true);
        stopBgm();
        setTimeout(() => {
          window.alert('敗北しました。');
          setMessage('敗北しました。');
          setShowRetry(true);
        }, 0);
      }
    });
  };

  useEffect(() => {
    return () => {
      const bgm = bgmRef.current;

      if (bgm) {
        bgm.pause();
        bgm.currentTime = 0;
      }

      if (damageBlinkIntervalRef.current !== null) {
        window.clearInterval(damageBlinkIntervalRef.current);
      }

      Object.values(effectIntervalRefs.current).forEach((sideIntervalRefs) => {
        Object.values(sideIntervalRefs).forEach((intervalId) => {
          if (intervalId !== null) {
            window.clearInterval(intervalId);
          }
        });
      });
    };
  }, []);

  return (
    <>
      <div className="my-6 mx-4 px-3 space-y-4 border h-[calc(100vh-200px)]">
        <h1 className="my-2 text-2xl font-bold flex justify-center">
          チャージバースト
        </h1>
        {!isStarted ? (
          <div className="mx-auto flex min-h-[360px] w-[800px] flex-col items-center justify-center bg-slate-600">
            <p className="mb-4 text-lg font-bold">ゲーム開始しますか？</p>
            <button
              type="button"
              className="border px-5 py-2 hover:bg-slate-500"
              onClick={startGame}
            >
              開始
            </button>
            <div className="mt-12">
              <BgmToggle isEnabled={isBgmEnabled} onToggle={toggleBgm} />
            </div>
          </div>
        ) : (
          <div className="mx-auto flex flex-col w-[800px] justify-center bg-slate-600">
            <div className="mx-24 mt-3 flex justify-start">
              <BgmToggle isEnabled={isBgmEnabled} onToggle={toggleBgm} />
            </div>
            {/* enemy */}
            <div className="mx-24 flex flex-row space-x-4 justify-end">
              <div className="relative space-y-1">
                <Gauge
                  label="HP"
                  points={enemyHp}
                  fillClassName="bg-lime-400"
                  isBlinking={isEnemyHpBlinking}
                  isBlinkVisible={isDamageBlinkVisible}
                />
                <Gauge
                  label="ENERGY"
                  points={enemyEnergy}
                  fillClassName="bg-amber-500"
                  isBlinking={isEnemyHpBlinking}
                  isBlinkVisible={isDamageBlinkVisible}
                />
                <div className="relative h-32 w-32">
                  <SpriteEffect
                    frame={effectFrames.charge.enemy}
                    side="enemy"
                    type="charge"
                  />
                  <SpriteEffect
                    frame={effectFrames.barrier.enemy}
                    side="enemy"
                    type="barrier"
                  />
                  <SpriteEffect
                    frame={effectFrames.burst.enemy}
                    side="enemy"
                    type="burst"
                  />
                </div>
              </div>
              <div className="relative w-[15%]">
                <img
                  src="/games/chargeBurst/enemy.png"
                  alt="敵キャラクター"
                  className={`w-full ${getBlinkClassName(
                    isEnemyHpBlinking,
                    isDamageBlinkVisible,
                  )}`}
                />
              </div>
            </div>
            {/* ally */}
            <div className="mx-24 my-8 h-[200px] flex flex-row space-x-4 items-center justify-between">
              <div className="relative space-y-1">
                <SpriteEffect
                  frame={effectFrames.charge.player}
                  side="player"
                  type="charge"
                />
                <SpriteEffect
                  frame={effectFrames.barrier.player}
                  side="player"
                  type="barrier"
                />
                <SpriteEffect
                  frame={effectFrames.burst.player}
                  side="player"
                  type="burst"
                />
                <Gauge
                  label="HP"
                  points={playerHp}
                  fillClassName="bg-lime-400"
                  isBlinking={isPlayerHpBlinking}
                  isBlinkVisible={isDamageBlinkVisible}
                />
                <Gauge
                  label="ENERGY"
                  points={playerEnergy}
                  fillClassName="bg-amber-500"
                  isBlinking={isPlayerHpBlinking}
                  isBlinkVisible={isDamageBlinkVisible}
                />
              </div>
              <div className="mt-8 px-2 py-1 w-36 border">
                <button
                  type="button"
                  className={actionButtonClass}
                  disabled={isGameOver || isResolvingTurn}
                  onClick={() => handleAction('charge')}
                >
                  チャージ
                </button>
                <button
                  type="button"
                  className={actionButtonClass}
                  disabled={isGameOver || isResolvingTurn}
                  onClick={() => handleAction('barrier')}
                >
                  バリア
                </button>
                <button
                  type="button"
                  className={actionButtonClass}
                  disabled={playerEnergy === 0 || isGameOver || isResolvingTurn}
                  onClick={() => handleAction('burst')}
                >
                  バースト
                </button>
              </div>
            </div>
            <div className="mx-24 mb-6 border-t border-slate-500 pt-3 text-sm">
              {message}
              {showRetry && (
                <button
                  type="button"
                  className="mt-3 block border px-4 py-1 hover:bg-slate-500"
                  onClick={startGame}
                >
                  リトライ
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ChargeBurst;
