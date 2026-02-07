import MaterialIcons from '@react-native-vector-icons/material-icons';
import React, { useEffect, useState } from 'react';
import {
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import { ReactNativeLegal } from 'react-native-legal';
import { useApi } from '../Api/ApiContextProvider';
import { getUserInfo, UserInfo } from '../Api/UserApi';
import { useAppEnvironment } from '../AppEnvironment';
import { logout } from '../Auth/Authentication';

function SettingsScreen() {
  const { environment } = useAppEnvironment();
  const api = useApi();

  const [user, setUser] = useState<UserInfo | null | undefined>(undefined);

  const makeAWishUrl =
    'https://docs.google.com/forms/d/e/1FAIpQLSelERsYq3' +
    'gLmHbWvVCWha5iCU8z3r9VYC0hCN4ArLpMAiysaQ/viewform?entry.1338203640=MyRoboJackets%20' +
    (Platform.OS === 'android' ? 'Android' : 'iOS');

  type SettingsMenuLinkProps = {
    icon: React.ComponentProps<typeof MaterialIcons>['name'];
    title: string;
    subtitle?: string;
    onClick: () => void;
  };
  type SettingsHeaderProps = { title: string };

  const SettingsHeader = ({ title }: SettingsHeaderProps) => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>{title}</Text>
    </View>
  );

  const SettingsMenuLink = ({ icon, title, subtitle, onClick }: SettingsMenuLinkProps) => (
    <TouchableOpacity onPress={onClick} style={styles.menuLinkTouchable}>
      <View style={styles.menuLinkRow}>
        <MaterialIcons name={icon} size={30} color="#666" style={styles.menuIcon} />
        <View style={styles.menuTextContainer}>
          <Text style={styles.menuTitle}>{title}</Text>
          {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );

  const MadeWithLove = () => (
    <View style={styles.madeWithLoveContainer}>
      <Text style={styles.madeWithLoveText}>{'Made with ♥ by RoboJackets'}</Text>
    </View>
  );

  async function openLink(url: string) {
    try {
      if (await InAppBrowser.isAvailable()) {
        await InAppBrowser.open(url, {
          // iOS Properties
          dismissButtonStyle: 'cancel',
          // preferredBarTintColor: '#453AA4',
          // preferredControlTintColor: 'white',
          readerMode: false,
          animated: true,
          modalPresentationStyle: 'fullScreen',
          modalTransitionStyle: 'coverVertical',
          modalEnabled: true,
          enableBarCollapsing: false,
          // Android Properties
          showTitle: true,
          // toolbarColor: '#6200EE',
          // secondaryToolbarColor: 'black', // We may add color settings later using system theme
          // navigationBarColor: 'black',
          // navigationBarDividerColor: 'white',
          enableUrlBarHiding: true,
          enableDefaultShare: true,
          forceCloseOnRedirection: false,
        });
      } else Linking.openURL(url);
    } catch (error) {
      if (error instanceof Error) console.log(error.message);
    }
  }

  async function onRefreshUser(forceRefresh: boolean = false) {
    if (!user || forceRefresh) {
      setUser(await getUserInfo(api));
    }
  }

  useEffect(() => {
    onRefreshUser(true);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <SettingsHeader title="Account" />
        <SettingsMenuLink
          icon="person"
          title={user && user.name ? user.name : 'Refreshing data...'}
          subtitle={user && user.uid ? user.uid : 'Username'}
          onClick={() => {
            onRefreshUser();
          }}
        />
        {__DEV__ && ( // checks if app is running locally
          <>
            <SettingsMenuLink
              icon="verified-user"
              title="DEBUG: Recognized permissions"
              subtitle={user && user.allPermissions ? user.allPermissions.join(', ') : 'None'}
              onClick={() => {}}
            />
            <SettingsMenuLink
              icon="update"
              title="DEBUG: Open optional update bottom sheet"
              onClick={() => {}}
            />
            <SettingsMenuLink
              icon="update"
              title="DEBUG: Open required update prompt"
              onClick={() => {}}
            />
            <SettingsMenuLink
              icon="update"
              title="DEBUG: Open update in progress screen"
              onClick={() => {}}
            />
          </>
        )}
        <SettingsMenuLink
          icon="logout"
          title="Logout"
          onClick={() => {
            logout(environment);
          }}
        />
        <SettingsHeader title="About" />
        <SettingsMenuLink
          icon="home"
          title="Server"
          subtitle={environment.name + ' ' + environment.baseUrl}
          onClick={() => {}}
        />
        <SettingsMenuLink icon="build" title="Version" subtitle="1.5.4" onClick={() => {}} />
        <SettingsMenuLink
          icon="update"
          title="App update status"
          subtitle="Not available"
          onClick={() => {}}
        />
        <SettingsMenuLink
          icon="feedback"
          title="Make a wish"
          onClick={async () => {
            await openLink(makeAWishUrl);
          }}
        />
        <SettingsMenuLink
          icon="privacy-tip"
          title="Privacy policy"
          onClick={async () => {
            await openLink(environment.baseUrl + '/privacy');
          }}
        />
        <SettingsMenuLink
          icon="info"
          title="Open-source licenses"
          onClick={() => {
            ReactNativeLegal.launchLicenseListScreen('OSS Notice');
          }}
        />
        <MadeWithLove />
      </ScrollView>
    </SafeAreaView>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  headerContainer: {
    padding: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  madeWithLoveContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  madeWithLoveText: {
    fontSize: 20,
  },
  menuIcon: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  menuLinkRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  menuLinkTouchable: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  menuSubtitle: {
    color: 'gray',
    fontSize: 15,
  },
  menuTextContainer: {
    flexShrink: 1,
    padding: 5,
  },
  menuTitle: {
    fontSize: 20,
  },
});

export default SettingsScreen;
