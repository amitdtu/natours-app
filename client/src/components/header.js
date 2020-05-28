import React, { useContext, Fragment } from "react";
import logo from "../assets/img/logo-white.png";
import { Link } from "react-router-dom";
import AuthContext from "./authContext";
import axios from "axios";

export default function Header() {
  const { user } = useContext(AuthContext);
  console.log(axios.defaults);

  const logout = () => {
    const url = "/users/logout";
    axios
      .get(url)
      .then((res) => {
        console.log(res);
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  return (
    <header className="header">
      <nav className="nav nav--tours">
        <Link to="/" className="nav__el">
          All tours
        </Link>
        <form className="nav__search">
          <button className="nav__search-btn">
            <svg>
              <use xlinkHref="img/icons.svg#icon-search" />
            </svg>
          </button>
          <input
            type="text"
            placeholder="Search tours"
            className="nav__search-input"
          />
        </form>
      </nav>
      <div className="header__logo">
        <img src={logo} alt="Natours logo" />
      </div>
      <nav className="nav nav--user">
        {user ? (
          <Fragment>
            <div onClick={logout} className="nav__el nav__el--logout">
              Logout
            </div>
            <Link to="/me" className="nav__el">
              <img
                src={`${axios.defaults.params.mediaURL}/img/users/${user.photo}`}
                alt=""
                className="nav__user-img"
              />
              <span>{user.name.split(" ")[0]}</span>
            </Link>
          </Fragment>
        ) : (
          <Fragment>
            <Link to="/login">
              <button className="nav__el">Log in</button>
            </Link>
            <button className="nav__el nav__el--cta">Sign up</button>
          </Fragment>
        )}
      </nav>
    </header>
  );
}
