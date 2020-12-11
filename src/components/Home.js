import React from 'react';
import './Home.css';
import tower from '../img/tower.png';
import { Container, Row, Col } from 'react-bootstrap';

const Home = () => {
    return (
        <div className="about">
            <Container>
                <Row>
                    <Col md={6}>
                        <img src={tower} alt="tower" />
                    </Col>
                    <Col md={6}>
                        <h3>House Price Valuations Made Easy!</h3>
                        <div class="search">
                            <input
                                type="text"
                                class="searchTerm"
                                placeholder="Search City, Neighbourhood, or Address"
                            />
                            <button type="submit" class="searchButton">
                                Go
                            </button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Home;
