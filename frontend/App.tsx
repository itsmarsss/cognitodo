import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import AddTaskScreen from './src/screens/AddTaskScreen';
import EditTaskScreen from './src/screens/EditTaskScreen';

const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerShadowVisible: false,
          cardStyle: {backgroundColor: '#f8f9fa'},
        }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'CogniTodo',
            headerLargeTitle: true,
          }}
        />
        <Stack.Screen
          name="AddTask"
          component={AddTaskScreen}
          options={{
            title: 'Add Task',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="EditTask"
          component={EditTaskScreen}
          options={{
            title: 'Edit Task',
            presentation: 'modal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
