import MaterialIcons from '@react-native-vector-icons/material-icons';
import React from 'react';
import { ColorValue, StyleSheet, Text, View } from 'react-native';

type ActionPromptProps = {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  color?: ColorValue;
  title: string;
  subtitle?: string;
  subtitle2?: string;
};

export const ActionPrompt = (props : ActionPromptProps) => {
  return (
    <View style={styles.viewContainer}>
      <MaterialIcons
        name={props.icon}
        size={100}
        style={styles.icon}
        color={props.color}
      />
      <Text style={styles.mainText}>{props.title}</Text>
      {props.subtitle && <Text style={styles.subText}>{props.subtitle}</Text>}
      {props.subtitle2 && <Text style={styles.subText}>{props.subtitle2}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  icon: {
    margin: 10,
  },
  mainText: {
    fontSize: 30,
    marginBottom: 20,
    textAlign: 'center',
  },
  subText: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  viewContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});