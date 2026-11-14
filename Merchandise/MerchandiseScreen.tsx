import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ItemList } from '../Components/ItemList';
import { useTheme } from '../Themes/ThemeContextProvider';

function MerchandiseScreen() {
  const { currentTheme } = useTheme();
  const styles = createStyles(currentTheme);
  return (
    <View style={styles.container}>
      {
        //Example of how to use the ItemList component. Replace with actual merchandise data and navigation logic as needed.
        <ItemList
          items={[
            { name: 'T-shirt' },
            { name: 'Hoodie' },
            { name: 'Mug' },
            { name: 'Sticker' },
            { name: 'Cap' },
            { name: 'Cap' },
            { name: 'Cap' },
            { name: 'Cap' },
            { name: 'Cap' },
            { name: 'Cap' },
            { name: 'Cap' },
            { name: 'Cap' },
            { name: 'Cap' },
            { name: 'Cap' },
            { name: 'Cap' },
            { name: 'Cap' },
          ]} // Replace with actual merchandise data
          onItemSelected={(item) => console.log(item)}
          title={
            //Replace with actual color from current theme
            <Text style={styles.title}>Pick a merchandise item to distribute</Text>
          }
          itemKey={(item, index) => index.toString()}
          empty={<Text>No items available</Text>}
          //Replace with actual color from current theme
          itemContent={(item) => <Text style={styles.items}>{item.name}</Text>}
        />
      }
    </View>
  );
}

function createStyles(currentTheme: ReturnType<typeof useTheme>['currentTheme']) {
  return StyleSheet.create({
    container: {
      backgroundColor: currentTheme.background,
      flex: 1,
    },
    items: {
      color: currentTheme.onSurface,
      fontSize: 18,
      marginHorizontal: 17,
    },
    title: {
      color: currentTheme.onSurface,
      fontSize: 25,
      marginHorizontal: 17,
      marginTop: 10,
      marginBottom:10,
    },
  });
}

export default MerchandiseScreen;
