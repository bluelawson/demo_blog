'use client';

import { useEffect, useRef, useState } from 'react';

const MAX_POINTS = 5;
const BGM_PATH = '/games/chargeBurst/bgm.mp3';
const START_SOUND_PATH = '/games/chargeBurst/start.mp3';
const CHARGE_SOUND_PATH = '/games/chargeBurst/charge.mp3';
const BARRIER_SOUND_PATH = '/games/chargeBurst/barrier.mp3';
const BURST_SOUND_PATH = '/games/chargeBurst/burst.mp3';
const DAMAGE_SOUND_PATH = '/games/chargeBurst/damage.mp3';

type Action = 'charge' | 'barrier' | 'burst';

const actionLabels: Record<Action, string> = {
  charge: 'チャージ',
  barrier: 'バリア',
  burst: 'バースト',
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
  const startSoundRef = useRef<HTMLAudioElement | null>(null);
  const chargeSoundRef = useRef<HTMLAudioElement | null>(null);
  const barrierSoundRef = useRef<HTMLAudioElement | null>(null);
  const burstSoundRef = useRef<HTMLAudioElement | null>(null);
  const damageSoundRef = useRef<HTMLAudioElement | null>(null);
  const isResolvingTurnRef = useRef(false);
  const damageBlinkIntervalRef = useRef<number | null>(null);
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

  const playSound = (audio: HTMLAudioElement) => {
    return new Promise<void>((resolve) => {
      audio.pause();
      audio.currentTime = 0;

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

  const getStartSound = () => {
    if (startSoundRef.current) {
      return startSoundRef.current;
    }

    startSoundRef.current = new Audio(START_SOUND_PATH);
    startSoundRef.current.volume = 0.7;

    return startSoundRef.current;
  };

  const getChargeSound = () => {
    if (chargeSoundRef.current) {
      return chargeSoundRef.current;
    }

    chargeSoundRef.current = new Audio(CHARGE_SOUND_PATH);
    chargeSoundRef.current.volume = 0.7;

    return chargeSoundRef.current;
  };

  const getBarrierSound = () => {
    if (barrierSoundRef.current) {
      return barrierSoundRef.current;
    }

    barrierSoundRef.current = new Audio(BARRIER_SOUND_PATH);
    barrierSoundRef.current.volume = 0.7;

    return barrierSoundRef.current;
  };

  const getBurstSound = () => {
    if (burstSoundRef.current) {
      return burstSoundRef.current;
    }

    burstSoundRef.current = new Audio(BURST_SOUND_PATH);
    burstSoundRef.current.volume = 0.7;

    return burstSoundRef.current;
  };

  const getDamageSound = () => {
    if (damageSoundRef.current) {
      return damageSoundRef.current;
    }

    damageSoundRef.current = new Audio(DAMAGE_SOUND_PATH);
    damageSoundRef.current.volume = 0.7;

    return damageSoundRef.current;
  };

  const playStartSound = () => {
    return playSound(getStartSound());
  };

  const playActionSound = (action: Action) => {
    if (action === 'charge') {
      return playSound(getChargeSound());
    }

    if (action === 'barrier') {
      return playSound(getBarrierSound());
    }

    return playSound(getBurstSound());
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

    await playActionSound(playerAction);
    await playActionSound(enemyAction);

    if (playerDamaged || enemyDamaged) {
      damageBlinkIntervalRef.current = window.setInterval(() => {
        setIsDamageBlinkVisible((current) => !current);
      }, 120);

      setIsPlayerHpBlinking(playerDamaged);
      setIsEnemyHpBlinking(enemyDamaged);
      await playSound(getDamageSound());
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
    isResolvingTurnRef.current = false;
  };

  const startGame = () => {
    void playStartSound();
    resetGame();
    setIsStarted(true);
    playBgm();
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

    setPlayerHp(nextPlayerHp);
    setPlayerEnergy(nextPlayerEnergy);
    setEnemyHp(nextEnemyHp);
    setEnemyEnergy(nextEnemyEnergy);
    setMessage(
      `あなた: ${actionLabels[playerAction]} / 敵: ${actionLabels[enemyAction]}`,
    );

    if (nextEnemyHp <= 0) {
      setIsGameOver(true);
      stopBgm();
      void turnSoundsPromise.then(() => {
        setTimeout(() => {
          window.confirm('勝利しました');
          resetGame();
          setIsStarted(false);
        }, 0);
      });
      return;
    }

    if (nextPlayerHp <= 0) {
      setIsGameOver(true);
      stopBgm();
      void turnSoundsPromise.then(() => {
        setTimeout(() => {
          window.alert('敗北しました。');
          setMessage('敗北しました。');
          setShowRetry(true);
        }, 0);
      });
    }
  };

  useEffect(() => {
    return () => {
      const bgm = bgmRef.current;

      if (bgm) {
        bgm.pause();
        bgm.currentTime = 0;
      }

      const startSound = startSoundRef.current;

      if (startSound) {
        startSound.pause();
        startSound.currentTime = 0;
      }

      const chargeSound = chargeSoundRef.current;

      if (chargeSound) {
        chargeSound.pause();
        chargeSound.currentTime = 0;
      }

      const barrierSound = barrierSoundRef.current;

      if (barrierSound) {
        barrierSound.pause();
        barrierSound.currentTime = 0;
      }

      const burstSound = burstSoundRef.current;

      if (burstSound) {
        burstSound.pause();
        burstSound.currentTime = 0;
      }

      const damageSound = damageSoundRef.current;

      if (damageSound) {
        damageSound.pause();
        damageSound.currentTime = 0;
      }

      if (damageBlinkIntervalRef.current !== null) {
        window.clearInterval(damageBlinkIntervalRef.current);
      }
    };
  }, []);

  return (
    <>
      <div className="my-6 mx-4 px-3 border h-[calc(100vh-200px)]">
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
          </div>
        ) : (
          <div className="mx-auto flex flex-col w-[800px] justify-center bg-slate-600">
            {/* enemy */}
            <div className="mx-24 flex flex-row space-x-4 justify-end">
              <div className="space-y-1">
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
              </div>
              <img
                src="/games/chargeBurst/enemy.png"
                alt="敵キャラクター"
                className={`w-[15.0%] ${getBlinkClassName(
                  isEnemyHpBlinking,
                  isDamageBlinkVisible,
                )}`}
              />
            </div>
            {/* ally */}
            <div className="mx-24 my-8 h-[200px] flex flex-row space-x-4 items-center justify-between">
              <div className="space-y-1">
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
