// React Imports
import React, { useState } from 'react';
// Material UI Imports
//// Core
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
//// Icons
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import CloseIcon from '@material-ui/icons/Close';
import PersonAddOutlinedIcon from '@material-ui/icons/PersonAddOutlined';
import PersonAddDisabledOutlinedIcon from '@material-ui/icons/PersonAddDisabledOutlined';
// Custom Components
import Tweetbox from './Tweetbox';
// Custom Helpers
import APIHelper from '../helpers/api'
// Custom Styling
import '../styles/components/MoreButton.css'

const StyledMenu = withStyles({
    paper: {
      border: '1px solid #d3d4d5',
    },
})((props) => (
    <Menu
      elevation={0}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      {...props}
    />
));

function MoreButton({ tweetUserID, avatar, text, image, tweet, fetchPosts, currentUserID }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [delModalOpen, setDelModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);

    {/** More Button Menu */}
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    
    {/** Del Button Dialog */}
    const handleClickDelModalOpen = () => {
        setDelModalOpen(true);
    };
    const handleDelModalClose = () => {
        setDelModalOpen(false);
    };
    const handlePrimaryDelete = () => {
        handleClose();
        // pop up modal to ask if sure to delete
        handleClickDelModalOpen();
    };
    const handleSecondaryDelete = () => {
        handleDelModalClose();
        APIHelper.deleteTweet(tweet)
            .then((data) => {
                if (APIHelper.type(data) === "Object" && data.error) {
                    return console.error(data.error);
                }
                fetchPosts();
                fetchPosts(true);
            });
    };

    {/** Edit Button Dialog */}
    const handleClickEditModalOpen = () => {
        setEditModalOpen(true);
    };
    const handleEditModalClose = () => {
        setEditModalOpen(false);
    };
    const handlePrimaryEdit = () => {
        handleClose();
        // pop up modal to edit post
        handleClickEditModalOpen();
    };

    return (
        <div className="moreButton">
            <Tooltip title="More" aria-label="more">
            <MoreHorizIcon
                aria-controls="more-menu"
                aria-haspopup="true"
                className={anchorEl ? "moreButton__icon is-active" : "moreButton__icon"}
                fontSize="small"
                onClick={handleClick}
            />
            </Tooltip>
            <StyledMenu
                id="more-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {/** Current User = Tweet Owner */}
                {tweetUserID === currentUserID ?
                    <div>
                        <MenuItem onClick={handlePrimaryDelete}>
                            <ListItemIcon>
                                <DeleteForeverOutlinedIcon fontSize="small" color="secondary"/>
                            </ListItemIcon>
                            <ListItemText primary="Delete" className="moreButton__delete"/>
                        </MenuItem>
                        <MenuItem onClick={handlePrimaryEdit}>
                            <ListItemIcon>
                                <EditOutlinedIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Edit" />
                        </MenuItem>
                    </div>
                    :
                    <div>
                        <MenuItem>
                            <ListItemIcon>
                                <PersonAddOutlinedIcon fontSize="small"/>
                            </ListItemIcon>
                            <ListItemText primary="Follow" />
                        </MenuItem>
                        <MenuItem>
                            <ListItemIcon>
                                <PersonAddDisabledOutlinedIcon fontSize="small" color="secondary"/>
                            </ListItemIcon>
                            <ListItemText primary="Unfollow" className="moreButton__delete"/>
                        </MenuItem>
                    </div>
                }
            </StyledMenu>

            {/** Delete Dialog  */}
            <Dialog
                open={delModalOpen}
                onClose={handleDelModalClose}
                aria-labelledby="del-dialog-title"
                aria-describedby="del-dialog-description"
            >
                <DialogTitle id="del-dialog-title">{"Delete Tweet?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="del-dialog-description">
                        This can’t be undone and it will be removed from your profile, the timeline of any accounts that follow you, and from Twitter search results. 
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDelModalClose} color="primary" autoFocus>
                        Cancel
                    </Button>
                    <Button onClick={handleSecondaryDelete} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/** Edit Dialog  */}
            <Dialog
                className="moreButton__editDialog"
                open={editModalOpen}
                onClose={handleEditModalClose}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle className="moreButton__editDialog__title">
                    <IconButton className="moreButton__editDialog__closeButton" onClick={handleEditModalClose}>
                        <CloseIcon />
                    </IconButton>
                    <span>Edit Tweet</span>
                </DialogTitle>
                <DialogContent dividers className="moreButton__editDialog__content">
                    <Tweetbox isEditMode={true} avatar={avatar} fetchPosts={fetchPosts} initText={text} initImage={image} tweetID={tweet} handleEditModalClose={handleEditModalClose} />
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default MoreButton;