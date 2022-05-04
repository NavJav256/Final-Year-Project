import React, { useContext, useState } from 'react'
import { Alert } from 'react-native'

//import { Ionicons } from '@expo/vector-icons'
import styled from 'styled-components'

import Text from '../utils/Text'

import { UserContext } from '../contexts/UserContext'
import { FirebaseContext } from '../contexts/FirebaseContext'


export default LoginScreen = ({ navigation }) => {

    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [loading, setLoading] = useState(false)
    const [secure, setSecure] = useState(true)

    const [_, setUser] = useContext(UserContext)
    const firebase = useContext(FirebaseContext)

    const handleShowPassword = () => {
        setSecure(!secure)
    }

    const signIn = async () => {
        setLoading(true)
        try {
            await firebase.signIn(email, password)
            const userid = firebase.getCurrentUser().uid
            var userInfo = ''
            try {
                userInfo = await firebase.getUserInfo(userid)
            } catch (error) {
                console.log('Error with getUserInfo in login screen: ', error)
            }
            setUser({
                email: userInfo.email,
                username: userInfo.username,
                uid: userid,
                profilePicUrl: userInfo.profilePicUrl,
                isLoggedIn: true,
                highScore: userInfo.highScore,
            })
        } catch (error) {
            console.log('Error with signIn in login screen: ', error)
            error.code === 'auth/argument-error' ? Alert.alert('Please fill in all the fields')
                : error.code === 'auth/invalid-email' ? Alert.alert('Invalid email')
                    : error.code === 'auth/user-not-found' ? Alert.alert('There is no user with that email')
                        : error.code === 'auth/wrong-password' ? Alert.alert('Incorrect password')
                            : Alert.alert('An error occured')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Container>
            <StatusBar hidden='true' />
            {/* <BackButton onPress={() => navigation.goBack()}>
                <Ionicons name='arrow-back' size={24} color='white' />
            </BackButton> */}
            <Main>
                <Text title bold center>Welcome back!</Text>
                <Text large semi center>Sign in below</Text>
            </Main>
            <Auth>
                <AuthContainer>
                    <AuthTitle>Email Address</AuthTitle>
                    <AuthField
                        autoCapitalize='none'
                        autoCompleteType='email'
                        autoCorrect={false}
                        autoFocus={true}
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
            <LoginContainer onPress={signIn} disabled={loading}>
                {loading ? (
                    <Loading />
                ) : (
                    <Text bold center color='white'>Sign in</Text>
                )}
            </LoginContainer>
            {/* <ForgotPassword onPress={() => { navigation.navigate('PReset') }}>
                <Text tiny center>Forgot password? <Text tiny bold color='hotpink'>Reset here</Text></Text>
            </ForgotPassword> */}
        </Container>
    )
}

const Container = styled.View`
    flex: 1
`
const StatusBar = styled.StatusBar``

const BackButton = styled.TouchableOpacity`
    position: absolute
    top: 48px
    left: 32px
    width: 32px
    height: 32px
    borderRadius: 16px
    backgroundColor: rgba(21,22,48,0.1)
    alignItems: center
    justifyContent: center
`

const Main = styled.View`
    marginTop: 192px
`

const Auth = styled.View`
    margin: 64px 32px 32px
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

const LoginContainer = styled.TouchableOpacity`
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

const ForgotPassword = styled.TouchableOpacity`
    marginTop: 16px
`