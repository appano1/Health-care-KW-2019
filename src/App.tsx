import React, { useState } from "react";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import "./App.css";
import { Route, Switch } from "react-router-dom";
import Home from "./routes/Home";
import Register from "./routes/Register";
import Research from "./components/Research";
import Statistics from "./routes/Statistics";
import MyStatistics from "./routes/MyStatistics";

function App() {
  const [isLogin, setLog] = useState(
    Boolean(sessionStorage.getItem("isLogin"))
  );

  return (
    <>
      <Switch>
        <Route
          exact
          path="/"
          render={props => <Home {...props} isLogin={isLogin} />}
        />
        <Route path="/SignUp" component={SignUp} />
        <Route path="/Research" component={Research}/>
        <Route
          path="/Login"
          render={props => <Login {...props} setLog={setLog} />}
        />
        <Route path="/register" component={Register} />
        <Route path="/statistics" component={MyStatistics} />
      </Switch>
    </>
  );
}

export default App;
