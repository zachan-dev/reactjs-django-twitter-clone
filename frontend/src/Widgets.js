import React, { useState } from 'react';
import './Widgets.css';
import {
    TwitterTimelineEmbed,
    TwitterShareButton,
    TwitterTweetEmbed
} from 'react-twitter-embed';
import SearchIcon from '@material-ui/icons/Search';

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
                    url={"https://twitter-clone-cea24.web.app/"}
                    options={{ text: "Your Twitter Clone is purely awesome!\n", via: "ZachChan10" }}
                />
            </div>
        </div>
    );
};

export default Widgets;
