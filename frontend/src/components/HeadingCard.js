// React Imports
import React from 'react';
// Custom Styling
import '../styles/components/HeadingCard.css'

const HeadingCard = ({ line_1, line_2 }) => {
    return (
        <div className="headingCard">
            <h3>{line_1}</h3>
            <p>{line_2}</p>
        </div>
    );
};

export default HeadingCard;