import React, { useState, useEffect, useRef, Fragment } from "react";
import ReactMapboxGl, {
  Layer,
  Feature,
  Marker,
  Popup,
  MapContext,
} from "react-mapbox-gl";
import pin from "../assets/img/pin.png";

export default function MapBox({ locations }) {
  // const [onteractive, setInteractive] = useState(locations);

  const Map = ReactMapboxGl({
    accessToken:
      "pk.eyJ1IjoiYW1pdGR0dSIsImEiOiJja2FpaXplenAwMTY4MnJwMXl1ZjJqM3I0In0.q5xG2iylpDGM8x6oOlLkWw",
    interactive: true,
  });

  return (
    <Map
      style="mapbox://styles/amitdtu/ckaik7lhj0jt71ir0l2ry9h7i"
      containerStyle={{
        height: "70vh",
        // width: "100vw",
      }}
      center={locations[0].coordinates}
      zoom={[3]}
      renderChildrenInPortal={true}
    >
      <Layer
        type="symbol"
        className="marker"
        layout={{ "icon-image": "hu-main-4" }}
      >
        {locations.map((loc, index) => (
          <Feature key={index} coordinates={loc.coordinates}></Feature>
        ))}
      </Layer>
      {locations.map((loc, index) => (
        <Popup
          onClick={() => console.log("hide me")}
          key={index}
          coordinates={loc.coordinates}
          className="popup"
          closeButton={true}
          closeOnClick={true}
        >
          {/* <div className={"icon"}>x</div> */}
          <p>{`Day ${loc.day}: ${loc.description}`}</p>
        </Popup>
      ))}
    </Map>
  );
}
