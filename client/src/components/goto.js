import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "./authContext";

export default function Goto() {
  const history = useHistory();
  const { goTo } = useContext(AuthContext);

  if (goTo) {
    history.push(goTo);
  }
  return <div></div>;
}
