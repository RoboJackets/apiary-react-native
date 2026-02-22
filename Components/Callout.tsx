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
  const { currentTheme } = useTheme();

  // This rule is needed because style sheets in a useMemo are not
  // detected by eslint normally.
  /* eslint react-native/no-unused-styles: off */
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          backgroundColor: props.backgroundColor ?? currentTheme.background,
          borderColor: props.borderColor,
          borderRadius: 8,
          borderWidth: props.borderColor ? 1 : 0,
          padding: props.padding ?? 8,
          width: '100%',
        },
        title: {
          alignItems: 'center',
          flexDirection: 'row',
          marginBottom: 4,
        },
      }),
    [props.backgroundColor, props.borderColor, props.padding, currentTheme],
  );
  return (
    <View style={styles.container}>
      <View style={styles.title}>{props.title}</View>
      <View>{props.children}</View>
    </View>
  );
}

export default Callout;
