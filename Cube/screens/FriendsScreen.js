import React, { useContext, useState } from 'react'
import styled from 'styled-components'

import Text from '../utils/Text'

import { UserContext } from '../contexts/UserContext'
import { FirebaseContext } from '../contexts/FirebaseContext'


export default FriendsScreen = () => {

    const [user, setUser] = useContext(UserContext)
    const firebase = useContext(FirebaseContext)

    return (
        <Container>
            <Text center>This is the friends screen</Text>

        </Container>
    )
}

const Container = styled.View`
    flex: 1
    justify-content: center
    align-items: center
`