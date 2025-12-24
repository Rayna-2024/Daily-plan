import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Sparkles, AlertCircle } from 'lucide-react';
import { ChatMessage, DailyPlan } from '../types/Plan';
import { generateDailyPlan } from '../services/planGenerator';

interface ChatPanelProps {
  onPlanGenerated: (plan: DailyPlan) => void;
  onGeneratingStart: () => void;
  isGenerating: boolean;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ 
  onPlanGenerated, 
  onGeneratingStart, 
  isGenerating 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Hi! I'm Zypher, your AI daily planning assistant. I'll help you create a structured, personalized daily plan based on what you need to accomplish today.\n\nJust tell me about your tasks, appointments, priorities, or preferences, and I'll organize them into an optimized schedule with appropriate time blocks, breaks, and recommendations.",
      role: 'assistant',
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isGenerating) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      role: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setError(null);
    onGeneratingStart();

    try {
      // Generate the daily plan using Zypher AI
      const plan = await generateDailyPlan(inputMessage);
      onPlanGenerated(plan);

      // Add assistant response
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: `Perfect! I've created a comprehensive daily plan for you with ${plan.totalTasks} structured time blocks and an estimated ${plan.estimatedProductiveHours} hours of productive time.\n\nYour plan includes prioritized tasks, appropriate breaks, and is optimized for your productivity and well-being. You can see the detailed schedule in the left panel.\n\nWould you like me to adjust anything or create a plan for a different day?`,
        role: 'assistant',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error generating plan:', error);
      setError('Failed to generate plan. Please check your connection and try again.');
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I encountered an issue while generating your plan. This could be due to a connection problem or temporary service interruption. Please try again with your request, and I'll do my best to create your personalized daily plan.",
        role: 'assistant',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const suggestedPrompts = [
    "I need to finish a presentation, attend 2 meetings, go to the gym, and cook dinner today",
    "I have a job interview at 2pm, need to prepare for it, and want some relaxation time in the evening",
    "Help me plan a productive work day with regular breaks and time for learning something new",
    "I want to balance work tasks with personal errands and quality family time",
    "I have 4 hours of deep work needed, plus some calls, and want to fit in exercise",
    "Plan my day around a doctor's appointment at 11am and important project deadline"
  ];

  const handleSuggestionClick = (prompt: string) => {
    setInputMessage(prompt);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <MessageCircle className="w-6 h-6 text-primary-600" />
          <h2 className="text-2xl font-bold text-gray-900">Zypher AI Assistant</h2>
          <div className="ml-auto">
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Connected
            </div>
          </div>
        </div>
        <p className="text-gray-600 mt-2">Describe what you need to accomplish today</p>
        
        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] rounded-2xl p-4 ${
              message.role === 'user'
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-gray-200 text-gray-900 shadow-sm'
            }`}>
              <div className="flex items-start gap-3">
                {message.role === 'assistant' && (
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-3 h-3 text-primary-600" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                  <p className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-primary-200' : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {isGenerating && (
          <div className="flex justify-start">
            <div className="max-w-[85%] bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-primary-600 animate-pulse" />
                </div>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-gray-600">Zypher is thinking...</span>
              </div>
            </div>
          </div>
        )}

        {/* Suggested Prompts */}
        {messages.length === 1 && !isGenerating && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 font-medium">💡 Try these examples:</p>
            <div className="grid gap-2">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(prompt)}
                  className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors text-sm text-gray-700 hover:text-gray-900"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 bg-white border-t border-gray-200">
        <div className="flex gap-3">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tell Zypher what you need to accomplish today..."
            className="flex-1 resize-none rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm min-h-[80px]"
            rows={3}
            disabled={isGenerating}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isGenerating}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 h-fit"
          >
            <Send className="w-4 h-4" />
            {isGenerating ? 'Generating...' : 'Send'}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Shift + Enter for new line, Enter to send
        </p>
      </div>
    </div>
  );
};

export default ChatPanel;
