import React from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';

type Task = {
  id: number;
  description: string;
  status: string;
};

type ScheduledTask = {
  task_id: number;
  start_time: string;
  end_time: string;
  priority: string;
};

type DailyScheduleProps = {
  schedule: ScheduledTask[];
  tasks: Task[];
};

const DailySchedule: React.FC<DailyScheduleProps> = ({schedule, tasks}) => {
  const taskMap = tasks.reduce((map, task) => {
    map[task.id] = task.description;
    return map;
  }, {} as Record<number, string>);

  return (
    <FlatList
      data={schedule}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <View style={styles.scheduleCard}>
          <Text style={styles.scheduleText}>
            Task: {taskMap[item.task_id] || 'Unknown'}
          </Text>
          <Text style={styles.scheduleText}>
            Time: {item.start_time} - {item.end_time}
          </Text>
          <Text style={styles.scheduleText}>Priority: {item.priority}</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  scheduleCard: {
    backgroundColor: '#e0f7fa',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  scheduleText: {
    fontSize: 14,
    color: '#333',
  },
});

export default DailySchedule;
