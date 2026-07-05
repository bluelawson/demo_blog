'use client';

import { useState } from 'react';

const MAX_POINTS = 5;

type Action = 'charge' | 'barrier' | 'burst';

const actionLabels: Record<Action, string> = {
  charge: 'チャージ',
  barrier: 'バリア',
  burst: 'バースト',
};

const actionButtonClass =
  'block cursor-pointer hover:underline disabled:cursor-not-allowed disabled:text-slate-400 disabled:hover:no-underline';

type GaugeProps = {
  label: string;
  points: number;
  maxPoints?: number;
  fillClassName: string;
};

const Gauge = ({ label, points, maxPoints = 5, fillClassName }: GaugeProps) => {
  const filledPoints = Math.max(0, Math.min(points, maxPoints));

  return (
    <div>
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
  const [playerHp, setPlayerHp] = useState(MAX_POINTS);
  const [playerEnergy, setPlayerEnergy] = useState(0);
  const [enemyHp, setEnemyHp] = useState(MAX_POINTS);
  const [enemyEnergy, setEnemyEnergy] = useState(0);
  const [message, setMessage] = useState('技を選んでください');
  const [isGameOver, setIsGameOver] = useState(false);

  const resetGame = () => {
    setPlayerHp(MAX_POINTS);
    setPlayerEnergy(0);
    setEnemyHp(MAX_POINTS);
    setEnemyEnergy(0);
    setMessage('技を選んでください');
    setIsGameOver(false);
  };

  const handleAction = (playerAction: Action) => {
    if (isGameOver || (playerAction === 'burst' && playerEnergy === 0)) {
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

    setPlayerHp(nextPlayerHp);
    setPlayerEnergy(nextPlayerEnergy);
    setEnemyHp(nextEnemyHp);
    setEnemyEnergy(nextEnemyEnergy);
    setMessage(
      `あなた: ${actionLabels[playerAction]} / 敵: ${actionLabels[enemyAction]}`,
    );

    if (nextEnemyHp <= 0) {
      setIsGameOver(true);
      setTimeout(() => {
        window.confirm('勝利しました');
        resetGame();
      }, 0);
      return;
    }

    if (nextPlayerHp <= 0) {
      setIsGameOver(true);
      setTimeout(() => {
        if (window.confirm('敗北しました。再挑戦しますか？')) {
          resetGame();
        }
      }, 0);
    }
  };

  return (
    <>
      <div className="my-6 mx-4 px-3 border h-[calc(100vh-200px)]">
        <h1 className="my-2 text-2xl font-bold flex justify-center">
          チャージバースト
        </h1>
        <div className="mx-auto flex flex-col w-[800px] justify-center bg-slate-600">
          {/* enemy */}
          <div className="mx-24 flex flex-row space-x-4 justify-end">
            <div className="space-y-1">
              <Gauge label="HP" points={enemyHp} fillClassName="bg-lime-400" />
              <Gauge
                label="ENERGY"
                points={enemyEnergy}
                fillClassName="bg-amber-500"
              />
            </div>
            <img
              src="/games/chargeBurst/enemy.png"
              alt="敵キャラクター"
              className="w-[15.0%]"
            />
          </div>
          {/* ally */}
          <div className="mx-24 my-8 h-[200px] flex flex-row space-x-4 items-center justify-between">
            <div className="space-y-1">
              <Gauge
                label="HP"
                points={playerHp}
                fillClassName="bg-lime-400"
              />
              <Gauge
                label="ENERGY"
                points={playerEnergy}
                fillClassName="bg-amber-500"
              />
            </div>
            <div className="mt-8 px-2 py-1 w-36 border">
              <button
                type="button"
                className={actionButtonClass}
                disabled={isGameOver}
                onClick={() => handleAction('charge')}
              >
                チャージ
              </button>
              <button
                type="button"
                className={actionButtonClass}
                disabled={isGameOver}
                onClick={() => handleAction('barrier')}
              >
                バリア
              </button>
              <button
                type="button"
                className={actionButtonClass}
                disabled={playerEnergy === 0 || isGameOver}
                onClick={() => handleAction('burst')}
              >
                バースト
              </button>
            </div>
          </div>
          <div className="mx-24 mb-6 border-t border-slate-500 pt-3 text-sm">
            {message}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChargeBurst;
