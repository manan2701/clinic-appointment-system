import React, { useState } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import "../../css/ReviewForm.css";
import "../../css/Forms.css";
import "../../css/Button.css";
const ReviewForm = ({ clinicId, onClose, onReviewSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }
    try {
      await axios.post("/api/user/reviews", { clinicId, rating, comment });
      onReviewSubmit();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review.");
    }
  };
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>Write a Review</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          <div className="form-group star-rating">
            {[...Array(5)].map((star, index) => {
              const ratingValue = index + 1;
              return (
                <label key={index}>
                  <input
                    type="radio"
                    name="rating"
                    value={ratingValue}
                    onClick={() => setRating(ratingValue)}
                  />
                  <FaStar
                    className="star"
                    color={
                      ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"
                    }
                    onMouseEnter={() => setHover(ratingValue)}
                    onMouseLeave={() => setHover(0)}
                  />
                </label>
              );
            })}
          </div>
          <div className="form-group">
            <label>Your comments</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary btn-full-width">
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};
export default ReviewForm;
