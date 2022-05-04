import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import RegisterScreen from '../screens/RegisterScreen'
import LoginScreen from '../screens/LoginScreen'

export default AuthStackScreens = () => {
    const AuthStack = createStackNavigator()

    return (
        <AuthStack.Navigator headerShown='false'>
            <AuthStack.Screen name='Register' component={RegisterScreen} options={{ headerShown: false }} />
            <AuthStack.Screen name='Login' component={LoginScreen} options={{ headerShown: false }} />
        </AuthStack.Navigator>
    )
}