import { Avatar } from '@material-ui/core';
import React, { forwardRef } from 'react'
import '../styles/components/Post.css';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import RepeatIcon from "@material-ui/icons/Repeat";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import PublishIcon from "@material-ui/icons/Publish";
import moment from 'moment-timezone';

const Post = forwardRef((
    { 
        displayName, 
        username, 
        verified, 
        text, 
        image, 
        avatar,
        dateTime, 
    }, ref ) => {
    return (
        <div className="post" ref={ref}>
            <div className="post__avatar">
                <Avatar src={avatar} />
            </div>
            <div className="post__body">
                <div className="post__header">
                    <div className="post__headerText">
                        <h3 style={{fontWeight: "normal"}}>
                            <b>{displayName}{" "}</b>
                            <span style={{color: "grey"}}>
                                <span>
                                    { verified && <VerifiedUserIcon className="post__badge" /> } @{username} 
                                </span>
                                <span> · </span>
                                <time dateTime={dateTime}>{moment(dateTime).tz(moment.tz.guess()).format('hh:mm A, DD MMM YYYY')}</time>
                            </span>
                        </h3>
                    </div>
                    <div className="post__headerDescription">
                        <p>{text}</p>
                    </div>
                </div>
                <img 
                    src={image} 
                    alt=""
                />
                <div className="post__footer">
                    <ChatBubbleOutlineIcon fontSize="small" />
                    <RepeatIcon fontSize="small" />
                    <FavoriteIcon fontSize="small" color="secondary" />
                    <PublishIcon fontSize="small" />
                </div>
            </div>
        </div>
    );
});

export default Post;
