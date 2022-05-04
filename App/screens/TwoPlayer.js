import React, { useContext, useState, useEffect } from 'react'
import styled from 'styled-components'

import Text from '../utils/Text'

import { BleManager } from 'react-native-ble-plx'
import Ionicons from 'react-native-vector-icons/Ionicons/'

import { UserContext } from '../contexts/UserContext'
import { FirebaseContext } from '../contexts/FirebaseContext'
import { Alert } from 'react-native'


const manager = new BleManager()
const serviceUUID = '00001523-1212-EFDE-1523-785FEABCD123'
const ButtonCharacteristicUUID = '00001524-1212-EFDE-1523-785FEABCD123'
const LEDCharacteristicUUID = '00001525-1212-EFDE-1523-785FEABCD123'


export default TwoPlayer = () => {

    const [playerOne, setPlayerOne] = useState(false)
    const [playerTwo, setPlayerTwo] = useState(false)
    const [boardOne, setBoardOne] = useState({})
    const [boardTwo, setBoardTwo] = useState({})

    const [player, setPlayer] = useState('Player 1')
    const [playing, setPlaying] = useState(false)
    const [score, setScore] = useState(0)
    const [round, setRound] = useState(1)

    var roundNumber = 1
    var index = 0
    var count = 0
    var indexB = 0

    const [correctA, setCorrectA] = useState(null)
    const [correctB, setCorrectB] = useState(null)
    const [button, setButton] = useState(1)
    const [buttonB, setButtonB] = useState(1)

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

    const scanAndConnect = (number) => {
        manager.startDeviceScan(null, null, (error, device) => {
            if (error) console.error(error)
            if (device.name === 'Navboard') {
                if (count == 1 && device.id == boardOne.id) return
                manager.stopDeviceScan()
                device.connect()
                    .then((device) => {
                        return device.discoverAllServicesAndCharacteristics()
                    })
                    .then((device) => {
                        if (number == 1) {
                            console.log('1')
                            setBoardOne(device)
                            setPlayerOne(true)
                            count = 1
                        }
                        else {
                            setBoardTwo(device)
                            setPlayerTwo(true)
                            count = 2
                        }
                        // device.onDisconnected((error, device) => {
                        //     setConnected(false)
                        //     console.error(error)
                        // })
                    })
                    .catch((error) => {
                        console.error(error)
                    })
            }
        })
    }

    const disconnect = (number) => {
        if (number == 1) {
            setPlayerOne(false)
            manager.cancelDeviceConnection(boardOne.id)
            count -= 1
        }
        else {
            setPlayerTwo(false)
            manager.cancelDeviceConnection(boardTwo.id)
            count -= 1
        }
    }

    const playGame = async () => {
        if (!playerOne || !playerTwo) {
            Alert.alert('Cannot start game, both devices not connected')
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
        if (roundNumber % 2 == 1) {
            setPlayer('Player 1')
            monitor(seq, boardOne)
            blinkBoard(boardOne, seq)
        } else {
            setPlayer('Player 2')
            monitor(seq, boardTwo)
            blinkBoard(boardTwo, seq)
        }
    }

    const monitor = async (seq, board) => {
        let sub = manager.monitorCharacteristicForDevice(board.id, serviceUUID, ButtonCharacteristicUUID, (error, characteristic) => {
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

    const blinkBoard = async (board, sequence) => {
        for (let i = 0; i < sequence.length; i++) {
            ledOn(board, sequence[i])
            await delay(1000)
            ledOff(board, sequence[i])
            await delay(500)
        }
        allOff(board)
        await delay(1000)
    }

    const ledOn = (board, number) => {
        if (number == 1) toggleLed(board, 1)
        if (number == 2) toggleLed(board, 2)
        if (number == 3) toggleLed(board, 3)
        if (number == 4) toggleLed(board, 4)
    }

    const ledOff = (board, number) => {
        if (number == 1) toggleLed(board, 5)
        if (number == 2) toggleLed(board, 6)
        if (number == 3) toggleLed(board, 7)
        if (number == 4) toggleLed(board, 8)
    }

    const allOff = (board) => {
        toggleLed(board, 5)
        toggleLed(board, 6)
        toggleLed(board, 7)
        toggleLed(board, 8)
    }

    const toggleLed = (board, number) => {
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
        allOff(boardOne)
        allOff(boardTwo)
        setPlayer('Player 1')
    }

    const save = async () => {
        if (!playing) {
            let res = false
            console.log(score)
            if (score > user.highScore) {
                res = await firebase.addScore(user.uid, score)
                console.log(res)
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
                <PlayerOne>
                    <ConnectBox onPress={() => { scanAndConnect(1) }}>
                        {playerOne ? (
                            <Text bold color={'white'}>Player One: ({boardOne.id.slice(0, 8)})</Text>
                        ) : (
                            <Text bold color={'white'}>Player One: Connect</Text>
                        )}
                    </ConnectBox>
                    <DisconnectBox onPress={() => { disconnect(1) }}>
                        <Text bold color={'white'}>Disconnect</Text>
                    </DisconnectBox>
                </PlayerOne>
                <Space />
                <PlayerTwo>
                    <ConnectBox onPress={() => { scanAndConnect(2) }}>
                        {playerTwo ? (
                            <Text bold color={'white'}>Player Two: ({boardTwo.id.slice(0, 8)})</Text>
                        ) : (
                            <Text bold color={'white'}>Player Two: Connect</Text>
                        )}
                    </ConnectBox>
                    <DisconnectBox onPress={() => { disconnect(2) }}>
                        <Text bold color={'white'}>Disconnect</Text>
                    </DisconnectBox>
                </PlayerTwo>
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
                    <Player>
                        <Text>{player}</Text>
                    </Player>
                    <Text>Button number</Text>
                    <Space />
                    <AnswerBox background={correctA == null ? '#ffd269' : correctA ? '#69ffb4' : '#aa4678'}>
                        <Text large bold color={'white'}>{button}</Text>
                    </AnswerBox>
                    <Space />
                    <Text>Score: {score}</Text>
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
    justify-content: center
    align-items: center
`

const PlayerOne = styled.View`
    flex-direction: row
`

const PlayerTwo = styled.View`
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
    height: 75%
    border-radius: 20px
    align-items: center
`

const Space = styled.View`
    margin-top: 2%
    margin-bottom: 2%
`

const StartButton = styled.TouchableOpacity`
    background-color: hotpink
    padding: 2%
    justify-content: center
    align-items: center
    width: 75%
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
    top: 2%
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
    height: 24%
    border-radius: 75px
    margin: 2%
`

const Player = styled.View``