const $ = require( "jquery" );
var withQuery = require('with-query').default;

// Helpers for API Handlers
// JSON detection
const type = (object) => {
    var stringConstructor = "test".constructor;
    var arrayConstructor = [].constructor;
    var objectConstructor = ({}).constructor;

    if (object === null) {
        return "null";
    }
    if (object === undefined) {
        return "undefined";
    }
    if (object.constructor === stringConstructor) {
        return "String";
    }
    if (object.constructor === arrayConstructor) {
        return "Array";
    }
    if (object.constructor === objectConstructor) {
        return "Object";
    }
    return "unknown";
};

// get cookie function e.g. CSRF token
const getCookie = (name) => {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = $.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};

//----------------------------------------------------------------
// Actual API Handlers

const getCurrentUserInfo = () => {
    return fetch("/api/current_user/").then(response => {
        if (response.status >= 400) {
            return { 
                'error': 'Retrieve current user: Something went wrong' 
            };
        }
        return response.json();
    });
};

const getUserInfoByUsername = (username) => {
    return fetch(`/api/username/${username}/`).then(response => {
        if (response.status >= 400) {
            return { 
                'error': 'Retrieve user by username: Something went wrong' 
            };
        }
        return response.json();
    });
};

const updateUserInfo = (userInfo) => {
    return fetch(`/api/current_user/`, {
        method: "PATCH",
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json",
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify(userInfo)
    })
    .then(response => {
        if (response.status >= 400) {
            return { 
                'error': 'Update user by username: Something went wrong' 
            };
        }
        return {'message': 'User updated'};
    });
};

const getAllTweets = (query) => {
    return fetch(withQuery("/api/tweet/", query))
        .then(response => {
            if (response.status >= 400) {
                return { 
                    'error': 'Retrieve all tweets: Something went wrong' 
                };
            }
            return response.json();
        });
};

const postTweet = (tweet) => {
    return fetch("/api/tweet/", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json",
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify(tweet)
    })
    .then(response => {
        if (response.status >= 400) {
            return { 
                'error': 'Post tweet: Something went wrong' 
            };
        }
        return response.json();
    });
};

const likeTweet = (tweetID) => {
    return fetch("/api/tweet_like/", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json",
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({
            "tweet": tweetID
        })
    })
};

const getTweetLikes = (query) => {
    return fetch(withQuery('/api/tweet_like/', query))
        .then(response => {
            if (response.status >= 400) {
                return { 
                    'error': 'Unlike tweet: Cannot get tweet likes by current user and tweetID' 
                };
            }
            return response.json();
        });
};

const isTweetLiked = (tweetID) => {
    return getTweetLikes({ 'tweet': tweetID, 'current': true })
        .then(likes => {
            if (type(likes) === "Object" && likes.error) {
                return { 
                    'error': 'Unlike tweet: Something went wrong' 
                };
            }
            return like.length > 0;
        });
};

const unlikeTweet = (tweetID) => {
    return getTweetLikes({ 'tweet': tweetID, 'current': true })
        .then(likes => {
            if (type(likes) === "Object" && likes.error) {
                return { 
                    'error': 'Unlike tweet: Something went wrong' 
                };
            }
            for (var i = 0; i < likes.length; i++) {
                return fetch(`/api/tweet_like/${likes[i].id}/`, {
                    method: "DELETE",
                    headers: {
                        'Accept': 'application/json',
                        "Content-Type": "application/json",
                        'X-CSRFToken': getCookie('csrftoken'),
                    }
                });
            }
        });
};

const deleteTweet = (tweetID) => {
    return fetch(`/api/tweet/${tweetID}/`, {
        method: "DELETE",
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
        },
    })
    .then(response => {
        if (response.status >= 400) {
            return { 
                'error': 'Delete tweet: Something went wrong' 
            };
        }
        return {'message': 'Tweet deleted'};
    });
};

const editTweet = (tweetID, tweet) => {
    return fetch(`/api/tweet/${tweetID}/`, {
        method: "PUT",
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json",
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify(tweet)
    })
    .then(response => {
        if (response.status >= 400) {
            return { 
                'error': 'Edit tweet: Something went wrong' 
            };
        }
        return response.json();
    });
};


export default { type, getCookie, 
                 getCurrentUserInfo, updateUserInfo, getUserInfoByUsername,
                 getAllTweets, postTweet, likeTweet, isTweetLiked, unlikeTweet, deleteTweet, editTweet };