import React from 'react';
import {FlatList, StyleSheet} from 'react-native';

import {ScheduledTask} from '../types';
import Schedule from './Schedule';

type ScheduleListProps = {
  schedule: ScheduledTask[];
};

const ScheduleList: React.FC<ScheduleListProps> = ({schedule}) => {
  return (
    <FlatList
      data={schedule}
      keyExtractor={item => item.task_id.toString()}
      renderItem={({item}) => <Schedule schedule={item} />}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingTop: 5,
    paddingBottom: 75,
  },
});

export default ScheduleList;
