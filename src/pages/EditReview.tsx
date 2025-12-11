import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useReviewState, useReviewDispatch } from '../contexts/ReviewContext';
import { ReviewFormWithSearch } from '../components/ReviewFormWithSearch';
import { ArrowLeft } from 'lucide-react';
import './EditReview.css';

export function EditReview() {
  const { id } = useParams<{ id: string }>();
  const { reviews } = useReviewState();
  const { onUpdate } = useReviewDispatch();
  const navigate = useNavigate();

  const review = reviews.find((r) => r.id === id);

  if (!review) {
    return (
      <div className="edit-review-container">
        <div className="edit-review-content">
          <button
            onClick={() => navigate('/')}
            className="edit-review-back-btn"
          >
            <ArrowLeft className="w-5 h-5" />
            목록으로 돌아가기
          </button>

          <div className="edit-review-error">
            <div className="edit-review-error-icon">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="mb-2">리뷰를 찾을 수 없습니다</h2>
            <p className="text-gray-600">해당 리뷰가 삭제되었거나 존재하지 않습니다.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleUpdate = (data: any) => {
    onUpdate(review.id, data);
  };

  return (
    <div className="edit-review-container">
      {/* 배경 장식 */}
      <div className="edit-review-bg-decoration">
        <div className="edit-review-bg-blob edit-review-bg-blob-1"></div>
        <div className="edit-review-bg-blob edit-review-bg-blob-2"></div>
      </div>

      <div className="edit-review-content">
        <button
          onClick={() => navigate('/')}
          className="edit-review-back-btn"
        >
          <ArrowLeft className="w-5 h-5" />
          목록으로 돌아가기
        </button>

        <div className="edit-review-header">
          <div className="edit-review-header-content">
            <div className="edit-review-header-icon">
              ✏️
            </div>
            <div>
              <h1 className="edit-review-header-title">
                리뷰 수정
              </h1>
              <p className="edit-review-header-subtitle">리뷰 내용을 수정할 수 있습니다</p>
            </div>
          </div>
        </div>

        <ReviewFormWithSearch
          initialData={review}
          onSubmit={handleUpdate}
          submitLabel="수정 완료"
          existingReviews={reviews}
          currentReviewId={review.id}
        />
      </div>
    </div>
  );
}