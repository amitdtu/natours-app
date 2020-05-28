import React, { useState, useEffect, Fragment } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import axios from 'axios';
import { Skeleton, message, Button } from 'antd';
import { StarOutlined } from '@ant-design/icons';
import MapBox from './mapbox';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_ivzDYVvN4znBx8cOXDqhNIfX00NTmk9Dry');

export default function TourDetails(props) {
  let location = useLocation();
  let history = useHistory();
  const [tour, setTour] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const bookingHandler = async () => {
    console.log(props);
    try {
      const tourId = location?.state?.tourId;
      if (!tourId) return message.error('tour id not found.');
      setIsLoading(true);

      const url = `/booking/checkout-session/${tourId}`;
      const { data } = await axios.get(url);
      const sessionId = data.session.id;
      console.log(data);

      const stripe = await stripePromise;

      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) message.error(error.message);
      setIsLoading(false);
    } catch (err) {
      console.log(err?.response?.data);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const tourId = location?.state?.tourId;
    if (!tourId) history.push('/');
    const url = `/tours/${tourId}`;

    axios.get(url).then((res) => {
      const {
        data: {
          data: { data },
        },
      } = res;
      console.log(data);
      setTour(data);
    });
  }, []);

  if (!tour) {
    return (
      <Fragment>
        <Skeleton active />
      </Fragment>
    );
  }

  return (
    <div>
      <section className="section-header">
        <div className="heading-box">
          <h1 className="heading-primary">
            <span>{tour.name}</span>
          </h1>
          <div className="heading-box__group">
            <div className="heading-box__detail">
              <svg className="heading-box__icon">
                <use xlinkHref="img/icons.svg#icon-clock" />
              </svg>
              <span className="heading-box__text">{tour.duration} days</span>
            </div>
            <div className="heading-box__detail">
              <svg className="heading-box__icon">
                <use xlinkHref="img/icons.svg#icon-map-pin" />
              </svg>
              <span className="heading-box__text">
                {tour.startLocation.address}
              </span>
            </div>
          </div>
        </div>
      </section>
      <section className="section-description">
        <div className="overview-box">
          <div>
            <div className="overview-box__group">
              <h2 className="heading-secondary ma-bt-lg">Quick facts</h2>
              <div className="overview-box__detail">
                <svg className="overview-box__icon">
                  <use xlinkHref="img/icons.svg#icon-calendar" />
                </svg>
                <span className="overview-box__label">Next date</span>
                <span className="overview-box__text">
                  {new Date(tour.startDates[0]).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                  })}
                </span>
              </div>
              <div className="overview-box__detail">
                <svg className="overview-box__icon">
                  <use xlinkHref="img/icons.svg#icon-trending-up" />
                </svg>
                <span className="overview-box__label">Difficulty</span>
                <span className="overview-box__text">{tour.difficulty}</span>
              </div>
              <div className="overview-box__detail">
                <svg className="overview-box__icon">
                  <use xlinkHref="img/icons.svg#icon-user" />
                </svg>
                <span className="overview-box__label">Participants</span>
                <span className="overview-box__text">
                  {tour.maxGroupSize} people
                </span>
              </div>
              <div className="overview-box__detail">
                <svg className="overview-box__icon">
                  <use xlinkHref="img/icons.svg#icon-star" />
                </svg>
                <span className="overview-box__label">Rating</span>
                <span className="overview-box__text">
                  {tour.ratingsAverage} / 5
                </span>
              </div>
            </div>
            <div className="overview-box__group">
              <h2 className="heading-secondary ma-bt-lg">Your tour guides</h2>
              {tour.guides.map((guide, index) => (
                <div key={index} className="overview-box__detail">
                  <img
                    // src={require(`../assets/img/users/${guide.photo}`)}
                    c={`${axios.defaults.params.mediaURL}/img/users/${guide.photo}`}
                    alt="Lead guide"
                    className="overview-box__img"
                  />
                  <span className="overview-box__label">{guide.role}</span>
                  <span className="overview-box__text">{guide.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="description-box">
          <h2 className="heading-secondary ma-bt-lg">About {tour.name} tour</h2>
          <p className="description__text">{tour.description}</p>
        </div>
      </section>
      <section className="section-pictures">
        {tour.images.map((img, index) => (
          <div key={index} className="picture-box">
            <img
              className="picture-box__img picture-box__img--1"
              src={`${axios.defaults.params.mediaURL}/img/tours/${img}`}
              alt="The Park Camper Tour 1"
            />
          </div>
        ))}
      </section>
      <section className="section-map">
        <MapBox locations={tour.locations} />
      </section>
      <section className="section-reviews">
        <div className="reviews">
          {tour.review.map((review, index) => (
            <div key={index} className="reviews__card">
              <div className="reviews__avatar">
                <img
                  src={`${axios.defaults.params.mediaURL}/img/users/${review.user.photo}`}
                  alt={review.user.name}
                  className="reviews__avatar-img"
                />
                <h6 className="reviews__user">{review.user.name}</h6>
              </div>
              <p className="reviews__text">{review.review}</p>
              <div className="reviews__rating">
                {[...Array(Math.round(review.rating))].map((el, index) => (
                  <StarOutlined key={index} style={{ color: '#55c57a' }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-cta">
        <div className="cta">
          <div className="cta__img cta__img--logo">
            <img
              src={require(`../assets/img/logo-white.png`)}
              alt="Natours logo"
            />
          </div>
          {/* {tour.images.map((img, index) => (
            
          ))} */}
          <img
            src={`${axios.defaults.params.mediaURL}/img/tours/${tour.images[0]}`}
            alt=""
            className={`cta__img cta__img--1`}
          />
          <img
            src={`${axios.defaults.params.mediaURL}/img/tours/${tour.images[1]}`}
            alt=""
            className="cta__img cta__img--2"
          />
          <div className="cta__content">
            <h2 className="heading-secondary">What are you waiting for?</h2>
            <p className="cta__text">
              {tour.duration} days. 1 adventure. Infinite memories. Make it
              yours today!
            </p>
            <Button
              onClick={bookingHandler}
              className="btn btn--green span-all-rows"
              loading={isLoading}
            >
              Book tour now!
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
