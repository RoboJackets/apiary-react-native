import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../Themes/Colors';
import { useTheme } from '../Themes/ThemeContextProvider';
import Callout from './Callout';

type WarningCalloutProps = {
  titleText: string;
  body: React.ReactNode;
  padding?: number;
};

function WarningCallout(props: WarningCalloutProps) {
  const { currentTheme } = useTheme();

  const backgroundColor = currentTheme.warningSubtle;
  const borderColor = Colors.warningLightMuted;

  return (
    <Callout
      title={
        <View style={styles.header}>
          <MaterialDesignIcons
            name="alert-circle-outline"
            color={currentTheme.onSurface}
            size={24}
          />
          <Text style={styles.title}>{props.titleText}</Text>
        </View>
      }
      backgroundColor={backgroundColor}
      borderColor={borderColor}
      padding={props.padding}
    >
      {props.body}
    </Callout>
  );
}

export default WarningCallout;

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
});
