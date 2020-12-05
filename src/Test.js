import React, { useState, useEffect } from 'react';
import axios from 'axios';
import qs from 'querystring';

const Test = () => {
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [content, setContent] = useState([]);

    // const proxyurl = 'https://cors-anywhere.herokuapp.com/';
    const url = 'https://api.realtor.ca/Listing.svc/PropertySearch_Post';
    const options = {

        LongitudeMin: -79.6758985519409,
        LongitudeMax: -79.6079635620117,
        LatitudeMin: 43.57601549736786,
        LatitudeMax: 43.602250137362276,
        PriceMin: 100000,
        PriceMax: 1000000,
        RecordsPerPage: 100,
        CultureID: 1,
        ApplicationId: 37,
    };

    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    };

    useEffect(async () => {
        const res = await axios.post(
            url,
            qs.stringify(options),
            config
        );

        console.log(res.data);
        setErrors(res.data.ErrorCode);
        setIsLoading(false);
        setContent(res.data.Results);
    }, []);

    return (
        <div style={{ display: 'table', margin: '0 auto', padding: '20px' }}>
            {isLoading ? (
                <div>loading...</div>
            ) : (
                <div>loaded</div>
            )}
            {errors.Id}{" "}{errors.Description}
            

            <h1>Info</h1>

            <table>
                {content.map((result) => <tr>
                    <td style={{ paddingRight: '20px' }}>{result.Property.Address.AddressText}</td>
                    <td style={{ paddingRight: '20px' }}>{result.Property.Price}</td>
                    <td style={{ paddingRight: '20px' }}>{result.Property.Type}</td>
                    </tr>)}
            </table>
            
        </div>
    );
};

export default Test;
