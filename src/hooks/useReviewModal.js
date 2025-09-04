import { useState } from "react";

export function useReviewModal() {
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewActivityId, setReviewActivityId] = useState(null);
  const [reviewStars, setReviewStars] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const openReviewModal = (activityId, userReviewData = null) => {
    setReviewActivityId(activityId);
    setReviewStars(userReviewData?.stars || 0);
    setReviewComment(userReviewData?.comment || "");
    setReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setReviewModalOpen(false);
    setReviewActivityId(null);
    setReviewStars(0);
    setReviewComment("");
  };

  return {
    reviewModalOpen,
    reviewActivityId,
    reviewStars,
    setReviewStars,
    reviewComment,
    setReviewComment,
    reviewSubmitting,
    setReviewSubmitting,
    openReviewModal,
    closeReviewModal,
  };
}