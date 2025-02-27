import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Task as TaskType} from '../types';

type TaskProps = {
  task: TaskType;
};

const Task: React.FC<TaskProps> = ({task}) => {
  const navigation = useNavigation();

  const handlePress = () => {
    console.log('Navigating to EditTask with:', task);
    navigation.navigate('EditTask', {
      taskId: task.id,
      initialName: task.name,
      initialDescription: task.description,
      initialStatus: task.status,
      initialPriority: task.priority || 'medium',
      initialDueDate: task.dueDate,
      initialDuration: task.duration,
    });
  };

  // Function to determine background color based on priority
  const getBackgroundColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#ff0000'; // Light red
      case 'medium':
        return '#ffa500'; // Light orange
      case 'low':
        return '#008000'; // Light green
      default:
        return '#ffa500'; // Default to light orange
    }
  };

  // Function to determine emoji based on status
  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'completed':
        return '✅'; // Check mark emoji
      case 'pending':
        return '⏳'; // Hourglass emoji
      case 'cancelled':
        return '❌'; // Cross mark emoji
      case 'rescheduled':
        return '🔄'; // Counterclockwise arrows emoji
      default:
        return '❓'; // Question mark emoji for unknown status
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: '#FFFFFF',
        },
      ]}
      onPress={handlePress}>
      <View style={styles.leftSection}>
        <View style={styles.taskHeader}>
          <Text style={styles.taskName} numberOfLines={1} ellipsizeMode="tail">
            <Text
              style={{
                color: getBackgroundColor(task.priority || 'medium'),
                fontSize: 20,
              }}>
              •
            </Text>{' '}
            {task.name || 'New Task'}{' '}
            <Text style={styles.status}>{getStatusEmoji(task.status)}</Text>
          </Text>
        </View>
        <Text style={styles.taskDescription} numberOfLines={2}>
          {task.description || 'Task description.'}
        </Text>
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.taskTime}>{task.timeToComplete || 0} mins</Text>
        <Text style={styles.taskDue}>
          {task.dueDate
            ? `Due: ${new Date(task.dueDate).toLocaleDateString()}`
            : 'Flexible'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginLeft: 25,
    marginBottom: 15,
    marginHorizontal: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 3, height: 3},
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  leftSection: {
    flex: 0.8,
    paddingRight: 5,
  },
  taskNameContainer: {
    flex: 1,
    maxWidth: 200,
  },
  taskName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    maxWidth: 200,
    marginBottom: 5,
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
  },
  rightSection: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 0.2,
    paddingLeft: 5,
  },
  taskTime: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  taskDue: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#999',
  },
  status: {
    fontSize: 12,
  },
  priority: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default Task;
