const { initializeApp } = require('firebase/app')
const { 
  getFirestore, 
  doc, 
  setDoc, 
  addDoc, 
  collection, 
  getDoc, 
  onSnapshot,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} = require('firebase/firestore')

const { 
    getAuth, 
    connectAuthEmulator, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    signInAnonymously
} = require('firebase/auth');

const dotenv = require('dotenv');
const { sign } = require('crypto');

dotenv.config()
/*const{
    API_KEY,
    AUTH_DOMAIN,
    PROJECT_ID,
    STORAGE_BUCKET,
    MEASSAGING_SENDER_ID,
    APP_ID,
    MEASUREMENT_ID
} = process.env

const firebaseApp = initializeApp({
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MEASSAGING_SENDER_ID,
    appId: APP_ID,
    measurementId: MEASUREMENT_ID
})*/

const firebaseApp = initializeApp({
    apiKey: "AIzaSyAyUL73lnqRDZ-1HP_F-3CWhgaXoCYlC_E",
    authDomain: "miscommunication-mayhem.firebaseapp.com",
    projectId: "miscommunication-mayhem",
    storageBucket: "miscommunication-mayhem.appspot.com",
    messagingSenderId: "619420848727",
    appId: "1:619420848727:web:9205b82fbb712b71940912"
  });
  
const firestore = getFirestore();
const auth = getAuth(firebaseApp);

// Variable to track if redirection has been performed
let isRedirected = false;

// Function to create a new account
const createNewAccount = async (myEmail, myUsername, myPassword, req, res) => {
    const loginEmail = myEmail;
    const loginPassword = myPassword;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, loginEmail, loginPassword);
        await addUserToDB(myEmail, myUsername); // Wait for addUserToDB to complete
        console.log('Firebase: A user has created an account.');
        monitorAuthState(req, res); // Now call monitorAuthState after addUserToDB completes
    } catch (error) {
        console.log('Firebase: There was an error creating account.');
        console.log(error);
    }
}

const redirect = (req, res) => {
    res.redirect(req.baseUrl + '/game');
  };
  
const monitorAuthState = (req, res) => {
    let redirected = false; // Flag to indicate if redirect has been performed
  
    onAuthStateChanged(auth, user => {
        if (user && user.isAnonymous && !redirected) {
            console.log('Auth State: Guest User is Logged In.');
            redirect(req, res);
            redirected = true;
        } else if (user && !user.isAnonymous && !redirected) {
            console.log('Auth State: Regular User is Logged In.');
            redirect(req, res);
            redirected = true;
        } else if (!user) {
            console.log('Auth State: User is Logged Out.');
        }
    });
};

// Function to add new user to the database
async function addUserToDB(myEmail, myUsername) {

    try{
        const userUID = getUserUID();
        userInformation = doc(firestore, `users/${userUID}`)
        const userData ={
            username: myUsername,
            email: myEmail,
            uid: userUID
        }
        setDoc(userInformation, userData);

        console.log('Firebase: A new user account was created.');
    }
    catch(error){
        console.log('Firebase: There was an error creating a new user account.');
        console.log(error);
    }
}

// Function to login with email and password
const loginEmailPassword = async(myEmail, myPassword, req, res) => {
    const loginEmail = myEmail;
    const loginPassword = myPassword;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
        console.log('Firebase: A user has logged in.');
        monitorAuthState(req, res);
    } catch (error) {
        console.log('Firebase: There was an error logging in.');
        console.log(error);
    }
}

// Function to get the username of the current user
const getUsername = async function() {
    //const userEmail = getUserEmail();
    const userUID = getUserUID();
    if (userUID !== null) {
        const userInformation = doc(firestore, `users/${userUID}`);
        const mySnapshot = await getDoc(userInformation);
        if(mySnapshot.exists()){
            const docData = mySnapshot.data();
            console.log(`My data is ${JSON.stringify(docData)}`);
            const username = docData.username;
            console.log(`Username is ${username}`);

            return username;
        }
    }
    return "";
}

// Function to get the email of the current user
const getUserEmail = function() {
    const user = auth.currentUser;
    if (user !== null) {
        return user.email;
    } else {
        return null;
    }
}

const getUserUID = function() {
    const user = auth.currentUser;
    if (user !== null) {
        return user.uid;
    } else {
        return null;
    }
}

const loginGuest = async(myUsername, req, res) => {
    console.log("Guest sign in with username: " + myUsername);
    try {
        const userCredential = await signInAnonymously(auth);
        console.log('Guest User has logged in');
        monitorAuthState(req, res);
        addUserToDB(null, myUsername);
    } catch (error) {
        console.log('There was an error logging in guest');
        console.log(error);
    }
}

module.exports = {
    createNewAccount,
    loginEmailPassword,
    getUsername,
    getUserEmail,
    loginGuest,
};
