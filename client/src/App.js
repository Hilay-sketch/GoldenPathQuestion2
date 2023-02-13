import "./App.css";
import { useState } from "react";
import UserIn from "./components/UserCargo";
import DataRet from "./components/retrivedatafire";
import Weather from "./components/weatherChecker";
const App = () => {
  const [user_cargo_mass, setUserCargo] = useState();
  const [user_date, setUserDate2] = useState("misson date");
  return (
    <>
      <div className="App bg-dark">
        <h1 className="text-info mb-3 display-3 font-weight-bold">
          מחשבון טיסה
        </h1>
        <div className="wheatherChecker">
          <Weather userDate={user_date} setUserDate={setUserDate2}></Weather>
        </div>
        <div className="userInput">
          <UserIn user_cargo_mass={user_cargo_mass} setCargo={setUserCargo} />
        </div>
        <div className="retriveAllData bg-dark">
          <DataRet></DataRet>
        </div>
      </div>
    </>
  );
};
export default App;
