import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Text} from 'react-native-gesture-handler';

const AddTask: React.FC = () => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('AddTask');
  };

  return (
    <TouchableOpacity style={styles.fab} onPress={handlePress}>
      <Text style={{fontSize: 48, color: '#fff', lineHeight: 50}}>+</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 25,
    bottom: 25,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ffa500',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});

export default AddTask;
