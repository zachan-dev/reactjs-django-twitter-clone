import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/components/Profile.css';
import APIHelper from '../helpers/api';
import MathHelper from '../helpers/math';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Button from '@material-ui/core/Button';
import moment from 'moment-timezone';
import DateRangeIcon from '@material-ui/icons/DateRange';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
// Dialog
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
// Fields
import TextField from '@material-ui/core/TextField';
import { MuiPickersUtilsProvider, KeyboardDatePicker, } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { withStyles } from "@material-ui/core/styles";

function Profile({ classes }) {
    const navigate = useNavigate();
    const { username } = useParams();
    const [profileUser, setProfileUser] = useState({});
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editBirthDate, setEditBirthDate] = useState(null);

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
            });
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

    return (
        <div className="profile">
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
                                <Button variant="outlined" size="medium" onClick={handleClickEditModalOpen}>Edit Profile</Button>
                            </div>
                            <h2>{profileUser.display_name}</h2>
                            <p className="profile__info__username">@{profileUser.username}</p>
                            <p className="profile__info__bio">{profileUser.bio}</p>
                            <p className="profile__info__dateJoined">
                                <DateRangeIcon className="profile__info__dateJoinedIcon" size="small"/>
                                <span>Joined <time dateTime={profileUser.date_joined}>
                                    {moment(profileUser.date_joined).tz(moment.tz.guess()).format('MMM YYYY')}
                                </time></span>
                            </p>
                        </div>
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
                        <div className="profile__warning">
                            <h3>This account doesn’t exist</h3>
                            <p>Try searching for another.</p>
                        </div>
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
