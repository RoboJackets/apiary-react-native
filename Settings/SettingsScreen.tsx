import MaterialIcons from '@react-native-vector-icons/material-icons';
import React from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

function SettingsScreen() {
    type SettingsMenuLinkProps = { 
        icon: React.ComponentProps<typeof MaterialIcons>['name'], 
        title: string, 
        subtitle?: string, 
        onClick: () => void 
    };
    type SettingsHeaderProps = { title: string };

    const SettingsHeader = ({ title }: SettingsHeaderProps) => (
        <View style={{ padding: 10 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{title}</Text>
        </View>
    );

    const SettingsMenuLink = ({ icon, title, subtitle, onClick }: SettingsMenuLinkProps) => (
        <TouchableOpacity onPress={onClick} style={{ paddingHorizontal: 10, paddingVertical: 20 }} >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialIcons name={icon} size={30} color="#666" style={{ paddingHorizontal: 10, paddingVertical: 5 }} />
                <View style={{ padding: 5, flexShrink: 1 }}>
                    <Text style={{ fontSize: 20 }}>{title}</Text>
                    {subtitle && <Text style={{ fontSize: 15, color: "gray" }}>{subtitle}</Text>}
                </View>
            </View>
        </TouchableOpacity>
    );

    const MadeWithLove = () => (
        <View style={{ padding: 10, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 20 }}>{"Made with ♥ by RoboJackets"}</Text>
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1, margin: 10 }} >
            <ScrollView>
                <SettingsHeader title="Account"></SettingsHeader>
                <SettingsMenuLink icon="person" title="Refreshing data..." subtitle="Username" onClick={() => { }} ></SettingsMenuLink>
                {
                    __DEV__ && // checks if app is running locally
                    <>
                        <SettingsMenuLink icon="verified-user" title="DEBUG: Recognized permissions" subtitle="None" onClick={() => { }} ></SettingsMenuLink>
                        <SettingsMenuLink icon="update" title="DEBUG: Open optional update bottom sheet" onClick={() => { }} ></SettingsMenuLink>
                        <SettingsMenuLink icon="update" title="DEBUG: Open required update prompt" onClick={() => { }} ></SettingsMenuLink>
                        <SettingsMenuLink icon="update" title="DEBUG: Open update in progress screen" onClick={() => { }} ></SettingsMenuLink>
                    </>
                }
                <SettingsMenuLink icon="logout" title="Logout" onClick={() => { }} ></SettingsMenuLink>
                <SettingsHeader title="About"></SettingsHeader>
                <SettingsMenuLink icon="home" title="Server" subtitle="[Server]" onClick={() => { }} ></SettingsMenuLink>
                <SettingsMenuLink icon="build" title="Version" subtitle="1.5.4" onClick={() => { }} ></SettingsMenuLink>
                <SettingsMenuLink icon="update" title="App update status" subtitle="Not available" onClick={() => { }} ></SettingsMenuLink>
                <SettingsMenuLink icon="feedback" title="Make a wish" onClick={() => { }} ></SettingsMenuLink>
                <SettingsMenuLink icon="privacy-tip" title="Privacy policy" onClick={() => { }} ></SettingsMenuLink>
                <SettingsMenuLink icon="info" title="Open-source licenses" onClick={() => { }} ></SettingsMenuLink>
                <MadeWithLove />
            </ScrollView>
        </SafeAreaView>
    );
}

export default SettingsScreen;