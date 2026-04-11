import React from 'react';
import { Text, View } from 'react-native';
import { ItemList } from '../Components/ItemList';

function MerchandiseScreen() {
  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'flex-start' }}>
      <Text>Merchandise Screen</Text>
      {
        //Example of how to use the ItemList component. Replace with actual merchandise data and navigation logic as needed.
        <ItemList
          items={[
            { name: 'T-shirt' },
            { name: 'Hoodie' },
            { name: 'Mug' },
            { name: 'Sticker' },
            { name: 'Cap' },
          ]} // Replace with actual merchandise data
          onItemSelected={(item) => console.log(item)}
          title={
            <Text style={{ fontSize: 20, color: 'black' }}>
              Pick a merchandise item to distribute
            </Text>
          }
          itemKey={(item, index) => index.toString()}
          empty={<Text>No items available</Text>}
          itemContent={(item) => <Text style={{ color: 'black' }}>{item.name}</Text>}
        />
      }
    </View>
  );
}

export default MerchandiseScreen;
