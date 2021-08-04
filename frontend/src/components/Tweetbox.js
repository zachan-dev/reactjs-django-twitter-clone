import React, { useState } from 'react';
import '../styles/components/Tweetbox.css';
import { Avatar, Button } from '@material-ui/core';
import TextareaAutosize from 'react-textarea-autosize';
import APIHelper from '../helpers/api';

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
