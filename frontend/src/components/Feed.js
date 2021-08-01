import React, { useState, useEffect } from 'react';
import Tweetbox from './Tweetbox';
import Post from './Post';
import './Feed.css';
import FlipMove from 'react-flip-move';
import APIHelper from '../helpers/api';

function Feed({ user }) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fecthPosts = () => {
            APIHelper.getAllTweets()
                .then(data => {
                    if (APIHelper.type(data) == "Object" && data.error) {
                        return console.error(data.error);
                    }
                    data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());  // latest first
                    setPosts(data);
                });
        };
        fecthPosts(); // fetch immediately
        setInterval(fecthPosts, 5000); // fetch every 5 seconds
    }, [])

    return (
        <div className="feed">
            {/* Header */}
            <div className="feed__header">
                <h2>Home</h2>
            </div>
            
            {/* TweetBox */}
            <Tweetbox user={user} setPosts={setPosts}/>
            <div className="feed__seperator"></div>

            {/* Post */}
            <FlipMove>
                {posts.map(post => (
                    <Post
                        key={post.text}
                        displayName={post.user.display_name}
                        username={post.user.username}
                        verified={post.user.verified}
                        text={post.text}
                        avatar={post.user.photo}
                        image={post.image}
                        dateTime={post.created_at}
                    />
                ))}
            </FlipMove>
            {/* <Post 
                displayName="Elon Musk"
                username='elonmusk'
                verified
                text="Dogecoin to the Mooooon!"
                avatar="https://pbs.twimg.com/profile_images/1364491704817098753/V22-Luf7_400x400.jpg"
                image="https://media.giphy.com/media/VrkGLBfSn7AXI9sPT1/source.gif"
            />
            <Post 
                displayName="Zach Chan"
                username='ZachChan10'
                text="I challenge you to build a Twitter Clone website."
                avatar="https://pbs.twimg.com/profile_images/1361905300928749568/M4vupWSQ_bigger.jpg"
                image="https://media.giphy.com/media/65ATdpi3clAdjomZ39/source.gif"
            /> */}
        </div>
    );
};

export default Feed;
