import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/img/logo-green.png";

export default function Footer() {
  return (
    <div className="footer">
      <div className="footer__logo">
        <img src={logo} alt="Natours logo" />
      </div>
      <ul className="footer__nav">
        <li>
          <Link to="#" />
          About us
        </li>
        <li>
          <Link to="#" />
          Download apps
        </li>
        <li>
          <Link to="#" />
          Become a guide
        </li>
        <li>
          <Link to="#" />
          Careers
        </li>
        <li>
          <Link to="#" />
          Contact
        </li>
      </ul>
      <p className="footer__copyright">
        © by Jonas Schmedtmann. All rights reserved.
      </p>
    </div>
  );
}
