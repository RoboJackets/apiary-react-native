import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';
import { useTheme } from '../Themes/ThemeContextProvider';

type ThemedTextProps = TextProps & {
  children: React.ReactNode;
};

const ThemedText = ({ children, style }: ThemedTextProps) => {
  const { currentTheme } = useTheme();

  return <Text style={[styles.text, { color: currentTheme.onBackground }, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
  },
});

export default ThemedText;
