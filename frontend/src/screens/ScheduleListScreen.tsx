import React, {useState, useEffect, useContext} from 'react';
import {View, Text, StyleSheet, Alert, ActivityIndicator} from 'react-native';
import ScheduleList from '../components/ScheduleList';
import {getDailyPlan} from '../services/api';
import {DailyPlan} from '../types';
import TasksListButton from '../components/TasksListButton';
import DatePicker from '../components/DatePicker';

const SchedulesListScreen: React.FC = () => {
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
    plan();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topper}>
        <Text style={styles.header}>Daily Schedule</Text>
        <DatePicker />
      </View>
      {loading ? (
        <ActivityIndicator
          style={{marginTop: 20}}
          size="large"
          color="#ffa500"
        />
      ) : dailyPlan ? (
        <ScheduleList schedule={dailyPlan.schedule} />
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
  topper: {
    marginLeft: 30,
    marginTop: 50,
    marginBottom: 10,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
});

export default SchedulesListScreen;
