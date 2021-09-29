// React Imports
import React from 'react';
// Components Imports
import ReactPaginate from 'react-paginate';
// Custom Styling
import '../styles/components/TweetPagination.css';

function TweetPagination({ pageCount, currentPage, setCurrentPage }) {
    return (
        <div className="tweetPagination disable-select">
            <ReactPaginate 
                initialPage={currentPage}
                forcePage={currentPage}
                pageCount={pageCount} 
                marginPagesDisplayed={2} 
                pageRangeDisplayed={5} 
                onPageChange={(e) => setCurrentPage(e.selected)} 
                disableInitialCallback = {true}
                nextLabel="&rarr;"
                previousLabel="&larr;"
                breakLabel={"..."}
                breakClassName={"break"}
                activeClassName={"active"}
            />
        </div>
    );
}

export default TweetPagination;