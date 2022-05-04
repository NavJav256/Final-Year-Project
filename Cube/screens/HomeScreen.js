import React, { useContext, useState, useEffect } from 'react'
import styled from 'styled-components'

import { BleManager } from 'react-native-ble-plx'

import Text from '../utils/Text'

import DeviceCard from '../components/DeviceCard'

import { UserContext, UserProvider } from '../contexts/UserContext'
import { FirebaseContext } from '../contexts/FirebaseContext'
import { FlatList } from 'react-native'
import { BLEContext } from '../contexts/BLEContext'

const manager = new BleManager()

export default HomeScreen = () => {

    const [user, setUser] = useContext(UserContext)
    const firebase = useContext(FirebaseContext)
    // const ble = useContext(BLEContext)

    const [scanning, setScanning] = useState(false)
    const [deviceOne, setDeviceOne] = useState()
    const [deviceTwo, setDeviceTwo] = useState()
    const [count, setCount] = useState(0)

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

    useEffect(() => {
        const subscription = manager.onStateChange((state) => {
            if (state === 'PoweredOn') {
                subscription.remove()
            }
        }, true)
        // ble.init()
    }, [])

    const scan = () => {
        // manager.startDeviceScan(null, null, (error, device) => {
        //     setScanning(true)
        //     if (error) console.error(error)
        //     if (device.name === 'NavBoard') {
        //         console.log(device.id)
        //         if (device.id === 'CA38B3E7-B2BD-E529-4F13-3F9865E42B81' || device.id === '6F2BAD28-EA88-B2D7-91D8-896A4B10D1ED') {
        //             if (count == 0) {
        //                 setDeviceOne(device)
        //                 setCount(1)
        //             }
        //             else {
        //                 setDeviceTwo(device)
        //                 setCount(2)
        //             }
        //         }
        //     }
        //     // console.log(deviceOne.id)
        //     // console.log(deviceTwo.id)
        // })
    }

    // const stop = () => {
    //     manager.stopDeviceScan()
    //     setScanning(false)
    // }

    return (
        <Container>
            <StatusBar hidden='true' />
            {scanning ? (
                <ScanButton onPress={stop}>
                    <Text>Click here to stop scanning</Text>
                </ScanButton>
            ) : (
                <ScanButton onPress={scan}>
                    <Text>Click here to start scanning</Text>
                </ScanButton>
            )}
            {deviceOne && (
                <Device>
                    <Text>{deviceOne.name}</Text>
                    <Text>{deviceOne.id}</Text>
                </Device>
            )}
            {deviceTwo && (
                <Device>
                    <Text>{deviceTwo.name}</Text>
                    <Text>{deviceTwo.id}</Text>
                </Device>
            )}
        </Container>
    )
}

const Container = styled.View`
    flex: 1
    justify-content: center
    align-items: center
`

const StatusBar = styled.StatusBar``

const ScanButton = styled.TouchableOpacity``

const Device = styled.TouchableOpacity``


