import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/components/Profile.css';
import APIHelper from '../helpers/api';

function Profile() {
    const { username } = useParams();
    const [profileUser, setProfileUser] = useState({});

    useEffect(() =>{ // componentWillMount
        APIHelper.getUserInfoByUsername(username)
            .then(data => {
                if (APIHelper.type(data) === "Object" && data.error) {
                    console.error(data.error);
                }
                setProfileUser(data);
            });
    }, []);

    return (
        <div className="profile">
            {profileUser.error ? 
                <div>Not Found</div>
                :
                (profileUser.username ? 
                    <div className="profile__header">
                        <h2>{profileUser.username}</h2>
                    </div>
                    :
                    <div className="profile__loading"></div>
                )
            }

            {/* <div className="profile__seperator"></div> */}
        </div>
    );
};

export default Profile;
