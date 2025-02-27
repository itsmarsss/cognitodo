import React from 'react';
import {View, Text, Button, FlatList, StyleSheet} from 'react-native';
import {updateTask, deleteTask} from '../services/api';

type Task = {
  id: number;
  description: string;
  status: string;
};

type TaskListProps = {
  tasks: Task[];
  onTaskUpdate: () => void;
  onEditTask: (task: Task) => void;
};

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onTaskUpdate,
  onEditTask,
}) => {
  const handleToggleStatus = async (task: Task) => {
    const newStatus = task.status === 'pending' ? 'completed' : 'pending';
    try {
      await updateTask(task.id, task.description, newStatus);
      onTaskUpdate();
    } catch (error) {
      alert('Failed to update task');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTask(id);
      onTaskUpdate();
    } catch (error) {
      alert('Failed to delete task');
    }
  };

  return (
    <FlatList
      data={tasks}
      keyExtractor={item => item.id.toString()}
      renderItem={({item}) => (
        <View style={styles.taskCard}>
          <Text style={styles.taskText}>{item.description}</Text>
          <View style={styles.buttonContainer}>
            <Button
              title={item.status === 'pending' ? 'Complete' : 'Undo'}
              onPress={() => handleToggleStatus(item)}
            />
            <Button title="Edit" onPress={() => onEditTask(item)} />
            <Button title="Delete" onPress={() => handleDelete(item.id)} />
          </View>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  taskCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  taskText: {
    fontSize: 16,
    flex: 1,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
});

export default TaskList;
