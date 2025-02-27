import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';

const AddTask: React.FC = () => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('AddTask');
  };

  return (
    <TouchableOpacity style={styles.fab} onPress={handlePress}>
      <Icon name="add" size={48} color="#fff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#5C6BC0',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});

export default AddTask;
