import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/components/SidebarOption.css';

// onHover turn Blue
// pass component as prop: pass it an icon with styling, text and es6

function SidebarOption({ to, exact, text, Icon }) {
    return (
        <NavLink className="sidebarOption" exact={exact} to={to} activeClassName="sidebarOption--active">
            <Icon />
            <h2>{text}</h2>
        </NavLink>
    );
};

export default SidebarOption;
