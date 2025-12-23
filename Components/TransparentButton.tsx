import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

type TransparentButtonProps = {
  title: string;
  onPress: () => void;
};

function TransparentButton(props: TransparentButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={props.onPress}>
      <Text style={styles.text}>{props.title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 30,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  text: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TransparentButton;
