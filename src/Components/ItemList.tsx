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
            <Pressable
              onPress={() => props.onItemSelected(item)}
              style={({ pressed }) => [
                styles.listItem,
                pressed && styles.listItemPressed,
              ]}
              >
            {props.itemContent(item)}
            </Pressable>
        )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  listItem: {
    padding: 16,
  },
  listItemPressed: {
    backgroundColor: '#ccc',
    opacity: 0.8,
    borderRadius: 12,
    transform: [{ scale: 0.95 }],
  },
  separator: {
    alignSelf: 'center',
    backgroundColor: '#ccc',
    height: 2,
    marginVertical: 2,
    width: '93%',
  },
});
