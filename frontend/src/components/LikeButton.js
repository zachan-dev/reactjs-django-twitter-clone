import React from 'react';
import '../styles/components/LikeButton.css'
import APIHelper from '../helpers/api'

function LikeButton({tweet, liked, fecthPosts}) {
    const toggleLike = () => {
        if (!liked) {
            APIHelper.likeTweet(tweet).then(data => {
                if (APIHelper.type(data) === "Object" && data.error) {
                    return console.error(data.error);
                }
                fecthPosts();
            });
        } else {
            APIHelper.unlikeTweet(tweet).then(data => {
                if (APIHelper.type(data) === "Object" && data.error) {
                    return console.error(data.error);
                }
                fecthPosts();
            });
        }
    };

    return (
        <span className="like-button">
            {liked ? 
                <div className="like-button__heart is-active" onClick={toggleLike}></div>:
                <div className="like-button__heart" onClick={toggleLike}></div>
                /* <FavoriteIcon fontSize="small" color="secondary" onClick={toggleLike}/> : 
                <FavoriteBorderIcon fontSize="small" onClick={toggleLike}/> */
            }
        </span>
    );
};

export default LikeButton;