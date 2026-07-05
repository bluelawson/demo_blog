'use client';

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

const ChargeBurst = () => {
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
              <Gauge label="HP" points={5} fillClassName="bg-lime-400" />
              <Gauge label="ENERGY" points={5} fillClassName="bg-amber-500" />
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
              <Gauge label="HP" points={5} fillClassName="bg-lime-400" />
              <Gauge label="ENERGY" points={5} fillClassName="bg-amber-500" />
            </div>
            <div className="mt-8 px-2 py-1 w-36 border">
              <div className="cursor-pointer hover:underline">チャージ</div>
              <div className="cursor-pointer hover:underline">バリア</div>
              <div className="cursor-pointer hover:underline">バースト</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChargeBurst;
