import React from 'react';
import axios from 'axios';
import querystring from 'querystring';

const DataDisplay = ({ content }) => {
    let city = /\|.*$/;
    const proxy = 'https://realtor-proxy.herokuapp.com/';

    var options = {
        PropertyId: '',
        ReferenceNumber: '',
        HashCode: 0,
        CultureId: 1,
        ApplicationId: 37,
    };

    content.map(async (result) => {
        options.PropertyId = result.Id;
        options.ReferenceNumber = result.MlsNumber;
        const res = await axios.get(proxy + 'https://api.realtor.ca/Listing.svc/PropertyDetails?' + querystring.encode(options));
        console.log(res);
    });

    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{ display: 'table', margin: '0 auto' }}>
                <tbody>
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
                                {result.Property.Address.AddressText.replace(
                                    city,
                                    ''
                                )}
                            </td>
                            <td>{result.Property.Price}</td>
                            <td>{result.Property.Type}</td>
                            <td>{result.Building.Bedrooms}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataDisplay;
