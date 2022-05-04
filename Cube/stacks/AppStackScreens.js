import React, { useContext } from 'react'
import { LogBox } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'

import AuthStackScreens from './AuthStackScreens'
import MainStackScreens from './MainStackScreens'
import LoadingScreen from '../screens/LoadingScreen'

import { UserContext } from '../contexts/UserContext'

export default AppStackScreens = () => {
    const AppStack = createStackNavigator()
    const [user] = useContext(UserContext)

    LogBox.ignoreLogs([
        "[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!",
        "RCTBridge required dispatch_sync to load RNGestureHandlerModule. This may lead to deadlocks",
    ])

    return (
        <AppStack.Navigator >
            {user.isLoggedIn === null ? (
                <AppStack.Screen name='Loading' component={LoadingScreen} options={{ headerShown: false }} />
            ) : user.isLoggedIn ? (
                <AppStack.Screen name='Main' component={MainStackScreens} options={{ headerShown: false }} />
            ) : (
                <AppStack.Screen name='Auth' component={AuthStackScreens} options={{ headerShown: false }} />
            )}
        </AppStack.Navigator>
    )
}