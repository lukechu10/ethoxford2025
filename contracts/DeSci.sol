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
		// Unique id for the paper. Incremented for each new paper.
		uint256 id;
		address author;
		string title;
		uint256 timestamp;
		// Where is the paper stored?
		string fileUri;
		// Hash of the paper.
		string fileHash;

		// Short description of the paper.
		string desc;

		// Defaults to 0.
		int64 votes;
		// Review (ids) for the paper.
		// Defaults to empty array.
		uint256[] reviews;
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

	// Create a new paper and store it in the contract.
	// Returns the id of the new paper.
	function submitPaper(string memory _title, string memory _fileUri, string memory _fileHash, string memory _desc) external returns (uint256) {
		Paper memory paper;

        uint256 id = paperCount++;
        paper.id = id;
        paper.author = msg.sender;
        paper.title = _title;
        paper.timestamp = block.timestamp;

		paper.fileUri = _fileUri;
		paper.fileHash = _fileHash;

		paper.desc = _desc;

		// Store it in the map.
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

	function getPaperVotes(uint256 _paperId) external view returns (int64) {
		return papers[_paperId].votes; 
	}

	function getPaperReviews(uint256 _paperId) external view returns (uint256[] memory) {
		return papers[_paperId].reviews;
	}

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
