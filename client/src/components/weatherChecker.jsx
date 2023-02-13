import React, { useRef } from "react";

const Weather = ({ userDate, setUserDate }) => {
  const allTimeRef = useRef(null);

  const handleClick = () => {
    fetch("http://localhost:5000/weahterCheck", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: userDate,
      }),
    })
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((resData) => {
        if (resData.isGood) {
          var time = resData.allPossibeleTime;
          console.log(time.substring(0, time.length - 2));
          allTimeRef.current.innerHTML = time.substring(0, time.length - 2);
        } else if (resData.isGood == false) {
          console.log(resData.avgTemp);
          allTimeRef.current.innerHTML =
            "[c]" +
            "אין זמני טיסה מתאימים, הטמפ' הממוצעת במקום " +
            resData.avgTemp;
        } else {
          console.error("Error:", resData.error);
          alert("ניתן לבדוק תאריכים קרובים בלבד");
          allTimeRef.current.innerHTML = "";
        }
      });
  };
  return (
    <>
      <h2 className="font-weight-light">הכנס את תאריך המשימה</h2>
      <input
        type="date"
        className="w-25 mx-auto mt-3"
        value={userDate}
        onChange={(e) =>
          setUserDate(e.target.valueAsDate.toISOString().split("T")[0])
        }></input>
      <button
        onClick={handleClick}
        className="btn btn-primary w-25 mx-auto mt-3 d-flex justify-content-center"
        type="submit">
        אישור תאריך
      </button>
      <p className="mt-2">:שעות בהן ניתן לטוס בתאריך המבוקש</p>
      <p
        ref={allTimeRef}
        className="font-weight-bold mt-3 d-flex justify-content-center"></p>
    </>
  );
};
export default Weather;
