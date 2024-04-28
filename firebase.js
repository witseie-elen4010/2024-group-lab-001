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
const{
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
})
  
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

module.exports = {
    createNewAccount,
};
