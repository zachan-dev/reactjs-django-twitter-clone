import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/components/SidebarOption.css';

// onHover turn Blue
// pass component as prop: pass it an icon with styling, text and es6

function SidebarOption({ to, end, text, Icon }) {
    return (
        <NavLink className="sidebarOption" end={end} to={to}>
            <Icon />
            <h2>{text}</h2>
        </NavLink>
    );
};

export default SidebarOption;
