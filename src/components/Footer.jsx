import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-800 text-slate-300 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Train className="w-5 h-5 text-amber-400" />
              <span className="font-bold text-white text-lg">Pattern Railway</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              An educational puzzle game where you repair railway tracks by
              discovering and completing repeating patterns.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3">Pattern Types</h3>
            <ul className="text-sm space-y-1.5 text-slate-400">
              <li>Direction patterns</li>
              <li>Rotation &amp; shape cycles</li>
              <li>Colour sequences</li>
              <li>Mirror &amp; symmetry</li>
              <li>Mixed signal puzzles</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3">How to Play</h3>
            <ol className="text-sm space-y-1.5 text-slate-400 list-decimal list-inside">
              <li>Study the visible track pieces</li>
              <li>Find the repeating pattern</li>
              <li>Fill in the missing pieces</li>
              <li>Watch the train reach the goal!</li>
            </ol>
          </div>
        </div> */}

        <div className=" mt-4 pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-slate-400">
          <p>&copy; {new Date().getFullYear()} EduGeNie Pattern Railway</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" /> for learning
          </p>
        </div>
      </div>
    </footer>
  );
}
