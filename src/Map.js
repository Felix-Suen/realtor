import React, { useState } from 'react';
import ReactMapGL from 'react-map-gl';
import './App.css';

const Map = () => {
    const [viewport, setViewport] = useState({
        latitude: 43.6532,
        longitude: -79.3832,
        zoom: 12,
        width: '60vw',
        height: '80vh',
    });

    return (
        <div className="map">
            <ReactMapGL
                {...viewport}
                mapboxApiAccessToken="pk.eyJ1IjoiZmVuZy1ndW8iLCJhIjoiY2tpZzZlbDR0MGNpZzJxcXBodWZ3b3M3cSJ9.SpRJgUpSDBkD_V29dUtpLg"
                mapStyle="mapbox://styles/feng-guo/ckigexbc5149t19o4ezx8zjug"
                onViewportChange={viewport => {
                    setViewport(viewport);
                }}
            ></ReactMapGL>
        </div>
    );
};

export default Map;
