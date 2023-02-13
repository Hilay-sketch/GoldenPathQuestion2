import React from "react";
import { useRef, useState } from "react";

//gets an array and returning a list object
function makeAList(missons1) {
  var a = "<ol class='list-group bg-dark'>",
    b = "</ol>",
    m = [];
  m[0] = a;
  var p = 1;
  for (var i = 0; i < missons1.length; i++) {
    m[p] = "<li class='list-group-item'>" + p + ": " + missons1[i] + "</li>";
    var s1 = m[p].indexOf("destroyMass:");
    //WILL ASSIGN A DIFFRENT COLOR IF OVER-WEIGHT
    if (m[p].charAt(12 + s1) > 0) {
      console.log(m[p].charCodeAt(12 + s1) + "    " + m[p].charAt(12 + s1));
      m[p] =
        "<li class='list-group-item list-group-item-danger'>" +
        p +
        ": " +
        missons1[i] +
        "</li>";
    }
    p++;
  }
  console.log(a + m + b);
  m[m.length] = b;
  return m;
}

const DataRet = () => {
  const pRef = useRef(null);
  const listRef = useRef(null);
  //returning a <list>  of the missons to the ui
  const matchMissons = (missonsData) => {
    var missons = missonsData;

    for (let index2 = 0; index2 < missonsData.length; index2++) {
      missons[index2] = missons[index2].substring(
        1,
        missons[index2].length - 1
      );
      missons[index2] = missons[index2].replace(/"/g, "");
      missons[index2] = missons[index2].replace(/,/g, ", ");
    }
    console.log(missons.length);
    return makeAList(missons);
  };

  //will call our server
  const handleClick = () => {
    var missonsList = [];
    fetch("http://localhost:5000/showAllMissons", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        body: JSON.stringify({
          str: "giveData",
        }),
      },
    })
      .then((res) => {
        return res.json(res);
      })
      .then((resData) => {
        missonsList = matchMissons(resData);
        listRef.current.innerHTML = missonsList.join("");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    pRef.current.innerHTML = "*משימות באדום הן משימות בהן המשקל חרג מהמקסימום";
  };
  return (
    <>
      <button onClick={handleClick} className="btn btn-info mt-3 w-25">
        כל המשימות
      </button>
      <div ref={pRef} className="mt-3"></div>
      <div
        ref={listRef}
        className="d-flex justify-content-center mt-3 text-dark bg-dark">
        <p>כאן יוצגו כל המבצעים</p>
      </div>
    </>
  );
};
export default DataRet;
