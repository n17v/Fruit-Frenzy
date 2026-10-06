const { useState, useEffect } = React;

declare const game: any;

type Info = {
  state: string;
  score: number;
  lives: number;
  level: number;
  best: number;
  newBest: boolean;
};

function Hearts({ lives }: { lives: number }) {
  const hearts = [];
  for (let i = 0; i < 5; i++) {
    hearts.push(
      <span key={i} className={i < lives ? "text-red-500" : "text-white/30"}>
        ♥
      </span>
    );
  }
  return <div className="text-2xl leading-none">{hearts}</div>;
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 bg-emerald-950/70 flex flex-col items-center justify-center text-center gap-4 p-6 pointer-events-auto">
      {children}
    </div>
  );
}

function PlayButton({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-yellow-400 hover:bg-yellow-300 text-emerald-950 font-bold text-2xl px-10 py-3 rounded-full shadow-lg active:scale-95 transition"
    >
      {text}
    </button>
  );
}

function App() {
  const [info, setInfo] = useState<Info>({
    state: "menu",
    score: 0,
    lives: 5,
    level: 1,
    best: game.best,
    newBest: false
  });

  useEffect(function () {
    game.onChange = setInfo;
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      {info.state !== "menu" && (
        <div className="flex justify-between items-start p-4 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
          <div>
            <div className="text-4xl font-bold leading-none">{info.score}</div>
            <div className="text-sm mt-1">Level {info.level}</div>
          </div>
          <div className="text-right">
            <Hearts lives={info.lives} />
            <div className="text-sm mt-1">Best {info.best}</div>
          </div>
        </div>
      )}

      {info.state === "menu" && (
        <Panel>
          <h1 className="text-6xl font-bold text-yellow-300 drop-shadow-lg">Fruit Frenzy</h1>
          <div className="text-lg text-emerald-100 leading-relaxed">
            <p>Catch apples and oranges.</p>
            <p>Cherries are worth 5 points.</p>
            <p>Dodge the bombs.</p>
            <p>Every missed fruit costs a heart.</p>
          </div>
          <PlayButton text="Play" onClick={() => game.start()} />
          <p className="text-emerald-200">Best score: {info.best}</p>
        </Panel>
      )}

      {info.state === "paused" && (
        <Panel>
          <h2 className="text-5xl font-bold">Paused</h2>
          <PlayButton text="Resume" onClick={() => game.togglePause()} />
        </Panel>
      )}

      {info.state === "over" && (
        <Panel>
          <h2 className="text-5xl font-bold text-red-400">Game over</h2>
          <p className="text-2xl">You scored {info.score}</p>
          {info.newBest && <p className="text-yellow-300 text-xl">New best score!</p>}
          <p className="text-emerald-200">Best score: {info.best}</p>
          <PlayButton text="Play again" onClick={() => game.start()} />
        </Panel>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
