// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract DeSci {
    struct Review {
        uint256 id; // Unique id for the review
        uint256 paperId; // ID of the paper being reviewed
        address reviewer; // Address of the reviewer
        string comment; // Content of the review
        int64 votes; // Upvotes/downvotes for the review
        bool flagged; // Indicates if the review has been flagged
    }

    struct Paper {
        uint256 id; // Unique id for the paper
        address author; // Address of the paper author
        string title; // Title of the paper
        uint256 timestamp; // Submission timestamp
        int64 votes; // Upvotes/downvotes for the paper
        uint256[] reviews; // Array of review IDs for the paper
    }

    mapping(address => int64) public reputation; // User reputation scores
    Paper[] public papers; // Array of all papers
    mapping(uint256 => Review) public reviews; // Mapping of all reviews by ID

    uint256 public paperCount;
    uint256 public reviewCount;

    // Events
    event PaperSubmitted(uint256 indexed paperId, address indexed author, string title);
    event ReviewSubmitted(uint256 indexed reviewId, uint256 indexed paperId, address indexed reviewer);
    event ReputationAdjusted(address indexed user, int64 newReputation);
    event ReviewFlagged(uint256 indexed reviewId, address indexed reviewer);

    // Submit a new paper
    function submitPaper(string memory _title) external returns (uint256) {
        Paper memory paper;

        uint256 id = paperCount++;
        paper.id = id;
        paper.author = msg.sender;
        paper.title = _title;
        paper.timestamp = block.timestamp;

        papers.push(paper);

        emit PaperSubmitted(id, msg.sender, _title);
        return id;
    }

    // Submit a new review
    function submitReview(uint256 _paperId, string memory _comment) external {
        Review memory review;

        uint256 id = reviewCount++;
        review.id = id;
        review.paperId = _paperId;
        review.reviewer = msg.sender;
        review.comment = _comment;
        review.flagged = false;

        reviews[id] = review;
        papers[_paperId].reviews.push(id);

        emit ReviewSubmitted(id, _paperId, msg.sender);
    }

    // Upvote or downvote a paper
    function votePaper(uint256 _paperId, bool _upvote) external {
        if (_upvote) {
            papers[_paperId].votes += 1;
            reputation[papers[_paperId].author] += 1;
        } else {
            papers[_paperId].votes -= 1;
            reputation[papers[_paperId].author] -= 1;
        }

        emit ReputationAdjusted(papers[_paperId].author, reputation[papers[_paperId].author]);
    }

    // Upvote or downvote a review
    function voteReview(uint256 _reviewId, bool _upvote) external {
        if (_upvote) {
            reviews[_reviewId].votes += 1;
            reputation[reviews[_reviewId].reviewer] += 1;
        } else {
            reviews[_reviewId].votes -= 1;
            reputation[reviews[_reviewId].reviewer] -= 1;
        }

        emit ReputationAdjusted(reviews[_reviewId].reviewer, reputation[reviews[_reviewId].reviewer]);
    }

    // Flag a review as toxic or spam (called by AI agent or moderators)
    function flagReview(uint256 _reviewId) external {
        reviews[_reviewId].flagged = true;

        // Penalize the reviewer's reputation
        reputation[reviews[_reviewId].reviewer] -= 10;

        emit ReviewFlagged(_reviewId, reviews[_reviewId].reviewer);
        emit ReputationAdjusted(reviews[_reviewId].reviewer, reputation[reviews[_reviewId].reviewer]);
    }

    // Retrieve reputation of a user
    function getReputation(address _user) external view returns (int256) {
        return reputation[_user];
    }

    // Retrieve all papers
    function getAllPapers() external view returns (Paper[] memory) {
        return papers;
    }

    // Retrieve votes for a paper
    function getPaperVotes(uint256 _paperId) external view returns (int64) {
        return papers[_paperId].votes;
    }

    // Retrieve votes for a review
    function getReviewVotes(uint256 _reviewId) external view returns (int64) {
        return reviews[_reviewId].votes;
    }
}
