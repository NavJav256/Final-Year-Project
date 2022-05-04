import React, { createContext } from 'react'

import firebase from 'firebase/compat'
import firebaseConf from '../config/firebase'

const FirebaseContext = createContext()

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConf)
}

const db = firebase.firestore()

const Firebase = {


    createUser: async (user) => {
        try {
            await firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
            const uid = Firebase.getCurrentUser().uid

            let profilePicUrl = 'default'

            await db.collection('users').doc(uid).set({
                username: user.username,
                email: user.email,
                highScore: 0,
                profilePicUrl
            })

            if (user.profilePic) {
                profilePicUrl = await Firebase.uploadProfilePic(user.profilePic)
                console.log(profilePicUrl)
            }

            delete user.password

            return { ...user, profilePicUrl, uid }

        } catch (error) {
            console.log('Error with createUser in FirebaseContext: ', error.message)
            return error.code
        }
    },

    getCurrentUser: () => {
        return firebase.auth().currentUser
    },

    getUserInfo: async (uid) => {
        try {
            const user = await db.collection('users').doc(uid).get()

            if (user.exists) {
                return user.data()
            }
        } catch (error) {
            console.log('Error with getUserInfo in FirebaseContext: ', error)
        }
    },

    uploadProfilePic: async (uri) => {
        const uid = Firebase.getCurrentUser().uid

        try {
            const photo = await Firebase.getBlob(uri)

            const imageRef = firebase.storage().ref('profilePics').child(uid)
            await imageRef.put(photo)

            const url = await imageRef.getDownloadURL()

            await db.collection('users').doc(uid).update({
                profilePicUrl: url
            })

            return url
        } catch (error) {
            console.log('Error with uploadProfilePic in FirebaseContext: ', error)
        }
    },

    getBlob: async (uri) => {
        return await new Promise((res, rej) => {
            const xhr = new XMLHttpRequest()

            xhr.onload = () => {
                res(xhr.response)
            }

            xhr.onerror = () => {
                rej(new TypeError('Network request failed'))
            }

            xhr.responseType = 'blob'
            xhr.open('GET', uri, true)
            xhr.send(null)
        })
    },

    signIn: async (email, password) => {
        return firebase.auth().signInWithEmailAndPassword(email, password)
    },

    logOut: async () => {
        try {
            await firebase.auth().signOut()
            return true
        } catch (error) {
            console.log('Error with logOut in FirebaseContext: ', error)
        }
        return false
    },

    addScore: async (uid, score) => {
        try {
            const userRef = db.collection('users').doc(uid)
            console.log(score)
            const res = await userRef.update({ highScore: score })
            return true
        } catch (error) {
            console.log('Error with addScore in FirebaseContext: ', error)
        }
        return false
    },


}

const FirebaseProvider = (props) => {
    return <FirebaseContext.Provider value={Firebase}>{props.children}</FirebaseContext.Provider>
}

export { FirebaseContext, FirebaseProvider }