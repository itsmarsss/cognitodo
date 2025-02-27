import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Schedule as ScheduleType} from '../types'; // Adjust the import based on your types

type ScheduleProps = {
  schedule: ScheduleType;
};

const Schedule: React.FC<ScheduleProps> = ({schedule}) => {
  const navigation = useNavigation();

  const handlePress = () => {
    // Navigate to the EditScheduleScreen or any other screen if needed
    navigation.navigate('EditScheduleScreen', {schedule});
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.leftSection}>
        <Text style={styles.scheduleTitle}>{schedule.title}</Text>
        <Text style={styles.scheduleDescription}>{schedule.description}</Text>
        <Text style={styles.schedulePriority}>
          Priority: {schedule.priority}
        </Text>
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.scheduleTime}>Start: {schedule.startTime}</Text>
        <Text style={styles.scheduleTime}>End: {schedule.endTime}</Text>
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
  scheduleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  scheduleDescription: {
    fontSize: 14,
    color: '#666',
  },
  schedulePriority: {
    fontSize: 12,
    color: '#999',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  scheduleTime: {
    fontSize: 14,
    color: '#333',
  },
});

export default Schedule;
