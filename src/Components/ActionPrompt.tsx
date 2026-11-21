import MaterialIcons from '@react-native-vector-icons/material-icons';
import React from 'react';
import { ColorValue, StyleSheet, View } from 'react-native';
import ThemedText from './ThemedText';

type ActionPromptProps = {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  color?: ColorValue;
  title: string;
  subtitle?: string;
  subtitle2?: string;
};

export const ActionPrompt = (props: ActionPromptProps) => {
  return (
    <View style={styles.viewContainer}>
      <MaterialIcons name={props.icon} size={100} style={styles.icon} color={props.color} />
      <ThemedText style={styles.mainText} title={props.title} />
      {props.subtitle && <ThemedText style={styles.subText} title={props.subtitle} />}
      {props.subtitle2 && <ThemedText style={styles.subText} title={props.subtitle2} />}
    </View>
  );
};

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
