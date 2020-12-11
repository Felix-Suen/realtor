import React, { useState } from 'react';
import './Home.css';
import tower from '../img/tower.png';
import { Container, Row, Col } from 'react-bootstrap';
import Test from './Test';

const Home = () => {
    const [address, setAddress] = useState('');
    const [isAddress, setIsAddress] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault();
        if (address != '') {
            setIsAddress(true);
        }
    };

    return (
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
                                value={address}
                                type="text"
                                className="searchTerm"
                                onChange={e => setAddress(e.target.value)}
                                placeholder="Search City, Neighbourhood, or Address"
                            />
                            <button type="submit" className="searchButton">
                                Go
                            </button>
                        </form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Home;
