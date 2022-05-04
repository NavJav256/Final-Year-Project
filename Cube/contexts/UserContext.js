import React, { useState, createContext } from 'react'

const UserContext = createContext([{}, () => { }])

const UserProvider = (props) => {
    const [state, setState] = useState({
        username: '',
        email: '',
        uid: '',
        isLoggedIn: null,
        profilePicUrl: 'default',
        highScore: 0,
    })

    return <UserContext.Provider value={[state, setState]}>{props.children}</UserContext.Provider>
}

export { UserContext, UserProvider }