import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext } from 'react';
import { AuthContext } from '../Auth/AuthContextProvider';
import { AuthenticationState } from '../Auth/Authentication';
import AuthenticationScreen from '../Auth/AuthenticationScreen';
import LoadingScreen from '../Components/LoadingScreen';
import NavBar from './NavBar';

const Stack = createNativeStackNavigator();

function RootStack() {
    
    const auth = useContext(AuthContext)
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
        { auth?.authenticated !== null? (auth?.authenticated === AuthenticationState.AUTHENTICATED?
            <Stack.Screen name="Main" component={NavBar} />
        :
            <Stack.Screen name="Authentication">
                {() => <AuthenticationScreen />}
            </Stack.Screen>)
        :
        <Stack.Screen name="Loading" component={LoadingScreen} />
        }
        </Stack.Navigator>
    )
}

export default RootStack;