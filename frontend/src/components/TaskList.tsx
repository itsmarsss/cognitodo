import React, {useState} from 'react';
import {FlatList, StyleSheet} from 'react-native';
import Task from './Task';
import {Task as TaskType} from '../types';

type TaskListProps = {
  tasks: TaskType[];
  onRefresh: () => void;
  refreshing: boolean;
};

const TaskList: React.FC<TaskListProps> = ({tasks, onRefresh, refreshing}) => {
  return (
    <FlatList
      data={tasks}
      keyExtractor={item => item.id.toString()}
      renderItem={({item}) => <Task task={item} />}
      contentContainerStyle={styles.listContainer}
      onRefresh={onRefresh}
      refreshing={refreshing}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingTop: 5,
  },
});

export default TaskList;
