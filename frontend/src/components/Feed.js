// React Imports
import React, { useState, useEffect } from 'react';
// Custom Components
import Tweetbox from './Tweetbox';
import FeedTweets from './FeedTweets';
// Custom Helpers
import APIHelper from '../helpers/api';
// Custom Styling
import '../styles/components/Feed.css';

function Feed({ user }) {
    const [posts, setPosts] = useState([]);
    
    const fetchPosts = () => {
        return APIHelper.getAllTweets({ sort: 'latest', related: 'likes_current' })
            .then(data => {
                if (APIHelper.type(data) === "Object" && data.error) {
                    return console.error(data.error);
                }
                setPosts(data);
            });
    };

    useEffect(() => {
        fetchPosts(); // fetch immediately
    }, []);

    const handleScroll = (e) => {
        const top = e.target.scrollTop === 0;
        if (top) {
            fetchPosts(); // only fetch when scroll to the top of feeds
        }
    };


    return (
        <div className="feed" onScroll={handleScroll}>
            {/* Header */}
            <div className="feed__header">
                <h2>Home</h2>
            </div>
            
            {/* TweetBox */}
            <Tweetbox isEditMode={false} avatar={user.photo} fetchPosts={fetchPosts}/>
            <div className="feed__seperator"></div>

            {/* FeedTweets Tabs */}
            <FeedTweets user={user} tweets={posts} fetchPosts={fetchPosts} />
        </div>
    );
};

export default Feed;
