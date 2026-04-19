import React from 'react';
import { StyleSheet, View } from 'react-native';
import ThemedText from './ThemedText';

type MenuHeaderProps = { title: string };

const MenuHeader = ({ title }: MenuHeaderProps) => {
  return (
    <View style={styles.headerContainer}>
      <ThemedText style={styles.headerText} title={title} />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default MenuHeader;
