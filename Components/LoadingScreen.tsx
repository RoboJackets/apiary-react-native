import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../Themes/ThemeContextProvider';
import ThemedText from './ThemedText';

export default function LoadingScreen() {
  const { currentTheme } = useTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <ActivityIndicator size="large" />
      <ThemedText style={styles.text} title="Loading..." />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    marginTop: 10,
  },
});
