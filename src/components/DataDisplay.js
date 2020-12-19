import React, { useEffect } from 'react';
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

    var dimensions = [];

    const getData = async (opt) => {
        return await axios.get(
            proxy +
                'https://api.realtor.ca/Listing.svc/PropertyDetails?' +
                querystring.encode(opt)
        );;
    };

    content.map(async (result) => {
        options.PropertyId = result.Id;
        options.ReferenceNumber = result.MlsNumber;
        const house = await getData(options);
        try {
            var totalSpace = 0;
            var row = house.data.Building.Room.map((room) => {
                var space = room.Dimension.split('x');
                if (room.Dimension === '') space = 0;
                else if (space[0].includes("'")) {
                    // imperial convert to metrics
                    space[0] = space[0].match(/\d+/g).map(Number);
                    space[1] = space[1].match(/\d+/g).map(Number);
                    if (space[0].length === 1) space[0] = space[0][0] * 0.3048;
                    else space[0] = space[0][0] * 0.3048 + space[0][1] * 0.0254;
                    if (space[1].length === 1) space[1] = space[1][0] * 0.3048;
                    else space[1] = space[1][0] * 0.3048 + space[1][1] * 0.0254;
                    space = space[0] * space[1];
                    space = Math.round(space * 100) / 100;
                } else {
                    // metrics
                    space[0] = parseFloat(space[0].replace(/([' 'm])/g, ''));
                    space[1] = parseFloat(space[1].replace(/([' 'm])/g, ''));
                    space = space[0] * space[1];
                    space = Math.round(space * 100) / 100; // round to 2 decimals
                }
                totalSpace += space;
                return totalSpace;
            });

            var bedrooms = house.Building.Bedrooms.split(' + ');
            var numBed = 0;
            if (bedrooms.length > 1) {
                numBed = parseInt(bedrooms[0]) + parseInt(bedrooms[1]);
            } else {
                numBed = parseInt(bedrooms[0]);
            }

            var type = 0;
            if (house.Building.Type === 'Apartment') type = 1;

            row.push(house.Property.Address.AddressText);
            row.push(type);
            row.push(numBed);
            row.push(parseInt(house.Building.BathroomTotal));
            row.push(Math.round(totalSpace * 100) / 100);
            row.push(parseInt(house.Property.PriceUnformattedValue));
            console.log(row);
            dimensions.push(row);
        } catch (err) {
            console.error(err.message);
        }
    });
    // Promise.all(dimensions).then((dimensions) => {console.log(dimensions)});

    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{ display: 'table', margin: '0 auto' }}>
                <tbody>
                    <tr style={{ textAlign: 'left' }}>
                        <th>Entry</th>
                        <th>Address</th>
                        <th>Type</th>
                        <th># bed</th>
                        <th># bath</th>
                        <th>totalSpace</th>
                        <th>Price</th>
                    </tr>
                    {dimensions.map((result, index) => (
                        <tr>
                            <td>{index + 1}</td>
                            <td>{result[0]}</td>
                            <td>{result[1]}</td>
                            <td>{result[2]}</td>
                            <td>{result[3]}</td>
                            <td>{result[4]}</td>
                            <td>{result[5]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataDisplay;
