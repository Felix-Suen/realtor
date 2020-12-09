import React, { useState } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import './App.css';

const Map = ({ content }) => {
    const [viewport, setViewport] = useState({
        latitude: 43.60015014,
        longitude: -79.61436356,
        zoom: 13,
        width: '60vw',
        height: '80vh',
    });

    return (
        <div className="map">
            <ReactMapGL
                {...viewport}
                mapboxApiAccessToken="pk.eyJ1IjoiZmVuZy1ndW8iLCJhIjoiY2tpZzZlbDR0MGNpZzJxcXBodWZ3b3M3cSJ9.SpRJgUpSDBkD_V29dUtpLg"
                mapStyle="mapbox://styles/feng-guo/ckigexbc5149t19o4ezx8zjug"
                onViewportChange={(viewport) => {
                    setViewport(viewport);
                }}
            >
                {content.map((house) => (
                    <Marker
                        key={house.Id}
                        latitude={parseFloat(house.Property.Address.Latitude)}
                        longitude={parseFloat(house.Property.Address.Longitude)}
                    >
                        <button>
                            {house.Property.Price}
                        </button>
                    </Marker>
                ))}
            </ReactMapGL>
        </div>
    );
};

export default Map;
