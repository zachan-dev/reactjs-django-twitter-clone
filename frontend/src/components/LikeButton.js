// React Imports
import React from 'react';
// Custom Components
import Tooltip from '@material-ui/core/Tooltip';
// Custom Helpers
import APIHelper from '../helpers/api'
// Custom Styling
import '../styles/components/LikeButton.css'

function LikeButton({tweet, liked, fetchPosts}) {
    const toggleLike = () => {
        if (!liked) {
            APIHelper.likeTweet(tweet).then(data => {
                if (APIHelper.type(data) === "Object" && data.error) {
                    return console.error(data.error);
                }
                fetchPosts();
                fetchPosts(true);
            });
        } else {
            APIHelper.unlikeTweet(tweet).then(data => {
                if (APIHelper.type(data) === "Object" && data.error) {
                    return console.error(data.error);
                }
                fetchPosts();
                fetchPosts(true);
            });
        }
    };

    return (
        <Tooltip className="like-button" title={!liked ? 'Like' : 'Unlike'} aria-label={!liked ? 'like' : 'unlike'}>
            {liked ? 
                <div className="like-button__heart is-active" onClick={toggleLike}></div>:
                <div className="like-button__heart" onClick={toggleLike}></div>
                /* <FavoriteIcon fontSize="small" color="secondary" onClick={toggleLike}/> : 
                <FavoriteBorderIcon fontSize="small" onClick={toggleLike}/> */
            }
        </Tooltip>
    );
};

export default LikeButton;