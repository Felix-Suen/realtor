import React from 'react';
import request from 'request-promise';
import querystring from 'querystring';
import MLR from 'ml-regression-multivariate-linear';

const DataDisplay = ({ content }) => {
    let city = /\|.*$/;

    var dimensions = [];
    var result = [];
    var options = {
        PropertyId: '',
        ReferenceNumber: '',
    };
    const clientSettingsDefaults = {
        CultureId: 1,
        ApplicationId: 37,
    };
    const proxy = 'https://realtor-proxy.herokuapp.com/';

    const getPropertyDetails = (options) => {
        let optionDefaults = {
            ...clientSettingsDefaults,
            HashCode: 0,
        };
        let params = {};
        let url = '';
        params = Object.assign(optionDefaults, options);
        url =
            proxy +
            'https://api.realtor.ca/Listing.svc/PropertyDetails?' +
            querystring.encode(params);
        return request({
            uri: url,
            json: true,
        });
    };

    dimensions = content.map((result) => {
        options.PropertyId = result.Id;
        options.ReferenceNumber = result.MlsNumber;
        return getPropertyDetails(options).then((house) => {
            try {
                var totalSpace = 0;
                var row = [];
                house.Building.Room.map((room) => {
                    var space = room.Dimension.split('x');
                    if (room.Dimension === '') space = 0;
                    else if (space[0].includes("'")) {
                        // imperial convert to metrics
                        space[0] = space[0].match(/\d+/g).map(Number);
                        space[1] = space[1].match(/\d+/g).map(Number);
                        if (space[0].length === 1)
                            space[0] = space[0][0] * 0.3048;
                        else
                            space[0] =
                                space[0][0] * 0.3048 + space[0][1] * 0.0254;
                        if (space[1].length === 1)
                            space[1] = space[1][0] * 0.3048;
                        else
                            space[1] =
                                space[1][0] * 0.3048 + space[1][1] * 0.0254;
                        space = space[0] * space[1];
                        space = Math.round(space * 100) / 100;
                    } else {
                        // metrics
                        space[0] = parseFloat(
                            space[0].replace(/([' 'm])/g, '')
                        );
                        space[1] = parseFloat(
                            space[1].replace(/([' 'm])/g, '')
                        );
                        space = space[0] * space[1];
                        space = Math.round(space * 100) / 100; // round to 2 decimals
                    }
                    totalSpace += space;
                    // return space;
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

                row.push(type);
                row.push(numBed);
                row.push(parseInt(house.Building.BathroomTotal));
                row.push(Math.round(totalSpace * 100) / 100);
                row.push(parseInt(house.Property.PriceUnformattedValue));
                // row.unshift(house.Property.Address.AddressText);
                return row;
            } catch (err) {
                console.error(err.message);
            }
        });
    });
    Promise.all(dimensions).then((dimensions) => {
        // filter out unnecessary rows
        result = dimensions.filter(
            (row) => row !== undefined && row[3] > 0 && row[3] < 300
        );

        // split the array for ML
        var price = [];
        result.map((house) => {
            var priceArray = [];
            priceArray.push(house[4]);
            price.push(priceArray);
            house.pop();
        });

        // ML
        const mlr = new MLR(result, price);

        // put it back into excel rows
        result.map((house, index) => {
            house.push(price[index][0]);
            var predict = mlr.predict(house)[0];
            predict = Math.round(predict * 100) / 100;
            house.push(predict);
        });
        console.log(result);
    });

    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{ display: 'table', margin: '0 auto' }}>
                <tbody>
                    <tr style={{ textAlign: 'left' }}>
                        <th>Index</th>
                        <th>Type</th>
                        <th># Bedroom</th>
                        <th># Bathroom</th>
                        <th>Total Space</th>
                        <th>Price</th>
                        <th>Predicted</th>
                    </tr>
                    {result.map((res, index) => (
                        <tr>
                            <td>{index + 1}</td>
                            <td>{res[0]}</td>
                            <td>{res[1]}</td>
                            <td>{res[2]}</td>
                            <td>{res[3]}</td>
                            <td>{res[4]}</td>
                            <td>{res[5]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataDisplay;
