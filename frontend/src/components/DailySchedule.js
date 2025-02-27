import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {format} from '../utils/dateUtils';

const TimeBlock = ({task, onPress}) => {
  const startTime = task.startTime
    ? format(new Date(task.startTime), 'h:mm A')
    : '';
  const endTime = task.endTime ? format(new Date(task.endTime), 'h:mm A') : '';

  const getBackgroundColor = () => {
    switch (task.priority) {
      case 'high':
        return 'rgba(220, 53, 69, 0.1)';
      case 'medium':
        return 'rgba(255, 193, 7, 0.1)';
      case 'low':
        return 'rgba(40, 167, 69, 0.1)';
      default:
        return 'rgba(73, 80, 87, 0.05)';
    }
  };

  const getBorderColor = () => {
    switch (task.priority) {
      case 'high':
        return '#DC3545';
      case 'medium':
        return '#FFC107';
      case 'low':
        return '#28A745';
      default:
        return '#6C757D';
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.timeBlock,
        {
          backgroundColor: getBackgroundColor(),
          borderLeftColor: getBorderColor(),
        },
      ]}
      onPress={() => onPress && onPress(task)}>
      <View style={styles.timeInfo}>
        {startTime && endTime ? (
          <Text style={styles.timeText}>
            {startTime} - {endTime}
          </Text>
        ) : null}
      </View>
      <View style={styles.taskContent}>
        <Text style={styles.taskTitle}>{task.title}</Text>
        {task.description ? (
          <Text style={styles.taskDescription} numberOfLines={1}>
            {task.description}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const DailySchedule = ({plan, onTaskPress}) => {
  if (!plan || !plan.tasks || !plan.tasks.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No schedule yet</Text>
        <Text style={styles.emptySubtext}>
          Add tasks and generate a plan to see your schedule
        </Text>
      </View>
    );
  }

  // Sort tasks by start time
  const sortedTasks = [...plan.tasks].sort((a, b) => {
    if (!a.startTime && !b.startTime) return 0;
    if (!a.startTime) return 1;
    if (!b.startTime) return -1;
    return new Date(a.startTime) - new Date(b.startTime);
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.timeline}>
        {sortedTasks.map(task => (
          <TimeBlock
            key={task.id.toString()}
            task={task}
            onPress={onTaskPress}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  timeline: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  timeBlock: {
    flexDirection: 'row',
    marginBottom: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  timeInfo: {
    width: 90,
    marginRight: 12,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#495057',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: '#6C757D',
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

export default DailySchedule;
