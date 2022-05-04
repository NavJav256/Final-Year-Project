import React, { useContext, useState, useEffect } from 'react'
import styled from 'styled-components'

import Text from '../utils/Text'

import { BleManager } from 'react-native-ble-plx'

import { UserContext } from '../contexts/UserContext'
import { FirebaseContext } from '../contexts/FirebaseContext'
import { Alert } from 'react-native'

const manager = new BleManager()
const serviceUUID = '00001523-1212-EFDE-1523-785FEABCD123'
const ButtonCharacteristicUUID = '00001524-1212-EFDE-1523-785FEABCD123'
const LEDCharacteristicUUID = '00001525-1212-EFDE-1523-785FEABCD123'


export default SinglePlayer = () => {

    const [connected, setConnected] = useState(false)
    const [board, setBoard] = useState({})
    const [count, setCount] = useState(0)

    const [playing, setPlaying] = useState(false)
    const [score, setScore] = useState(0)
    const [round, setRound] = useState(1)
    var roundNumber = 1
    var index = 0
    const [correctA, setCorrectA] = useState(null)
    const [button, setButton] = useState(1)

    const [user, setUser] = useContext(UserContext)
    const firebase = useContext(FirebaseContext)

    const delay = ms => new Promise(res => setTimeout(res, ms));

    useEffect(() => {
        const subscription = manager.onStateChange((state) => {
            if (state === 'PoweredOn') {
                subscription.remove()
            }
        }, true)
    }, [])

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

    const scanAndConnect = () => {
        manager.startDeviceScan(null, null, (error, device) => {
            if (error) console.error(error)
            if (device.name === 'Navboard') {
                manager.stopDeviceScan()
                if (count != 0) return
                else {
                    device.connect()
                        .then((device) => {
                            setConnected(true)
                            setCount(1)
                            return device.discoverAllServicesAndCharacteristics()
                        })
                        .then((device) => {
                            setBoard(device)
                            // device.onDisconnected((error, device) => {
                            //     setConnected(false)
                            //     console.error(error)
                            // })
                        })
                        .catch((error) => {
                            console.error(error)
                        })
                }
            }
        })
    }

    const disconnect = () => {
        setConnected(false)
        setCount(0)
        manager.cancelDeviceConnection(board.id)
    }

    const playGame = () => {
        if (!connected) {
            Alert.alert('Cannot start game, device not connected')
            return
        }
        // manager.onDeviceDisconnected(board.id, (error, device) => {
        //     if (error) console.error(error)
        //     setPlaying(false)
        //     Alert.alert('Device disconnected')
        //     reset()
        //     return
        // })

        setPlaying(true)
        var seq = generateSequence(roundNumber)
        let sub = monitor(seq)
        blinkBoard(seq)
    }

    const monitor = (seq) => {
        const sub = manager.monitorCharacteristicForDevice(board.id, serviceUUID, ButtonCharacteristicUUID, (error, characteristic) => {
            if (error) console.error(error)
            if (characteristic.value === 'Ag==') b = 1
            if (characteristic.value === 'Aw==') b = 0
            if (characteristic.value === 'BA==') b = 2
            if (characteristic.value === 'BQ==') b = 0
            if (characteristic.value === 'Bg==') b = 3
            if (characteristic.value === 'Bw==') b = 0
            if (characteristic.value === 'CA==') b = 4
            if (characteristic.value === 'CQ==') b = 0
            if (b != 0) {
                if (b == seq[index]) correct(seq, sub)
                else gameOver(sub)
            }
        })
        return sub
    }

    const correct = async (sequence, subscription) => {
        if (index == sequence.length - 1) {
            subscription.remove()
            nextRound()
        } else {
            index += 1
            setButton(index + 1)
            setCorrectA(true)
            await delay(500)
            setCorrectA(null)
        }
    }

    const generateSequence = (size) => {
        let res = []
        setButton(1)
        console.log('generateSequence: size ' + size)
        for (let i = 0; i < size; i++) {
            res.push(Math.floor(Math.random() * 4) + 1)
        }
        return res
    }

    const blinkBoard = async (sequence) => {
        for (let i = 0; i < sequence.length; i++) {
            ledOn(sequence[i])
            await delay(1000)
            ledOff(sequence[i])
            await delay(500)
        }
        allOff()
        await delay(1000)
    }

    const ledOn = (number) => {
        if (number == 1) toggleLed(1)
        if (number == 2) toggleLed(2)
        if (number == 3) toggleLed(3)
        if (number == 4) toggleLed(4)
    }

    const ledOff = (number) => {
        if (number == 1) toggleLed(5)
        if (number == 2) toggleLed(6)
        if (number == 3) toggleLed(7)
        if (number == 4) toggleLed(8)
    }

    const allOff = () => {
        toggleLed(5)
        toggleLed(6)
        toggleLed(7)
        toggleLed(8)
    }

    const toggleLed = (number) => {
        console.log('toggleLed:' + number)
        var data = number == 1 ? 'AQ=='
            : number == 2 ? 'Ag=='
                : number == 3 ? 'Aw=='
                    : number == 4 ? 'BA=='
                        : number == 5 ? 'BQ=='
                            : number == 6 ? 'Bg=='
                                : number == 7 ? 'Bw=='
                                    : number == 8 ? 'CA=='
                                        : 'AA=='
        manager.writeCharacteristicWithResponseForDevice(board.id, serviceUUID, LEDCharacteristicUUID, data)
            .then((characteristic) => {
                // console.log(characteristic.value)

            })
    }

    const nextRound = () => {
        roundNumber += 1
        setScore(roundNumber - 1)
        setRound(roundNumber)
        index = 0
        playGame(roundNumber)
    }

    const gameOver = async (sub) => {
        setCorrectA(false)
        await delay(500)
        setCorrectA(null)
        sub.remove()
        setPlaying(false)
        reset()
        Alert.alert('Game over', 'Incorrect button pushed')
    }

    const reset = () => {
        roundNumber = 1
        setRound(roundNumber)
        index = 0
        setButton(index + 1)
        allOff()
    }

    const save = async () => {
        if (!playing) {
            let res = false
            console.log(score)
            if (score > user.highScore) {
                res = await firebase.addScore(user.uid, score)
                if (res == true) setUser({ ...user, highScore: score })
                Alert.alert('Score saved!')
            }
        } else {
            Alert.alert('Cannot save score when playing')
        }
    }

    return (
        <Container>
            <Connection>
                <ConnectBox onPress={scanAndConnect}>
                    {connected ? (
                        <Text bold color={'white'}>Device Connected</Text>
                    ) : (
                        <Text bold color={'white'}>Connect to nearby device</Text>
                    )}
                </ConnectBox>
                <DisconnectBox onPress={disconnect}>
                    <Text bold color={'white'}>Disconnect</Text>
                </DisconnectBox>
            </Connection>
            <Space />
            <GameContainer>
                <Round>
                    <Text large bold>Round {round}</Text>
                </Round>
                <Space />
                <StartButton onPress={() => { playGame(1) }}>
                    <Text bold color={'white'}>Start Game</Text>
                </StartButton>
                <Space />
                <GameArea>
                    <Text>Button number</Text>
                    <Space />
                    <AnswerBox background={correctA == null ? '#ffd269' : correctA ? '#69ffb4' : '#aa4678'}>
                        <Text large bold color={'white'}>{button}</Text>
                    </AnswerBox>
                    <Space />
                    <Text>Score {score}</Text>
                </GameArea>
                <SaveScore onPress={save}>
                    <Text bold color={'white'}>Save high score</Text>
                </SaveScore>
            </GameContainer>

        </Container>
    )
}

