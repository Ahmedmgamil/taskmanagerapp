// Demo Setup for Task Manager App
// This file contains sample data that can be used to test the app functionality

export const DEMO_TASKS = [
  {
    id: 'demo-1',
    title: 'Complete Project Proposal',
    description: 'Finish the quarterly project proposal for the marketing campaign',
    status: 'In Progress',
    priority: 'HIGH',
    category: 'work',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    recurring: 'none',
    estimatedTime: '4 hours',
    reminders: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    updatedAt: new Date().toISOString(),
    timeSpent: 0,
    isOverdue: false,
  },
  {
    id: 'demo-2',
    title: 'Doctor Appointment',
    description: 'Annual health checkup with Dr. Smith',
    status: 'To Do',
    priority: 'MEDIUM',
    category: 'health',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
    recurring: 'none',
    estimatedTime: '2 hours',
    reminders: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    updatedAt: new Date().toISOString(),
    timeSpent: 0,
    isOverdue: false,
  },
  {
    id: 'demo-3',
    title: 'Pay Monthly Bills',
    description: 'Pay electricity, water, and internet bills',
    status: 'To Do',
    priority: 'HIGH',
    category: 'finance',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago (overdue)
    recurring: 'monthly',
    estimatedTime: '30 minutes',
    reminders: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    updatedAt: new Date().toISOString(),
    timeSpent: 0,
    isOverdue: true,
  },
  {
    id: 'demo-4',
    title: 'Learn React Native',
    description: 'Complete the React Native course on mobile development',
    status: 'In Progress',
    priority: 'MEDIUM',
    category: 'education',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks from now
    recurring: 'none',
    estimatedTime: '20 hours',
    reminders: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
    updatedAt: new Date().toISOString(),
    timeSpent: 0,
    isOverdue: false,
  },
  {
    id: 'demo-5',
    title: 'Buy Groceries',
    description: 'Weekly grocery shopping - milk, bread, fruits, vegetables',
    status: 'Done',
    priority: 'LOW',
    category: 'personal',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    recurring: 'weekly',
    estimatedTime: '1 hour',
    reminders: true,
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    timeSpent: 0,
    isOverdue: false,
  },
  {
    id: 'demo-6',
    title: 'Team Meeting',
    description: 'Weekly team standup meeting to discuss project progress',
    status: 'To Do',
    priority: 'MEDIUM',
    category: 'work',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    recurring: 'weekly',
    estimatedTime: '1 hour',
    reminders: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    timeSpent: 0,
    isOverdue: false,
  },
  {
    id: 'demo-7',
    title: 'Exercise - Morning Run',
    description: 'Daily 5km morning run for fitness',
    status: 'Done',
    priority: 'HIGH',
    category: 'health',
    dueDate: new Date().toISOString(), // Today
    recurring: 'daily',
    estimatedTime: '45 minutes',
    reminders: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    timeSpent: 0,
    isOverdue: false,
  },
  {
    id: 'demo-8',
    title: 'Update Portfolio Website',
    description: 'Add new projects and update skills section on personal website',
    status: 'To Do',
    priority: 'LOW',
    category: 'personal',
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
    recurring: 'none',
    estimatedTime: '3 hours',
    reminders: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    updatedAt: new Date().toISOString(),
    timeSpent: 0,
    isOverdue: false,
  },
];

// Function to load demo data into the app
export const loadDemoData = async () => {
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    await AsyncStorage.setItem('tasks', JSON.stringify(DEMO_TASKS));
    console.log('Demo data loaded successfully!');
    return true;
  } catch (error) {
    console.error('Error loading demo data:', error);
    return false;
  }
};

// Function to clear all data
export const clearAllData = async () => {
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    await AsyncStorage.removeItem('tasks');
    console.log('All data cleared successfully!');
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};

// Usage instructions:
// 1. Import this file in your App.js
// 2. Add a button or call loadDemoData() in useEffect to populate with sample data
// 3. Use clearAllData() to reset the app

/* Example usage in App.js:

import { loadDemoData, clearAllData } from './demo-setup';

// Add this in your App component
const loadDemo = async () => {
  const success = await loadDemoData();
  if (success) {
    loadTasks(); // Reload tasks from storage
  }
};

// Add demo buttons in your UI (optional)
<TouchableOpacity onPress={loadDemo}>
  <Text>Load Demo Data</Text>
</TouchableOpacity>

<TouchableOpacity onPress={async () => {
  await clearAllData();
  setTasks([]);
}}>
  <Text>Clear All Data</Text>
</TouchableOpacity>

*/