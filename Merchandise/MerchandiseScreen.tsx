import React from 'react';
import { Text, View } from 'react-native';

function MerchandiseScreen() {
  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Merchandise Screen</Text>
      {/* {
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
            <Text style={{ color: Colors.surfaceDark }}>Pick a merchandise item to distribute</Text>
          }
          itemKey={(item, index) => index.toString()}
          empty={<Text>No items available</Text>}
          //Replace with actual color from current theme
          itemContent={(item) => <Text style={{ color: Colors.surfaceDark }}>{item.name}</Text>}
        />
      } */}
    </View>
  );
}

export default MerchandiseScreen;
