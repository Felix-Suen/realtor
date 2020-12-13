import React from 'react';

const DataDisplay = ({ content }) => {
    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{ display: 'table', margin: '0 auto' }}>
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
                        <td>{result.Property.Address.AddressText}</td>
                        <td>{result.Property.Price}</td>
                        <td>{result.Property.Type}</td>
                        <td>{result.Building.Bedrooms}</td>
                    </tr>
                ))}
            </table>
        </div>
    );
};

export default DataDisplay;