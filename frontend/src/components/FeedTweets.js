// React Imports
import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Components Imports
import SwipeableViews from 'react-swipeable-views';
import FlipMove from 'react-flip-move';
// Material UI Imports
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
// Custom Components
import Post from './Post';
import HeadingCard from './HeadingCard';
import TweetPagination from './TweetPagination';
// Custom Styling
import '../styles/components/FeedTweets.css'

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
  }))((props) => <Tab className="feedTweets__tab" {...props} />);

export default function FeedTweets({ 
  user, tweets, tweetsFollowing, fetchPosts, 
  pageCount, currentPage, setCurrentPage, 
  followingPageCount, currentFollowingPage, setCurrentFollowingPage 
}) {
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
          <AntTab label="All" {...a11yProps(0)} />
          <AntTab label="Following" {...a11yProps(1)} />
        </AntTabs>
        <SwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={value}
            onChangeIndex={handleChangeIndex}
        >
            <TabPanel className="feedTweets__tweetsTabPanel" value={value} index={0} dir={theme.direction}>
                {/* All Tweets */}
                <FlipMove>
                    {tweets.map(post => (
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
                            fetchPosts={fetchPosts}
                            currentUserID={user.id}
                        />
                    ))}
                </FlipMove>
                {tweets.length === 0 ? 
                  <HeadingCard line_1={`Nobody has Tweeted anything yet`} line_2="When they do, their tweets will show up here."/>
                  : null
                }
                {/* Pagination */}
                <TweetPagination 
                    pageCount={pageCount}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            </TabPanel>
            <TabPanel className="feedTweets__tweetsTabPanel" value={value} index={1} dir={theme.direction}>
                {/* Tweets by users following */}
                <FlipMove>
                    {tweetsFollowing.map(post => (
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
                            fetchPosts={fetchPosts}
                            currentUserID={user.id}
                        />
                    ))}
                </FlipMove>
                {tweetsFollowing.length === 0 ? 
                  <HeadingCard line_1={`Users you follow haven't Tweeted anything yet`} line_2="When they do, their tweets will show up here."/>
                  : null
                }
                {/* Pagination */}
                <TweetPagination 
                    pageCount={followingPageCount}
                    currentPage={currentFollowingPage}
                    setCurrentPage={setCurrentFollowingPage}
                />
            </TabPanel>
        </SwipeableViews>
    </div>
  );
}
