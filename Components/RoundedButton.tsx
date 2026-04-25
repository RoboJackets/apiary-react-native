import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

type RoundedButtonProps = {
  title: string;
  onPress: () => void;
  color?: string;
  textColor?: string;
  borderColor?: string;
};

function RoundedButton(props: RoundedButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: props.color ?? '#007AFF' },
        { borderColor: props.borderColor ?? 'transparent' },
      ]}
      onPress={props.onPress}
    >
      <Text style={[styles.text, { color: props.textColor ?? '#fff' }]}>{props.title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 30,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RoundedButton;
