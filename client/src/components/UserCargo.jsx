import React, { useEffect } from "react";
import { useRef } from "react";

const UserIn = ({ user_cargo_mass, setCargo }) => {
  const resRef = useRef(null);
  const timeRef = useRef(null);
  const feedbackRef = useRef(null);
  const timeResRef = useRef(null);
  const distanceRef = useRef(null);
  const distanceResRef = useRef(null);

  const handleServerMissonData = (missonInfo) => {
    //negative mass was entered
    if (missonInfo == "negative number isn't valid") {
      feedbackRef.current.innerHTML = "אנא הכנס מספר חיובי או אפס"; //feedback
    }
    //If the mass is too heavy
    else if (missonInfo.massDestroy > 0) {
      feedbackRef.current.innerHTML =
        ":כמות המסה שיש להחסיר מהמטען להמראה מיטבית";
      resRef.current.innerHTML = missonInfo.massDestroy + " [kg]";
      timeRef.current.innerHTML =
        ":זמן ההמראה למסה הנתונה (חייב להיות קטן מ60 שניות)";
      timeResRef.current.innerHTML = missonInfo.time + " [sec]";
      distanceRef.current.innerHTML = ":מרחק ההמראה למסה הנתונה";
      distanceResRef.current.innerHTML = missonInfo.distance + " [m]";
    }
    //Input is correct and the mass is not over-weighthing
    else {
      feedbackRef.current.innerHTML = "מסת המטען";
      resRef.current.innerHTML = missonInfo.mass + " [kg]";
      timeRef.current.innerHTML = ":זמן ההמראה";
      timeResRef.current.innerHTML = missonInfo.time + " [sec]";
      distanceRef.current.innerHTML = ":מרחק ההמראה למסה הנתונה";
      distanceResRef.current.innerHTML = missonInfo.distance + " [m]";
    }
  };
  //handler which calls the server with mass input
  const massHandler = () => {
    if (user_cargo_mass != null) {
      fetch("http://localhost:5000/calcMass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mass: user_cargo_mass,
        }),
      })
        .then((res) => {
          console.log(res);
          return res.json();
        })
        .then((resData) => {
          // we got the calculation needed for the misson now we are going
          //to implament it to the client side
          handleServerMissonData(resData);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
    else
    {
      feedbackRef.current.innerHTML = "אנא הזן מסה"
    }
  };

  return (
    <>
      <div>
        <h2 className="font-weight-light">נא להכניס את מסת המטען</h2>
      </div>
      <div className="w-25 mx-auto mt-3">
        <input
          placeholder="cargo mass[kg]"
          type={"number"}
          value={user_cargo_mass}
          onChange={(e) => setCargo(e.target.valueAsNumber)}
          className="form-control"></input>
      </div>

      <button
        onClick={massHandler}
        className="btn btn-primary mt-3 w-25"
        type="submit">
        אישור מסת מטען
      </button>
      <div className="mt-3 font-weight-light  ">
        <p ref={feedbackRef}></p>
        <p ref={resRef}></p>
        <p ref={timeRef}></p>
        <p ref={timeResRef}></p>
        <p ref={distanceRef}></p>
        <p ref={distanceResRef}></p>
      </div>
    </>
  );
};

export default UserIn;
