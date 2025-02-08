// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DeSciPlatform {

    struct Paper {
        uint256 id;
        address author;
        string greenfieldURI;
        int256 votes;
    }

    struct Review {
        uint256 paperId;
        address reviewer;
        string reviewGreenfieldURI;
        int256 votes;
    }

    struct UserProfile {
        address userAddress;
        uint256 reputation;
        string name;
    }

    uint256 public paperCount;
    uint256 public reviewCount;
    mapping(uint256 => Paper) public papers;
    mapping(uint256 => Review) public reviews;
    mapping(address => uint256) public reputation;

    event paperReviewed(uint256 paperId, address indexed reviewer);
    event paperSubmitted(uint256 paperId, address indexed author, string greenfieldURI);
    event paperVoted(uint256 paperId, address voter, bool vote);


    function submitPaper(string memory _greenfieldURI) external {
        paperCount ++;
        papers[paperCount] = Paper(paperCount, msg.sender, _greenfieldURI, 0);
        emit paperSubmitted(paperCount, msg.sender, _greenfieldURI);
    }

    function reviewPaper(uint256 _paperId, string memory _reviewGreenfieldURI) external {
        require(papers[_paperId].id != 0, "Paper does not exist");
        reviewCount ++;
        reviews[reviewCount] = Review(_paperId, msg.sender, _reviewGreenfieldURI, 0);
        emit paperReviewed(_paperId, msg.sender);
    }

    function makeVote(uint256 _paperId, bool _upvote ) external {
        require(papers[_paperId].id != 0, "Paper does not exist");
        if (_upvote) {
            papers[_paperId].votes += 1;
            reputation[papers[_paperId].author] += 1;
        } else {
            papers[_paperId].votes -= 1;
            reputation[papers[_paperId].author] -= 1;
        }
        emit paperVoted(_paperId, msg.sender, _upvote);
    }

}