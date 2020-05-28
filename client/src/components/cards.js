import React, { Fragment, useLocation } from "react";
import { Link } from "react-router-dom";
import { Skeleton } from "antd";
import axios from "axios";
// import logo from "../assets/img/tours";

export default function Card({ tours }) {
  // no tours (api is fetching...)
  if (!tours) {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    return (
      <main className="main">
        <div className="card-container">
          {arr.map((el, i) => (
            <Skeleton key={i} active width={"30%"} />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="main">
      <div className="card-container">
        {tours.map((tour, index) => (
          <div key={index} className="card">
            <div className="card__header">
              <div className="card__picture">
                <div className="card__picture-overlay">&nbsp;</div>
                <img
                  src={`${axios.defaults.params.mediaURL}/img/tours/${tour.imageCover}`}
                  alt="Tour 1"
                  className="card__picture-img"
                />
              </div>
              <h3 className="heading-tertirary">
                <span>{tour.name}</span>
              </h3>
            </div>
            <div className="card__details">
              <h4 className="card__sub-heading">
                {tour.difficulty} {tour.duration}-day tour
              </h4>
              <p className="card__text">{tour.summary}</p>
              <div className="card__data">
                <svg className="card__icon">
                  <use xlinkHref="img/icons.svg#icon-map-pin" />
                </svg>
                <span>{tour.startLocation.description}</span>
              </div>
              <div className="card__data">
                <svg className="card__icon">
                  <use xlinkHref="img/icons.svg#icon-calendar" />
                </svg>
                <span>
                  {new Date(tour.startDates[0]).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                  })}
                </span>
              </div>
              <div className="card__data">
                <svg className="card__icon">
                  <use xlinkHref="img/icons.svg#icon-flag" />
                </svg>
                <span>{tour.locations.length} stops</span>
              </div>
              <div className="card__data">
                <svg className="card__icon">
                  <use xlinkHref="img/icons.svg#icon-user" />
                </svg>
                <span>{tour.maxGroupSize} people</span>
              </div>
            </div>
            <div className="card__footer">
              <p>
                <span className="card__footer-value">${tour.price}</span>
                <span className="card__footer-text"> per person</span>
              </p>
              <p className="card__ratings">
                <span className="card__footer-value">
                  {tour.ratingsAverage}{" "}
                </span>
                <span className="card__footer-text">
                  rating ({tour.ratingsQuantity})
                </span>
              </p>
              <Link
                to={{ pathname: tour.slug, state: { tourId: tour._id } }}
                className="btn btn--green btn--small"
              >
                Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
