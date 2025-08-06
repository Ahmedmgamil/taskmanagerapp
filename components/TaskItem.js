import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';

export default function TaskItem({ task, onToggleComplete, onDelete }) {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
  const isDueSoon = task.dueDate && new Date(task.dueDate) - new Date() < 24 * 60 * 60 * 1000 && !task.completed;

  return (
    <View style={[
      styles.taskContainer,
      task.completed && styles.completedContainer,
      isOverdue && styles.overdue,
      isDueSoon && !isOverdue && styles.dueSoon
    ]}>
      <View style={styles.taskContent}>
        <View style={styles.taskHeader}>
          <Text style={[
            styles.taskText, 
            task.completed && styles.completed,
            isOverdue && styles.overdueText
          ]}>
            {task.text}
          </Text>
          {task.completed && (
            <View style={styles.completedBadge}>
              <Text style={styles.completedBadgeText}>✓</Text>
            </View>
          )}
        </View>

        <View style={styles.taskMeta}>
          <Text style={styles.dateText}>
            Created: {task.createdAt}
          </Text>
          
          {task.dueDate && (
            <Text style={[
              styles.dueDate,
              isOverdue && styles.overdueDateText,
              isDueSoon && !isOverdue && styles.dueSoonText
            ]}>
              {isOverdue ? '⚠️ Overdue: ' : isDueSoon ? '⏰ Due soon: ' : '📅 Due: '}
              {task.dueDate}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.completeButton,
            task.completed && styles.undoButton
          ]}
          onPress={onToggleComplete}
        >
          <Text style={[
            styles.actionButtonText,
            task.completed && styles.undoButtonText
          ]}>
            {task.completed ? "↶ Undo" : "✓ Done"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={onDelete}
        >
          <Text style={styles.deleteButtonText}>🗑️ Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  taskContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  completedContainer: {
    backgroundColor: '#f8f9fa',
    borderLeftColor: '#28a745',
    opacity: 0.8,
  },
  overdue: {
    borderLeftColor: '#dc3545',
    backgroundColor: '#fff5f5',
  },
  dueSoon: {
    borderLeftColor: '#ffc107',
    backgroundColor: '#fffbf0',
  },
  taskContent: {
    flex: 1,
    marginBottom: 12,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  taskText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    flex: 1,
    lineHeight: 22,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#6c757d',
    fontWeight: '400',
  },
  overdueText: {
    color: '#dc3545',
  },
  completedBadge: {
    backgroundColor: '#28a745',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  completedBadgeText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  taskMeta: {
    marginTop: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 4,
  },
  dueDate: {
    fontSize: 13,
    color: '#495057',
    fontWeight: '500',
  },
  overdueDateText: {
    color: '#dc3545',
    fontWeight: '600',
  },
  dueSoonText: {
    color: '#f57c00',
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeButton: {
    backgroundColor: '#e8f5e8',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  undoButton: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffc107',
  },
  deleteButton: {
    backgroundColor: '#f8d7da',
    borderWidth: 1,
    borderColor: '#dc3545',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  undoButtonText: {
    color: '#f57c00',
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#dc3545',
  },
});
