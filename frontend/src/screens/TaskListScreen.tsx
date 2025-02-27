import React, {useContext} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import TaskList from '../components/TaskList';
import {TasksContext} from '../contexts/TasksContext';
import AddTask from '../components/AddTask';
import DatePicker from '../components/DatePicker';

const TaskListScreen: React.FC = () => {
  const {tasks, refreshTasks} = useContext(TasksContext);
  const navigation = useNavigation();

  const handleEditTask = (task: any) => {
    navigation.navigate('EditTask', {task});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Tasks</Text>
      <DatePicker />
      <TaskList
        tasks={tasks}
        onTaskUpdate={refreshTasks}
        onEditTask={handleEditTask}
      />
      <AddTask />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FBFBFB',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 20,
    color: '#333',
  },
});

export default TaskListScreen;
