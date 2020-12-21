import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import MLR from 'ml-regression-multivariate-linear';

const CustomForm = ({ result, price }) => {
    const [custom, setCustom] = useState({
        type: '',
        beds: null,
        baths: null,
        size: null,
    });
    var customArray = [];
    const [predict, setPredict] = useState();
    const [predictLoading, setPredictLoading] = useState(false);

    const onChange = (e) => {
        setCustom({
            ...custom,
            [e.target.name]: e.target.value,
        });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (custom.type === 'House') customArray.push(0);
        else customArray.push(1);
        customArray.push(
            parseInt(custom.beds),
            parseInt(custom.baths),
            parseInt(custom.size / 10.764)
        );
        console.log(customArray);
        const mlr = new MLR(result, price);
        setPredict(Math.round(mlr.predict(customArray)));
        setPredictLoading(true);
    };

    return (
        <div>
            {!predictLoading ? (
                <Form onSubmit={(e) => onSubmit(e)}>
                    <Form.Group controlId="exampleForm.SelectCustom">
                        <Form.Label>Property Type</Form.Label>
                        <Form.Control
                            as="select"
                            custom
                            value={custom.type}
                            onChange={(e) => onChange(e)}
                            name="type"
                            required
                        >
                            <option>Apartment</option>
                            <option>House</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Number of Bedrooms</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter a Number"
                            value={custom.beds}
                            onChange={(e) => onChange(e)}
                            name="beds"
                            required
                            min="1"
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Number of Bathrooms</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter a Number"
                            value={custom.baths}
                            onChange={(e) => onChange(e)}
                            name="baths"
                            required
                            min="1"
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Property Size</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="In Square Feet"
                            value={custom.size}
                            onChange={(e) => onChange(e)}
                            name="size"
                            required
                            min="100"
                        />
                    </Form.Group>

                    <Button
                        style={{ backgroundColor: '#f3746f', border: 'none' }}
                        variant="primary"
                        type="submit"
                    >
                        Predict
                    </Button>
                </Form>
            ) : (
                <b>${predict.toLocaleString()}</b>
            )}
        </div>
    );
};

export default CustomForm;
