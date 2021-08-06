// rfce: useful snippet
import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/components/Sidebar.css';
import SidebarOption from './SidebarOption';
/** Icons */
import TwitterIcon from '@material-ui/icons/Twitter';
import HomeIcon from '@material-ui/icons/Home';
import SearchIcon from '@material-ui/icons/Search';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import ListAltIcon from '@material-ui/icons/ListAlt';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
/** Button */
import { Button } from '@material-ui/core';

function Sidebar() {
    return (
        <div className="sidebar">
            {/* Twitter icon */}
            <NavLink className="sidebar__twitterIcon__navLink" exact to='/'>
                <TwitterIcon className="sidebar__twitterIcon" />
            </NavLink>

            {/* SidebarOption */}
            <SidebarOption Icon={HomeIcon} text="Home" to="/" exact={true} />
            <SidebarOption Icon={SearchIcon} text="Explore" to="/search" exact={false}  />
            <SidebarOption Icon={NotificationsNoneIcon} text="Notifications" to="/notifications" exact={false} />
            <SidebarOption Icon={MailOutlineIcon} text="Messages" to="/messages" exact={false} />
            <SidebarOption Icon={BookmarkBorderIcon} text="Bookmarks" to="/bookmarks" exact={false} />
            <SidebarOption Icon={ListAltIcon} text="Lists" to="/lists" exact={false} />
            <SidebarOption Icon={PermIdentityIcon} text="Profile" to="/profile" exact={false} />
            <SidebarOption Icon={MoreHorizIcon} text="More" to="/more" exact={false} />

            {/* Button -> Tweet */}
            <Button variant="outlined" className="sidebar__tweet" fullWidth>Tweet</Button>
        </div>
    );
};

export default Sidebar;
