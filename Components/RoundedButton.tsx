import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

type RoundedButtonProps = {
  title: string;
  onPress: () => void;
};

function RoundedButton(props: RoundedButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={props.onPress}>
      <Text style={styles.text}>{props.title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 30,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RoundedButton;
