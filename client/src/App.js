import React, { useState, useEffect, useLayoutEffect } from "react";
import "./App.css";
import AppRouter from "./routes/router";
import axios from "axios";
import AuthContext from "./components/authContext";

function App(props) {
  // const history = useHistory();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [goTo, setgoTo] = useState(null);
  const value = { isAuthenticated, setIsAuthenticated, user, setUser, goTo };
  const [isDone, setIsDone] = useState(false);

  const go = window.location.pathname === "/" ? null : window.location.pathname;
  useLayoutEffect(() => {
    const url = "/users/isLoggedIn";
    axios
      .get(url)
      .then((res) => {
        // console.log(res.data);
        setUser(res.data.user);
        setIsAuthenticated(true);
        setgoTo(go);
        setIsDone(true);
      })
      .catch((err) => {
        console.log(err);
        setIsDone(true);
      });
  }, []);

  if (!isDone) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={value}>
      <div className="App">
        <AppRouter />
      </div>
    </AuthContext.Provider>
  );
}

export default App;
