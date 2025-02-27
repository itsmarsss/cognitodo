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
      initialPriority: task.priority,
      initialDueDate: task.dueDate,
      initialDuration: task.duration,
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.leftSection}>
        <Text style={styles.taskName}>{task.name}</Text>
        <Text style={styles.taskDescription}>{task.description}</Text>
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.taskTime}>{task.timeToComplete} mins</Text>
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
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  leftSection: {
    flex: 1,
  },
  taskName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  taskTime: {
    fontSize: 14,
    color: '#333',
  },
  taskDue: {
    fontSize: 12,
    color: '#999',
  },
});

export default Task;
