// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getMessaging,getToken, onMessage} from 'firebase/messaging';
import instance from "../../auth/services/api/customAxios";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDRcXZF1ueul_kaJK8KeLE24aVYJy6q3ns",
  authDomain: "bird-farm-meal-system.firebaseapp.com",
  projectId: "bird-farm-meal-system",
  storageBucket: "bird-farm-meal-system.appspot.com",
  messagingSenderId: "584944175812",
  appId: "1:584944175812:web:a5cc2aec3aab4cc2df9791",
  measurementId: "G-PHZNEFXH9M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
const VAPID_KEY = 'BMD-t60m8Cky08gYwK1aZi30wmlfeaRLS2UpYMw1_Wzm2ortXm56ww-Hda7Wjfm28ZA_et9mypaazNb7A5jLm38';
// const VAPID_KEY = '';
export const generateToken = async()=>{
  try{
    const permission = await Notification.requestPermission()
    if(permission === 'granted'){
      const token = await getToken(messaging, {vapidKey: VAPID_KEY})
      await instance.post('/device-tokens/managers',{
        "deviceToken": token
      }).catch(err => {console.log(err)})
      localStorage.setItem('notify_device_token',token)
    }
  }catch(err){console.log(err)}
}

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });