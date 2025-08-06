import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, StatusBar } from 'react-native';

export default function HistoryScreen({ route }) {
  const { history } = route.params;

  // Convert string dates to Date objects and sort descending
  const sortedHistory = [...history].sort((a, b) => {
    return new Date(b.actionAt) - new Date(a.actionAt);
  });

  const getActionIcon = (action) => {
    switch (action) {
      case 'completed': return '✅';
      case 'undone': return '↶';
      case 'deleted': return '🗑️';
      default: return '📝';
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'completed': return '#28a745';
      case 'undone': return '#ffc107';
      case 'deleted': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const renderHistoryItem = ({ item }) => (
    <View style={styles.historyItem}>
      <View style={styles.historyHeader}>
        <View style={[styles.actionBadge, { backgroundColor: getActionColor(item.action) }]}>
          <Text style={styles.actionIcon}>{getActionIcon(item.action)}</Text>
        </View>
        <View style={styles.historyContent}>
          <Text style={[styles.taskText, item.completed && styles.completedText]}>
            {item.text}
          </Text>
          <Text style={styles.actionText}>
            {item.action.charAt(0).toUpperCase() + item.action.slice(1)} at {item.actionAt}
          </Text>
        </View>
      </View>
      <Text style={styles.createdText}>Originally created: {item.createdAt}</Text>
      {item.dueDate && (
        <Text style={styles.dueDateText}>📅 Due date: {item.dueDate}</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Task History</Text>
        <Text style={styles.subtitle}>
          {sortedHistory.length} {sortedHistory.length === 1 ? 'action' : 'actions'} recorded
        </Text>
      </View>

      {sortedHistory.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>📝</Text>
          <Text style={styles.emptyStateText}>No history yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Complete, undo, or delete tasks to see them here
          </Text>
        </View>
      ) : (
        <FlatList
          data={sortedHistory}
          keyExtractor={item => item.id + item.actionAt}
          renderItem={renderHistoryItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}
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
    paddingBottom: 15,
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
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  historyItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  actionBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionIcon: {
    fontSize: 16,
    color: '#ffffff',
  },
  historyContent: {
    flex: 1,
  },
  taskText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 4,
    lineHeight: 22,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#6c757d',
  },
  actionText: {
    fontSize: 14,
    color: '#495057',
    fontWeight: '500',
  },
  createdText: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 4,
  },
  dueDateText: {
    fontSize: 12,
    color: '#495057',
    fontStyle: 'italic',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6c757d',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#adb5bd',
    textAlign: 'center',
    lineHeight: 22,
  },
});
