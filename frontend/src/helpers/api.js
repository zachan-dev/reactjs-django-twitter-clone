const $ = require( "jquery" );

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

const getUserInfo = () => {
    return fetch("current_user/")
        .then(response => {
            if (response.status >= 400) {
                return { 
                    'error': 'Retrieve current user: Something went wrong' 
                };
            }
            return response.json();
        });
};

const getAllTweets = () => {
    return fetch("api/tweet/")
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
    return fetch("api/tweet/", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json",
            'X-CSRFToken': getCookie('csrftoken')
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
}


export default { type, getCookie, getUserInfo, getAllTweets, postTweet, };