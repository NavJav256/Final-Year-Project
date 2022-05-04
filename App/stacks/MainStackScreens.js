import React from 'react'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Ionicons from 'react-native-vector-icons/Ionicons'

import SinglePlayer from '../screens/SinglePlayer'
import TwoPlayer from '../screens/TwoPlayer'
import HomeScreen from '../screens/HomeScreen'
import FriendsScreen from '../screens/FriendsScreen'
import ProfileScreen from '../screens/ProfileScreen'

export default MainStackScreens = () => {
    const MainStack = createBottomTabNavigator()

    const tabBarOptions = {
        showLabel: false,
        style: {
            backgroundColor: 'black',
            paddingBottom: 12
        }
    }

    const screenOptions = (({ route }) => ({
        tabBarStyle: { backgroundColor: 'black' },

        tabBarIcon: ({ focused }) => {
            let iconName = 'home'

            switch (route.name) {

                case 'Single Player':
                    iconName = 'remove-outline'
                    break

                case 'Two Player':
                    iconName = 'reorder-two-outline'
                    break

                // case 'Friends':
                //     iconName = 'people-outline'
                //     break

                case 'Profile':
                    iconName = 'person-outline'
                    break

                default:
                    iconName = 'remove-outline'
            }

            // if (route.name === 'Home') {
            //     return <Ionicons name='home' size={64} color='hotpink' />
            // }

            return <Ionicons name={iconName} size={25} color={focused ? 'white' : 'skyblue'} />
        }
    }))

    return (
        <MainStack.Navigator initialRouteName='Single Player' screenOptions={screenOptions} >
            <MainStack.Screen name='Single Player' component={SinglePlayer} options={{ headerShown: false }} />
            <MainStack.Screen name='Two Player' component={TwoPlayer} options={{ headerShown: false }} />
            {/* <MainStack.Screen name='Home' component={HomeScreen} options={{ headerShown: false }} /> */}
            {/* <MainStack.Screen name='Friends' component={FriendsScreen} options={{ headerShown: false }} /> */}
            <MainStack.Screen name='Profile' component={ProfileScreen} options={{ headerShown: false }} />
        </MainStack.Navigator>
    )
}
