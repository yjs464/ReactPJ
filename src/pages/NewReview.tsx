import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useReviewState, useReviewDispatch } from '../contexts/ReviewContext';
import { ReviewFormWithSearch } from '../components/ReviewFormWithSearch';
import { ArrowLeft } from 'lucide-react';
import './NewReview.css';

export function NewReview() {
  const { reviews } = useReviewState();
  const { onCreate } = useReviewDispatch();
  const navigate = useNavigate();

  return (
    <div className="new-review-container">
      {/* 배경 장식 */}
      <div className="new-review-bg-decoration">
        <div className="new-review-bg-blob new-review-bg-blob-1"></div>
        <div className="new-review-bg-blob new-review-bg-blob-2"></div>
      </div>

      <div className="new-review-content">
        <button
          onClick={() => navigate('/')}
          className="new-review-back-btn"
        >
          <ArrowLeft className="w-5 h-5" />
          목록으로 돌아가기
        </button>

        <div className="new-review-header">
          <div className="new-review-header-content">
            <div className="new-review-header-icon">
              ✍️
            </div>
            <div>
              <h1 className="new-review-header-title">
                새 리뷰 작성
              </h1>
              <p className="new-review-header-subtitle">영화에 대한 리뷰를 작성해보세요</p>
            </div>
          </div>
        </div>

        <ReviewFormWithSearch 
          onSubmit={onCreate} 
          submitLabel="리뷰 등록"
          existingReviews={reviews}
        />
      </div>
    </div>
  );
}