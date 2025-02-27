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
    navigation.navigate('EditTask', {task});
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

  // Function to determine color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#28a745'; // Green
      case 'pending':
        return '#ffc107'; // Yellow
      case 'cancelled':
        return '#dc3545'; // Red
      case 'rescheduled':
        return '#17a2b8'; // Teal
      default:
        return '#6c757d'; // Gray for unknown status
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
            {task.name || 'New Task'}
          </Text>
        </View>
        <Text style={styles.taskDescription} numberOfLines={2}>
          {task.description || 'Task description.'}
        </Text>
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.taskTime}>
          {task.duration || 0} min{task.duration != '1' ? 's' : ''}
        </Text>
        <Text style={[styles.taskStatus, {color: getStatusColor(task.status)}]}>
          {task.status ? `${task.status}` : 'Pending'}
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
    flex: 0.5,
    paddingLeft: 5,
  },
  taskTime: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  taskStatus: {
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
