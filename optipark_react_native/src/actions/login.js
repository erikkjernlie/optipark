import { userRef, auth } from '../firebase';

export const fetchUser = () => dispatch => {
    console.log("CHANGE");
    userRef.child(auth.currentUser.uid).on('value', snapshot => {
        dispatch({
            type: 'USER-INFO',
            payload: snapshot.val()
        })
    }
    )
}


export const createUser = (email, password, licencePlate,  navigation) => async dispatch => {
    console.log("TRying to create user")
    dispatch({
        type: 'START-REGISTER'
    });
    auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
            auth.signInWithEmailAndPassword(email, password)
        })
        .then(() => {
            let curr = auth.currentUser;
            userRef.child(curr.uid).set({
                email: email,
                username: email.split("@")[0],
                uid: curr.uid,
                lp: licencePlate,
                isParked: false,
            })
        }).then(() => {
            let curr = auth.currentUser;
            dispatch({
                type: 'USER-INFO',
                payload: {
                    email: email,
                    username: email.split("@")[0],
                    uid: curr.uid,
                    lp: licencePlate,
                    isParked:false,
                }
            })
            dispatch({
                type: 'START-REGISTER',
                payload: false,
            });
            navigation.navigate('TabNavigator')
        })
        .then(() => {
            dispatch({
                type: 'LOGIN',
                payload: true,
            })
        })
        .catch((err) => {
            dispatch({ type: 'REGISTER_ERROR', err });
            dispatch({ type: 'REGISTER_ERROR_STOP' });
            
        });
}

export const signInUser = (email, password, navigation) => async dispatch => {
    dispatch({
        type: 'START-LOGIN',
        payload: true,
    });
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            dispatch({
                type: 'LOGIN',
                payload: true
            })
            dispatch({
                type: 'START-LOGIN',
                payload: false
            })
        }).then(() => {
            console.log("NAVIGATING AFTER LOGIN")
            navigation.navigate('TabNavigator')
        })
        .catch((err) => {
            console.log('Signin error', err);
            dispatch({ type: 'LOGIN_ERROR', err });
        });
}

export const signOutUser = (navigation) => async dispatch => {
    auth.signOut().then(() => {
        dispatch({
            type: 'LOGIN',
            payload: false,
        })
        navigation.navigate('WelcomeScreen')
        dispatch({
            type: 'USER-IFNO',
            payload: {},
        })
    })
        .catch(() => {
            console.log('Signout Error');
        });
}

