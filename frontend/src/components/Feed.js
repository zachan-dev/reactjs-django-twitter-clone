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
    const [pageCount, setPageCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(0);
    
    const [following_posts, setFollowingPosts] = useState([]);
    const [followingPageCount, setFollowingPageCount] = useState(1);
    const [currentFollowingPage, setCurrentFollowingPage] = useState(0);
    
    const fetchPosts = (is_following = false) => {
        const args = {
            sort: 'latest', 
            related: 'likes_current', 
            page: (is_following ? currentFollowingPage : currentPage) + 1,
        }
        if (is_following) {
            args.filter = 'following';
        }
        return APIHelper.getAllTweets(args)
            .then(obj => {
                if (!('tweets' in obj)) {
                    return console.error('tweets not in getAllTweets')
                }
                if (!('pages' in obj)) {
                    return console.error('pages not in getAllTweets')
                }
                is_following ? setFollowingPageCount(obj.pages) : setPageCount(obj.pages);
                return obj.tweets.then(data => {
                    if (APIHelper.type(data) === "Object" && data.error) {
                        return console.error(data.error);
                    }
                    is_following? setFollowingPosts(data) : setPosts(data);
                });
            });
    };

    useEffect(() => {
        fetchPosts(); // fetch immediately
    }, [currentPage]);
    useEffect(() => {
        fetchPosts(true); // fetch immediately
    }, [currentFollowingPage]);

    const handleScroll = (e) => {
        const top = e.target.scrollTop === 0;
        if (top) {
            fetchPosts(); // only fetch when scroll to the top of feeds
            fetchPosts(true);
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
            <FeedTweets 
                user={user} 
                tweets={posts} 
                tweetsFollowing={following_posts}
                fetchPosts={fetchPosts} 
                pageCount={pageCount}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                followingPageCount={followingPageCount}
                currentFollowingPage={currentFollowingPage}
                setCurrentFollowingPage={setCurrentFollowingPage}
            />
        </div>
    );
};

export default Feed;
