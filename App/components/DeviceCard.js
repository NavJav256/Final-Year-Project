import React from 'react'
import styled from 'styled-components'

import Text from '../utils/Text'

//, onPress, backroundColor, textColor

export default DeviceCard = ({ device }) => {


    return (
        <Container>
            <InfoBox>
                <Text>{device.id}</Text>
                <Text>{device.name}</Text>
                <Text>{device.rssi}</Text>
                <Text>{device.isConnectable}</Text>
                <Text>{device.isConnected()}</Text>
            </InfoBox>
            <ButtonContainer>
                <ConnectButton>
                    <Text>Connect</Text>
                </ConnectButton>
                <DisconnectButton>
                    <Text>Disconnect</Text>
                </DisconnectButton>
            </ButtonContainer>
        </Container>
    )
}

const Container = styled.View`
    flex: 1
    justify-content: center
    align-items: center
`

const InfoBox = styled.View``

const ButtonContainer = styled.View``

const ConnectButton = styled.TouchableOpacity``

const DisconnectButton = styled.TouchableOpacity``
