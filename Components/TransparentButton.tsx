import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

type TransparentButtonProps = {
    title: string;
    onPress: () => void;
}

function TransparentButton(props: TransparentButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={props.onPress}>
      <Text style={styles.text}>{props.title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "transparent",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default TransparentButton;