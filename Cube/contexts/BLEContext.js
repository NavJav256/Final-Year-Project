import React, { createContext, useState } from 'react'

import { BleManager } from 'react-native-ble-plx'

const BLEContext = createContext()

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConf)
}

const manager = new BleManager()
const [count, setCount] = useState(0)
const [deviceOne, setDeviceOne] = useState()
const [deviceTwo, setDeviceTwo] = useState()

const BLE = {

    init: () => {
        const subscription = manager.onStateChange((state) => {
            if (state === 'PoweredOn') {
                subscription.remove()
            }
        }, true)
    },

    scan: () => {
        manager.startDeviceScan(null, null, (error, device) => {
            if (error) console.error(error)
            if (device.name === 'NavBoard') {
                console.log(device.id)
                if (device.id === 'CA38B3E7-B2BD-E529-4F13-3F9865E42B81' || device.id === '6F2BAD28-EA88-B2D7-91D8-896A4B10D1ED') {
                    if (count == 0) {
                        setDeviceOne(device)
                        setCount(1)
                    }
                    else {
                        setDeviceTwo(device)
                        setCount(2)
                    }
                }
            }
        })
    },

    stop: () => {
        manager.stopDeviceScan()
        setCount(0)
        setDeviceOne(null)
        setDeviceTwo(null)
    }
}

const BLEProvider = (props) => {
    return <BLEContext.Provider value={BLE}>{props.children}</BLEContext.Provider>
}

export { BLEContext, BLEProvider }