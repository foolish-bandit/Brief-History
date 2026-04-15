import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Share2, Shuffle, History, Map as MapIcon } from 'lucide-react';
import ParticleBackground from './components/ParticleBackground';
import JourneyMap from './components/JourneyMap';
import TimelineCard from './components/TimelineCard';
import LoadingSequence from './components/LoadingSequence';
import ShareModal from './components/ShareModal';
import { fetchTimeline } from './services/geminiService';
import { QueryNode, HistoryItem } from './types';
import { RANDOM_SCENARIOS, DEFAULT_ERAS } from './constants';

export default function App() {
  const [nodes, setNodes] = useState<QueryNode[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  
  const [inputValue, setInputValue] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Load from local storage
  useEffect(() => {
    const savedNodes = localStorage.getItem('briefHistory_nodes');
    const savedHistory = localStorage.getItem('briefHistory_history');
    const savedCurrent = localStorage.getItem('briefHistory_current');
    
    if (savedNodes) setNodes(JSON.parse(savedNodes));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedCurrent) setCurrentNodeId(savedCurrent);
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('briefHistory_nodes', JSON.stringify(nodes));
    localStorage.setItem('briefHistory_history', JSON.stringify(history));
    if (currentNodeId) localStorage.setItem('briefHistory_current', currentNodeId);
  }, [nodes, history, currentNodeId]);

  const currentNode = nodes.find(n => n.id === currentNodeId);

  const handleSearch = async (scenario: string, parentId: string | null = null, erasToCheck = DEFAULT_ERAS) => {
    if (!scenario.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setInputValue('');
    
    // Create optimistic node
    const newNodeId = crypto.randomUUID();
    const newNode: QueryNode = {
      id: newNodeId,
      label: scenario,
      parentId,
      timestamp: Date.now(),
      data: null
    };
    
    setNodes(prev => [...prev, newNode]);
    setCurrentNodeId(newNodeId);

    try {
      const data = await fetchTimeline(scenario, erasToCheck);
      
      setNodes(prev => prev.map(n => n.id === newNodeId ? { ...n, data } : n));
      
      setHistory(prev => [{
        id: crypto.randomUUID(),
        nodeId: newNodeId,
        label: scenario,
        timestamp: Date.now()
      }, ...prev]);

    } catch (err) {
      console.error(err);
      setError("The archives are temporarily inaccessible. Please try again.");
      // Remove the optimistic node if it failed
      setNodes(prev => prev.filter(n => n.id !== newNodeId));
      setCurrentNodeId(parentId);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRandomScenario = () => {
    const random = RANDOM_SCENARIOS[Math.floor(Math.random() * RANDOM_SCENARIOS.length)];
    handleSearch(random, currentNodeId);
  };

  const handleGoDeeper = (eraName: string, period: string) => {
    if (!currentNode) return;
    const scenario = currentNode.label;
    // Generate sub-eras based on the era
    handleSearch(scenario, currentNodeId, [
      `Early ${eraName}`,
      `Mid ${eraName}`,
      `Late ${eraName}`
    ]);
  };

  return (
    <div className="min-h-screen flex overflow-hidden relative">
      <ParticleBackground />

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#08090f]/90 backdrop-blur-md border-b border-white/10 z-40 flex items-center justify-between px-4">
        <button onClick={() => setLeftSidebarOpen(true)} className="text-white/70 hover:text-white">
          <MapIcon size={24} />
        </button>
        <h1 className="font-serif text-lg font-bold tracking-widest text-amber-400">BRIEF HISTORY</h1>
        <button onClick={() => setRightSidebarOpen(true)} className="text-white/70 hover:text-white">
          <History size={24} />
        </button>
      </div>

      {/* Left Sidebar - Journey Map */}
      <div className={`fixed md:static inset-y-0 left-0 w-72 bg-[#0a0b14] border-r border-white/10 z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${leftSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <h2 className="font-serif text-lg text-white/90 flex items-center gap-2">
            <MapIcon size={18} className="text-amber-400" />
            Journey Map
          </h2>
          <button className="md:hidden text-white/50" onClick={() => setLeftSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-hidden relative">
          <JourneyMap 
            nodes={nodes} 
            currentNodeId={currentNodeId} 
            onNodeClick={(id) => {
              setCurrentNodeId(id);
              setLeftSidebarOpen(false);
            }} 
          />
        </div>
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleRandomScenario}
            className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2 text-sm font-medium transition-colors cursor-pointer"
          >
            <Shuffle size={16} />
            Random Scenario
          </button>
        </div>
      </div>

      {/* Center Content */}
      <div className="flex-1 h-screen overflow-y-auto relative z-10 pt-16 md:pt-0 scroll-smooth">
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
          
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight text-white mb-4 drop-shadow-[0_0_15px_rgba(240,180,41,0.3)]">
              LEGAL TIME TRAVEL
            </h1>
            <p className="text-white/50 text-lg">Explore the evolution of American law.</p>
          </div>

          <div className="max-w-2xl mx-auto mb-20">
            <form 
              onSubmit={(e) => { 
                e.preventDefault(); 
                if (!inputValue.trim()) {
                  setValidationError("Please enter a scenario to travel through time.");
                  return;
                }
                setValidationError(null);
                handleSearch(inputValue, currentNodeId); 
              }}
              className="relative"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                placeholder="What if you did ___ in 1776?"
                className={`w-full bg-white/5 border ${validationError ? 'border-red-500/50 focus:border-red-500/50' : 'border-white/20 focus:border-amber-400/50'} rounded-full py-4 pl-6 pr-32 text-lg text-white placeholder-white/30 focus:outline-none focus:bg-white/10 transition-all shadow-lg`}
              />
              <button 
                type="submit"
                disabled={isLoading}
                className="absolute right-2 top-2 bottom-2 px-6 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                TRAVEL
              </button>
              
              {validationError && (
                <div className="absolute -bottom-6 left-6 text-red-400 text-sm">
                  {validationError}
                </div>
              )}
            </form>

            <div className="mt-8 flex flex-wrap justify-center items-center gap-2">
              <span className="text-white/40 text-sm mr-1">Try asking:</span>
              {["I paid for something with cryptocurrency", "I challenged someone to a duel", "I flew a drone over my neighbor's property"].map((ex, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setInputValue(ex);
                    setValidationError(null);
                    handleSearch(ex, currentNodeId);
                  }}
                  className="text-xs text-amber-400/80 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/20 rounded-full px-3 py-1.5 transition-colors"
                >
                  "{ex}"
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <LoadingSequence />
          ) : currentNode?.data ? (
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentNode.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-16">
                  <h2 className="text-2xl font-serif text-amber-400">"{currentNode.label}"</h2>
                </div>

                <div className="relative">
                  {/* Center Line */}
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: '100%' }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute left-4 md:left-1/2 top-0 w-0.5 bg-gradient-to-b from-amber-400/50 via-indigo-500/50 to-transparent transform -translate-x-1/2"
                  />

                  {currentNode.data.eras.map((era, index) => (
                    <TimelineCard 
                      key={index} 
                      era={era} 
                      index={index} 
                      onGoDeeper={() => handleGoDeeper(era.name, era.period)}
                      onWhatIf={(scenario) => handleSearch(scenario, currentNode.id)}
                    />
                  ))}
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="mt-20 bg-gradient-to-br from-[#1a1a4e]/40 to-[#08090f] border border-indigo-500/30 rounded-2xl p-8 shadow-2xl"
                >
                  <h3 className="font-serif text-2xl text-ivory mb-4">Legal Evolution Summary</h3>
                  <p className="text-white/80 leading-relaxed text-lg">
                    {currentNode.data.evolutionSummary}
                  </p>
                </motion.div>

                {currentNode.data.nextTrip && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="mt-8"
                  >
                    <button 
                      onClick={() => handleSearch(currentNode.data!.nextTrip, currentNode.id)}
                      className="w-full bg-white/5 hover:bg-white/10 border border-white/20 rounded-2xl p-6 text-left transition-all hover:border-amber-400/50 group cursor-pointer"
                    >
                      <div className="text-xs text-amber-400 uppercase tracking-widest font-bold mb-2">Next Trip Suggestion</div>
                      <div className="text-xl text-white group-hover:text-amber-100 transition-colors">
                        What if: {currentNode.data.nextTrip} &rarr;
                      </div>
                    </button>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          ) : nodes.length === 0 ? (
            <div className="text-center text-white/30 mt-20 font-serif italic">
              Enter a scenario above or choose a random one to begin your journey.
            </div>
          ) : null}

        </div>
      </div>

      {/* Right Sidebar - History */}
      <div className={`fixed md:static inset-y-0 right-0 w-72 bg-[#0a0b14] border-l border-white/10 z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${rightSidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <h2 className="font-serif text-lg text-white/90 flex items-center gap-2">
            <History size={18} className="text-amber-400" />
            Query History
          </h2>
          <button className="md:hidden text-white/50" onClick={() => setRightSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentNodeId(item.nodeId);
                setRightSidebarOpen(false);
              }}
              className={`w-full text-left p-3 rounded-xl border transition-colors cursor-pointer ${
                item.nodeId === currentNodeId 
                  ? 'bg-indigo-900/30 border-indigo-500/50' 
                  : 'bg-white/5 border-white/5 hover:bg-white/10'
              }`}
            >
              <div className="text-sm text-white/90 line-clamp-2 leading-snug">{item.label}</div>
              <div className="text-xs text-white/40 mt-2">
                {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </button>
          ))}
          {history.length === 0 && (
            <div className="text-center text-white/30 text-sm mt-10">No history yet.</div>
          )}
        </div>

        {currentNode?.data && (
          <div className="p-4 border-t border-white/10">
            <button 
              onClick={() => setShareModalOpen(true)}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold flex items-center justify-center gap-2 text-sm transition-colors cursor-pointer"
            >
              <Share2 size={16} />
              Share Timeline
            </button>
          </div>
        )}
      </div>

      {/* Error Toast */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-red-900/90 text-white px-6 py-3 rounded-full shadow-2xl border border-red-500/50 z-50 flex items-center gap-3"
          >
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-white/50 hover:text-white cursor-pointer">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      {shareModalOpen && currentNode?.data && (
        <ShareModal 
          scenario={currentNode.label} 
          data={currentNode.data} 
          onClose={() => setShareModalOpen(false)} 
        />
      )}
    </div>
  );
}
