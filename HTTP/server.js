const firebase = require("firebase-admin/firestore");
const express = require("express");
const app = express();
const json = require("body-parser");
const cors = require("cors");
const axios = require("axios");

//firestore build
const firebaseAdmin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKeys.json");
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
});
const db = firebase.getFirestore();
let dataRef = db.collection("data");

app.use(json());
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("pg");
});

//INPUT:NULL
//OUTPUT:NULL
//adding the misson to the firestore
async function addNewMissonToFireStore(missonData) {
  const misson = {
    mass: +missonData.mass,
    time: +missonData.time,
    distance: +missonData.distance,
    destroyMass: +missonData.massDestroy,
  };
  await db
    .collection("data")
    .add(misson)
    .then((docRef) => {
      console.log("doc added " + docRef.id);
    })
    .catch((error) => {
      console.log(error);
    });
}

//all the constant elments
const engineForce = +100000;
const crewMass = +35000;
const takeOffSpeed = +140;

const maxCargo = {
  mass: +7857.14,
  time: +60,
  distance: 4200,
}; //Object that contains the max values of the cargo

//INPUT:double: givienMass return function:res
//OUTPUT: object with all the data after calculation with the mass
//including the mass itself, the mass amount needed to destroy
//the time and distance it took
//and uploading the misson to the database
function massCalculator(givenMass, res) {
  mass = givenMass;
  var allData = {}; //obj returend
  allData.mass = mass;
  var massDestroy = 0,
    accelartion = 0; //Resting all varabiles

  accelartion = engineForce / (crewMass + mass);
  allData.time = (takeOffSpeed / accelartion).toFixed(2);
  allData.distance = (0.5 * accelartion * allData.time ** 2).toFixed(2);

  //If the mass is too heavy
  if (mass > maxCargo.mass) {
    massDestroy = (mass - maxCargo.mass).toFixed(2);
    allData.massDestroy = massDestroy;
    //after all the calculations now its time to add this misson info to the no-sql database
    addNewMissonToFireStore(allData); //adding the misson to the firestore
  }
  //negative number was enterd
  else if (mass < 0) {
    res.json("negative number isn't valid");
  }
  //Input is correct and the mass is not over-weighthing
  else {
    allData.massDestroy = 0;
    //after all the calculations now its time to add this misson info to the no-sql database
    addNewMissonToFireStore(allData); //adding the misson to the firestore
  }
  res.json(allData);
}

//INPUT:NULL
//OUTPUT:All the previous missons from the firestore no-sql
//database as array[]
async function getMissonsFromFirestore() {
  console.log("in");
  let missons = [];
  await dataRef.get().then((snapshot) => {
    snapshot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
      missons.push(JSON.stringify(doc.data()));
    });
  });
  console.log("/////////// " + missons + " ///////");
  if (missons != null) return missons; //checking there are missons
  return null;
}

//INPUT: date:string and res:return to client
//OUTPUT:object that contains if there are
//any good flight times and string of times
//or the avergae temprature
function checkTemp(data, res) {
  const apiUrl =
    "https://api.open-meteo.com/v1/forecast?latitude=30&longitude=35&hourly=temperature_2m&timezone=auto&start_date=2023-02-14&end_date=2023-02-14";
  var missonPicked = apiUrl.replace(/2023-02-14/g, data);
  console.log(missonPicked);
  if (missonPicked != null) {
    axios.get(missonPicked)
      .then((response) => {
        console.log(response.data);
        var temp = response.data.hourly.temperature_2m;
        var time = response.data.hourly.time;
        var averageTemp = 0;
        console.log(response.data.hourly);
        var allPossibeleTime = "";
        let i = 0;
        for (i = 0; i < temp.length; i++) {
          if (temp[i] >= 15 && temp[i] <= 30) {
            allPossibeleTime += time[i].substring(11, time[i].length) + " / ";
          }
          averageTemp += temp[i];
        }
        if (allPossibeleTime == "") {
          const answer = {
            avgTemp: (averageTemp / 24).toFixed(2),
            isGood: false,
          };
          res.json(answer);
        } else {
          const answer = { allPossibeleTime: allPossibeleTime, isGood: true };
          res.json(answer);
        }
      })
      .catch((error) => {
        console.log(error);
        res.json(error);
      });
  } else {
    console.log(error);
    res.json(error);
  }
}

//INPUT: double = user entered mass
//OUTPUT: (inside the function) = gives back an object with all the data
//after calculations
app.post("/calcMass", (req, res) => {
  massCalculator(req.body.mass, res);
});

//INPUT: Null
//OUTPUT: array[] with all the missons from the
//no-sql firestore
app.post("/showAllMissons", async (req, res) => {
  const missons = await getMissonsFromFirestore();
  res.json(missons);
});

//INPUT: date as a string
//OUTPUT:(inside the function)all the hours we can fly at the given date
//or there isn't a good flight hour and then the average temprature
app.post("/weahterCheck", (req, res) => {
  checkTemp(req.body.date, res);
});

app.listen(5000, () => console.log("Server started on port 5000..."));
