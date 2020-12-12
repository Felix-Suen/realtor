import React, { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import './Style.css';
import { Container, Row, Col } from 'react-bootstrap';

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
                            className="marker"
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
                        latitude={parseFloat(
                            selectedHouse.Property.Address.Latitude
                        )}
                        longitude={parseFloat(
                            selectedHouse.Property.Address.Longitude
                        )}
                        onClose={() => {
                            setSelectedHouse(null);
                        }}
                    >
                        <div className="popup">
                            <b>{selectedHouse.Property.Address.AddressText}</b>
                            <Container>
                                <Row>
                                    <Col>
                                        <p>
                                            <b>Price: </b>
                                            {selectedHouse.Property.Price}
                                            <br />
                                            <b>Type: </b>
                                            {selectedHouse.Property.Type}
                                            <br />
                                            <b>Number of Bedrooms: </b>
                                            {selectedHouse.Building.Bedrooms}
                                        </p>
                                    </Col>
                                    <Col>
                                        <img
                                            src={
                                                selectedHouse.Property.Photo[0]
                                                    .MedResPath
                                            }
                                        />
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                    </Popup>
                ) : null}
            </ReactMapGL>
        </div>
    );
};

export default Map;
