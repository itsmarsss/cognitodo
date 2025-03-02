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
  const task = (tasks || []).find(task => task.id === schedule.task_id);

  const handlePress = () => {
    // Navigate to the EditTask with the task parameter
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
  const getBorderColor = (status: string) => {
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
    <>
      {task ? ( // Check if task exists before rendering TouchableOpacity
        <TouchableOpacity
          style={[
            styles.card,
            {
              backgroundColor: '#FFFFFF',
              borderLeftWidth: 2,
              borderLeftColor: getBorderColor(task ? task.status : 'pending'),
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
                    color: getBackgroundColor(task ? task.priority : 'medium'),
                  }}>
                  •
                </Text>{' '}
                {task ? task.name : 'Task Not Found'}
              </Text>
            </View>
            <Text style={styles.scheduleDescription} numberOfLines={2}>
              {task ? task.description : 'No description available'}
            </Text>
          </View>
          <View style={styles.rightSection}>
            <Text style={styles.scheduleTime}>
              Start: {schedule.start_time}
            </Text>
            <Text style={styles.scheduleTime}>End: {schedule.end_time}</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <Text style={styles.taskNotFound}>Task Not Found</Text> // Optional placeholder
      )}
    </>
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
  taskNotFound: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 25,
    marginBottom: 15,
  },
});

export default Schedule;
