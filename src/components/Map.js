import React, { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import './Style.css';

const Map = ({ content, coords }) => {
    const [viewport, setViewport] = useState({
        latitude: coords.Latitude,
        longitude: coords.Longitude,
        zoom: 13,
        width: '55vw',
        height: '80vh',
    });
    const [selectedHouse, setSelectedHouse] = useState(null);

    useEffect(() => {
        setViewport((prevState) => ({
            ...prevState,
            latitude: coords.Latitude,
            longitude: coords.Longitude,
        }));
    }, [coords]);

    return (
        <div>
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
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setSelectedHouse(house);
                            }}
                        >
                            {house.Property.Price}
                        </button>
                    </Marker>
                ))}

                {selectedHouse ? (
                    <Popup
                        latitude={parseFloat(selectedHouse.Property.Address.Latitude)}
                        longitude={parseFloat(selectedHouse.Property.Address.Longitude)}
                        onClose={() => {
                            setSelectedHouse(null);
                        }}
                    >
                        <div>
                            <h4>{selectedHouse.Property.Address.AddressText}</h4>
                            <p><b>Price: </b>{selectedHouse.Property.Price}</p>
                            <p><b>Type: </b>{selectedHouse.Property.Type}</p>
                            <p><b>Number of Bedrooms: </b>{selectedHouse.Building.Bedrooms}</p>
                        </div>
                    </Popup>
                ) : null}
            </ReactMapGL>
        </div>
    );
};

export default Map;