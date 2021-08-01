import React from 'react';
import '../styles/components/SidebarOption.css';

// onHover turn Blue
// pass component as prop: pass it an icon with styling, text and es6

function SidebarOption({ active, text, Icon }) {
    return (
        <div className={`sidebarOption ${active && 'sidebarOption--active'}`}>
            <Icon />
            <h2>{text}</h2>
        </div>
    );
};

export default SidebarOption;
