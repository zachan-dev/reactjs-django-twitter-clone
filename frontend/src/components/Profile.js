// React Imports
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// Internal Imports
import moment from 'moment-timezone';
import MomentUtils from '@date-io/moment';
// Material UI Imports
//// Core
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { withStyles } from "@material-ui/core/styles";
//// Pickers
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
//// Icons
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import LinkIcon from '@material-ui/icons/Link';
import DateRangeIcon from '@material-ui/icons/DateRange';
import CloseIcon from '@material-ui/icons/Close';
// Custom Components
import ProfileTweets from './ProfileTweets'
import HeadingCard from './HeadingCard'
// Custom Helpers
import APIHelper from '../helpers/api';
import MathHelper from '../helpers/math';
// Custom Styling
import '../styles/components/Profile.css';

function Profile({ user, classes }) {
    const navigate = useNavigate();
    const { username } = useParams();
    const [profileUser, setProfileUser] = useState({});
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editBirthDate, setEditBirthDate] = useState(null);
    const [unfollowModalOpen, setUnfollowModalOpen] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);

    const loadUserFollowed = (userId) => {
        APIHelper.isUserFollowedByMe(userId)
            .then(data => {
                if (APIHelper.type(data) === "Object" && data.error) {
                    console.error(data.error);
                }
                setIsFollowing(data);
            });
    };

    const loadUserProfile = () => {
        APIHelper.getUserInfoByUsername(username)
            .then(data => {
                if (APIHelper.type(data) === "Object" && data.error) {
                    console.error(data.error);
                }
                setProfileUser(data);
                if (profileUser.birth_date) {
                    setEditBirthDate(moment(profileUser.birth_date));
                }
                loadUserFollowed(profileUser.id);
            });
    };

    const handleScroll = (e) => {
        const top = e.target.scrollTop === 0;
        if (top) {
            loadUserProfile(); // only fetch when scroll to the top of feeds
        }
    };

    useEffect(() =>{ // componentWillMount
        loadUserProfile();
    }, []);

    const goBack = () => {
        navigate(-1);
    };

    {/** Edit Button Dialog */}
    const handleClickEditModalOpen = () => {
        setEditModalOpen(true);
    };
    const handleEditModalClose = () => {
        setEditModalOpen(false);
        setEditBirthDate(profileUser.birth_date ? moment(profileUser.birth_date) : null);
    };

    {/** Edit Birth Date Field */}
    const handleEditBirthDateChange = (date) => {
        setEditBirthDate(date ? moment(date) : null);
    };

    {/** Edit Form Submission */}
    const handleEditFormSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        const dataObj = Object.fromEntries(data.entries());
        if (dataObj.birth_date) {
            dataObj.birth_date = moment(dataObj.birth_date).format("YYYY-MM-DD");
        }
        if (dataObj.birth_date === '') {
            delete dataObj.birth_date;
        }
        APIHelper.updateUserInfo(dataObj).then(data => {
            if (APIHelper.type(data) === "Object" && data.error) {
                return console.error(data.error);
            }
            handleEditModalClose(); // close modal
            loadUserProfile();
        });
    };

    {/** Handle Follow/Unfollow button */}
    const handleClickFollow = () => {
        APIHelper.followUser(profileUser.id).then(data => {
            if (APIHelper.type(data) === "Object" && data.error) {
                return console.error(data.error);
            }
            // setIsFollowing(true);
            loadUserFollowed(profileUser.id);
        });
    };
    
    {/** Unfollow Button Dialog */}
    const handleClickUnfollowModalOpen = () => {
        setUnfollowModalOpen(true);
    };
    const handleUnfollowModalClose = () => {
        setUnfollowModalOpen(false);
    };
    const handlePrimaryUnfollow = () => {
        // pop up modal to ask if sure to delete
        handleClickUnfollowModalOpen();
    };
    const handleSecondaryUnfollow = () => {
        handleUnfollowModalClose();
        APIHelper.unfollowUser(profileUser.id)
            .then(data =>{
                if (APIHelper.type(data) === "Object" && data.error) {
                    return console.error(data.error);
                }
                // setIsFollowing(false);
                loadUserFollowed(profileUser.id);
            });
    };


    return (
        <div className="profile" onScroll={handleScroll}>
            {!profileUser.error && !profileUser.id ? 
                <div className="profile__loading"></div>
                :
                (profileUser.id ? 
                    // valid user
                    <div>
                        <div className="profile__header">
                            <ArrowBackIcon className="profile__backIcon" onClick={goBack}/>
                            <div className="profile__header__validUser">
                                <h2>{profileUser.display_name}</h2>
                                <div className="profile__header__tweetsNum">{MathHelper.nFormatter(profileUser.tweets.length, 1)} Tweets</div>
                            </div>
                        </div>
                        <div className="profile__photos">
                            <img className="profile__photos__bg" src={profileUser.header_photo} onError={(e)=>{e.target.onerror = null; e.target.src="/static/images/bg_grey.png"}}/>
                            <img className="profile__photos__photo" src={profileUser.photo} onError={(e)=>{e.target.onerror = null; e.target.src="/static/images/bg_lightgrey.png"}}/>
                        </div>
                        <div className="profile__info">
                            <div className="profile__info__editProfile">
                                {user.id === profileUser.id ?
                                    <Button className="profile__info__editProfile__outlinedBtn" name="sameUser" variant="outlined" size="medium" onClick={handleClickEditModalOpen}>Edit Profile</Button>
                                    : (!isFollowing ?
                                        <Button className="profile__info__editProfile__outlinedBtn" name="differentUser" variant="outlined" size="medium" onClick={handleClickFollow}>Follow</Button>
                                        :
                                        <Button className="profile__info__editProfile__btn" name="differentUser" size="medium" onClick={handlePrimaryUnfollow}>
                                            <span name="following">Following</span>
                                            <span name="unfollow" style={{display: 'none'}}>Unfollow</span>
                                        </Button>
                                      )
                                }
                            </div>
                            <h2>{profileUser.display_name}</h2>
                            <p className="profile__info__username">@{profileUser.username}</p>
                            <p className="profile__info__bio">{profileUser.bio}</p>
                            <p className="profile__info__miscellaneous">
                                {profileUser.location ?
                                    <span>
                                        <LocationOnOutlinedIcon className="profile__info__icons" size="small"/>
                                        <span className="profile__info__location">{profileUser.location}</span>
                                    </span>
                                    : null
                                }
                                {profileUser.website ?
                                    <span>
                                        <LinkIcon className="profile__info__icons" size="small"/>
                                        <a className="profile__info__website" href={profileUser.website}>{new URL(profileUser.website).hostname}</a>
                                    </span>
                                    : null
                                }
                                <span>
                                    <DateRangeIcon className="profile__info__icons" size="small"/>
                                    <span>Joined <time dateTime={profileUser.date_joined}>
                                        {moment(profileUser.date_joined).tz(moment.tz.guess()).format('MMM YYYY')}
                                    </time></span>
                                </span>
                            </p>
                            
                            <p className="profile__info__follows">
                                <span className="profile__info__followingsCount"><b>{profileUser.followings_count}</b> Following</span>
                                <span className="profile__info__followersCount"><b>{profileUser.followers_count}</b> Followers</span>
                            </p>
                        </div>
                        <ProfileTweets currentUser={user} profileUser={profileUser} loadUserProfile={loadUserProfile}/>
                                
                        {/** Unfollow Dialog */}
                        <Dialog
                            open={unfollowModalOpen}
                            onClose={handleUnfollowModalClose}
                            aria-labelledby="unfollow-dialog-title"
                            aria-describedby="unfollow-dialog-description"
                        >
                            <DialogTitle id="unfollow-dialog-title">{`Unfollow @${profileUser.username}?`}</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="unfollow-dialog-description">
                                    Their Tweets will no longer show up in your home timeline. You can still view their profile, unless their Tweets are protected. 
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleUnfollowModalClose} color="primary" autoFocus>
                                    Cancel
                                </Button>
                                <Button onClick={handleSecondaryUnfollow} color="secondary">
                                    Unfollow
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                    :
                    // user not found
                    <div>
                        <div className="profile__header">
                            <ArrowBackIcon className="profile__backIcon" onClick={goBack}/>
                            <div className="profile__header__invalidUser">
                                <h2>{"Profile"}</h2>
                                <div style={{fontSize: 5}}>&nbsp;</div>
                            </div>
                        </div>
                        <div className="profile__photos">
                            <img className="profile__photos__bg" src="/static/images/bg_grey.png" />
                            <img className="profile__photos__photo" src="/static/images/bg_lightgrey.png" />
                        </div>
                        <div className="profile__info">
                            <div className="profile__info__editProfile" style={{height: 40}}/>
                            <h2>@{username}</h2>
                            <div className="profile__info__editProfile" style={{height: 20}}/>
                        </div>
                        <Divider light />
                        <HeadingCard 
                            line_1="This account doesn’t exist" 
                            line_2="Try searching for another."
                        />
                    </div>
                )
            }

            {/** Edit Dialog  */}
            <Dialog
                className="profile__editDialog"
                open={editModalOpen}
                onClose={handleEditModalClose}
                fullWidth
                maxWidth="sm"
            >
                <form id="form__editProfile" onSubmit={handleEditFormSubmit}>
                    <DialogTitle className="profile__editDialog__title">
                        <IconButton className="profile__editDialog__closeButton" onClick={handleEditModalClose}>
                            <CloseIcon />
                        </IconButton>
                        <span>Edit profile</span>
                        <Button type="submit" className="profile__editDialog__saveButton" size="medium">Save</Button>
                    </DialogTitle>
                    <DialogContent dividers className="profile__editDialog__content">
                        <TextField 
                            id="profile__editForm__bgImage" 
                            name="header_photo"
                            label="Background Image URL" 
                            variant="outlined"
                            defaultValue={profileUser.header_photo}
                            InputLabelProps={{
                                classes: {
                                    root: classes.cssLabel,
                                    focused: classes.cssFocused
                                },
                            }}
                            InputProps={{
                                classes: {
                                    root: classes.cssOutlinedInput,
                                    focused: classes.cssFocused,
                                    notchedOutline: classes.notchedOutline
                                },
                            }}
                        />
                        <TextField 
                            id="profile__editForm__photo"
                            name="photo"
                            label="Avatar Photo URL" 
                            variant="outlined"
                            defaultValue={profileUser.photo}
                            InputLabelProps={{
                                classes: {
                                    root: classes.cssLabel,
                                    focused: classes.cssFocused
                                },
                            }}
                            InputProps={{
                                classes: {
                                    root: classes.cssOutlinedInput,
                                    focused: classes.cssFocused,
                                    notchedOutline: classes.notchedOutline
                                },
                            }}
                        />
                        <TextField
                            id="profile__editForm__displayName"
                            name="display_name"
                            label="Display Name" 
                            variant="outlined"
                            defaultValue={profileUser.display_name}
                            InputLabelProps={{
                                classes: {
                                    root: classes.cssLabel,
                                    focused: classes.cssFocused
                                },
                            }}
                            InputProps={{
                                classes: {
                                    root: classes.cssOutlinedInput,
                                    focused: classes.cssFocused,
                                    notchedOutline: classes.notchedOutline
                                },
                            }}
                            required
                        />
                        <TextField
                            id="profile__editForm__bio" 
                            name="bio"
                            label="Bio" 
                            variant="outlined"
                            defaultValue={profileUser.bio}
                            InputLabelProps={{
                                classes: {
                                    root: classes.cssLabel,
                                    focused: classes.cssFocused
                                },
                            }}
                            InputProps={{
                                classes: {
                                    root: classes.cssOutlinedInput,
                                    focused: classes.cssFocused,
                                    notchedOutline: classes.notchedOutline
                                },
                            }}
                        />
                        <TextField
                            id="profile__editForm__location" 
                            name="location"
                            label="Location" 
                            variant="outlined"
                            defaultValue={profileUser.location}
                            InputLabelProps={{
                                classes: {
                                    root: classes.cssLabel,
                                    focused: classes.cssFocused
                                },
                            }}
                            InputProps={{
                                classes: {
                                    root: classes.cssOutlinedInput,
                                    focused: classes.cssFocused,
                                    notchedOutline: classes.notchedOutline
                                },
                            }}
                        />
                        <TextField 
                            id="profile__editForm__website" 
                            name="website"
                            label="Website" 
                            variant="outlined"
                            defaultValue={profileUser.website}
                            InputLabelProps={{
                                classes: {
                                    root: classes.cssLabel,
                                    focused: classes.cssFocused
                                },
                            }}
                            InputProps={{
                                classes: {
                                    root: classes.cssOutlinedInput,
                                    focused: classes.cssFocused,
                                    notchedOutline: classes.notchedOutline
                                },
                            }}
                        />
                        <MuiPickersUtilsProvider utils={MomentUtils}>
                            <KeyboardDatePicker
                                disableToolbar
                                variant="inline"
                                inputVariant="outlined"
                                format="YYYY-MM-DD"
                                margin="normal"
                                id="profile__editForm__birthDate"
                                name="birth_date"
                                label="Birth date"
                                defaultValue={profileUser.birth_date ? moment(profileUser.birth_date) : null}
                                value={editBirthDate}
                                onChange={handleEditBirthDateChange}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                                InputLabelProps={{
                                    classes: {
                                        root: classes.cssLabel,
                                        focused: classes.cssFocused
                                    },
                                }}
                                InputProps={{
                                    classes: {
                                        root: classes.cssOutlinedInput,
                                        focused: classes.cssFocused,
                                        notchedOutline: classes.notchedOutline
                                    },
                                }}
                            />
                        </MuiPickersUtilsProvider>
                    </DialogContent>
                </form>
            </Dialog>
        </div>
    );
};

const textFieldStyles = theme => ({
    cssLabel: {
      color: "var(--twitter-grey)",
      "&.Mui-focused": {
        color: "var(--twitter-color)"
      }
    },
    cssOutlinedInput: {
        "&:not(hover):not($disabled):not($cssFocused):not($error) $notchedOutline": {
          borderColor: "var(--twitter-grey)"
        },
        "&:hover:not($disabled):not($cssFocused):not($error) $notchedOutline": {
          borderColor: "var(--twitter-grey)"
        },
        "&$cssFocused $notchedOutline": {
          borderColor: "var(--twitter-color)" //focused
        }
    },
    notchedOutline: {},
    cssFocused: {},
    disabled: {},
    error: {},
  });

export default withStyles(textFieldStyles)(Profile);
