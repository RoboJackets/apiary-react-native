import MaterialIcons from '@react-native-vector-icons/material-icons';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppEnvironment } from '../AppEnvironment';
import { logout } from '../Auth/Authentication';

function SettingsScreen() {
  const { environment } = useAppEnvironment();
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <SettingsHeader title="Account" />
        <SettingsMenuLink
          icon="person"
          title="Refreshing data..."
          subtitle="Username"
          onClick={() => {}}
        />
        {__DEV__ && ( // checks if app is running locally
          <>
            <SettingsMenuLink
              icon="verified-user"
              title="DEBUG: Recognized permissions"
              subtitle="None"
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
        <SettingsMenuLink icon="home" title="Server" subtitle="[Server]" onClick={() => {}} />
        <SettingsMenuLink icon="build" title="Version" subtitle="1.5.4" onClick={() => {}} />
        <SettingsMenuLink
          icon="update"
          title="App update status"
          subtitle="Not available"
          onClick={() => {}}
        />
        <SettingsMenuLink icon="feedback" title="Make a wish" onClick={() => {}} />
        <SettingsMenuLink icon="privacy-tip" title="Privacy policy" onClick={() => {}} />
        <SettingsMenuLink icon="info" title="Open-source licenses" onClick={() => {}} />
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
