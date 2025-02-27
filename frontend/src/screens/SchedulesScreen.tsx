import React, {useState, useEffect, useContext} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Calendar} from 'react-native-calendars';
import DailySchedule from '../components/ScheduleList';
import {TasksContext} from '../contexts/TasksContext';
import {getDailyPlan} from '../services/api';
import {DailyPlan} from '../types';

const SchedulesScreen: React.FC = () => {
  const {tasks} = useContext(TasksContext);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [dailyPlan, setDailyPlan] = useState<DailyPlan | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchSchedule = async (date: string) => {
    setLoading(true);
    try {
      const plan = await getDailyPlan(date); // Assume getDailyPlan accepts a date parameter
      setDailyPlan(plan);
    } catch (error) {
      console.error('Failed to fetch schedule', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule(selectedDate);
  }, [selectedDate]);

  const handleDayPress = (day: {dateString: string}) => {
    setSelectedDate(day.dateString);
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={{
          [selectedDate]: {selected: true, selectedColor: 'orange'},
        }}
      />
      {loading ? (
        <Text>Loading...</Text>
      ) : dailyPlan ? (
        <DailySchedule schedule={dailyPlan.schedule} tasks={tasks} />
      ) : (
        <Text>No schedule for this date</Text>
      )}
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
