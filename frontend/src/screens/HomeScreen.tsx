import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {getTasks, getDailyPlan} from '../services/api';
import TaskList from '../components/TaskList';
import DailySchedule from '../components/DailySchedule';

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

type DailyPlan = {
  date: string;
  schedule: ScheduledTask[];
};

const HomeScreen: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [plan, setPlan] = useState<DailyPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const tasksData = await getTasks();
      setTasks(tasksData);
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchPlan = async () => {
    setLoading(true);
    try {
      const planData = await getDailyPlan();
      setPlan(planData);
    } catch (err) {
      setError('Failed to generate plan');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, []),
  );

  const onEditTask = (task: Task) => {
    navigation.navigate('EditTask', {task});
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>Tasks</Text>
        <TaskList
          tasks={tasks}
          onTaskUpdate={fetchTasks}
          onEditTask={onEditTask}
        />
        <View style={styles.buttonRow}>
          <Button
            title="Add New Task"
            onPress={() => navigation.navigate('AddTask')}
          />
          <Button title="Plan" onPress={fetchPlan} />
        </View>
        {plan && (
          <>
            <Text style={[styles.header, styles.marginTop]}>
              Daily Schedule
            </Text>
            <DailySchedule schedule={plan.schedule} tasks={tasks} />
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  marginTop: {
    marginTop: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default HomeScreen;
