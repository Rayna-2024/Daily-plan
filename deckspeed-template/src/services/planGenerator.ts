import { DailyPlan } from '../types/Plan';

// Real Claude AI integration via backend API
export const generateDailyPlan = async (userInput: string): Promise<DailyPlan> => {
  try {
    const response = await fetch('/api/generate-plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userInput: userInput.trim()
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const plan: DailyPlan = await response.json();
    
    // Validate the plan structure
    if (!plan.timeBlocks || !Array.isArray(plan.timeBlocks)) {
      throw new Error('Invalid plan structure received from API');
    }

    return plan;
  } catch (error) {
    console.error('Error calling Claude API:', error);
    
    // Fallback plan in case of API failure
    const fallbackPlan: DailyPlan = {
      id: `fallback-plan-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      title: `Daily Plan - ${new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' 
      })}`,
      summary: "A basic daily plan created due to temporary service unavailability.",
      timeBlocks: [
        {
          id: 'morning-1',
          startTime: '08:00',
          endTime: '09:00',
          type: 'break',
          title: 'Morning Routine',
          color: '#e0f2fe'
        },
        {
          id: 'main-work-1',
          startTime: '09:00',
          endTime: '12:00',
          type: 'task',
          title: 'Focus Time - Priority Tasks',
          task: {
            id: 'task-1',
            title: 'Focus Time - Priority Tasks',
            description: userInput || 'Work on your main priorities for today',
            startTime: '09:00',
            endTime: '12:00',
            priority: 'high' as const,
            category: 'work' as const,
            completed: false,
            estimatedDuration: 180
          },
          color: '#dbeafe'
        },
        {
          id: 'lunch-1',
          startTime: '12:00',
          endTime: '13:00',
          type: 'meal',
          title: 'Lunch Break',
          color: '#fef3c7'
        },
        {
          id: 'afternoon-1',
          startTime: '13:00',
          endTime: '16:00',
          type: 'task',
          title: 'Afternoon Activities',
          task: {
            id: 'task-2',
            title: 'Afternoon Activities',
            description: 'Continue with planned activities and tasks',
            startTime: '13:00',
            endTime: '16:00',
            priority: 'medium' as const,
            category: 'personal' as const,
            completed: false,
            estimatedDuration: 180
          },
          color: '#dcfce7'
        },
        {
          id: 'evening-1',
          startTime: '18:00',
          endTime: '19:00',
          type: 'break',
          title: 'Evening Routine',
          color: '#e0e7ff'
        }
      ],
      totalTasks: 2,
      estimatedProductiveHours: 6,
      priorities: ['Complete main priority tasks'],
      notes: 'This is a fallback plan. Please check your internet connection and try again for a personalized AI-generated plan.',
      createdAt: new Date().toISOString()
    };

    return fallbackPlan;
  }
};
