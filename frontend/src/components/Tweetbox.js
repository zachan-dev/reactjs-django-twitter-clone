import React, { useState } from 'react';
import '../styles/components/Tweetbox.css';
import { Avatar, Button } from '@material-ui/core';
import TextareaAutosize from 'react-textarea-autosize';
import APIHelper from '../helpers/api';

function Tweetbox({ user, fecthPosts }) {
    const [tweetMessage, setTweetMessage] = useState('');
    const [tweetImage, setTweetImage] = useState('');

    const sendTweet = e => {
        e.preventDefault();

        APIHelper.postTweet({
            user: user.id,
            text: tweetMessage,
            image: tweetImage,
        }).then(data => {
            if (APIHelper.type(data) === "Object" && data.error) {
                return console.error(data.error);
            }
            setTweetMessage('');
            setTweetImage('');
            fecthPosts();
        });
    };

    return (
        <div className="tweetBox">
            <form>
                <div className="tweetBox__input">
                    <Avatar src={user.photo} />
                    <TextareaAutosize 
                        className="tweetBox__input__textarea"
                        onChange={e => setTweetMessage(e.target.value)}
                        value={tweetMessage} 
                        placeholder="What's happening?" 
                        type="text"    
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
