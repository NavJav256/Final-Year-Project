import React from 'react'

import { NavigationContainer } from '@react-navigation/native'

import { FirebaseProvider } from './contexts/FirebaseContext'
import { UserProvider } from './contexts/UserContext'

import AppStack from './stacks/AppStackScreens'

export default App = () => {
  return (
    <FirebaseProvider>
      <UserProvider>
        <NavigationContainer>
          <AppStack />
        </NavigationContainer>
      </UserProvider>
    </FirebaseProvider>
  )
}