const Container = styled.View`
    flex: 1
    top: 5%
    align-items: center
`

const Connection = styled.View`
    flex-direction: row
`

const ConnectBox = styled.TouchableOpacity`
    background-color: hotpink
    padding: 2%
    margin-right: 3%
    border-radius: 50px
`

const DisconnectBox = styled.TouchableOpacity`
    background-color: #aa4678
    padding: 2%
    margin-left: 3%
    border-radius: 50px
`

const GameContainer = styled.View`
    padding: 5%
    background-color: #6969ff
    width: 85%
    height: 85%
    border-radius: 20px
    align-items: center
`

const Space = styled.View`
    margin-top: 2%
    margin-bottom: 2%
`

const StartButton = styled.TouchableOpacity`
    background-color: hotpink
    justify-content: center
    align-items: center
    width: 75%
    padding: 2%
    border-radius: 50px
`

const Round = styled.View`
    padding: 2%
`

const GameArea = styled.View`
    background-color: #69b4ff
    width: 85%
    height: 75%
    align-items: center
    justify-content: center
    border-radius: 25px
`

const SaveScore = styled.TouchableOpacity`
    top: 5%
    background-color: hotpink
    padding: 2%
    border-radius: 20px
    width: 75%
    align-items: center
`


const AnswerBox = styled.View`
    justify-content: center
    align-items: center
    background-color: ${props => props.background}
    width: 40%
    height: 22%
    border-radius: 75px
    margin: 2%
`


