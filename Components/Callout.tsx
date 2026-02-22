import React, { useMemo } from 'react';
import { ColorValue, StyleSheet, View } from 'react-native';
import { useTheme } from '../Themes/ThemeContextProvider';

type CalloutProps = {
  title: React.ReactNode;
  children: React.ReactNode;
  backgroundColor?: ColorValue;
  borderColor?: ColorValue;
  padding?: number;
};

function Callout(props: CalloutProps) {
  const {currentTheme} = useTheme()
  const styles = useMemo(() => StyleSheet.create({
    container: {
        borderRadius: 8,
        width: '100%',
        backgroundColor: props.backgroundColor ?? currentTheme.background,
        borderColor: props.borderColor,
        borderWidth: props.borderColor ? 1 : 0,
        padding: props.padding ?? 8,
    },
    title: {
        marginBottom: 4,
        flexDirection: 'row',
        alignItems: 'center',
    },
    }), [props.backgroundColor, props.borderColor, props.padding, currentTheme]);
  return (
    <View
      style={styles.container}
    >
      <View style={styles.title}>{props.title}</View>
      <View>{props.children}</View>
    </View>
  );
}

export default Callout;
