// React Imports
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
// Material UI Imports
//// Cores
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
//// Icons
import TwitterIcon from '@material-ui/icons/Twitter';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import SearchIcon from '@material-ui/icons/Search';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import ListAltIcon from '@material-ui/icons/ListAlt';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import PostAddIcon from '@material-ui/icons/PostAdd';
import CloseIcon from '@material-ui/icons/Close';
// Custom Components
import SidebarOption from './SidebarOption';
import Tweetbox from './Tweetbox';
// Custom Styling
import '../styles/components/Sidebar.css';

function Sidebar({ user }) {
    const [tweetModalOpen, setTweetModalOpen] = useState(false);

    {/** Tweet Button Dialog */}
    const handleClickTweetModalOpen = () => {
        setTweetModalOpen(true);
    };
    const handleTweetModalClose = () => {
        setTweetModalOpen(false);
    };
    const handleClickTweetButton = () => {
        // pop up modal to create tweet
        handleClickTweetModalOpen();
    };

    return (
        <div className="sidebar">
            {/* Twitter icon */}
            <NavLink className="sidebar__twitterIcon__navLink" end to='/'>
                <TwitterIcon className="sidebar__twitterIcon" />
            </NavLink>

            {/* SidebarOption */}
            <SidebarOption Icon={HomeOutlinedIcon} text="Home" to="/" end={true} />
            <SidebarOption Icon={SearchIcon} text="Explore" to="/search" end={false}  />
            <SidebarOption Icon={NotificationsNoneIcon} text="Notifications" to="/notifications" end={false} />
            <SidebarOption Icon={MailOutlineIcon} text="Messages" to="/messages" end={false} />
            <SidebarOption Icon={BookmarkBorderIcon} text="Bookmarks" to="/bookmarks" end={false} />
            <SidebarOption Icon={ListAltIcon} text="Lists" to="/lists" end={false} />
            <SidebarOption Icon={PermIdentityIcon} text="Profile" to={`/profile/${user.username}`} end={false} />
            <SidebarOption Icon={MoreHorizIcon} text="More" to="/more" end={false} />

            {/* Button -> Tweet */}
            <Button variant="outlined" className="sidebar__tweet" fullWidth onClick={handleClickTweetButton}>
                <span className="sidebar__tweet__text">Tweet</span>
                <PostAddIcon className="sidebar__tweet__icon" />
            </Button>

            {/** Tweet Dialog  */}
            <Dialog
                className="sidebar__tweetDialog"
                open={tweetModalOpen}
                onClose={handleTweetModalClose}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle className="sidebar__tweetDialog__title">
                    <IconButton className="sidebar__tweetDialog__closeButton" onClick={handleTweetModalClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers className="sidebar__tweetDialog__content">
                    <Tweetbox isEditMode={false} avatar={user.photo} fetchPosts={handleTweetModalClose} handleEditModalClose={handleTweetModalClose} />
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Sidebar;

