import { Component, createSignal } from "solid-js";
import { useParams } from "@solidjs/router";
import "./PostView.css";

const PostView: Component = () => {
    const mockReviews = [
        { text: "This research is a joke. Stop wasting our time!", votes: -3 },
        { text: "Interesting paper! I learned a lot.", votes: 5 },
        { text: "Your methodology is flawed and stupid.", votes: -2 },
        { text: "Great insights! Thanks for sharing.", votes: 3 },
        { text: "This is absolute nonsense. Who even funds this?", votes: -4 },
    ];

    const [reviews, setReviews] = createSignal(mockReviews);
    const [newReview, setNewReview] = createSignal<string>("");
    const [postVotes, setPostVotes] = createSignal(0);
    const params = useParams();

    const posts = [
        {
            id: 1,
            title: "Hello, world!",
            author: "Alice",
            date: "2/1/1990",
            content: "This is a test post.",
            pdf: "https://introcs.cs.princeton.edu/java/home/chapter1.pdf",
        },
        {
            id: 2,
            title: "Boop",
            author: "Bob",
            date: "2/2/1990",
            content: "This is another test post.",
            pdf: "https://example.com/another-pdf.pdf",
        },
    ];

    const post = posts.find((p) => p.id === Number(params.id));

    const handlePostUpvote = () => setPostVotes(postVotes() + 1);
    const handlePostDownvote = () => setPostVotes(postVotes() - 1);

    const submitReview = async () => {
        if (newReview().trim() === "") {
            alert("Review cannot be empty!");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/check_toxicity", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: newReview() }),
            });

            const result = await response.json();
            console.log("AI Response:", result); // Log the AI response

            if (result.score > 0.7) {
                alert("Your review was flagged as toxic and cannot be submitted.");
                return;
            }
        } catch (error) {
            console.error("Error checking toxicity:", error);
        }

        setReviews((prevReviews) => [...prevReviews, { text: newReview(), votes: 0 }]);
        setNewReview(""); // Clear the input box
    };

    const handleReviewVote = (index: number, delta: number) => {
        const updatedReviews = [...reviews()];
        updatedReviews[index].votes += delta;
        setReviews(updatedReviews);
    };

    return post ? (
        <div class="post-view-container">
            <h1 class="post-title">{post.title}</h1>
            <p class="post-meta">
                By {post.author} on {post.date}
            </p>
            <iframe
                src={post.pdf}
                height="500"
                width="100%"
                class="pdf-viewer"
            ></iframe>

            <div class="voting-section">
                <button class="voting-button upvote" onClick={handlePostUpvote}>
                    Upvote
                </button>
                <button
                    class="voting-button downvote"
                    onClick={handlePostDownvote}
                >
                    Downvote
                </button>
                <p class="vote-count">Post Votes: {postVotes()}</p>
            </div>

            <div class="reviews-container">
                <h2 class="reviews-header">Reviews</h2>
                <div class="review-list">
                    {reviews().length > 0 ? (
                        reviews().map((review, index) => (
                            <div class="review-item">
                                <div>
                                    <p class="review-text">{review.text}</p>
                                    <p class="review-votes">
                                        Votes: {review.votes}
                                    </p>
                                </div>
                                <div class="review-buttons">
                                    <button
                                        class="review-button upvote"
                                        onClick={() =>
                                            handleReviewVote(index, 1)
                                        }
                                    >
                                        Upvote
                                    </button>
                                    <button
                                        class="review-button downvote"
                                        onClick={() =>
                                            handleReviewVote(index, -1)
                                        }
                                    >
                                        Downvote
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p class="text-gray-500">
                            No reviews yet. Be the first to review!
                        </p>
                    )}
                </div>

                <textarea
                    class="review-input"
                    rows="3"
                    placeholder="Write your review here..."
                    value={newReview()}
                    onInput={(e) => setNewReview(e.currentTarget.value)}
                ></textarea>
                <button class="submit-button" onClick={submitReview}>
                    Submit Review
                </button>
            </div>
        </div>
    ) : (
        <div class="text-center text-red-500">Post not found</div>
    );
};

export default PostView;
