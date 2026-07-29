import React, { useState, useEffect, useRef } from "react";
import {
  ArrowUpRight,
  Circle,
  Square,
  Triangle,
  Check,
  X,
  RotateCcw,
  ArrowRightCircle,
  Home,
  Lightbulb,
  Coins,
  RefreshCw,
} from "lucide-react";

const COLOR_CLASS = {
  "slate-700": "text-slate-700",
  "indigo-600": "text-indigo-600",
  "amber-600": "text-amber-600",
  "red-500": "text-red-500",
  "blue-500": "text-blue-500",
  "green-500": "text-green-500",
  "purple-500": "text-purple-500",
  "teal-600": "text-teal-600",
};

const pieceKey = (p) => `${p.type}-${p.rot ?? ""}-${p.shape ?? ""}-${p.color ?? ""}`;

const LEVELS = [
  {
    id: 1,
    name: "Zig-Zag Line",
    hint: "The track alternates between two directions: ↗ then ↘.",
    unit: [
      { type: "dir", rot: 0, color: "slate-700" },
      { type: "dir", rot: 90, color: "slate-700" },
    ],
    trackLength: 8,
    blanks: [2, 4, 6, 7],
    distractors: [
      { type: "dir", rot: 180, color: "slate-700" },
      { type: "dir", rot: 270, color: "slate-700" },
    ],
  },
  {
    id: 2,
    name: "Spinning Signal",
    hint: "Each signal rotates 90° clockwise from the last one.",
    unit: [
      { type: "dir", rot: 0, color: "indigo-600" },
      { type: "dir", rot: 90, color: "indigo-600" },
      { type: "dir", rot: 180, color: "indigo-600" },
      { type: "dir", rot: 270, color: "indigo-600" },
    ],
    trackLength: 8,
    blanks: [1, 3, 5, 6],
    distractors: [{ type: "dir", rot: 45, color: "indigo-600" }],
  },
  {
    id: 3,
    name: "Shape Shuffle",
    hint: "Shapes repeat in a cycle: circle, square, triangle.",
    unit: [
      { type: "shape", shape: "circle", color: "slate-700" },
      { type: "shape", shape: "square", color: "slate-700" },
      { type: "shape", shape: "triangle", color: "slate-700" },
    ],
    trackLength: 9,
    blanks: [1, 3, 5, 7, 8],
    distractors: [{ type: "shape", shape: "circle", color: "amber-600" }],
  },
  {
    id: 4,
    name: "Color Cycle",
    hint: "Same signal shape, but the color cycles: red, blue, green.",
    unit: [
      { type: "shape", shape: "circle", color: "red-500" },
      { type: "shape", shape: "circle", color: "blue-500" },
      { type: "shape", shape: "circle", color: "green-500" },
    ],
    trackLength: 9,
    blanks: [2, 3, 5, 8],
    distractors: [{ type: "shape", shape: "circle", color: "purple-500" }],
  },
  {
    id: 5,
    name: "Mixed Signals",
    hint: "Direction AND color both matter, and both alternate together.",
    unit: [
      { type: "dir", rot: 0, color: "red-500" },
      { type: "dir", rot: 90, color: "blue-500" },
    ],
    trackLength: 8,
    blanks: [1, 2, 5, 6, 7],
    distractors: [
      { type: "dir", rot: 0, color: "blue-500" },
      { type: "dir", rot: 90, color: "red-500" },
    ],
  },
  {
    id: 6,
    name: "Mirror Line",
    hint: "The track mirrors itself around the center — read it forwards or backwards, it's the same.",
    sequence: [
      { type: "dir", rot: 0, color: "teal-600" },
      { type: "dir", rot: 90, color: "teal-600" },
      { type: "dir", rot: 180, color: "teal-600" },
      { type: "dir", rot: 270, color: "teal-600" },
      { type: "dir", rot: 180, color: "teal-600" },
      { type: "dir", rot: 90, color: "teal-600" },
      { type: "dir", rot: 0, color: "teal-600" },
    ],
    trackLength: 7,
    blanks: [1, 3, 4, 5],
    distractors: [
      { type: "dir", rot: 45, color: "teal-600" },
      { type: "dir", rot: 225, color: "teal-600" },
    ],
  },
];

