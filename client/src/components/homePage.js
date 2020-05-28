import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "./cards";
import axios from "axios";
// import Header from "./header";
// import Footer from "./footer";

export default function HomePage() {
  const [tours, setTours] = useState(null);
  useEffect(() => {
    const url = "/tours";
    console.log("going to get all tours");
    axios
      .get(url)
      .then((res) => {
        const {
          data: {
            data: { data },
          },
        } = res;
        console.log(data);
        setTours(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return <Card tours={tours} />;
}
