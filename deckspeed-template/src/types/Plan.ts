export interface Task {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  priority: 'high' | 'medium' | 'low';
  category: 'work' | 'personal' | 'health' | 'social' | 'learning' | 'other';
  completed: boolean;
  estimatedDuration: number; // in minutes
}

export interface TimeBlock {
  id: string;
  startTime: string;
  endTime: string;
  type: 'task' | 'break' | 'meal' | 'commute' | 'buffer';
  title: string;
  description?: string;
  category?: 'work' | 'personal' | 'health' | 'social' | 'learning' | 'other';
  priority?: 'high' | 'medium' | 'low';
  task?: Task;
  color?: string;
  estimatedDuration?: number; // in minutes
}

export interface DailyPlan {
  id: string;
  date: string;
  title: string;
  summary: string;
  timeBlocks: TimeBlock[];
  totalTasks: number;
  estimatedProductiveHours: number;
  priorities: string[];
  notes?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}
