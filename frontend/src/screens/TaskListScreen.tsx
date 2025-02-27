import React, {useContext} from 'react';
import {View, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import TaskList from '../components/TaskList';
import {TasksContext} from '../contexts/TasksContext';
import AddTask from '../components/AddTask';

const TaskListScreen: React.FC = () => {
  const {tasks, refreshTasks} = useContext(TasksContext);
  const navigation = useNavigation();

  const handleEditTask = (task: any) => {
    navigation.navigate('EditTask', {task});
  };

  return (
    <View style={styles.container}>
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
    backgroundColor: '#f5f5f5',
  },
});

export default TaskListScreen;
