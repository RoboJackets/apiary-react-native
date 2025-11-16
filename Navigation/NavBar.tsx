import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import AttendanceScreen from '../Attendance/AttendanceScreen';
import MerchandiseScreen from '../Merchandise/MerchandiseScreen';
import SettingsScreen from '../Settings/SettingsScreen';
type NavBarProps = {
  hidden?: boolean | null;
};

const Tab = createBottomTabNavigator();

function NavBar(props: NavBarProps) {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: props.hidden ? {display: 'none'} : {}
            }}
        >
            <Tab.Screen 
                name="Attendance" 
                component={AttendanceScreen} 
                options={{
                    tabBarIcon: ({color, size}) => {
                        return (
                            <MaterialDesignIcons
                                name="contactless-payment-circle-outline" 
                                color={color} 
                                size={size}
                            />
                        )
                    }
                }}
            />
            <Tab.Screen 
                name="Merchandise" 
                component={MerchandiseScreen} 
                options={{
                    tabBarIcon: ({color, size}) => {
                        return (
                            <MaterialDesignIcons
                                name="storefront-outline" 
                                color={color} 
                                size={size} 
                            />
                        )
                    }
                }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsScreen} 
                options={{
                    tabBarIcon: ({color, size}) => {
                        return (
                            <MaterialIcons 
                                name="settings" 
                                color={color} 
                                size={size}
                            />
                        )
                    }
                }}
            />
        </Tab.Navigator>
    )
}

export default NavBar;
