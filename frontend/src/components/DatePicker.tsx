import React, {useState} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';

const DatePicker: React.FC = () => {
  const [date, setDate] = useState(new Date());

  const onChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setDate(selectedDate); // Set the selected date
    }
  };

  return (
    <DateTimePicker
      style={{marginLeft: -10}}
      value={date}
      mode="date"
      display="default"
      onChange={onChange}
    />
  );
};

export default DatePicker;
