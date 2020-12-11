import React from 'react';
import './Style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faLaptopCode, faNetworkWired, faBook, faBicycle} from '@fortawesome/free-solid-svg-icons';

const Intro = () => {
    return (
        <div className="intro">
            <FontAwesomeIcon icon={faLaptopCode} />{' '}
            <FontAwesomeIcon icon={faNetworkWired} />{' '}
            <FontAwesomeIcon icon={faBook} />{' '}
            <FontAwesomeIcon icon={faBicycle} />
        </div>
    );
};

export default Intro;
