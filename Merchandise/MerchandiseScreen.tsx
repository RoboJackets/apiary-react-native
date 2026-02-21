import React from 'react';
import { Text, View } from 'react-native';

function MerchandiseScreen() {
  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Merchandise Screen</Text>
      {/* 
        Example of how to use the ItemList component. Replace with actual merchandise data and navigation logic as needed.
          <ItemList
          items={[{ name: 'T-shirt' }, { name: 'Hoodie' }]}
          onItemSelected={(item) => console.log(item)}
          title={<Text style={{ fontSize: 20 }}>Merchandise</Text>}
          itemKey={(item, index) => index.toString()}
          empty={<Text>No items available</Text>}
          itemContent={(item) => <Text>{item.name}</Text>}
        /> */}
    </View>
  );
}

export default MerchandiseScreen;