function buildSequence(level) {
  if (level.sequence) return level.sequence;
  return Array.from(
    { length: level.trackLength },
    (_, i) => level.unit[i % level.unit.length]
  );
}

function buildPalette(level) {
  const sourcePieces = level.sequence || level.unit;
  const uniqueUnitPieces = [];
  const seen = new Set();
  sourcePieces.forEach((p) => {
    const k = pieceKey(p);
    if (!seen.has(k)) {
      seen.add(k);
      uniqueUnitPieces.push(p);
    }
  });
  const all = [...uniqueUnitPieces, ...level.distractors];
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all;
}

function PieceIcon({ piece, size = 28, className = "" }) {
  if (!piece) return null;
  const colorClass = COLOR_CLASS[piece.color] || "text-slate-700";

  if (piece.type === "dir") {
    return (
      <ArrowUpRight
        width={size}
        height={size}
        className={`${colorClass} ${className}`}
        style={{ transform: `rotate(${piece.rot}deg)` }}
        strokeWidth={2.5}
      />
    );
  }

  const shapeMap = { circle: Circle, square: Square, triangle: Triangle };
  const ShapeComp = shapeMap[piece.shape] || Circle;
  return (
    <ShapeComp
      width={size}
      height={size}
      className={`${colorClass} fill-current ${className}`}
      strokeWidth={2}
    />
  );
}

