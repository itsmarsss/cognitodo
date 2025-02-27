import React, {useState, useEffect, useContext} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import ScheduleList from '../components/ScheduleList';
import {TasksContext} from '../contexts/TasksContext';
import {getDailyPlan} from '../services/api';
import {DailyPlan} from '../types';
import TasksListButton from '../components/TasksListButton';

const SchedulesScreen: React.FC = () => {
  const {tasks} = useContext(TasksContext);
  const [dailyPlan, setDailyPlan] = useState<DailyPlan | null>(null);
  const [loading, setLoading] = useState(false);

  const plan = async () => {
    setLoading(true);
    try {
      const plan = await getDailyPlan(); // Assume getDailyPlan accepts a date parameter
      setDailyPlan(plan);
    } catch (error) {
      Alert.alert('Failed to fetch schedule');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    plan;
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : dailyPlan ? (
        <ScheduleList schedule={dailyPlan.schedule} tasks={tasks} />
      ) : (
        <Text>No schedule for this date</Text>
      )}
      <TasksListButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
});

export default SchedulesScreen;
