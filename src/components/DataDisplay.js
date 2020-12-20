import React, { useState, useEffect } from 'react';
import request from 'request-promise';
import querystring from 'querystring';
import MLR from 'ml-regression-multivariate-linear';
import { Card, CardDeck } from 'react-bootstrap';

const DataDisplay = ({ content }) => {
    var dimensions = [];
    var result = [];
    var price = [];

    const [display, setDisplay] = useState([]);
    const [predicting, setPredicting] = useState(true);
    const [error, setError] = useState(false);
    const [apartment, setApartment] = useState(0);
    const [house, setHouse] = useState(0);

    var options = {
        PropertyId: '',
        ReferenceNumber: '',
    };
    const proxy = 'https://realtor-proxy.herokuapp.com/';

    const getPropertyDetails = (options) => {
        let optionDefaults = {
            CultureId: 1,
            ApplicationId: 37,
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

    const getData = (cont) => {
        dimensions = cont.map((result) => {
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

            if (result.length <= 5) setError(true);
            else {
                // split the array for ML
                result.map((house) => {
                    var priceArray = [];
                    priceArray.push(house[4]);
                    price.push(priceArray);
                    house.pop();
                });

                // ML
                const mlr = new MLR(result, price);
                setApartment(Math.round(mlr.predict([1, 2, 2, 60])));
                setHouse(Math.round(mlr.predict([0, 5, 4, 200])));

                // result.map((house, index) => {
                //     house.push(price[index][0]);
                //     var predict = mlr.predict(house)[0];
                //     predict = Math.round(predict);
                //     house.push(predict);
                // });
                // console.log(result);
                // setDisplay(result);
            }
            setPredicting(false);
        });
    };

    useEffect(() => {
        getData(content);
    }, [content]);

    return (
        <div style={{ display: 'table', margin: '0 auto', width: '70%' }}>
            {predicting ? (
                <p>predicting...</p>
            ) : error ? (
                <p>Insufficient Data for prediction</p>
            ) : (
                <CardDeck>
                    <Card>
                        <Card.Img variant="top" src="https://img.icons8.com/ios/452/apartment.png" />
                        <Card.Body>
                            <Card.Title>Apartment</Card.Title>
                            <Card.Text>{apartment}</Card.Text>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Img variant="top" src="https://www.flaticon.com/svg/static/icons/svg/25/25694.svg" />
                        <Card.Body>
                            <Card.Title>House</Card.Title>
                            <Card.Text>{house}</Card.Text>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Img variant="top" src="https://simpleicon.com/wp-content/uploads/setting2.png" />
                        <Card.Body>
                            <Card.Title>Custom Prediction</Card.Title>
                            <Card.Text>
                                
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </CardDeck>
            )}
        </div>
    );
};

export default DataDisplay;
