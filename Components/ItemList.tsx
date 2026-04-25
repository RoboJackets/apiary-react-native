import React from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

type ItemListProps<T> = {
  items: T[];
  onItemSelected: (item: T) => void;
  title: React.ReactNode;
  itemKey: (item: T, index: number) => string;
  callout?: React.ReactNode;
  empty?: React.ReactNode;
  itemContent: (item: T) => React.ReactNode;
  separator?: React.ReactNode;
};

export function ItemList<T>(props: ItemListProps<T>) {
  return (
    <View style={styles.container}>
      {props.title}
      {props.callout}

      {props.items.length === 0 ? (
        (props.empty ?? null)
      ) : (
        <FlatList
          data={props.items}
          keyExtractor={props.itemKey}
          ItemSeparatorComponent={() => (
            <View>{props.separator ?? <View style={styles.separator} />}</View>
          )}
          renderItem={({ item }) => (
            <View>
              <Pressable onPress={() => props.onItemSelected(item)} style={styles.listItem}>
                {props.itemContent(item)}
              </Pressable>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listItem: {
    borderColor: '#ddd',
    padding: 16,
  },

  separator: {
    // Default styles, which can be overridden by props
    backgroundColor: '#ccc', // Default color (light gray)
    height: StyleSheet.hairlineWidth + 2, // Determines the thickness of the line
    marginVertical: 5, // Adds some space above and below the line
    width: '100%', // Makes the line span the full width
  },
});
