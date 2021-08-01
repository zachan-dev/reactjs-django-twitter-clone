import React, { useState } from 'react';
import './Tweetbox.css';
import { Avatar, Button } from '@material-ui/core';
import TextareaAutosize from 'react-textarea-autosize';
import APIHelper from '../helpers/api';

function Tweetbox({ user, setPosts }) {
    const [tweetMessage, setTweetMessage] = useState('');
    const [tweetImage, setTweetImage] = useState('');

    const sendTweet = e => {
        e.preventDefault();

        APIHelper.postTweet({
            user: user.id,
            text: tweetMessage,
            image: tweetImage,
        }).then(data => {
            if (APIHelper.type(data) == "Object" && data.error) {
                return console.error(data.error);
            }
            setTweetMessage('');
            setTweetImage('');
            APIHelper.getAllTweets()
                .then(data => {
                    if (APIHelper.type(data) == "Object" && data.error) {
                        return console.error(data.error);
                    }
                    data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());  // latest first
                    setPosts(data);
                });
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
