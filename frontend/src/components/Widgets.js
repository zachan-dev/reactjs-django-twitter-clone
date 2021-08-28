// React Imports
import React, { useState } from 'react';
// Components Imports
import {
    TwitterTimelineEmbed,
    TwitterShareButton,
    TwitterTweetEmbed
} from 'react-twitter-embed';
// Material UI Imports
//// Icons
import SearchIcon from '@material-ui/icons/Search';
// Custom Styling
import '../styles/components/Widgets.css';

function Widgets() {
    const [focus, setFocus] = useState(false);

    const handleInputFocus = () => {
        setFocus(true);
    };
    const handleInputBlur = () => {
        setFocus(false);
    };

    return (
        <div className="widgets">
            <div className="widgets__header">
                <div className={`widgets__input ${focus && 'widgets__input--active'}`}>
                    <SearchIcon className={`widgets__searchIcon ${focus && 'widgets__searchIcon--active'}`} />
                    <input placeholder="Search Twitter" type="text" onFocus={handleInputFocus} onBlur={handleInputBlur}/>
                </div>
            </div>
            <div className="widgets__widgetContainer">
                <h2>What's happening</h2>

                <TwitterTweetEmbed tweetId="1417288642662338564" />
                <TwitterTimelineEmbed 
                    sourceType="profile"
                    screenName="elonmusk"
                    options={{ height: 400 }}
                />
                <TwitterShareButton
                    url={"https://zach-reactdjango-twitterclone.herokuapp.com/"}
                    options={{ text: "Your Twitter Clone is purely awesome!\n", via: "ZachChan10" }}
                />
            </div>
        </div>
    );
};

export default Widgets;
