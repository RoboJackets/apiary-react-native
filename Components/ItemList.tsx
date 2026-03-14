import React from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

type ItemListProps<T> = {
  items: T[];
  onItemSelected: (item: T) => void;
  title: React.ReactNode;
  itemKey: (item: T, index: number) => string;
  callout?: React.ReactNode;
  preItem?: (index: number) => React.ReactNode;
  postItem?: (index: number) => React.ReactNode;
  empty?: React.ReactNode;
  itemContent: (item: T) => React.ReactNode;
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
          renderItem={({ item, index }) => (
            <View>
              {props.preItem?.(index)}

              <Pressable onPress={() => props.onItemSelected(item)} style={styles.listItem}>
                {props.itemContent(item)}
              </Pressable>

              {props.postItem?.(index)}
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
    borderBottomWidth: 1,
    borderColor: '#ddd',
    padding: 16,
  },
});
