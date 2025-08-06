import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
  Switch,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from 'react-native-calendars';
import * as Notifications from 'expo-notifications';
import uuid from 'react-native-uuid';
import { format, isAfter, isBefore, addDays, addWeeks, addMonths } from 'date-fns';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const TASK_STATUSES = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done'
};

const PRIORITIES = {
  LOW: { label: 'Low', color: '#4CAF50', value: 1 },
  MEDIUM: { label: 'Medium', color: '#FF9800', value: 2 },
  HIGH: { label: 'High', color: '#F44336', value: 3 }
};

const CATEGORIES = [
  { id: 'work', name: 'Work', color: '#2196F3' },
  { id: 'personal', name: 'Personal', color: '#9C27B0' },
  { id: 'health', name: 'Health', color: '#4CAF50' },
  { id: 'finance', name: 'Finance', color: '#FF5722' },
  { id: 'education', name: 'Education', color: '#FF9800' },
];

const RECURRING_OPTIONS = [
  { id: 'none', label: 'None' },
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
];

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [currentView, setCurrentView] = useState('list'); // 'list', 'calendar'
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortBy, setSortBy] = useState('created'); // 'created', 'priority', 'dueDate'
  const [showFilters, setShowFilters] = useState(false);

  // Task form state
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    status: TASK_STATUSES.TODO,
    priority: 'LOW',
    category: 'work',
    dueDate: null,
    recurring: 'none',
    estimatedTime: '',
    reminders: true,
  });

  useEffect(() => {
    loadTasks();
    requestNotificationPermissions();
  }, []);

  const requestNotificationPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Notifications permission is required for reminders.');
    }
  };

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks);
        setTasks(parsedTasks);
        scheduleNotificationsForTasks(parsedTasks);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const saveTasks = async (updatedTasks) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
      scheduleNotificationsForTasks(updatedTasks);
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  const scheduleNotificationsForTasks = async (taskList) => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    
    taskList.forEach(async (task) => {
      if (task.dueDate && task.reminders && task.status !== TASK_STATUSES.DONE) {
        const dueDate = new Date(task.dueDate);
        const now = new Date();
        
        if (isAfter(dueDate, now)) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: 'Task Reminder',
              body: `"${task.title}" is due soon!`,
              data: { taskId: task.id },
            },
            trigger: { date: new Date(dueDate.getTime() - 60 * 60 * 1000) }, // 1 hour before
          });
        }
      }
    });
  };

  const createTask = () => {
    if (!taskForm.title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    const newTask = {
      id: uuid.v4(),
      ...taskForm,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeSpent: 0,
      isOverdue: false,
    };

    const updatedTasks = [...tasks, newTask];
    saveTasks(updatedTasks);
    resetForm();
    setModalVisible(false);

    if (taskForm.recurring !== 'none') {
      scheduleRecurringTask(newTask);
    }
  };

  const updateTask = () => {
    if (!taskForm.title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    const updatedTasks = tasks.map(task =>
      task.id === editingTask.id
        ? { ...task, ...taskForm, updatedAt: new Date().toISOString() }
        : task
    );

    saveTasks(updatedTasks);
    resetForm();
    setEditingTask(null);
    setModalVisible(false);
  };

  const deleteTask = (taskId) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedTasks = tasks.filter(task => task.id !== taskId);
            saveTasks(updatedTasks);
          },
        },
      ]
    );
  };

  const toggleTaskStatus = (taskId) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        let newStatus;
        if (task.status === TASK_STATUSES.TODO) {
          newStatus = TASK_STATUSES.IN_PROGRESS;
        } else if (task.status === TASK_STATUSES.IN_PROGRESS) {
          newStatus = TASK_STATUSES.DONE;
        } else {
          newStatus = TASK_STATUSES.TODO;
        }
        return { ...task, status: newStatus, updatedAt: new Date().toISOString() };
      }
      return task;
    });
    saveTasks(updatedTasks);
  };

  const scheduleRecurringTask = (originalTask) => {
    const { recurring } = originalTask;
    let nextDate = new Date(originalTask.dueDate || new Date());

    switch (recurring) {
      case 'daily':
        nextDate = addDays(nextDate, 1);
        break;
      case 'weekly':
        nextDate = addWeeks(nextDate, 1);
        break;
      case 'monthly':
        nextDate = addMonths(nextDate, 1);
        break;
    }

    const recurringTask = {
      ...originalTask,
      id: uuid.v4(),
      dueDate: nextDate.toISOString(),
      status: TASK_STATUSES.TODO,
      createdAt: new Date().toISOString(),
    };

    setTimeout(() => {
      const updatedTasks = [...tasks, recurringTask];
      saveTasks(updatedTasks);
    }, 1000);
  };

  const resetForm = () => {
    setTaskForm({
      title: '',
      description: '',
      status: TASK_STATUSES.TODO,
      priority: 'LOW',
      category: 'work',
      dueDate: null,
      recurring: 'none',
      estimatedTime: '',
      reminders: true,
    });
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      category: task.category,
      dueDate: task.dueDate,
      recurring: task.recurring || 'none',
      estimatedTime: task.estimatedTime || '',
      reminders: task.reminders !== false,
    });
    setModalVisible(true);
  };

  const getFilteredAndSortedTasks = () => {
    let filtered = tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
      const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;

      return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
    });

    // Check for overdue tasks
    filtered = filtered.map(task => ({
      ...task,
      isOverdue: task.dueDate && isBefore(new Date(task.dueDate), new Date()) && task.status !== TASK_STATUSES.DONE
    }));

    // Sort tasks
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          return PRIORITIES[b.priority].value - PRIORITIES[a.priority].value;
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return filtered;
  };

  const getCalendarMarkedDates = () => {
    const marked = {};
    tasks.forEach(task => {
      if (task.dueDate) {
        const dateKey = format(new Date(task.dueDate), 'yyyy-MM-dd');
        const category = CATEGORIES.find(cat => cat.id === task.category);
        marked[dateKey] = {
          marked: true,
          dotColor: category?.color || '#2196F3',
          selectedColor: task.isOverdue ? '#F44336' : category?.color || '#2196F3',
        };
      }
    });
    return marked;
  };

  const renderTaskItem = ({ item: task }) => {
    const category = CATEGORIES.find(cat => cat.id === task.category);
    const priority = PRIORITIES[task.priority];

    return (
      <View style={[styles.taskItem, task.isOverdue && styles.overdueTask]}>
        <TouchableOpacity
          style={styles.taskContent}
          onPress={() => toggleTaskStatus(task.id)}
          onLongPress={() => openEditModal(task)}
        >
          <View style={styles.taskHeader}>
            <View style={styles.taskTitleRow}>
              <Ionicons
                name={
                  task.status === TASK_STATUSES.DONE
                    ? 'checkmark-circle'
                    : task.status === TASK_STATUSES.IN_PROGRESS
                    ? 'time'
                    : 'radio-button-off'
                }
                size={24}
                color={
                  task.status === TASK_STATUSES.DONE
                    ? '#4CAF50'
                    : task.status === TASK_STATUSES.IN_PROGRESS
                    ? '#FF9800'
                    : '#757575'
                }
              />
              <Text
                style={[
                  styles.taskTitle,
                  task.status === TASK_STATUSES.DONE && styles.completedTask,
                ]}
              >
                {task.title}
              </Text>
              <View style={[styles.priorityBadge, { backgroundColor: priority.color }]}>
                <Text style={styles.priorityText}>{priority.label}</Text>
              </View>
            </View>
            
            <View style={styles.taskMeta}>
              <View style={[styles.categoryBadge, { backgroundColor: category?.color }]}>
                <Text style={styles.categoryText}>{category?.name}</Text>
              </View>
              {task.dueDate && (
                <Text style={[styles.dueDate, task.isOverdue && styles.overdueDateText]}>
                  Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                </Text>
              )}
            </View>

            {task.description && (
              <Text style={styles.taskDescription}>{task.description}</Text>
            )}

            <View style={styles.taskFooter}>
              <Text style={styles.statusText}>{task.status}</Text>
              {task.recurring !== 'none' && (
                <Ionicons name="repeat" size={16} color="#757575" />
              )}
              {task.reminders && (
                <Ionicons name="notifications" size={16} color="#757575" />
              )}
            </View>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteTask(task.id)}
        >
          <Ionicons name="trash" size={20} color="#F44336" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderTaskModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#757575" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Task Title *"
              value={taskForm.title}
              onChangeText={(text) => setTaskForm({ ...taskForm, title: text })}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description"
              value={taskForm.description}
              onChangeText={(text) => setTaskForm({ ...taskForm, description: text })}
              multiline
              numberOfLines={3}
            />

            <View style={styles.formRow}>
              <Text style={styles.formLabel}>Priority:</Text>
              <View style={styles.prioritySelector}>
                {Object.entries(PRIORITIES).map(([key, priority]) => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.priorityOption,
                      { backgroundColor: priority.color },
                      taskForm.priority === key && styles.selectedOption,
                    ]}
                    onPress={() => setTaskForm({ ...taskForm, priority: key })}
                  >
                    <Text style={styles.priorityOptionText}>{priority.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formRow}>
              <Text style={styles.formLabel}>Category:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.categorySelector}>
                  {CATEGORIES.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryOption,
                        { backgroundColor: category.color },
                        taskForm.category === category.id && styles.selectedOption,
                      ]}
                      onPress={() => setTaskForm({ ...taskForm, category: category.id })}
                    >
                      <Text style={styles.categoryOptionText}>{category.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View style={styles.formRow}>
              <Text style={styles.formLabel}>Status:</Text>
              <View style={styles.statusSelector}>
                {Object.values(TASK_STATUSES).map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.statusOption,
                      taskForm.status === status && styles.selectedStatusOption,
                    ]}
                    onPress={() => setTaskForm({ ...taskForm, status })}
                  >
                    <Text
                      style={[
                        styles.statusOptionText,
                        taskForm.status === status && styles.selectedStatusText,
                      ]}
                    >
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => {
                // For simplicity, we'll use a basic date input
                // In a real app, you'd use a proper date picker
                const today = new Date();
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);
                setTaskForm({ ...taskForm, dueDate: tomorrow.toISOString() });
              }}
            >
              <Text style={styles.datePickerText}>
                {taskForm.dueDate
                  ? `Due: ${format(new Date(taskForm.dueDate), 'MMM dd, yyyy')}`
                  : 'Set Due Date'}
              </Text>
              <Ionicons name="calendar" size={20} color="#2196F3" />
            </TouchableOpacity>

            <View style={styles.formRow}>
              <Text style={styles.formLabel}>Recurring:</Text>
              <View style={styles.recurringSelector}>
                {RECURRING_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.recurringOption,
                      taskForm.recurring === option.id && styles.selectedRecurringOption,
                    ]}
                    onPress={() => setTaskForm({ ...taskForm, recurring: option.id })}
                  >
                    <Text
                      style={[
                        styles.recurringOptionText,
                        taskForm.recurring === option.id && styles.selectedRecurringText,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Estimated Time (e.g., 2 hours)"
              value={taskForm.estimatedTime}
              onChangeText={(text) => setTaskForm({ ...taskForm, estimatedTime: text })}
            />

            <View style={styles.switchRow}>
              <Text style={styles.formLabel}>Enable Reminders</Text>
              <Switch
                value={taskForm.reminders}
                onValueChange={(value) => setTaskForm({ ...taskForm, reminders: value })}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={taskForm.reminders ? '#2196F3' : '#f4f3f4'}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={editingTask ? updateTask : createTask}
              >
                <Text style={styles.saveButtonText}>
                  {editingTask ? 'Update' : 'Create'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Task Manager</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Ionicons name="filter" size={24} color="#2196F3" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setCurrentView(currentView === 'list' ? 'calendar' : 'list')}
          >
            <Ionicons
              name={currentView === 'list' ? 'calendar' : 'list'}
              size={24}
              color="#2196F3"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#757575" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search tasks..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filters */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filterRow}>
              <TouchableOpacity
                style={[styles.filterButton, filterStatus !== 'all' && styles.activeFilter]}
                onPress={() => setFilterStatus(filterStatus === 'all' ? TASK_STATUSES.TODO : 'all')}
              >
                <Text style={styles.filterText}>Status</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterButton, filterCategory !== 'all' && styles.activeFilter]}
                onPress={() => setFilterCategory(filterCategory === 'all' ? 'work' : 'all')}
              >
                <Text style={styles.filterText}>Category</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterButton, filterPriority !== 'all' && styles.activeFilter]}
                onPress={() => setFilterPriority(filterPriority === 'all' ? 'HIGH' : 'all')}
              >
                <Text style={styles.filterText}>Priority</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterButton, sortBy !== 'created' && styles.activeFilter]}
                onPress={() => {
                  const options = ['created', 'priority', 'dueDate'];
                  const currentIndex = options.indexOf(sortBy);
                  setSortBy(options[(currentIndex + 1) % options.length]);
                }}
              >
                <Text style={styles.filterText}>Sort: {sortBy}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      )}

      {/* Main Content */}
      {currentView === 'list' ? (
        <FlatList
          data={getFilteredAndSortedTasks()}
          renderItem={renderTaskItem}
          keyExtractor={(item) => item.id}
          style={styles.taskList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="checkmark-done" size={64} color="#E0E0E0" />
              <Text style={styles.emptyStateText}>No tasks found</Text>
              <Text style={styles.emptyStateSubtext}>Tap + to create your first task</Text>
            </View>
          }
        />
      ) : (
        <Calendar
          style={styles.calendar}
          markedDates={getCalendarMarkedDates()}
          onDayPress={(day) => {
            const tasksForDay = tasks.filter(task =>
              task.dueDate && format(new Date(task.dueDate), 'yyyy-MM-dd') === day.dateString
            );
            if (tasksForDay.length > 0) {
              Alert.alert(
                `Tasks for ${day.dateString}`,
                tasksForDay.map(task => `• ${task.title}`).join('\n')
              );
            }
          }}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#b6c1cd',
            selectedDayBackgroundColor: '#2196F3',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#2196F3',
            dayTextColor: '#2d4150',
            textDisabledColor: '#d9e1e8',
          }}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          resetForm();
          setEditingTask(null);
          setModalVisible(true);
        }}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      {/* Task Modal */}
      {renderTaskModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: Platform.OS === 'android' ? 25 : 0, // Adjust for status bar
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 5,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#eee',
    marginTop: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 15,
    marginTop: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#eee',
  },
  filterRow: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 5,
  },
  activeFilter: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
  },
  filterText: {
    fontSize: 14,
    color: '#333',
  },
  taskList: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  taskItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  overdueTask: {
    borderLeftWidth: 5,
    borderLeftColor: '#F44336',
  },
  taskContent: {
    flex: 1,
    padding: 15,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  taskTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    flex: 1,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#757575',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    marginLeft: 10,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  dueDate: {
    fontSize: 12,
    color: '#757575',
    marginLeft: 10,
  },
  overdueDateText: {
    color: '#F44336',
  },
  taskDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  taskFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  deleteButton: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 20,
    color: '#999',
    marginTop: 10,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 5,
  },
  calendar: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 15,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#2196F3',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  formLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    width: '30%',
  },
  prioritySelector: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
  },
  priorityOption: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  priorityOptionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  selectedOption: {
    opacity: 0.9,
  },
  categorySelector: {
    flexDirection: 'row',
  },
  categoryOption: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  categoryOptionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  statusSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statusOption: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  statusOptionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedStatusOption: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
  },
  selectedStatusText: {
    color: '#fff',
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  datePickerText: {
    fontSize: 16,
    color: '#333',
    marginRight: 10,
  },
  recurringSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  recurringOption: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  recurringOptionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedRecurringOption: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
  },
  selectedRecurringText: {
    color: '#fff',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#2196F3',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#fff',
  },
});
