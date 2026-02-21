import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useApi } from '../Api/ApiContextProvider';
import { getUserInfo, UserInfo } from '../Api/UserApi';

function MerchandiseScreen() {
  const api = useApi();
  const [user, setUser] = useState<UserInfo | null>(null);

  async function onRefreshUser(forceRefresh: boolean = false) {
    if (!user || forceRefresh) {
      setUser(await getUserInfo(api));
    }
  }

  useEffect(() => {
    onRefreshUser(false);
    // Check if user is null, if null set variable to force error screen
  });

  return (
    <View style={styles.container}>
      <Text>Merchandise Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  lower: { alignItems: 'center', flexShrink: 1, padding: 10 },
  upper: { alignItems: 'center', flex: 1, justifyContent: 'space-around' },
});

export default MerchandiseScreen;
