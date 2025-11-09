import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

type RoundedButtonProps = {
    title: string;
    onPress: () => void;
}

function RoundedButton(props: RoundedButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={props.onPress}>
      <Text style={styles.text}>{props.title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default RoundedButton;