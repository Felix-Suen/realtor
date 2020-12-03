import React, { useEffect, useState } from 'react';

const opts = {
    LongitudeMin: -79.6758985519409,
    LongitudeMax: -79.6079635620117,
    LatitudeMin: 43.57601549736786,
    LatitudeMax: 43.602250137362276,
    PriceMin: 100000,
    PriceMax: 1000000,
    RecordsPerPage: 100,
    CultureId: 1,
    ApplicationId: 37
    // TotalPage: 45,
    // Pins: 438,
    // CurrentPage: 1,
};

const Test = () => {
    
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);

    // Note: the empty deps array [] means
    // this useEffect will run once
    // similar to componentDidMount()
    useEffect(() => {
        fetch('https://api.realtor.ca/Listing.svc/PropertySearch_Post', {
            method: 'POST',
            body: JSON.stringify(opts)
        })
            .then((res) => res.json())
            .then(
                (result) => {
                    console.log(result);
                    setIsLoaded(true);
                    setItems(result);
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            );
    }, []);

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
            <ul>
                {items.map((item) => (
                    <li key={item.id}>
                        {item.name} {item.price}
                    </li>
                ))}
            </ul>
        );
    }
};

export default Test;
