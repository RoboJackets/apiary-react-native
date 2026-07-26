import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';
import { useTheme } from '../Themes/ThemeContextProvider';

type ThemedTextProps = TextProps & {
  title: string;
};

const ThemedText = ({ title, style }: ThemedTextProps) => {
  const { currentTheme } = useTheme();

  return <Text style={[styles.text, { color: currentTheme.onBackground }, style]}>{title}</Text>;
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
  },
});

export default ThemedText;
