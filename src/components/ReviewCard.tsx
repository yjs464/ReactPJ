import React from 'react';
import { Review } from '../types/review';
import { Star, Edit2, Trash2, Film, BookOpen, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './ReviewCard.css';

interface ReviewCardProps {
  review: Review;
  onDelete: (id: string) => void;
}

// React.memo로 최적화
export const ReviewCard = React.memo(function ReviewCard({ review, onDelete }: ReviewCardProps) {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/edit/${review.id}`);
  };

  const handleDelete = () => {
    if (window.confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
      onDelete(review.id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="review-card">
      <div className="review-card-content">
        {/* 포스터 이미지 */}
        {review.posterUrl && (
          <div className="review-card-poster">
            <img
              src={review.posterUrl}
              alt={review.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            {/* 수정/삭제 버튼 오버레이 */}
            <div className="review-card-actions">
              <button
                onClick={handleEdit}
                className="review-card-action-btn review-card-edit-btn"
                aria-label="수정"
              >
                <Edit2 className="w-3 h-3" />
              </button>
              <button
                onClick={handleDelete}
                className="review-card-action-btn review-card-delete-btn"
                aria-label="삭제"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* 리뷰 정보 */}
        <div className="review-card-info">
          <h3 className="review-card-title">{review.title}</h3>
          
          <div className="review-card-director">
            <div className="review-card-director-icon">
              🎬
            </div>
            <span className="review-card-director-text">감독: {review.creatorName}</span>
          </div>

          {review.releaseYear && (
            <div className="review-card-release-year">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span>{review.releaseYear}</span>
            </div>
          )}

          {review.genres && review.genres.length > 0 && (
            <div className="review-card-genres">
              {review.genres.map((genre, index) => (
                <span
                  key={index}
                  className="review-card-genre-tag"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}

          <div className="review-card-rating">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="review-card-rating-text">{review.rating}/5</span>
          </div>

          <p className="review-card-content-text">
            {review.content}
          </p>

          <div className="review-card-footer">
            <div className="review-card-date">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(review.createdAt)}</span>
            </div>
            {review.createdAt !== review.updatedAt && (
              <span className="review-card-updated">수정됨</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});