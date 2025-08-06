import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function TaskItem({ task, onToggleComplete, onDelete }) {
  return (
    <View style={styles.taskContainer}>
      <Text style={[styles.taskText, task.completed && styles.completed]}>
        {task.text}
      </Text>

      {task.dueDate && (
  <Text style={styles.dueDate}>Due: {task.dueDate}</Text>
)}


      {/* Show created date/time */}
      <Text style={styles.dateText}>
        {task.createdAt}
      </Text>

      <View style={styles.buttons}>
        <Button
          title={task.completed ? "Undo" : "Complete"}
          onPress={onToggleComplete}
        />
        <Button
          title="Delete"
          onPress={onDelete}
          color="red"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  taskContainer: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  taskText: {
    fontSize: 16,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  dateText: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },

  dueDate: {
  fontSize: 12,
  color: '#555',
},

});