const RAIL_PATTERN_URL =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='40' height='16'>
      <rect x='15' y='0' width='10' height='16' fill='#a8a29e'/>
      <rect x='0' y='5' width='40' height='2.5' fill='#57534e'/>
      <rect x='0' y='9' width='40' height='2.5' fill='#57534e'/>
    </svg>`
  );

function getMaxAttempts(level) {
  return level.blanks.length + 2;
}

function useLevelState(levelIndex, sessionKey) {
  const level = LEVELS[levelIndex];
  const sequence = buildSequence(level);
  const [filled, setFilled] = useState({});
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [wrongSlot, setWrongSlot] = useState(null);
  const [attemptsUsed, setAttemptsUsed] = useState(0);
  const [isFailed, setIsFailed] = useState(false);
  const palette = React.useMemo(
    () => buildPalette(level),
    [levelIndex, sessionKey]
  );

  const maxAttempts = getMaxAttempts(level);

  const resetBoard = () => {
    setFilled({});
    setSelectedSlot(null);
    setWrongSlot(null);
    setAttemptsUsed(0);
    setIsFailed(false);
  };

  useEffect(() => {
    resetBoard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelIndex, sessionKey]);

  const isComplete = level.blanks.every((idx) => filled[idx]);

  useEffect(() => {
    if (!isComplete && attemptsUsed >= maxAttempts) {
      setIsFailed(true);
    }
  }, [attemptsUsed, isComplete, maxAttempts]);

  return {
    level,
    sequence,
    filled,
    setFilled,
    selectedSlot,
    setSelectedSlot,
    wrongSlot,
    setWrongSlot,
    palette,
    resetBoard,
    isComplete,
    attemptsUsed,
    setAttemptsUsed,
    isFailed,
    setIsFailed,
    maxAttempts,
  };
}

export default function PatternRailway({ onGoHome }) {
  const [levelIndex, setLevelIndex] = useState(0);
  const [sessionKey, setSessionKey] = useState(0);
  const [levelTryNumber, setLevelTryNumber] = useState(1);
  const [totalCoins, setTotalCoins] = useState(0);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const {
    level,
    sequence,
    filled,
    setFilled,
    selectedSlot,
    setSelectedSlot,
    wrongSlot,
    setWrongSlot,
    palette,
    resetBoard,
    isComplete,
    attemptsUsed,
    setAttemptsUsed,
    isFailed,
    setIsFailed,
    maxAttempts,
  } = useLevelState(levelIndex, sessionKey);

  const [trainProgress, setTrainProgress] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [dragOverSlot, setDragOverSlot] = useState(null);
  const wrongTimeout = useRef(null);
  const coinsAwardedRef = useRef(false);

  useEffect(() => {
    setShowHint(false);
    setLevelTryNumber(1);
    setCoinsEarned(0);
    coinsAwardedRef.current = false;
  }, [levelIndex]);

  useEffect(() => {
    if (isComplete && !coinsAwardedRef.current) {
      const earned = levelTryNumber === 1 ? 5 : 2;
      setTotalCoins((c) => c + earned);
      setCoinsEarned(earned);
      coinsAwardedRef.current = true;
    }
    if (!isComplete) {
      coinsAwardedRef.current = false;
      setCoinsEarned(0);
    }
  }, [isComplete, levelTryNumber]);

  useEffect(() => {
    if (isComplete) {
      setTrainProgress(0);
      const t1 = setTimeout(() => setTrainProgress(100), 100);
      const t2 = setTimeout(() => setShowComplete(true), 1600);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
    setTrainProgress(0);
    setShowComplete(false);
  }, [isComplete]);

  const handleSlotClick = (idx) => {
    if (isFailed || isComplete) return;
    if (!level.blanks.includes(idx)) return;
    if (filled[idx]) return;
    setSelectedSlot(idx);
    setWrongSlot(null);
  };

  const attemptPlace = (idx, piece) => {
    if (isFailed || isComplete) return;
    if (idx === null || idx === undefined) return;
    if (!level.blanks.includes(idx) || filled[idx]) return;

    const nextAttempts = attemptsUsed + 1;
    setAttemptsUsed(nextAttempts);

    const expected = sequence[idx];
    if (pieceKey(expected) === pieceKey(piece)) {
      setFilled((f) => ({ ...f, [idx]: piece }));
      setSelectedSlot(null);
      setWrongSlot(null);
    } else {
      setWrongSlot(idx);
      if (wrongTimeout.current) clearTimeout(wrongTimeout.current);
      wrongTimeout.current = setTimeout(() => setWrongSlot(null), 500);
    }
  };

  const handlePaletteClick = (piece) => {
    if (isFailed || isComplete) return;
    if (selectedSlot === null) return;
    attemptPlace(selectedSlot, piece);
  };

  const handleDragStart = (e, piece) => {
    e.dataTransfer.setData("application/json", JSON.stringify(piece));
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDragOverSlot = (e, idx) => {
    if (isFailed || isComplete) return;
    if (!level.blanks.includes(idx) || filled[idx]) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    if (dragOverSlot !== idx) setDragOverSlot(idx);
  };

  const handleDragLeaveSlot = (idx) => {
    setDragOverSlot((cur) => (cur === idx ? null : cur));
  };

  const handleDropOnSlot = (e, idx) => {
    e.preventDefault();
    setDragOverSlot(null);
    if (isFailed || isComplete) return;
    if (!level.blanks.includes(idx) || filled[idx]) return;
    try {
      const piece = JSON.parse(e.dataTransfer.getData("application/json"));
      attemptPlace(idx, piece);
    } catch {
      // ignore malformed drag data
    }
  };

  const handleRestart = () => {
    resetBoard();
    setShowHint(false);
    setShowComplete(false);
    coinsAwardedRef.current = false;
    setCoinsEarned(0);
  };

  const handleRetry = () => {
    setLevelTryNumber((n) => n + 1);
    setSessionKey((k) => k + 1);
    setShowHint(false);
    setShowComplete(false);
    coinsAwardedRef.current = false;
    setCoinsEarned(0);
  };

  const handleNext = () => {
    if (levelIndex < LEVELS.length - 1) setLevelIndex((i) => i + 1);
  };

  const isLastLevel = levelIndex === LEVELS.length - 1;
  const filledCount = level.blanks.filter((idx) => filled[idx]).length;
  const attemptsLeft = maxAttempts - attemptsUsed;
  const progressPct = level.blanks.length
    ? Math.round((filledCount / level.blanks.length) * 100)
    : 0;
  const trackWidthPx = sequence.length * 82 + 140;
  const trainStartPx = 56; // aligns with the Start tile
  const trainEndPx = trackWidthPx - 96; // need to stop the train at the last end of the track

  return (
    <div className="w-full bg-slate-100 py-8 px-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold text-slate-800">Pattern Railway</h1>
            <p className="text-slate-500 mt-1">
              Level {levelIndex + 1} of {LEVELS.length}: {level.name}
            </p>
            <div className="mt-3">
              {!showHint ? (
                <button
                  onClick={() => setShowHint(true)}
                  className="inline-flex items-center gap-1.5 text-sm text-amber-700 font-medium bg-amber-50 border border-amber-200 rounded-full px-3 py-1.5 hover:bg-amber-100 transition-colors"
                >
                  <Lightbulb size={15} />
                  See Hint
                </button>
              ) : (
                <p className="text-sm text-slate-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 inline-flex items-start gap-2 max-w-md">
                  <Lightbulb size={15} className="text-amber-500 shrink-0 mt-0.5" />
                  {level.hint}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 self-center sm:self-start">
            {onGoHome && (
              <button
                onClick={onGoHome}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm"
              >
                <Home size={16} />
                Back to Home
              </button>
            )}
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-sm font-semibold shadow-sm">
              <Coins size={16} />
              {totalCoins} coins
            </div>
          </div>
        </div>

        {/* Progress + attempts + level dots */}
        <div className="mb-4 bg-white rounded-xl shadow-sm p-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm mb-3">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-slate-500">
                Progress: <span className="font-medium text-slate-700">{filledCount}</span> / {level.blanks.length} pieces placed
              </span>
              <span
                className={`font-medium ${
                  isFailed
                    ? "text-red-600"
                    : attemptsLeft <= 2
                      ? "text-amber-600"
                      : "text-slate-600"
                }`}
              >
                Attempts: {attemptsUsed} / {maxAttempts}
                {!isFailed && !isComplete && (
                  <span className="text-slate-400 font-normal ml-1">
                    ({attemptsLeft} left)
                  </span>
                )}
              </span>
            </div>
            <div className="flex gap-1.5" title={`Level ${levelIndex + 1} of ${LEVELS.length}`}>
              {LEVELS.map((lvl, i) => (
                <div
                  key={lvl.id}
                  title={lvl.name}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    i < levelIndex
                      ? "bg-green-500"
                      : i === levelIndex
                        ? "bg-amber-500 ring-2 ring-amber-200"
                        : "bg-slate-200"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isComplete ? "bg-green-500" : "bg-amber-400"
              }`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Track */}
        <div className="relative bg-white rounded-xl shadow p-4 sm:p-8 mb-6 overflow-x-auto">
          <div
            className="relative mx-auto"
            style={{
              width: `${sequence.length * 82 + 140}px`,
              maxWidth: "100%",
              height: "88px",
            }}
          >
            <div
              className="absolute top-1/2 left-14 right-14 h-4 rounded"
              style={{
                transform: "translateY(-50%)",
                backgroundImage: `url("${RAIL_PATTERN_URL}")`,
                backgroundRepeat: "repeat-x",
                backgroundSize: "40px 16px",
                backgroundPosition: "left center",
              }}
            />
            <div className="flex items-center relative z-10 gap-6">
              {!isComplete && (
                <div className="flex flex-col items-center w-15 shrink-0">
                  <div className="text-3xl">🚂</div>
                  <span className="text-xs text-slate-500 mt-1.5 font-medium">Start</span>
                </div>
              )}

              {!isComplete &&
                sequence.map((piece, idx) => {
                  const isBlank = level.blanks.includes(idx);
                  const solved = filled[idx];
                  const isSelected = selectedSlot === idx;
                  const isWrong = wrongSlot === idx;
                  const isDragOver = dragOverSlot === idx;

                  let boxClasses =
                    "relative w-15 h-15 rounded-lg flex items-center justify-center border-2 shrink-0 transition-all duration-150 ";

                  if (!isBlank) {
                    boxClasses += " bg-slate-50 border-slate-200";
                  } else if (solved) {
                    boxClasses += " bg-green-50 border-green-400";
                  } else if (isWrong) {
                    boxClasses += " bg-red-50 border-red-400 animate-pulse";
                  } else if (isDragOver) {
                    boxClasses +=
                      " bg-blue-100 border-blue-500 border-dashed scale-110 cursor-pointer";
                  } else if (isSelected) {
                    boxClasses += " bg-blue-50 border-blue-400 border-dashed cursor-pointer ring-2 ring-blue-200";
                  } else {
                    boxClasses +=
                      " bg-amber-50/70 border-amber-300 border-dashed cursor-pointer hover:border-blue-400 hover:bg-blue-50/50";
                  }

                  return (
                    <div
                      key={idx}
                      className={boxClasses}
                      onClick={() => handleSlotClick(idx)}
                      onDragOver={(e) => handleDragOverSlot(e, idx)}
                      onDragLeave={() => handleDragLeaveSlot(idx)}
                      onDrop={(e) => handleDropOnSlot(e, idx)}
                      title={isBlank ? "Click, or drag a piece here" : ""}
                    >
                      {isBlank && !solved ? (
                        isWrong ? (
                          <X className="text-red-500" size={22} />
                        ) : (
                          <span className="text-amber-400 text-xl font-semibold">?</span>
                        )
                      ) : (
                        <PieceIcon piece={isBlank ? filled[idx] || piece : piece} size={32} />
                      )}
                      {isBlank && solved && (
                        <Check
                          className="text-green-500 absolute bg-white rounded-full"
                          size={16}
                          style={{ transform: "translate(16px, -16px)" }}
                        />
                      )}
                    </div>
                  );
                })}

              {!isComplete && (
                <div className="flex flex-col items-center w-14 shrink-0">
                  <div className="text-3xl">🏁</div>
                  <span className="text-xs text-slate-500 mt-1.5 font-medium">Destination</span>
                </div>
              )}
            </div>

            <div
              className="absolute z-20 text-4xl pointer-events-none"
              style={{
                top: "calc(50% - 46px)",
                left: `${trainStartPx + (trainProgress / 100) * (trainEndPx - trainStartPx)}px`,
                transition: "left 1.4s ease-in-out",
              }}
            >
              {isComplete ? "🚂" : ""}
            </div>
          </div>
        </div>

        {/* Piece tray */}
        {!isComplete && !isFailed && (
          <div className="bg-white rounded-xl shadow p-5 mb-6 justify-content-center">
            <p className="text-sm text-slate-500 mb-3 text-center">
              {selectedSlot !== null
                ? "Pick the piece that continues the pattern:"
                : "Click a missing (?) piece above, or drag a piece from below directly onto it."}
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {palette.map((piece, i) => (
                <button
                  key={i}
                  draggable
                  onDragStart={(e) => handleDragStart(e, piece)}
                  onClick={() => handlePaletteClick(piece)}
                  className={`w-15 h-15 rounded-lg border-2 flex items-center justify-center transition-all cursor-grab active:cursor-grabbing
                    ${
                      selectedSlot === null
                        ? "border-slate-200 opacity-70 hover:opacity-100 hover:border-blue-300"
                        : "border-slate-300 hover:border-blue-400 hover:scale-105 bg-slate-50"
                    }`}
                >
                  <PieceIcon piece={piece} size={30} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Failed state */}
        {isFailed && (
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6 mb-6 text-center">
            <p className="text-red-700 font-semibold text-lg mb-1">
              Oops! You didn&apos;t reach the destination.
            </p>
            <p className="text-red-500 text-sm mb-4">
              You used all {maxAttempts} attempts. Study the pattern and try again!
            </p>
            <button
              onClick={handleRetry}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors shadow-sm"
            >
              <RefreshCw size={18} />
              Retry Level
            </button>
          </div>
        )}

        {/* Complete state */}
        {showComplete && (
          <div className="bg-green-50 border-2 border-green-300 rounded-xl p-5 mb-6 text-center">
            <p className="text-green-700 font-semibold text-lg">
              Track complete! The train reached the destination.
            </p>
            <p className="text-amber-600 font-medium mt-2 flex items-center justify-center gap-1.5">
              <Coins size={18} />
              You earned {coinsEarned} coin{coinsEarned !== 1 ? "s" : ""}!
              {levelTryNumber === 1
                ? " Perfect first try!"
                : " Keep practising for 5 on first try!"}
            </p>
          </div>
        )}

        {/* Controls */}
        {!isFailed && (
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-600 font-medium hover:bg-slate-50 hover:border-slate-400 transition-colors shadow-sm"
            >
              <RotateCcw size={18} />
              Restart Level
            </button>
            <button
              onClick={handleNext}
              disabled={!showComplete || isLastLevel}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors
                ${
                  showComplete && !isLastLevel
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                }`}
            >
              {isLastLevel && showComplete ? "All Levels Complete!" : "Next Level"}
              <ArrowRightCircle size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}