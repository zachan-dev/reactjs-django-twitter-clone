// React Imports
import React, { useState } from 'react';
// Components Imports
import TextareaAutosize from 'react-textarea-autosize';
// Material UI Imports
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
// Custom Helpers
import APIHelper from '../helpers/api';
// Custom Styling
import '../styles/components/Tweetbox.css';

function Tweetbox({ isEditMode, avatar, fetchPosts, initText='', initImage='', tweetID=null, handleEditModalClose=null }) {
    const [tweetMessage, setTweetMessage] = useState(initText);
    const [tweetImage, setTweetImage] = useState(initImage);

    const sendTweet = e => {
        e.preventDefault();
        
        if (isEditMode) {
            // edit mode
            if (tweetID) {
                APIHelper.editTweet(tweetID, {
                    text: tweetMessage,
                    image: tweetImage,
                }).then(data => {
                    if (APIHelper.type(data) === "Object" && data.error) {
                        return console.error(data.error);
                    }
                    if (handleEditModalClose) handleEditModalClose();
                    fetchPosts();
                    fetchPosts(true);
                });
            }
        } else {
            // create mode
            APIHelper.postTweet({
                text: tweetMessage,
                image: tweetImage,
            }).then(data => {
                if (APIHelper.type(data) === "Object" && data.error) {
                    return console.error(data.error);
                }
                setTweetMessage('');
                setTweetImage('');
                fetchPosts();
                fetchPosts(true);
            });
        }
    };

    return (
        <div className="tweetBox">
            <form>
                <div className="tweetBox__input">
                    <Avatar src={avatar} />
                    <TextareaAutosize 
                        className="tweetBox__input__textarea"
                        onChange={e => setTweetMessage(e.target.value)}
                        value={tweetMessage} 
                        placeholder="What's happening?" 
                        type="url"    
                    />
                </div>
                <input 
                    onChange={e => setTweetImage(e.target.value)}
                    value={tweetImage}
                    className="tweetBox__imageInput"
                    placeholder="Optional: Enter image URL"
                    type="text" 
                />

                <Button onClick={sendTweet} className="tweetBox__tweetButton" disabled={tweetMessage==='' && tweetImage===''}>Tweet</Button>
            </form>
        </div>
    );
};

export default Tweetbox;
