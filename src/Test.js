import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Test = () => {
    const [errors, setErrors] = useState({});

    const proxyurl = 'https://cors-anywhere.herokuapp.com/';
    const url = 'https://api.realtor.ca/Listing.svc/PropertySearch_Post';
    const options = {
        CultureId: 0,
        ApplicationId: 37,
        PropertySearchTypeId: 1,
        LongitudeMin: -79.6758985519409,
        LongitudeMax: -79.6079635620117,
        LatitudeMin: 43.57601549736786,
        LatitudeMax: 43.602250137362276,
        PriceMin: 100000,
        PriceMax: 1000000,
        RecordsPerPage: 100,
        // TotalPage: 45,
        // Pins: 438,
        // CurrentPage: 1,
    };

    useEffect(async () => {
        const res = await axios({
            method: 'post',
            url: proxyurl + url,
            headers: {},
            form: options,
            json: true,
        });

        console.log(res.data);
        setErrors(res.data.ErrorCode);
    }, []);

    return (
        <ul>
            <li>{errors.Description}</li>
            <li>{errors.Id}</li>
            <li>{errors.ProductName}</li>
        </ul>
        );
};

export default Test;
