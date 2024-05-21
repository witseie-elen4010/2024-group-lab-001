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
const { text } = require('body-parser');
const { log } = require('console');
const { get } = require('http');

dotenv.config()

const firebaseApp = initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
});

/*
const firebaseApp = initializeApp({
    apiKey: "AIzaSyAyUL73lnqRDZ-1HP_F-3CWhgaXoCYlC_E",
    authDomain: "miscommunication-mayhem.firebaseapp.com",
    projectId: "miscommunication-mayhem",
    storageBucket: "miscommunication-mayhem.appspot.com",
    messagingSenderId: "619420848727",
    appId: "1:619420848727:web:9205b82fbb712b71940912"
  });
*/

const firebaseApp = initializeApp({
    apiKey: "AIzaSyAM0d1FWsRSF_cN9qAGEikehCzyZvs1N1I",
    authDomain: "miscommunication-mayhem-ddd0b.firebaseapp.com",
    projectId: "miscommunication-mayhem-ddd0b",
    storageBucket: "miscommunication-mayhem-ddd0b.appspot.com",
    messagingSenderId: "691034734112",
    appId: "1:691034734112:web:ab2a371ab4c4263cebc645"
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
        let logTime = new Date().toISOString();
        logDB(loginEmail, "Signup", logTime, ` ${logTime}: User with email address ${loginEmail} has been created.`)
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
    onAuthStateChanged(auth, user => {
        if (user && user.isAnonymous) {
            console.log('Auth State: Guest User is Authenticated & Logged In.');
        } else if (user && !user.isAnonymous) {
            console.log('Auth State: Regular User is Authenticated & Logged In.');
        } else {
            console.log('Auth State: User is Authenticated & Logged Out.');
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
            uid: userUID,
            role: 'player'
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
const loginEmailPassword = async (myEmail, myPassword, req, res) => {
    const loginEmail = myEmail;
    const loginPassword = myPassword;

    try {
        
        const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
        console.log('Firebase: A user has logged in.');
        let logTime = new Date().toISOString();
        logDB(loginEmail, "Login", logTime, `${logTime}: User with email address ${loginEmail} has logged in.`)
        monitorAuthState(req, res);
        return; // Return here to prevent further execution
    } 
    catch (error) {
        console.log('Firebase: There was an error logging in.');
        let logTime = new Date().toISOString();
        logDB(loginEmail, "Login", logTime, `${logTime}: User with email address ${loginEmail} failed to log in.`)
        res.status(401).send('Login failed'); // Send response for login failure
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
            // console.log(`My data is ${JSON.stringify(docData)}`);
            const username = docData.username;
            // console.log(`Username is ${username}`);

            return username;
        }
    }
    return "";
}

// Function to get the role of the current user
const getRole = async function() {

    const userUID = getUserUID();
    if (userUID !== null) {
        const userInformation = doc(firestore, `users/${userUID}`);
        const mySnapshot = await getDoc(userInformation);
        if(mySnapshot.exists()){
            const docData = mySnapshot.data();

            const role = docData.role;

            return role;
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
    try {
        const userCredential = await signInAnonymously(auth);
        console.log("Firebase: Guest Login with Username: " + myUsername);
        let logTime = new Date().toISOString();
        logDB(myUsername, "Login", logTime, `${logTime}: Guest with username ${myUsername} has logged in.`)
        monitorAuthState(req, res);
        addUserToDB(null, myUsername);
    } catch (error) {
        console.log('There was an error for guest login.');
        console.log(error);
        let logTime = new Date().toISOString();
        logDB(myUsername, "Login", logTime, `${logTime}: Guest with username ${myUsername} failed to log in.`)
    }
}

// Function to get the prompt from the database
const generateRandomPrompts = async function(promptIndex) {
    const promptInformation = doc(firestore, `prompts/prompt_${promptIndex}`);
    const mySnapshot = await getDoc(promptInformation);
    if(mySnapshot.exists()){
        const docData = mySnapshot.data();
        const prompt = docData.text;
        
        return prompt;
    }
    return "";
};

const logDB = async function(logUsername, logAction, logTime, logText) {
    try{
        const logCollection = collection(firestore, `logs`);
        const logData = {
            username: logUsername,
            action: logAction,
            time: logTime,
            text: logText
        };
        await setDoc(doc(logCollection, logTime), logData);
    }

    catch(error){
        console.log('Firebase: There was an error logging to the database.');
        console.log(error);
    }

}

const getLogs = async function(numberOfLogs){
    const logCollection = collection(firestore, `logs`);
    const logQuery = query(logCollection, limit(numberOfLogs), orderBy('time', 'desc'));

    const logArray = [];

    const querySnapshot = await getDocs(logQuery);
    querySnapshot.forEach((snap) => {
        const logText = JSON.stringify(snap.data().text);
        logArray.push(logText);
    });
    console.log("Log Array: ", logArray);
    return logArray;
    
}

module.exports = {
    createNewAccount,
    loginEmailPassword,
    getUsername,
    getUserEmail,
    getRole,
    loginGuest,
    generateRandomPrompts,
    logDB,
    getLogs,
};
