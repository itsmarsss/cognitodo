import React, {useContext} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ScheduledTask} from '../types'; // Adjust the import based on your types
import {TasksContext} from '../contexts/TasksContext'; // Import TasksContext

type ScheduleProps = {
  schedule: ScheduledTask;
};

const Schedule: React.FC<ScheduleProps> = ({schedule}) => {
  const navigation = useNavigation();
  const {tasks} = useContext(TasksContext); // Access tasks from context

  // Find the task using schedule.task_id
  const task = tasks.find(task => task.id === schedule.task_id);

  const handlePress = () => {
    // Navigate to the EditTask with the task parameter
    navigation.navigate('EditTask', {task});
  };

  // Function to determine border color based on priority
  const getBorderColor = (priority: string) => {
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

  // Function to get emoji based on task status
  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'completed':
        return '✅'; // Check mark
      case 'pending':
        return '⏳'; // Hourglass
      case 'cancelled':
        return '❌'; // Cross mark
      case 'rescheduled':
        return '🔄'; // Counterclockwise arrows
      default:
        return '❓'; // Question mark for unknown status
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: '#FFFFFF',
          borderLeftWidth: 2,
          borderLeftColor: getBorderColor(task ? task.priority : 'medium'),
        },
      ]}
      onPress={handlePress}>
      <View style={styles.leftSection}>
        <View style={styles.taskHeader}>
          <Text
            style={styles.scheduleTitle}
            numberOfLines={1}
            ellipsizeMode="tail">
            <Text
              style={{
                fontSize: 20,
              }}>
              {task ? getStatusEmoji(task.status) : '❓'}
            </Text>{' '}
            {task ? task.name : 'Task Not Found'}
          </Text>
        </View>
        <Text style={styles.scheduleDescription} numberOfLines={2}>
          {task ? task.description : 'No description available'}
        </Text>
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.scheduleTime}>Start: {schedule.start_time}</Text>
        <Text style={styles.scheduleTime}>End: {schedule.end_time}</Text>
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
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    maxWidth: 200,
    marginBottom: 5,
  },
  scheduleDescription: {
    fontSize: 14,
    color: '#666',
  },
  rightSection: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 0.5,
    paddingLeft: 5,
  },
  scheduleTime: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
});

export default Schedule;
