import React, { useState, useContext } from 'react'
import { Alert } from 'react-native'

import styled from 'styled-components'
//import { Ionicons } from '@expo/vector-icons'
//import * as ImagePicker from 'expo-image-picker'

import Text from '../utils/Text'
//import UserPermissions from '../utils/UserPermissions'

import { FirebaseContext } from '../contexts/FirebaseContext'
import { UserContext } from '../contexts/UserContext'



export default RegisterScreen = ({ navigation }) => {

    const [username, setUsername] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [profilePic, setProfilePic] = useState()
    const [loading, setLoading] = useState(false)
    const [secure, setSecure] = useState(true)

    const [_, setUser] = useContext(UserContext)
    const firebase = useContext(FirebaseContext)

    /*
    const addProfilePic = async () => {
        UserPermissions.getCameraPermission()

        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5
            })

            if (!result.cancelled) {
                setProfilePic(result.uri)
            }
        } catch (error) {
            console.log('Error: ', error)
        }
    }
    */

    const handleShowPassword = () => {
        setSecure(!secure)
    }

    const signUp = async () => {
        setLoading(true)
        if (typeof username === 'undefined' || username === '') {
            alert('Please fill in the username field')
            setLoading(false)
        } else {
            const user = { username, email, password, profilePic }

            try {
                const createdUser = await firebase.createUser(user)
                if (typeof createdUser === 'string') {
                    const code = createdUser
                    code === 'auth/argument-error' ? Alert.alert('Please fill in all the fields')
                        : code === 'auth/email-already-in-use' ? Alert.alert('Email is already in use')
                            : code === 'auth/invalid-email' ? Alert.alert('Invalid email')
                                : code === 'auth/weak-password' ? Alert.alert('Password is too weak')
                                    : Alert.alert('An error occured')
                } else {
                    setUser({ ...createdUser, isLoggedIn: true, highScore: 0 })
                }


            } catch (error) {
                console.log('Error with signUp in RegisterScreen: ', error)
                alert(error.code)
            } finally {
                setLoading(false)
            }
        }
    }

    return (
        <Container>

            <StatusBar hidden='true' />
            <Main>
                <Text large bold center>Welcome to Cube Connect</Text>
                <Text large semi center>Sign up to get started</Text>
            </Main>

            {/* <ProfilePicContainer onPress={addProfilePic}>
                {profilePic ? (
                    <ProfilePic source={{ uri: profilePic }} />
                ) : (
                    <DefaultProfilePic>
                        <Ionicons name='add' size={24} color='white' />
                    </DefaultProfilePic>
                )}
            </ProfilePicContainer> */}

            <Auth>
                <AuthContainer>
                    <AuthTitle>Username</AuthTitle>
                    <AuthField
                        autoCapitalize='none'
                        autoCompleteType='email'
                        autoCorrect={false}
                        autoFocus={true}
                        onChangeText={username => setUsername(username.trim())}
                        value={username}
                    />
                </AuthContainer>
                <AuthContainer>
                    <AuthTitle>Email Address</AuthTitle>
                    <AuthField
                        autoCapitalize='none'
                        autoCompleteType='email'
                        autoCorrect={false}
                        keyboardType='email-address'
                        onChangeText={email => setEmail(email.trim())}
                        value={email}
                    />
                </AuthContainer>
                <AuthContainer>
                    <AuthTitle>Password</AuthTitle>
                    <AuthField
                        autoCapitalize='none'
                        autoCompleteType='password'
                        autoCorrect={false}
                        secureTextEntry={secure}
                        onChangeText={password => setPassword(password.trim())}
                        value={password}
                    />
                </AuthContainer>
                <ShowPasswordContainer onPress={handleShowPassword}>
                    {/* <Ionicons name='eye' size={24} style={{ marginRight: 10 }} /> */}
                    {secure ? (
                        <Text small>Show password</Text>
                    ) : (
                        <Text small>Hide password</Text>
                    )}
                </ShowPasswordContainer>
            </Auth>

            <RegisterContainer onPress={signUp} disabled={loading}>
                {loading ? (
                    <Loading />
                ) : (
                    <Text bold center color='white'>Sign up</Text>
                )}
            </RegisterContainer>

            <Login onPress={() => navigation.navigate('Login')}>
                <Text tiny center>Already have an account? <Text tiny bold color='hotpink'>Login</Text></Text>
            </Login>

        </Container>
    )
}

const Container = styled.View`
    flex: 1
`
const StatusBar = styled.StatusBar``

const Main = styled.View`
    marginTop: 128px
`

const ProfilePicContainer = styled.TouchableOpacity`
    backgroundColor: grey
    width: 80px
    height: 80px
    border-radius: 40px
    align-self: center
    margin-top: 16px
    overflow: hidden
`

const ProfilePic = styled.Image`
    flex: 1
`

const DefaultProfilePic = styled.View`
    align-items: center
    justify-content: center
    flex: 1
`

const Auth = styled.View`
    margin: 16px 32px 32px
    padding-top: 32px
`

const AuthContainer = styled.View`
    marginBottom: 32px
`

const AuthTitle = styled(Text)`
    color: #8A8F9E
    font-size: 14px
    text-transform: uppercase
    font-weight: 300
`

const AuthField = styled.TextInput`
    borderBottomColor: #4267B2
    borderBottomWidth: 0.5px
    height: 48px
`

const RegisterContainer = styled.TouchableOpacity`
    margin: 0px 48px
    height: 48px
    align-items: center
    justify-content: center
    backgroundColor: hotpink
    borderRadius: 15px
`

const ShowPasswordContainer = styled.TouchableOpacity`
    flex-direction: row
`

const Loading = styled.ActivityIndicator.attrs(props => ({
    color: 'white',
    size: 'small'
}))``

const Login = styled.TouchableOpacity`
    marginTop: 16px
`