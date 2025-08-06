import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export default function HistoryScreen({ route }) {
  const { history } = route.params;


  // Convert string dates to Date objects and sort descending
  const sortedHistory = [...history].sort((a, b) => {
    return new Date(b.actionAt) - new Date(a.actionAt);
  });
  

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Task History</Text>
     <FlatList
  data={sortedHistory}
  keyExtractor={item => item.id + item.actionAt}
  renderItem={({ item }) => (
    <View style={styles.item}>
      <Text style={[styles.text, item.completed && styles.completed]}>
        {item.text}
      </Text>
      <Text style={styles.date}>Created: {item.createdAt}</Text>
      <Text style={styles.date}>Action: {item.action} at {item.actionAt}</Text>
    </View>
  )}
/>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  item: {
    backgroundColor: '#eee',
    padding: 10,
    marginBottom: 8,
    borderRadius: 6,
  },
  text: { fontSize: 16 },
  completed: { textDecorationLine: 'line-through', color: 'gray' },
  date: { fontSize: 12, color: '#777' },
  status: { marginTop: 4, fontStyle: 'italic' },
});
