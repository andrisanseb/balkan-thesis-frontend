import React from "react";
import { FaStar } from "react-icons/fa";

const ReviewModal = ({
  open,
  stars,
  setStars,
  comment,
  setComment,
  submitting,
  onSubmit,
  onCancel,
  userReviewData,
}) => {
  if (!open) return null;
  return (
    <div className="review-modal-overlay">
      <div className="review-modal">
        <h3>Review Activity</h3>
        <div className="review-stars">
          {[1,2,3,4,5].map((star) => (
            <FaStar
              key={star}
              className={`review-star ${stars >= star ? "selected" : ""}`}
              onClick={() => setStars(star)}
            />
          ))}
        </div>
        <textarea
          className="review-comment"
          placeholder="Add a comment (optional)"
          value={comment}
          onChange={e => setComment(e.target.value)}
          rows={3}
        />
        {userReviewData && (
          <div className="your-review-info" style={{ marginBottom: 8, color: "#1976d2", fontSize: "0.95em" }}>
            <span>
              Current review: {userReviewData.stars}★
              {userReviewData.comment ? ` — "${userReviewData.comment}"` : ""}
            </span>
          </div>
        )}
        <div className="review-modal-actions">
          <button
            className="review-submit-btn"
            onClick={onSubmit}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
          <button className="review-cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;