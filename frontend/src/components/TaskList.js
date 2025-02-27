import React from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';

const TaskPriority = ({priority}) => {
  const colors = {
    low: '#28A745',
    medium: '#FFC107',
    high: '#DC3545',
  };

  return (
    <View
      style={[
        styles.priorityBadge,
        {backgroundColor: colors[priority] || colors.medium},
      ]}>
      <Text style={styles.priorityText}>{priority.toUpperCase()}</Text>
    </View>
  );
};

const TaskItem = ({task, onPress}) => {
  return (
    <TouchableOpacity style={styles.taskItem} onPress={() => onPress(task)}>
      <View style={styles.taskHeader}>
        <Text style={styles.taskTitle} numberOfLines={1}>
          {task.title}
        </Text>
        <TaskPriority priority={task.priority} />
      </View>

      {task.description ? (
        <Text style={styles.taskDescription} numberOfLines={2}>
          {task.description}
        </Text>
      ) : null}

      <View style={styles.taskDetails}>
        {task.duration ? (
          <Text style={styles.taskDetail}>{task.duration} min</Text>
        ) : null}

        {task.completed ? (
          <View style={styles.completedBadge}>
            <Text style={styles.completedText}>COMPLETED</Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const TaskList = ({tasks = [], onTaskPress}) => {
  if (!tasks.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No tasks yet</Text>
        <Text style={styles.emptySubtext}>
          Add tasks to start planning your day
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={tasks}
      keyExtractor={item => item.id.toString()}
      renderItem={({item}) => (
        <TaskItem task={item} onPress={onTaskPress || (() => {})} />
      )}
      style={styles.list}
      contentContainerStyle={styles.listContent}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  taskItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    flex: 1,
    marginRight: 8,
  },
  taskDescription: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 8,
  },
  taskDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskDetail: {
    fontSize: 12,
    color: '#6C757D',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  completedBadge: {
    backgroundColor: '#28A745',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  completedText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6C757D',
    textAlign: 'center',
  },
});

export default TaskList;
