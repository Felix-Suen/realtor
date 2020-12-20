import React, { useState, useEffect } from 'react';
import axios from 'axios';
import qs from 'querystring';
import Map from './Map';
import Intro from './Intro';
import DataDisplay from './DataDisplay';
import './Style.css';
import tower from '../img/tower.png';
import { Container, Row, Col, Spinner } from 'react-bootstrap';

const Main = () => {
    const [content, setContent] = useState([]);
    const [coords, setCoords] = useState({
        Longitude: -79.61436356,
        Latitude: 43.60015014,
    });
    const [loading, setLoading] = useState(true);
    const [address, setAddress] = useState({
        Address: '',
    });
    const recordsMin = 10;
    const [attempts, setAttempts] = useState({
        Attempts: 0,
    });
    const [recordsLoading, setRecordsLoading] = useState(true);

    // default parameters to pass in
    const [options, setOptions] = useState({
        LongitudeMin: null,
        LongitudeMax: null,
        LatitudeMin: null,
        LatitudeMax: null,
        PriceMin: 100000,
        PriceMax: 100000000,
        RecordsPerPage: 500,
        CultureID: 1,
        ApplicationId: 37,
        PropertySearchTypeId: 1,
    });
    const [addressLoading, setAddressLoading] = useState(true);
    const [isAddress, setIsAddress] = useState(false);

    // toggle displayed map on and off
    useEffect(() => {
        if (address.Address === '') {
            setIsAddress(false);
        }
    }, [address]);

    const proxy = 'https://realtor-proxy.herokuapp.com/';
    const url = 'https://api.realtor.ca/Listing.svc/PropertySearch_Post';
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    };

    // function that calls the api
    async function fetchData(opts) {
        const res = await axios.post(proxy + url, qs.stringify(opts), config);
        console.log(res.data);
        setContent(res.data.Results);
        setLoading(false);
        setAddressLoading(true);
        // console.log(options.LongitudeMax, options.LongitudeMin, options.LatitudeMax, options.LatitudeMin);
    }

    async function findGeoCode(address) {
        const res = await axios.get(
            'https://api.mapbox.com/geocoding/v5/mapbox.places/' +
                encodeURIComponent(address) +
                '.json?access_token=pk.eyJ1IjoiZmVuZy1ndW8iLCJhIjoiY2tpZzZlbDR0MGNpZzJxcXBodWZ3b3M3cSJ9.SpRJgUpSDBkD_V29dUtpLg',
            { params: { limit: 1 } }
        );
        let long = res.data.features[0].geometry.coordinates[0];
        let lat = res.data.features[0].geometry.coordinates[1];
        setCoords((prevState) => ({
            ...prevState,
            Longitude: long,
            Latitude: lat,
        }));
        setOptions((prevState) => ({
            ...prevState,
            LongitudeMax: long + 0.007,
            LongitudeMin: long - 0.007,
            LatitudeMax: lat + 0.007,
            LatitudeMin: lat - 0.007,
        }));
        setAddressLoading(false);
    }

    async function checkRecordsMinReached(numRecords) {
        if (attempts.Attempts > 5 || numRecords > 500) {
            console.log('Max attempts reached or number too big');
            setAttempts((prevState) => ({
                ...prevState,
                Attempts: 0,
            }));
        } else {
            let test = await axios.post(
                proxy + url,
                qs.stringify(options),
                config
            );
            let records = test.data.Paging.TotalRecords;
            if (records < numRecords) {
                let longMax = options.LongitudeMax + 0.007;
                let longMin = options.LongitudeMin - 0.007;
                let latMax = options.LatitudeMax + 0.007;
                let latMin = options.LatitudeMin - 0.007;
                setOptions((prevState) => ({
                    ...prevState,
                    LongitudeMax: longMax,
                    LongitudeMin: longMin,
                    LatitudeMax: latMax,
                    LatitudeMin: latMin,
                }));
                setAttempts((prevState) => ({
                    ...prevState,
                    Attempts: attempts.Attempts + 1,
                }));
                return;
            }
        }
        setRecordsLoading(false);
    }

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
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        findGeoCode(address.Address);
        if (address.Address !== '') setIsAddress(true);
    };

    // fetch housing data whenever new address is loaded
    useEffect(() => {
        if (!addressLoading) checkRecordsMinReached(recordsMin);
    }, [addressLoading]);

    useEffect(() => {
        if (attempts.Attempts === 0) {
            return;
        }
        checkRecordsMinReached(recordsMin);
    }, [attempts]);

    useEffect(() => {
        if (!recordsLoading) {
            setRecordsLoading(true);
            fetchData(options);
        }
    }, [recordsLoading]);

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
                            <form className="search" onSubmit={onSubmit}>
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
                    loading ? (
                        <div className="loading">
                            <Spinner animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                            <p>Fetching Nearby Data</p>
                        </div>
                    ) : (
                        <div>
                            <form className="filter-form">
                                <br />
                                <br />
                                <label>Price Min: </label>
                                <input
                                    value={options.PriceMin}
                                    type="number"
                                    onChange={onChange}
                                    name="PriceMin"
                                    className="filter"
                                />{' '}
                                <label>Price Max: </label>
                                <input
                                    value={options.PriceMax}
                                    type="number"
                                    onChange={onChange}
                                    name="PriceMax"
                                    className="filter"
                                />
                                <br />
                                <br />
                            </form>

                            <div className="map">
                                <Map content={content} coords={coords} />
                            </div>

                            <br />
                            <br />

                            <DataDisplay content={content} />
                        </div>
                    )
                ) : (
                    <Intro />
                )}
            </div>
        </div>
    );
};

export default Main;
