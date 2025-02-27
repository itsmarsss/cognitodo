import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {getTasks, getDailyPlan} from '../services/api';
import TaskList from '../components/TaskList';
import DailySchedule from '../components/ScheduleList';

type Task = {id: number; description: string; status: string};
type ScheduledTask = {
  task_id: number;
  start_time: string;
  end_time: string;
  priority: string;
};
type DailyPlan = {date: string; schedule: ScheduledTask[]};

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
    <View style={styles.container}>
      <Text style={styles.header}>Tasks</Text>
      <TaskList
        tasks={tasks}
        onTaskUpdate={fetchTasks}
        onEditTask={onEditTask}
      />
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.orangeButton}
          onPress={() => navigation.navigate('AddTask')}>
          <Text style={styles.buttonText}>Add New Task</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.orangeButton} onPress={fetchPlan}>
          <Text style={styles.buttonText}>Plan</Text>
        </TouchableOpacity>
      </View>
      {plan && (
        <>
          <Text style={[styles.header, styles.marginTop]}>Daily Schedule</Text>
          <DailySchedule schedule={plan.schedule} tasks={tasks} />
        </>
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#E64A19', // Dark orange for headers
  },
  marginTop: {
    marginTop: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  orangeButton: {
    backgroundColor: '#FF5722', // Orange accent
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default HomeScreen;
