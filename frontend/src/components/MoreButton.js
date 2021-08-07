import React, { useState } from 'react';
import '../styles/components/MoreButton.css'
import APIHelper from '../helpers/api'
// Core
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
// Icons
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
// Dialog
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Tweetbox from './Tweetbox';

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

function MoreButton({ avatar, text, image, tweet, fetchPosts }) {
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
                <MenuItem onClick={handlePrimaryDelete}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" color="secondary"/>
                    </ListItemIcon>
                    <ListItemText primary="Delete" className="moreButton__delete"/>
                </MenuItem>
                <MenuItem onClick={handlePrimaryEdit}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Edit" />
                </MenuItem>
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