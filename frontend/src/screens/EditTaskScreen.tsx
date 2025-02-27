import React, {useState, useContext} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {updateTask} from '../services/api';
import {TasksContext} from '../contexts/TasksContext';

const EditTaskScreen: React.FC<{route: any}> = ({route}) => {
  const {
    taskId,
    initialName,
    initialDescription,
    initialStatus,
    initialPriority,
    initialDueDate,
    initialDuration,
  } = route.params;

  // Preload values for editing
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [status, setStatus] = useState(initialStatus);
  const [priority, setPriority] = useState(initialPriority);
  const [dueTime, setDueTime] = useState(new Date(initialDueDate)); // Ensure dueTime is a Date object
  const [duration, setDuration] = useState(initialDuration);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const navigation = useNavigation();
  const {refreshTasks} = useContext(TasksContext);

  // Status options with emojis
  const statusOptions = [
    {
      value: 'pending',
      label: 'Pending',
      icon: '⏳', // Hourglass emoji
      color: '#3182CE',
    },
    {
      value: 'completed',
      label: 'Completed',
      icon: '✅', // Check mark emoji
      color: '#38A169',
    },
    {value: 'cancelled', label: 'Cancelled', icon: '❌', color: '#E53E3E'},
    {
      value: 'rescheduled',
      label: 'Rescheduled',
      icon: '🔄', // Counterclockwise arrows emoji
      color: '#DD6B20',
    },
  ];

  // Priority options with colors
  const priorityOptions = [
    {value: 'high', label: 'High', color: '#E53E3E'},
    {value: 'medium', label: 'Medium', color: '#DD6B20'},
    {value: 'low', label: 'Low', color: '#38A169'},
  ];

  const handleUpdateTask = async (taskId: number) => {
    if (description.trim()) {
      try {
        await updateTask(
          taskId,
          name,
          description,
          status,
          priority,
          dueTime.toISOString().split('T')[0], // Keep the date part
          duration,
        );
        refreshTasks();
        navigation.goBack();
      } catch (error) {
        alert('Failed to update task');
      }
    } else {
      alert('Please enter a task description');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoid}>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.formGroup}>
          <Text style={styles.label}>Task Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter task name"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Task Description</Text>
          <TextInput
            style={styles.descriptionInput}
            placeholder="What needs to be done?"
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Status</Text>
          <View style={styles.optionsContainer}>
            {statusOptions.map(option => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButton,
                  status === option.value && styles.optionButtonSelected,
                  status === option.value && {borderColor: option.color},
                ]}
                onPress={() => setStatus(option.value)}>
                <Text style={{fontSize: 16}}>{option.icon + ' '}</Text>
                <Text
                  style={[
                    styles.optionText,
                    status === option.value && {color: option.color},
                  ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Priority</Text>
          <View style={styles.optionsContainer}>
            {priorityOptions.map(option => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButton,
                  priority === option.value && styles.optionButtonSelected,
                  priority === option.value && {borderColor: option.color},
                ]}
                onPress={() => setPriority(option.value)}>
                <Text
                  style={[
                    styles.optionText,
                    priority === option.value && {color: option.color},
                  ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.rowContainer}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Duration (mins)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter duration in minutes"
              value={duration}
              onChangeText={text => {
                const numericValue = text.replace(/[^0-9]/g, '');
                const numericDuration = parseInt(numericValue, 10);
                if (numericDuration >= 0 && numericDuration <= 1440) {
                  setDuration(numericValue);
                }
              }}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.dueTimeContainer}>
            <Text style={styles.label}>Due Time</Text>
            <DateTimePicker
              value={dueTime}
              mode="time"
              display="default"
              onChange={(event, selectedTime) => {
                setShowTimePicker(false);
                if (selectedTime) setDueTime(selectedTime);
              }}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => handleUpdateTask(taskId)}>
          <Text style={styles.submitButtonText}>Update Task</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FBFBFB',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A5568',
    marginBottom: 8,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#fff',
    minHeight: 120,
    fontSize: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E0',
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 4,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  optionButtonSelected: {
    borderWidth: 2,
    backgroundColor: '#F7FAFC',
  },
  optionText: {
    color: '#4A5568',
    fontWeight: '500',
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 14,
    backgroundColor: '#fff',
  },
  dateText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#4A5568',
  },
  submitButton: {
    backgroundColor: '#5C6BC0',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginVertical: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    height: 40, // Set a fixed height for normal text input
  },
  dueTimeContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: 10,
    marginBottom: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default EditTaskScreen;
