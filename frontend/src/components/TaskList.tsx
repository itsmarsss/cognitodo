import React from 'react';
import {FlatList, StyleSheet} from 'react-native';
import Task from './Task';
import {Task as TaskType} from '../types';

type TaskListProps = {
  tasks: TaskType[];
  onEditTask: (task: TaskType) => void;
};

const TaskList: React.FC<TaskListProps> = ({tasks, onEditTask}) => {
  return (
    <FlatList
      data={tasks}
      keyExtractor={item => item.id.toString()}
      renderItem={({item}) => <Task task={item} onEditTask={onEditTask} />}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 10,
  },
});

export default TaskList;
