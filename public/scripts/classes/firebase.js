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
    signOut
} = require('firebase/auth');

const dotenv = require('dotenv')

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

// Function to create a new account
const createNewAccount = async(myEmail, myUsername, myPassword, req, res) =>{
    const loginEmail = myEmail
    const loginPassword = myPassword

    try{
        const userCredential = await createUserWithEmailAndPassword(auth, loginEmail, loginPassword);
        addUserToDB(myEmail, myUsername)
        console.log('User has creted an account');
        monitorAuthState(req, res)
    }
    catch(error){
        console.log('There was an error creating account');
        console.log(error);
    }
}

// Function to redirect user to the lobby after signup or login
const redirect = (req, res) => {
    res.redirect(req.baseUrl + '/lobby');
};

// Function to monitor the authentication state/ if a user is logged in or out
const monitorAuthState = (req, res) => {
    onAuthStateChanged(auth, user => {
        if(user){
            console.log('Auth State: User is logged in');
            redirect(req, res)
        }
        else{
            console.log('Auth State: User is logged out');
        }
    })
}

// Function to add new user to the database
async function addUserToDB(myEmail, myUsername) {

    try{
        userInformation = doc(firestore, `users/${myEmail}`)
        const userData ={
            username: myUsername,
            email: myEmail
        }
        setDoc(userInformation, userData);

        console.log('New user was created in DB');
    }
    catch(error){
        console.log('There was an error creating account DB');
        console.log(error);
    }
}

// Function to login with email and password
const loginEmailPassword = async(myEmail, myPassword, req, res) => {
    const loginEmail = myEmail;
    const loginPassword = myPassword;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
        console.log('User has logged in');
        monitorAuthState(req, res);
    } catch (error) {
        console.log('There was an error logging in');
        console.log(error);
    }
}

module.exports = {
    createNewAccount,
    loginEmailPassword
};
