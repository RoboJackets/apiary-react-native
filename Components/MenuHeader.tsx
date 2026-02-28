import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type MenuHeaderProps = { title: string };

const MenuHeader = ({ title }: MenuHeaderProps) => (
  <View style={styles.headerContainer}>
    <Text style={styles.headerText}>{title}</Text>
  </View>
);

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
