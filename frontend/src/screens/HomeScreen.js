import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import TaskList from '../components/TaskList';
import DailySchedule from '../components/DailySchedule';
import {getPlanForDate, createPlan} from '../services/api';
import {format} from '../utils/dateUtils';

const HomeScreen = ({navigation}) => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('schedule');

  useEffect(() => {
    const today = new Date();
    loadPlan(today);

    // Set up navigation listener to refresh data when screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      loadPlan(today);
    });

    return unsubscribe;
  }, [navigation]);

  const loadPlan = async date => {
    setLoading(true);
    try {
      const formattedDate = format(date, 'YYYY-MM-DD');
      const data = await getPlanForDate(formattedDate);
      setPlan(data);
    } catch (error) {
      console.error('Error loading plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateNewPlan = async () => {
    if (!plan?.tasks || plan.tasks.length === 0) {
      // Navigate to add task screen if no tasks exist
      navigation.navigate('AddTask');
      return;
    }

    setLoading(true);
    try {
      const today = new Date();
      const formattedDate = format(today, 'YYYY-MM-DD');

      const taskDescriptions = plan.tasks.map(task => task.title);

      const planRequest = {
        taskDescriptions,
        date: formattedDate,
        workHours: {
          start: '09:00',
          end: '17:00',
        },
        preferences: 'Include breaks',
      };

      const newPlan = await createPlan(planRequest);
      setPlan(newPlan);
    } catch (error) {
      console.error('Error generating plan:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading your day...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CogniTodo</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddTask')}>
          <Text style={styles.addButtonText}>+ Add Task</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>
          {format(new Date(), 'dddd, MMMM D')}
        </Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'schedule' && styles.activeTab]}
          onPress={() => setActiveTab('schedule')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'schedule' && styles.activeTabText,
            ]}>
            Schedule
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'tasks' && styles.activeTab]}
          onPress={() => setActiveTab('tasks')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'tasks' && styles.activeTabText,
            ]}>
            All Tasks
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'schedule' ? (
          <DailySchedule plan={plan} />
        ) : (
          <TaskList tasks={plan?.tasks || []} />
        )}
      </ScrollView>

      <TouchableOpacity style={styles.planButton} onPress={generateNewPlan}>
        <Text style={styles.planButtonText}>Plan My Day</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4A90E2',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#4A90E2',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  addButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  dateContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  dateText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#212529',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4A90E2',
  },
  tabText: {
    fontSize: 16,
    color: '#6C757D',
  },
  activeTabText: {
    color: '#4A90E2',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  planButton: {
    margin: 16,
    backgroundColor: '#4A90E2',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  planButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;
