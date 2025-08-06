import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Text } from 'react-native';

import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  Button
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
  if (task.trim() === '') return;

  const newTask = {
    id: Date.now().toString(),
    text: task,
    completed: false,
    createdAt: new Date().toLocaleString(),
    dueDate: dueDate, // add due date here
  };

  console.log(`[ADD] "${newTask.text}" due on ${dueDate || "No due date"}`);

  setTasks([...tasks, newTask]);
  setTask('');
  setDueDate(null); // reset for next task
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
    const logItem = {
      ...taskToDelete,
      action: 'deleted',
      actionAt: new Date().toLocaleString()
    };
    setHistory(prev => [...prev, logItem]);
    console.log(`[DELETE] "${taskToDelete.text}" at ${logItem.actionAt}`);
  }
  setTasks(tasks.filter(t => t.id !== id));
};



  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Add a task..."
        value={task}
        onChangeText={setTask}
        style={styles.input}
      />
      <Button title="Add Task" onPress={handleAddTask} />

      <Button title="Pick Due Date" onPress={() => setShowDatePicker(true)} />

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
  <Text style={{ marginVertical: 8 }}>📅 Due: {dueDate}</Text>
)}


      {/* Navigate to History Screen */}
      <View style={{ marginVertical: 10 }}>
        <Button
          title="View Task History"
          onPress={() => navigation.navigate('History', { history })}
        />
      </View>

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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});
