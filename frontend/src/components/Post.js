// React Imports
import React, { forwardRef, useState } from 'react'
import { Link } from 'react-router-dom'
// Internal Imports
import moment from 'moment-timezone';
// Material UI Imports
import Avatar from '@material-ui/core/Avatar';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import RepeatIcon from "@material-ui/icons/Repeat";
import PublishIcon from "@material-ui/icons/Publish";
import Tooltip from '@material-ui/core/Tooltip';
// Custom Components
import LikeButton from './LikeButton';
import MoreButton from './MoreButton';
// Custom Helpers
import MathHelper from '../helpers/math'
// Custom Styling
import '../styles/components/Post.css';

const Post = forwardRef((
    { 
        tweet,
        displayName, 
        userID, 
        username, 
        verified, 
        text, 
        image, 
        avatar,
        dateTime, 
        likes_count,
        liked,
        fetchPosts,
        currentUserID
    }, ref ) => {

    return (
        <div className="post" ref={ref}>
            <div className="post__avatar">
                <Avatar src={avatar} />
            </div>
            <div className="post__body">
                <div className="post__header">
                    <MoreButton className="post__more" tweetUserID={userID} avatar={avatar} text={text} image={image} tweet={tweet} fetchPosts={fetchPosts} currentUserID={currentUserID}/>
                    <div className="post__headerText">
                        <h3 style={{fontWeight: "normal"}}>
                            <Link className="post__profileLink" to={`/profile/${username}`}>
                                <b>{displayName}</b>
                            </Link>
                            <span style={{color: "grey"}}>
                                <span>
                                    {" "}{ verified && <VerifiedUserIcon className="post__badge" /> } @{username} 
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
                {image ?
                    <img 
                        src={image} 
                        alt=""
                        onError={(e)=>{e.target.onerror = null; e.target.src="/static/images/image_placeholder.png"}}
                    /> : null
                }
                <div className="post__footer">
                    <Tooltip title="Reply" aria-label="reply">
                        <ChatBubbleOutlineIcon fontSize="small" />
                    </Tooltip>
                    <Tooltip title="Retweet" aria-label="retweet">
                        <RepeatIcon fontSize="small" />
                    </Tooltip>
                    <div className="post__likeDiv">
                        <LikeButton tweet={tweet} liked={liked} fetchPosts={fetchPosts} />
                        {likes_count > 0 ? 
                            <span className="post__likeCount">{MathHelper.nFormatter(likes_count, 1)}</span> : 
                            <span className="post__likeCount__empty"></span>
                        }
                    </div>
                    <Tooltip title="Share" aria-label="share">
                        <PublishIcon fontSize="small" />
                    </Tooltip>
                </div>
            </div>
        </div>
    );
});

export default Post;
