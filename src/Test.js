import React, { useState, useEffect } from 'react';
import axios from 'axios';
import qs from 'querystring';
import './App.css';

const Test = () => {
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [content, setContent] = useState([]);

    const [coords, setCoords] = useState({
        Longitude: -79.61436356,
        Latitude: 43.60015014,
    })

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
        console.log(options);
        setErrors(res.data.ErrorCode);
        setIsLoading(false);
        setContent(res.data.Results);
    }

    // update the data whenever a parameter gets changed
    useEffect(async () => {
        fetchData(options);
    }, [options]);

    // Filter that changes parameters
    const onChange = e => {
        const { name, value } = e.target;
        setOptions(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const onChangeLong = e => {
        const { value } = e.target;
        setCoords(prevState => ({
            ...prevState,
            Longitude: value,
        }));
        setOptions(prevState => ({
            ...prevState,
            LongitudeMax: parseFloat(value + 0.0064),
            LongitudeMin: value - 0.0064,
        }));
    }

    const onChangeLat = e => {
        const { value } = e.target;
        setCoords(prevState => ({
            ...prevState,
            Latitude: value,
        }));
        setOptions(prevState => ({
            ...prevState,
            LatitudeMax: parseFloat(value + 0.0021),
            LatitudeMin: value - 0.0021,
        }));
    }

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

                        <label>Actual Longitude: </label>
                        <input 
                            value={coords.Longitude}
                            type='number'
                            onChange={onChangeLong}
                            name="Longitude"
                        />{" "}
                        <label>Actual Lattitude: </label>
                        <input 
                            value={coords.Latitude}
                            type='number'
                            onChange={onChangeLat}
                            name="Latitude"
                        /><br /><br />

                        <label>Longitude min: </label>
                        <input 
                            value={options.LongitudeMin}
                            type='number'
                            onChange={onChange}
                            name="LongitudeMin"
                        />{" "}
                        <label>Latitude min: </label>
                        <input 
                            value={options.LatitudeMin}
                            type='number'
                            onChange={onChange}
                            name="LatitudeMin"
                        /><br /><br />
                        <label>Longitude max: </label>
                        <input 
                            value={options.LongitudeMax}
                            type='number'
                            onChange={onChange}
                            name="LongitudeMax"
                        />{" "}
                        <label>Latitude max: </label>
                        <input 
                            value={options.LatitudeMax}
                            type='number'
                            onChange={onChange}
                            name="LatitudeMax"
                        />
                        <br /><br />

                        <label>Price Min: </label>
                        <input 
                            value={options.PriceMin}
                            type='number'
                            onChange={onChange}
                            name="PriceMin"
                        />{" "}
                        <label>Price Max: </label>
                        <input 
                            value={options.PriceMax}
                            type='number'
                            onChange={onChange}
                            name="PriceMax"
                        />{" "}
                        <label>Number of Records: </label>
                        <input 
                            value={options.RecordsPerPage}
                            type='number'
                            onChange={onChange}
                            name="RecordsPerPage"
                        />
                        <br /><br />
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
