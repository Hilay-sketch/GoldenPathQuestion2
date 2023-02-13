import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";  
import { getFirestore, getDocs, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBpLzDAN-m0NWFO3Jzlm-NwHeeny8uKlXk",
    authDomain: "goldenpath-dbc37.firebaseapp.com",
    projectId: "goldenpath-dbc37",
    storageBucket: "goldenpath-dbc37.appspot.com",
    messagingSenderId: "1012963058440",
    appId: "1:1012963058440:web:49a07d70b94831370dc2bd"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const dbRef = collection(db, "data");

const feedbackAnswer = document.getElementById('feedback');//feedback paragraph
const massReduce = document.getElementById('massReduce');//mass reduce paragraph
const distanceTR = document.getElementById('distanceTraveled');//distance pargraph
const timeTR = document.getElementById('timeTraveled');//Time pargraph
document.getElementById('seeList').onclick = showPreviousMissons;//will show previos missons from cloud
var time = 0,distance =0,destroyMass = 0, accelartion = 0;//Resting all varabiles
const engineForce = +100000;
const crewMass = +35000;
const takeOffSpeed = +140;
const maxCargo = 
{
    mass:+7857.14,
    time:+60,
    distance:4200
};//Object that contains the max values of the cargo
document.getElementById('confirm').onclick = calcAndGive;//calling the function whem is clicked
//function that will calculate the distance,time etc. and assgin its answers 
function calcAndGive()
{
    const userMass = +document.getElementById('cargoMassUser').value;//getting the mass from input
    if(maxCargo.mass < userMass)//cargo over weight
    {
        feedbackAnswer.innerHTML = ':המסה כבדה מידי, לאחר ההחסרה נסה שוב. נא החסר מהמסה הנתונה לפחות'
        destroyMass = (userMass-maxCargo.mass).toFixed(2);
        massReduce.innerHTML = destroyMass + '[kg]';
        accelartion = engineForce/(crewMass+userMass);
        time = (takeOffSpeed/accelartion).toFixed(2);
        distance = (0.5*accelartion*(time**2)).toFixed(2);
        distanceTR.innerHTML = distance + '[m]';
        timeTR.innerHTML = time + '[sec]'+ '> 60[sec](זמן המראה מקסימלי)';
        addNewMisson(userMass,time,distance, destroyMass);//calling the method which upload the misson to the database
    }
    else if(userMass < 0)// false input
    {
        massReduce.innerHTML = '';
        distanceTR.innerHTML = '';
        timeTR.innerHTML = '';
        feedbackAnswer.innerHTML = 'נא הזן מסה חיובית';
    }
    else
    {
        feedbackAnswer.innerHTML = 'זמן ומרחק ההמראה'
        massReduce.innerHTML = '';
        accelartion = engineForce/(crewMass+userMass);
        time = (takeOffSpeed/accelartion).toFixed(2);
        distance = (0.5*accelartion*(time**2)).toFixed(2);
        distanceTR.innerHTML = distance + '[m]';
        timeTR.innerHTML = time + '[sec]';
        addNewMisson(userMass,time,distance, 0);//calling the method which upload the misson to the database
    }
}
//adding a new misson to the data base
async function addNewMisson(mass2,time2,distance2, destroyMass2)
{
    const misson = {
        mass:+mass2,
        time:+time2,
        distance:+distance2,
        destroyMass:+destroyMass2
    };
    addDoc(dbRef,misson).then(docRef => {
        console.log("Document has been added");
    })
    .catch(error => {
        console.log(error);
    });
}

//retriving from firestore data
async function showPreviousMissons()
{
    var missons = [];
    const snapshot = await getDocs(dbRef);
    snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
        missons.push(JSON.stringify(doc.data()));
    });
    makeAList(missons);   
}
//making a list out of the last missons from databse
async function makeAList(missons)
{
    var a = '<ol>',
        b = '</ol>',
        m = [];
    for (var i = 0; i < missons.length; i ++){
        m[i] = '<li>' + missons[i] + '</li>';
    }
    document.getElementById('list').innerHTML = a + m + b;
}