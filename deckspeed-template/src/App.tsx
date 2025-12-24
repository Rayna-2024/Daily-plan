import React, { useState } from 'react';
import DailyPlanPanel from './components/DailyPlanPanel';
import ChatPanel from './components/ChatPanel';
import { DailyPlan } from './types/Plan';

function App() {
  const [currentPlan, setCurrentPlan] = useState<DailyPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePlanGenerated = (plan: DailyPlan) => {
    setCurrentPlan(plan);
    setIsGenerating(false);
  };

  const handleGeneratingStart = () => {
    setIsGenerating(true);
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Left Panel - Daily Plan Display */}
      <div className="w-1/2 bg-white border-r border-gray-200">
        <DailyPlanPanel 
          plan={currentPlan} 
          isGenerating={isGenerating}
        />
      </div>

      {/* Right Panel - Zypher AI Chat Interface */}
      <div className="w-1/2 bg-gray-50">
        <ChatPanel 
          onPlanGenerated={handlePlanGenerated}
          onGeneratingStart={handleGeneratingStart}
          isGenerating={isGenerating}
        />
      </div>
    </div>
  );
}

export default App;
