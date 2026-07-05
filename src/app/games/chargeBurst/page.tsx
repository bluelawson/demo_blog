'use client';

import { useEffect, useRef, useState } from 'react';

const MAX_POINTS = 5;
const BGM_PATH = '/games/chargeBurst/bgm.mp3';
const START_SOUND_PATH = '/games/chargeBurst/start.mp3';
const CHARGE_SOUND_PATH = '/games/chargeBurst/charge.mp3';
const BARRIER_SOUND_PATH = '/games/chargeBurst/barrier.mp3';
const BURST_SOUND_PATH = '/games/chargeBurst/burst.mp3';
const DAMAGE_SOUND_PATH = '/games/chargeBurst/damage.mp3';
const BARRIER_EFFECT_PATH = '/games/chargeBurst/barrier.png';
const BARRIER_EFFECT_FRAME_COUNT = 5;
const BARRIER_EFFECT_FRAME_MS = 80;

type Action = 'charge' | 'barrier' | 'burst';
type CharacterSide = 'enemy' | 'player';

const actionLabels: Record<Action, string> = {
  charge: 'チャージ',
  barrier: 'バリア',
  burst: 'バースト',
};

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

type BarrierEffectProps = {
  frame: number | null;
  side: CharacterSide;
};

const barrierEffectClassNames: Record<CharacterSide, string> = {
  enemy: 'left-[45%] translate-y-[-30%] -rotate-90',
  player: 'left-[120%] translate-y-[-65%] rotate-90',
};

const initialBarrierEffectFrames: Record<CharacterSide, number | null> = {
  enemy: null,
  player: null,
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

const BarrierEffect = ({ frame, side }: BarrierEffectProps) => {
  if (frame === null) {
    return null;
  }

  return (
    <div
      className={`pointer-events-none absolute top-1/2 h-32 w-32 bg-no-repeat ${barrierEffectClassNames[side]}`}
      style={{
        backgroundImage: `url(${BARRIER_EFFECT_PATH})`,
        backgroundSize: `${BARRIER_EFFECT_FRAME_COUNT * 100}% 100%`,
        backgroundPosition: `${(frame / (BARRIER_EFFECT_FRAME_COUNT - 1)) * 100}% 0`,
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
  const barrierEffectIntervalRefs = useRef<
    Record<CharacterSide, number | null>
  >({
    enemy: null,
    player: null,
  });
  const [isStarted, setIsStarted] = useState(false);
  const [playerHp, setPlayerHp] = useState(MAX_POINTS);
  const [playerEnergy, setPlayerEnergy] = useState(0);
  const [enemyHp, setEnemyHp] = useState(MAX_POINTS);
  const [enemyEnergy, setEnemyEnergy] = useState(0);
  const [message, setMessage] = useState('技を選んでください');
  const [isGameOver, setIsGameOver] = useState(false);
  const [showRetry, setShowRetry] = useState(false);
  const [isResolvingTurn, setIsResolvingTurn] = useState(false);
  const [isPlayerHpBlinking, setIsPlayerHpBlinking] = useState(false);
  const [isEnemyHpBlinking, setIsEnemyHpBlinking] = useState(false);
  const [isDamageBlinkVisible, setIsDamageBlinkVisible] = useState(true);
  const [isBgmEnabled, setIsBgmEnabled] = useState(true);
  const [barrierEffectFrames, setBarrierEffectFrames] = useState(
    initialBarrierEffectFrames,
  );

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

  const clearBarrierEffect = (target: CharacterSide) => {
    const intervalId = barrierEffectIntervalRefs.current[target];

    if (intervalId !== null) {
      window.clearInterval(intervalId);
      barrierEffectIntervalRefs.current[target] = null;
    }

    setBarrierEffectFrames((currentFrames) => ({
      ...currentFrames,
      [target]: null,
    }));
  };

  const startBarrierEffect = (target: CharacterSide) => {
    clearBarrierEffect(target);

    setBarrierEffectFrames((currentFrames) => ({
      ...currentFrames,
      [target]: 0,
    }));

    barrierEffectIntervalRefs.current[target] = window.setInterval(() => {
      setBarrierEffectFrames((currentFrames) => {
        const currentFrame = currentFrames[target];
        const nextFrame = currentFrame === null ? 0 : currentFrame + 1;

        if (nextFrame >= BARRIER_EFFECT_FRAME_COUNT) {
          const intervalId = barrierEffectIntervalRefs.current[target];

          if (intervalId !== null) {
            window.clearInterval(intervalId);
            barrierEffectIntervalRefs.current[target] = null;
          }

          return {
            ...currentFrames,
            [target]: null,
          };
        }

        return {
          ...currentFrames,
          [target]: nextFrame,
        };
      });
    }, BARRIER_EFFECT_FRAME_MS);
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

    if (playerAction === 'barrier') {
      startBarrierEffect('player');
    }

    if (enemyAction === 'barrier') {
      startBarrierEffect('enemy');
    }

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
    setMessage('技を選んでください');
    setIsGameOver(false);
    setShowRetry(false);
    setIsResolvingTurn(false);
    stopDamageBlink();
    clearBarrierEffect('player');
    clearBarrierEffect('enemy');
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
    setMessage(
      `あなた: ${actionLabels[playerAction]} / 敵: ${actionLabels[enemyAction]}`,
    );

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

      Object.values(barrierEffectIntervalRefs.current).forEach((intervalId) => {
        if (intervalId !== null) {
          window.clearInterval(intervalId);
        }
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
                  <BarrierEffect
                    frame={barrierEffectFrames.enemy}
                    side="enemy"
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
                <BarrierEffect
                  frame={barrierEffectFrames.player}
                  side="player"
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
