// App.tsx - Revised navigation structure
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {TasksProvider} from './src/contexts/TasksContext';
import TaskListScreen from './src/screens/TaskListScreen';
import AddTaskScreen from './src/screens/AddTaskScreen';
import EditTaskScreen from './src/screens/EditTaskScreen';
import SchedulesScreen from './src/screens/SchedulesScreen';

const Stack = createStackNavigator();

// Theme colors
const THEME = {
  primary: '#FFF', // Indigo as primary
  accent: '#FF9800', // Orange as accent, but used sparingly
  background: '#FDFDFD',
  card: '#FFFFFF',
  text: '#2D3748',
  border: '#E2E8F0',
};

const App: React.FC = () => {
  return (
    <TasksProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: THEME.primary,
            },
            headerTintColor: THEME.text,
          }}>
          <Stack.Screen
            name="TaskList"
            component={TaskListScreen}
            options={{title: 'CogniTodo'}}
          />
          <Stack.Screen
            name="AddTask"
            component={AddTaskScreen}
            options={{title: 'Create New Task'}}
          />
          <Stack.Screen
            name="EditTask"
            component={EditTaskScreen}
            options={{title: 'Edit Task'}}
          />
          <Stack.Screen
            name="ScheduleList"
            component={SchedulesScreen}
            options={{title: 'Daily Schedule'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </TasksProvider>
  );
};

export default App;
