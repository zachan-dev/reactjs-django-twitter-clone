import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Post from './Post';
import FlipMove from 'react-flip-move';
import '../styles/components/ProfileTweets.css'
import HeadingCard from './HeadingCard';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: 'white',
    width: '100%',
    marginTop: 20,
  },
}));

const AntTabs = withStyles({
    root: {
      borderBottom: '1px solid var(--twitter-border)',
    },
    indicator: {
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      '& > span': {
        maxWidth: 60,
        width: '100%',
        backgroundColor: 'var(--twitter-color)',
      },
    },
  })((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const AntTab = withStyles((theme) => ({
    root: {
      textTransform: 'none',
      minWidth: 72,
      fontSize: 15,
      fontWeight: theme.typography.fontWeightBold,
      marginRight: theme.spacing(4),
      transition: '0.3s',
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      '&:hover': {
        backgroundColor: 'var(--twitter-lightest-color)',
        color: 'var(--twitter-color)',
        opacity: 1,
      },
      '&$selected': {
        color: 'var(--twitter-color)',
        fontWeight: theme.typography.fontWeightBold,
      },
      '&:focus': {
        color: 'var(--twitter-color)',
      },
    },
    selected: {},
  }))((props) => <Tab className="profileTweets__tab" {...props} />);

export default function ProfileTweets({ currentUser, profileUser, loadUserProfile }) {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <div className={classes.root}>
        <AntTabs
          value={value}
          onChange={handleChange}
          variant="fullWidth"
        >
          <AntTab label="Tweets" {...a11yProps(0)} />
          <AntTab label="Media" {...a11yProps(1)} />
          <AntTab label="Likes" {...a11yProps(2)} />
        </AntTabs>
        <SwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={value}
            onChangeIndex={handleChangeIndex}
        >
            <TabPanel className="profileTweets__tweetsTabPanel" value={value} index={0} dir={theme.direction}>
                {/* User's Tweets */}
                <FlipMove>
                    {profileUser.tweets.map(post => (
                        <Post
                            key={post.id}
                            tweet={post.id}
                            displayName={post.user.display_name}
                            username={post.user.username}
                            userID={post.user.id}
                            verified={post.user.verified}
                            text={post.text}
                            avatar={post.user.photo}
                            image={post.image}
                            dateTime={post.created_at}
                            likes_count={post.likes_count}
                            liked={post.likes.length > 0}
                            fetchPosts={loadUserProfile}
                            currentUserID={currentUser.id}
                        />
                    ))}
                </FlipMove>
                {profileUser.tweets.length === 0 ? 
                  <HeadingCard line_1={`@${profileUser.username} hasn't Tweeted anything yet`} line_2="When they do, their tweets will show up here."/>
                  : null
                }
            </TabPanel>
            <TabPanel className="profileTweets__tweetsTabPanel" value={value} index={1} dir={theme.direction}>
                {/* User's Tweets with Media */}
                <FlipMove>
                    {profileUser.tweets.filter(post => post.image).map(post => (
                        <Post
                            key={post.id}
                            tweet={post.id}
                            displayName={post.user.display_name}
                            username={post.user.username}
                            userID={post.user.id}
                            verified={post.user.verified}
                            text={post.text}
                            avatar={post.user.photo}
                            image={post.image}
                            dateTime={post.created_at}
                            likes_count={post.likes_count}
                            liked={post.likes.length > 0}
                            fetchPosts={loadUserProfile}
                            currentUserID={currentUser.id}
                        />
                    ))}
                </FlipMove>
                {profileUser.tweets.filter(post => post.image).length === 0 ? 
                  <HeadingCard line_1={`@${profileUser.username} hasn't Tweeted any photos`} line_2="When they do, their media will show up here."/>
                  : null
                }
            </TabPanel>
            <TabPanel className="profileTweets__tweetsTabPanel" value={value} index={2} dir={theme.direction}>
                {/* User's LikedTweets */}
                <FlipMove>
                    {profileUser.likes.map(postLike => {
                      const post = postLike.tweet;
                      return (
                        <Post
                            key={post.id}
                            tweet={post.id}
                            displayName={post.user.display_name}
                            username={post.user.username}
                            userID={post.user.id}
                            verified={post.user.verified}
                            text={post.text}
                            avatar={post.user.photo}
                            image={post.image}
                            dateTime={post.created_at}
                            likes_count={post.likes_count}
                            liked={post.likes.length > 0}
                            fetchPosts={loadUserProfile}
                            currentUserID={currentUser.id}
                        />);
                    })}
                </FlipMove>
                {profileUser.likes.length === 0 ? 
                  <HeadingCard line_1={`@${profileUser.username} hasn't Liked any Tweets`} line_2="When they do, their liked tweets will show up here."/>
                  : null
                }
            </TabPanel>
        </SwipeableViews>
    </div>
  );
}
