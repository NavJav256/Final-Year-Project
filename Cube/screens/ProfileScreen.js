import React, { useContext, useEffect } from 'react'
import styled from 'styled-components'

import Text from '../utils/Text'

import { UserContext } from '../contexts/UserContext'
import { FirebaseContext } from '../contexts/FirebaseContext'


export default ProfileScreen = () => {

    const [user, setUser] = useContext(UserContext)
    const firebase = useContext(FirebaseContext)

    useEffect(() => {
        setTimeout(async () => {
            const user = await firebase.getCurrentUser()

            if (user) {
                var userInfo = ''
                try {
                    userInfo = await firebase.getUserInfo(user.uid)
                } catch (error) {
                    console.log('Error with getting user info in loading screen: ', error)
                }
                setUser({
                    isLoggedIn: true,
                    email: userInfo.email,
                    uid: user.uid,
                    username: userInfo.username,
                    profilePicUrl: userInfo.profilePicUrl,
                    highScore: userInfo.highScore
                })
            } else {
                setUser(state => ({ ...state, isLoggedIn: false }))
            }
        }, 2500)

    }, [])

    const logOut = async () => {
        const isLoggedOut = await firebase.logOut()

        if (isLoggedOut) {
            setUser(state => ({ ...state, isLoggedIn: false }))
        }
    }

    return (
        <Container>
            <Details>
                <ProfilePicContainer>
                    <ProfilePic source={user.profilePicUrl === 'default' ? require('../assets/defaultProfilePic.jpg') : { uri: user.profilePicUrl }} />
                </ProfilePicContainer>
                <Text medium bold margin='16px 0 32px 0'>{user.username}</Text>
                <Stats>
                    <Text center>Highscore: {user.highScore}</Text>

                </Stats>
                <Logout onPress={logOut}>
                    <Text bold center color='white'>Logout</Text>
                </Logout>
            </Details>

        </Container>
    )
}

const Container = styled.View`
    flex: 1
`

const Details = styled.View`
    margin: 100px 30px 30px
    justifyContent: center
    alignItems: center
`

const Stats = styled.View`

`

const ProfilePicContainer = styled.View`
    shadow-opacity: 0.9
    shadow-radius: 32px
    shadow-color: grey
`

const ProfilePic = styled.Image`
    width: 128px
    height: 128px
    border-radius: 64px
`

const Logout = styled.TouchableOpacity`
    margin: 32px 48px
    height: 48px
    width: 128px
    align-items: center
    justify-content: center
    backgroundColor: hotpink
    borderRadius: 15px
`

const AddScore = styled.TouchableOpacity``

const ResetScore = styled.TouchableOpacity``

const SaveScore = styled.TouchableOpacity``


