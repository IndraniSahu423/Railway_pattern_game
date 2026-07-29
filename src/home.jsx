import { motion } from "framer-motion";
import {
  ArrowRight,
  Circle,
  Square,
  Triangle,
  Sparkles,
  Train,
  Puzzle,
  Trophy,
  ArrowUpRight,
} from "lucide-react";

const PATTERN_CARDS = [
  {
    icon: ArrowUpRight,
    title: "Direction",
    desc: "Follow zig-zag arrows that alternate ↗ and ↘",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: Circle,
    title: "Shapes",
    desc: "Spot cycles of circles, squares, and triangles",
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: Sparkles,
    title: "Colours",
    desc: "Match repeating red, blue, and green signals",
    color: "from-rose-500 to-pink-600",
  },
  {
    icon: Puzzle,
    title: "Mixed",
    desc: "Combine direction and colour in one pattern",
    color: "from-amber-500 to-orange-600",
  },
];

const STEPS = [
  { num: "1", text: "Study the track pieces already in place" },
  { num: "2", text: "Discover the repeating pattern rule" },
  { num: "3", text: "Click or drag pieces to fill the gaps" },
  { num: "4", text: "Complete the track and watch the train go!" },
];


const PREVIEW_PIECES = ["↗", "↘", "?", "↗", "?", "↘"];

export default function Home({ onPlay }) {
  return (
    <div className="flex-1">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-amber-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500 rounded-full blur-3xl" />
        </div>

        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none hidden lg:block"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent, transparent 38px, rgba(255,255,255,0.5) 38px, rgba(255,255,255,0.5) 40px)",
            backgroundPosition: "center 60px",
            backgroundSize: "80% 4px",
            backgroundRepeat: "no-repeat",
          }}
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-1.5 rounded-full text-sm text-amber-300 mb-6 border border-white/10"
            >
              <Train size={16} />
              Educational Puzzle Game
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
              <span className="block sm:inline">Repair the Railway,</span>{" "}
              <span className="block sm:inline text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">
                Master the Pattern
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 mb-10 leading-relaxed">
              Sections of the track are missing! Use your pattern-spotting skills
              to rebuild the railway and guide the train from Start to Destination.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                onClick={onPlay}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-bold text-lg px-8 py-4 rounded-2xl shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-shadow"
              >
                Start Playing
                <ArrowRight
                  size={22}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </motion.button>

              <a
                href="#how-to-play"
                className="text-slate-300 hover:text-white text-sm font-medium underline underline-offset-4 decoration-slate-500 hover:decoration-white transition-colors"
              >
                How does it work?
              </a>
            </div>
          </motion.div>

          {/* Mini track preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-16 max-w-2xl mx-auto"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <p className="text-center text-xs font-semibold tracking-wide uppercase text-amber-300/80 mb-4">
                Example puzzle
              </p>

              <div className="flex items-center justify-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-lg bg-white/10 border-2 border-white/20 shrink-0">
                  🚉
                </div>

                {PREVIEW_PIECES.map((piece, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-lg font-bold border-2 shrink-0 ${
                      piece === "?"
                        ? "border-dashed border-amber-400/70 bg-amber-400/15 text-amber-300 animate-pulse"
                        : "border-white/20 bg-white/10 text-white"
                    }`}
                  >
                    {piece}
                  </motion.div>
                ))}

                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-lg bg-white/10 border-2 border-white/20 shrink-0">
                  🏁
                </div>
              </div>

              <p className="text-center text-sm text-slate-400 mt-4">
                Can you spot the pattern and fill in the missing pieces?
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pattern types */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-3">
              Learn Different Pattern Types
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Each level teaches a new way to think about repeating sequences.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PATTERN_CARDS.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4`}
                >
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{card.title}</h3>
                <p className="text-sm text-slate-500">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How to play */}
      <section id="how-to-play" className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-6">How to Play</h2>
              <div className="space-y-4">
                {STEPS.map((step, i) => (
                  <motion.div
                    key={step.num}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center shrink-0">
                      {step.num}
                    </div>
                    <p className="text-slate-600 pt-2">{step.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-slate-100 to-slate-50 rounded-2xl p-8 border border-slate-200"
            >
              <div className="flex justify-center gap-4 mb-6">
                <Circle className="w-10 h-10 text-red-500 fill-red-500" />
                <Square className="w-10 h-10 text-blue-500 fill-blue-500" />
                <Triangle className="w-10 h-10 text-green-500 fill-green-500" />
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <span className="font-bold text-slate-800">6 Puzzle Levels</span>
                </div>
                <p className="text-sm text-slate-500 mb-6">
                  Progress through increasingly challenging patterns with instant
                  feedback and a satisfying train animation when you succeed.
                </p>
                <button
                  onClick={onPlay}
                  className="w-full py-3 rounded-xl bg-slate-800 text-white font-semibold hover:bg-slate-700 transition-colors"
                >
                  Play Now
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}