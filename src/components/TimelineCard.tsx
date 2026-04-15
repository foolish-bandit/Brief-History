import { motion } from 'motion/react';
import { memo } from 'react';
import { Era } from '../types';
import { VERDICT_COLORS } from '../constants';

interface TimelineCardProps {
  era: Era;
  index: number;
  onGoDeeper: () => void;
  onWhatIf: (scenario: string) => void;
}

const TimelineCard = memo(function TimelineCard({ era, index, onGoDeeper, onWhatIf }: TimelineCardProps) {
  const isLeft = index % 2 === 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`relative flex items-center justify-between md:justify-normal w-full mb-16 ${isLeft ? 'md:flex-row-reverse' : 'md:flex-row'}`}
    >
      {/* Center dot */}
      <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-amber-400 border-4 border-[#08090f] transform -translate-x-1/2 z-10 shadow-[0_0_10px_rgba(240,180,41,0.5)]"></div>

      {/* Empty space for the other side on desktop */}
      <div className="hidden md:block w-5/12"></div>

      {/* Card Content */}
      <div className={`w-[calc(100%-3rem)] md:w-5/12 ml-12 md:ml-0 ${isLeft ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'}`}>
        <div className="bg-[#12131c] border border-white/10 rounded-2xl p-6 shadow-xl hover:border-white/20 transition-colors">
          
          <div className={`flex flex-col ${isLeft ? 'md:items-end' : 'md:items-start'} mb-4`}>
            <h3 className="font-serif text-2xl text-ivory mb-1">{era.name}</h3>
            <span className="text-sm text-white/50 font-mono tracking-wider">{era.period}</span>
          </div>

          <div className={`flex ${isLeft ? 'md:justify-end' : 'md:justify-start'} mb-4`}>
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase ${VERDICT_COLORS[era.verdict] || 'bg-gray-600 text-white'}`}
            >
              {era.verdict}
            </motion.div>
          </div>

          <p className="text-white/80 leading-relaxed mb-6 text-sm md:text-base text-left">
            {era.reasoning}
          </p>

          {era.wildCard && (
            <div className="bg-indigo-900/30 border border-indigo-500/30 rounded-xl p-4 mb-6 text-left">
              <div className="text-xs text-indigo-300 uppercase tracking-wider font-bold mb-1">Wild Card Fact</div>
              <p className="text-sm text-indigo-100 italic">{era.wildCard}</p>
            </div>
          )}

          <div className={`flex flex-wrap gap-2 ${isLeft ? 'md:justify-end' : 'md:justify-start'} mb-6`}>
            {era.whatIf.map((scenario, i) => (
              <button
                key={i}
                onClick={() => onWhatIf(scenario)}
                className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-3 py-1.5 text-white/70 hover:text-white transition-colors text-left"
              >
                What if: {scenario}
              </button>
            ))}
          </div>

          <button
            onClick={onGoDeeper}
            className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium tracking-wide transition-colors"
          >
            GO DEEPER INTO THIS ERA
          </button>
        </div>
      </div>
    </motion.div>
  );
});

export default TimelineCard;
