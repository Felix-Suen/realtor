import React, { useState, useEffect } from 'react';
import axios from 'axios';
import qs from 'querystring';
import Map from './Map';
import './App.css';

const Test = () => {
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(true);
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
        PriceMax: 1000000,
        RecordsPerPage: 100,
        CultureID: 1,
        ApplicationId: 37,
    });

    const [address, setAddress] = useState({
        Address: '216 Canyon Hill',
    });

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
        setIsLoading(false);
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

    const onChangeLong = (e) => {
        const { value } = e.target;
        setCoords((prevState) => ({
            ...prevState,
            Longitude: value,
        }));
        setOptions((prevState) => ({
            ...prevState,
            LongitudeMax: parseFloat(value + 0.0064),
            LongitudeMin: value - 0.0064,
        }));
    };

    const onChangeLat = (e) => {
        const { value } = e.target;
        setCoords((prevState) => ({
            ...prevState,
            Latitude: value,
        }));
        setOptions((prevState) => ({
            ...prevState,
            LatitudeMax: parseFloat(value + 0.0021),
            LatitudeMin: value - 0.0021,
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

    // const onSubmit = e => {
    //     e.preventDefault();
    //     fetchData(options);
    // }

    return (
        <div style={{ display: 'table', margin: '0 auto', padding: '20px' }}>
            {isLoading ? (
                <div>loading...</div>
            ) : (
                <div>
                    <div>loaded</div>
                    {errors.Id} {errors.Description}
                    <h1>Info</h1>
                    <form>
                        <label>Address: </label>
                        <input
                            value={address.Address}
                            type="text"
                            onChange={onChangeAddress}
                            name="Address"
                        />
                        <label>Actual Longitude: </label>
                        <input
                            value={coords.Longitude}
                            type="number"
                            onChange={onChangeLong}
                            name="Longitude"
                        />{' '}
                        <label>Actual Latitude: </label>
                        <input
                            value={coords.Latitude}
                            type="number"
                            onChange={onChangeLat}
                            name="Latitude"
                        />
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
                        <Map content={content} coords={coords}/>
                        <br />
                        <br />
                    </form>
                    <table>
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
                                <td>{result.Property.Address.AddressText}</td>
                                <td>{result.Property.Price}</td>
                                <td>{result.Property.Type}</td>
                                <td>{result.Building.Bedrooms}</td>
                            </tr>
                        ))}
                    </table>
                </div>
            )}
        </div>
    );
};

export default Test;
