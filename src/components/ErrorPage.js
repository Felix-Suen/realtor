import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import custom from '../img/custom.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faFrown} from '@fortawesome/free-regular-svg-icons';

const ErrorPage = () => {
    return (
        <div>
            <h3>Sorry, <FontAwesomeIcon icon={faFrown} /> not enough data in this area</h3>
            <Container>
                <Row>
                    <Col>
                        <img src={custom} alt='Error image' style={{ height: '250px', width: '250px' }}/>
                    </Col>
                    <Col>
                        <div style={{ padding: '20px', fontSize: '20px' }}>
                            <br/>
                            We are terribly sorry about this. <br />
                            There might not be enough data in this region. <br /><br />
                            please ensure the location is within <u>Ontario, Canada</u>. 
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default ErrorPage;