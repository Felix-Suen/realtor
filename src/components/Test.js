import React, { useState, useEffect } from 'react';
import axios from 'axios';
import qs from 'querystring';
import Map from './Map';
import Intro from './Intro';
import './Style.css';
import tower from '../img/tower.png';
import { Container, Row, Col } from 'react-bootstrap';

const Test = () => {
    const [errors, setErrors] = useState({});
    const [content, setContent] = useState([]);
    const [coords, setCoords] = useState({
        Longitude: -79.61436356,
        Latitude: 43.60015014,
    });

    // default parameters to pass in
    const [options, setOptions] = useState({
        LongitudeMin: -79.6758985519409,
        LongitudeMax: -79.6079635620117,
        LatitudeMin: 43.57601549736786,
        LatitudeMax: 43.602250137362276,
        PriceMin: 100000,
        PriceMax: 100000000,
        RecordsPerPage: 500,
        CultureID: 1,
        ApplicationId: 37,
    });
    const [address, setAddress] = useState({
        Address: '',
    });
    const [isAddress, setIsAddress] = useState(false);

    useEffect(() => {
        if (address.Address != '') {
            setIsAddress(true);
        } else {
            setIsAddress(false);
        }
    }, [address]);

    // const proxy = 'https://cors-anywhere.herokuapp.com/';
    const url = 'https://api.realtor.ca/Listing.svc/PropertySearch_Post';
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    };

    // function that calls the api
    async function fetchData(opts) {
        const res = await axios.post(url, qs.stringify(opts), config);

        console.log(res.data);
        setErrors(res.data.ErrorCode);
        setContent(res.data.Results);
    }

    async function findGeoCode(address) {
        const res = await axios.get(
            'https://api.mapbox.com/geocoding/v5/mapbox.places/' +
                encodeURIComponent(address) +
                '.json?access_token=pk.eyJ1IjoiZmVuZy1ndW8iLCJhIjoiY2tpZzZlbDR0MGNpZzJxcXBodWZ3b3M3cSJ9.SpRJgUpSDBkD_V29dUtpLg',
            { params: { limit: 1 } }
        );
        // console.log(res.data.features[0].geometry.coordinates);
        let long = res.data.features[0].geometry.coordinates[0];
        let lat = res.data.features[0].geometry.coordinates[1];
        setCoords((prevState) => ({
            ...prevState,
            Longitude: long,
            Latitude: lat,
        }));
        setOptions((prevState) => ({
            ...prevState,
            LongitudeMax: long + 0.0064,
            LongitudeMin: long - 0.0064,
            LatitudeMax: lat + 0.0021,
            LatitudeMin: lat - 0.0021,
        }));
    }

    // update the data whenever a parameter gets changed
    useEffect(async () => {
        fetchData(options);
    }, [options]);

    // Filter that changes parameters
    const onChange = (e) => {
        const { name, value } = e.target;
        setOptions((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const onChangeAddress = (e) => {
        const { value } = e.target;
        setAddress((prevState) => ({
            ...prevState,
            Address: value,
        }));
        findGeoCode(address.Address);
    };

    return (
        <div className="everything">
            <div className="about">
                <Container>
                    <Row>
                        <Col md={6}>
                            <img src={tower} alt="tower" />
                        </Col>
                        <Col md={6}>
                            <h3>House Price Valuations Made Easy!</h3>
                            <form className="search">
                                <input
                                    value={address.Address}
                                    type="text"
                                    onChange={onChangeAddress}
                                    name="Address"
                                    className="searchTerm"
                                    placeholder="Search City, Neighbourhood, or Address"
                                />
                                <button type="submit" className="searchButton">
                                    Go
                                </button>
                            </form>
                        </Col>
                    </Row>
                </Container>
                {isAddress ? (
                    <div style={{ textAlign: 'center' }}>
                        <form>
                            <br />
                            <br />
                            <label>Price Min: </label>
                            <input
                                value={options.PriceMin}
                                type="number"
                                onChange={onChange}
                                name="PriceMin"
                            />{' '}
                            <label>Price Max: </label>
                            <input
                                value={options.PriceMax}
                                type="number"
                                onChange={onChange}
                                name="PriceMax"
                            />{' '}
                            <label>Number of Records: </label>
                            <input
                                value={options.RecordsPerPage}
                                type="number"
                                onChange={onChange}
                                name="RecordsPerPage"
                            />
                            <br />
                            <br />
                            <div className="map">
                                <Map content={content} coords={coords} />
                            </div>
                            <br />
                            <br />
                        </form>
                        <table style={{ display: 'table', margin: '0 auto' }}>
                            <tr style={{ textAlign: 'left' }}>
                                <th>Entry</th>
                                <th>Address</th>
                                <th>Price</th>
                                <th>Type</th>
                                <th># Bedroom</th>
                            </tr>
                            {content.map((result, index) => (
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>
                                        {result.Property.Address.AddressText}
                                    </td>
                                    <td>{result.Property.Price}</td>
                                    <td>{result.Property.Type}</td>
                                    <td>{result.Building.Bedrooms}</td>
                                </tr>
                            ))}
                        </table>
                    </div>
                ) : (
                    <Intro />
                )}
            </div>
        </div>
    );
};

export default Test;
