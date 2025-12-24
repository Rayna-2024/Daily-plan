import React from 'react';
import { Calendar, Clock, CheckCircle2, Circle, Star, BarChart3 } from 'lucide-react';
import { DailyPlan, TimeBlock } from '../types/Plan';
import LoadingSpinner from './LoadingSpinner';

interface DailyPlanPanelProps {
  plan: DailyPlan | null;
  isGenerating: boolean;
}

const DailyPlanPanel: React.FC<DailyPlanPanelProps> = ({ plan, isGenerating }) => {
  const getCategoryColor = (category?: string) => {
    const colors = {
      work: 'bg-blue-100 text-blue-800 border-blue-200',
      personal: 'bg-green-100 text-green-800 border-green-200',
      health: 'bg-red-100 text-red-800 border-red-200',
      social: 'bg-purple-100 text-purple-800 border-purple-200',
      learning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      other: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  const getPriorityIcon = (priority?: string) => {
    switch (priority) {
      case 'high':
        return <Star className="w-4 h-4 text-red-500 fill-red-500" />;
      case 'medium':
        return <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />;
      case 'low':
        return <Star className="w-4 h-4 text-gray-400" />;
      default:
        return null;
    }
  };

  const formatTime = (time: string) => {
    try {
      return new Date(`2024-01-01T${time}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return time;
    }
  };

  const getBlockTypeIcon = (type: string) => {
    switch (type) {
      case 'task':
        return '📋';
      case 'break':
        return '☕';
      case 'meal':
        return '🍽️';
      case 'commute':
        return '🚗';
      default:
        return '⏰';
    }
  };

  if (isGenerating) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-900">Daily Plan</h1>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner />
            <p className="mt-4 text-gray-600">Zypher AI is crafting your personalized daily plan...</p>
            <p className="mt-2 text-sm text-gray-500">This may take a few moments</p>
          </div>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-900">Daily Plan</h1>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary-50 rounded-full flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Plan Your Day?</h3>
            <p className="text-gray-600">
              Tell Zypher what you need to accomplish today in the chat, and AI will create a structured, personalized daily plan for you.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-6 h-6 text-primary-600" />
          <h1 className="text-2xl font-bold text-gray-900">Daily Plan</h1>
          <div className="ml-auto text-sm text-gray-500">
            Powered by Zypher AI
          </div>
        </div>
        
        <div className="bg-primary-50 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">{plan.title}</h2>
          <p className="text-gray-700 text-sm mb-3">{plan.summary}</p>
          
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-primary-600" />
              <span className="text-gray-600">{plan.totalTasks} tasks</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-primary-600" />
              <span className="text-gray-600">{plan.estimatedProductiveHours}h productive</span>
            </div>
          </div>
        </div>
      </div>

      {/* Time Blocks */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-3">
          {plan.timeBlocks.map((block: TimeBlock) => (
            <div key={block.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg">{getBlockTypeIcon(block.type)}</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatTime(block.startTime)} - {formatTime(block.endTime)}
                    </span>
                    {(block.task?.category || block.category) && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(block.task?.category || block.category)}`}>
                        {block.task?.category || block.category}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-1">{block.title}</h3>
                  
                  {(block.task?.description || block.description) && (
                    <p className="text-sm text-gray-600 mb-2">{block.task?.description || block.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {(block.task?.priority || block.priority) && getPriorityIcon(block.task?.priority || block.priority)}
                      <span className="text-xs text-gray-500">
                        {(block.task?.estimatedDuration || block.estimatedDuration) ? 
                          `${block.task?.estimatedDuration || block.estimatedDuration} min` : ''}
                      </span>
                    </div>
                    
                    {block.task && (
                      <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600">
                        {block.task.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Priorities Section */}
        {plan.priorities && plan.priorities.length > 0 && (
          <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-600" />
              Top Priorities
            </h4>
            <ul className="space-y-1">
              {plan.priorities.map((priority, index) => (
                <li key={index} className="text-sm text-gray-700">• {priority}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Notes */}
        {plan.notes && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-gray-900 mb-2">AI Notes & Recommendations</h4>
            <p className="text-sm text-gray-700">{plan.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-500 pb-4">
          Plan generated on {new Date(plan.createdAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default DailyPlanPanel;
