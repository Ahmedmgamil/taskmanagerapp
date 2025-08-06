import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Text, TouchableOpacity, Alert } from 'react-native';

import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar
} from 'react-native';
import TaskItem from '../components/TaskItem';

export default function HomeScreen({ navigation }) {
  console.log("HomeScreen is rendering");
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [history, setHistory] = useState([]);
  const [dueDate, setDueDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleAddTask = () => {
    if (task.trim() === '') {
      Alert.alert('Error', 'Please enter a task description');
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      text: task,
      completed: false,
      createdAt: new Date().toLocaleString(),
      dueDate: dueDate,
    };

    console.log(`[ADD] "${newTask.text}" due on ${dueDate || "No due date"}`);

    setTasks([...tasks, newTask]);
    setTask('');
    setDueDate(null);
  };

  const toggleTaskComplete = (id) => {
    const updatedTasks = tasks.map(t => {
      if (t.id === id) {
        const updated = { ...t, completed: !t.completed };
        setHistory(prev => [
          ...prev,
          {
            ...t,
            action: updated.completed ? 'completed' : 'undone',
            actionAt: new Date().toLocaleString()
          }
        ]);
        console.log(`[${updated.completed ? 'COMPLETE' : 'UNDO'}] "${t.text}" at ${new Date().toLocaleString()}`);
        return updated;
      }
      return t;
    });
    setTasks(updatedTasks);
  };

  const deleteTask = (id) => {
    const taskToDelete = tasks.find(t => t.id === id);
    if (taskToDelete) {
      Alert.alert(
        'Delete Task',
        `Are you sure you want to delete "${taskToDelete.text}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              const logItem = {
                ...taskToDelete,
                action: 'deleted',
                actionAt: new Date().toLocaleString()
              };
              setHistory(prev => [...prev, logItem]);
              console.log(`[DELETE] "${taskToDelete.text}" at ${logItem.actionAt}`);
              setTasks(tasks.filter(t => t.id !== id));
            }
          }
        ]
      );
    }
  };

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Task Manager</Text>
        <Text style={styles.subtitle}>
          {completedTasks} of {totalTasks} tasks completed
        </Text>
      </View>

      {/* Add Task Section */}
      <View style={styles.addTaskSection}>
        <TextInput
          placeholder="What needs to be done?"
          value={task}
          onChangeText={setTask}
          style={styles.input}
          returnKeyType="done"
          onSubmitEditing={handleAddTask}
        />
        
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={styles.dueDateButton} 
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dueDateButtonText}>
              {dueDate ? '📅 Change Date' : '📅 Set Due Date'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
            <Text style={styles.addButtonText}>Add Task</Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={dueDate ? new Date(dueDate) : new Date()}
            mode="datetime"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (event.type === "set" && selectedDate) {
                setDueDate(selectedDate.toLocaleString());
              }
            }}
          />
        )}

        {dueDate && (
          <View style={styles.dueDateDisplay}>
            <Text style={styles.dueDateText}>📅 Due: {dueDate}</Text>
            <TouchableOpacity onPress={() => setDueDate(null)}>
              <Text style={styles.clearDateText}>Clear</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* History Button */}
      <TouchableOpacity
        style={styles.historyButton}
        onPress={() => navigation.navigate('History', { history })}
      >
        <Text style={styles.historyButtonText}>📋 View Task History</Text>
      </TouchableOpacity>

      {/* Tasks List */}
      <View style={styles.tasksSection}>
        {tasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No tasks yet</Text>
            <Text style={styles.emptyStateSubtext}>Add a task to get started!</Text>
          </View>
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TaskItem
                task={item}
                onToggleComplete={() => toggleTaskComplete(item.id)}
                onDelete={() => deleteTask(item.id)}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa'
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  addTaskSection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dueDateButton: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  dueDateButtonText: {
    color: '#1976d2',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  dueDateDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    padding: 10,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  dueDateText: {
    fontSize: 14,
    color: '#856404',
  },
  clearDateText: {
    fontSize: 14,
    color: '#dc3545',
    fontWeight: '500',
  },
  historyButton: {
    backgroundColor: '#6c757d',
    marginHorizontal: 15,
    marginVertical: 5,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  historyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  tasksSection: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6c757d',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#adb5bd',
  },
});
