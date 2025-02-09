// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract DeSci {
	struct Review {
		// Unique id for the review. Incremented for each new review.
		uint256 id;
		uint256 paperId;
		address reviewer;
		string comment;
		int64 votes;
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

	// Store the reputation of each user on the platform.
	mapping(address => int64) public reputation;

	// Store the papers submitted by id.
	Paper[] public papers;
	// Store the reviews submitted by id.
	mapping(uint256 => Review) public reviews;

	uint256 public paperCount;
	uint256 public reviewCount;

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

		return id;
	}

	// Submit a new review for a paper.
	function submitReview(uint256 _paperId, string memory _comment) external {
		Review memory review;

		uint256 id = reviewCount++;
		review.id = id;
		review.paperId = _paperId;
		review.reviewer = msg.sender;
		review.comment = _comment;

		reviews[id] = review;

		// Add the review to the paper.
		papers[_paperId].reviews.push(id);
	}

	// Upvote/downvote a paper.
	function votePaper(uint256 _paperId, bool _upvote) external {
		if (_upvote) {
			papers[_paperId].votes += 1;
			reputation[papers[_paperId].author] += 1;
		} else {
			papers[_paperId].votes -= 1;
			reputation[papers[_paperId].author] -= 1;
		}
	}

	function voteReview(uint256 _reviewId, bool _upvote) external {
		if (_upvote) {
			reviews[_reviewId].votes += 1;
			reputation[reviews[_reviewId].reviewer] += 1;
		} else {
			reviews[_reviewId].votes -= 1;
			reputation[reviews[_reviewId].reviewer] -= 1;
		}
	}

	function getReputation(address _user) external view returns (int256) {
		return reputation[_user];
	}

	function getAllPapers() external view returns (Paper[] memory) {
		return papers;
	}

	function getPaperVotes(uint256 _paperId) external view returns (int64) {
		return papers[_paperId].votes; 
	}

	function getPaperReviews(uint256 _paperId) external view returns (uint256[] memory) {
		return papers[_paperId].reviews;
	}

	function getReviewVotes(uint256 _reviewId) external view returns (int64) {
		return reviews[_reviewId].votes;
	}
}
