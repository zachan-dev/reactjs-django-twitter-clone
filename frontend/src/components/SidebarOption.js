// React Imports
import React from 'react';
import { NavLink } from 'react-router-dom';
// Custom Styling
import '../styles/components/SidebarOption.css';

// onHover turn Blue
// pass component as prop: pass it an icon with styling, text and es6

function SidebarOption({ to, end, text, Icon }) {
    return (
        <NavLink className="sidebarOption" end={end} to={to}>
            <Icon className="sidebarOption__icon"/>
            <h2>{text}</h2>
        </NavLink>
    );
};

export default SidebarOption;
