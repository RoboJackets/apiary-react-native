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

export function ItemList<T>({
  items,
  onItemSelected,
  title,
  itemKey,
  callout,
  preItem,
  postItem,
  empty,
  itemContent,
}: ItemListProps<T>) {
  return (
    <View style={styles.container}>
      {title}
      {callout}

      {items.length === 0 ? (
        (empty ?? null)
      ) : (
        <FlatList
          data={items}
          keyExtractor={itemKey}
          renderItem={({ item, index }) => (
            <View>
              {preItem?.(index)}

              <Pressable onPress={() => onItemSelected(item)} style={styles.listItem}>
                {itemContent(item)}
              </Pressable>

              {postItem?.(index)}
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
