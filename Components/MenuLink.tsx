import MaterialIcons from '@react-native-vector-icons/material-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../Themes/ThemeContextProvider';
import ThemedText from './ThemedText';

type MenuLinkProps = {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  title: string;
  onClick: () => void;
};

const MenuLink = ({ icon, title, onClick }: MenuLinkProps) => {
  const { currentTheme } = useTheme();

  return (
    <View style={styles.menuLinkContainer}>
      <TouchableOpacity onPress={onClick} style={styles.menuLinkTouchable}>
        <View style={styles.menuLinkRow}>
          <MaterialIcons name={icon} size={30} color="#666" style={styles.menuIcon} />
          <View style={styles.menuTextContainer}>
            <ThemedText style={[styles.menuTitle, { color: currentTheme.onBackground }]}>
              {title}
            </ThemedText>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  menuIcon: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  menuLinkContainer: {
    borderBlockColor: 'gray',
    borderBottomWidth: 0,
    borderTopWidth: 1,
  },
  menuLinkRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  menuLinkTouchable: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  menuTextContainer: {
    flexShrink: 1,
    padding: 5,
  },
  menuTitle: {
    fontSize: 20,
  },
});

export default MenuLink;
