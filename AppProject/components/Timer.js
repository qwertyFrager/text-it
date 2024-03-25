import React, { useState, useRef } from 'react';
import { View, Text, Button } from 'react-native';

function Timer() {
  const [time, setTime] = useState(0);
  const intervalRef = useRef(null);

  const startTimer = () => {
    if (intervalRef.current !== null) return;

    intervalRef.current = setInterval(() => {
      setTime(prevTime => prevTime + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current === null) return;

    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const resetTimer = () => {
    stopTimer();
    setTime(0);
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{ fontSize: 32}}>{time}</Text>
      <View style={{ flexDirection: 'row' }}>
        <Button title="Start" onPress={startTimer} />
        <Button title="Stop" onPress={stopTimer} />
        <Button title="Reset" onPress={resetTimer} />
      </View>
    </View>
  );
}

export default Timer;