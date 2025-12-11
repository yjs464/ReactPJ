import React, { useState, FormEvent } from 'react';
import { Review } from '../types/review';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './ReviewForm.css';

interface ReviewFormProps {
  initialData?: Review;
  onSubmit: (data: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>) => void;
  submitLabel: string;
}

export function ReviewForm({ initialData, onSubmit, submitLabel }: ReviewFormProps) {
  const navigate = useNavigate();
  
  const [title, setTitle] = useState(initialData?.title || '');
  const [creatorName, setCreatorName] = useState(initialData?.creatorName || '');
  const [rating, setRating] = useState(initialData?.rating || 5);
  const [content, setContent] = useState(initialData?.content || '');
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !creatorName.trim() || !content.trim()) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }

    onSubmit({
      title: title.trim(),
      creatorName: creatorName.trim(),
      rating,
      content: content.trim(),
      posterUrl: initialData?.posterUrl,
      tmdbId: initialData?.tmdbId,
      releaseYear: initialData?.releaseYear,
      genres: initialData?.genres,
    });

    navigate('/');
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      {/* 영화 정보 표시 (수정 불가) */}
      {initialData && (
        <div className="review-form-movie-info">
          <div className="review-form-movie-content">
            {initialData.posterUrl && (
              <div className="review-form-movie-poster">
                <img
                  src={initialData.posterUrl}
                  alt={initialData.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
            <div className="review-form-movie-details">
              <h3 className="review-form-movie-title">{initialData.title}</h3>
              <p className="review-form-movie-director">감독: {initialData.creatorName}</p>
              {initialData.releaseYear && (
                <p className="review-form-movie-year">{initialData.releaseYear}</p>
              )}
              {initialData.genres && initialData.genres.length > 0 && (
                <div className="review-form-movie-genres">
                  {initialData.genres.map((genre, index) => (
                    <span
                      key={index}
                      className="review-form-movie-genre"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="review-form-field">
        <label htmlFor="title" className="review-form-label">
          <span className="review-form-label-icon">📌</span>
          <span>제목 *</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="영화 제목을 입력하세요"
          className="review-form-input"
          required
        />
      </div>

      <div className="review-form-field">
        <label htmlFor="creatorName" className="review-form-label">
          <span className="review-form-label-icon">👤</span>
          <span>감독 *</span>
        </label>
        <input
          id="creatorName"
          type="text"
          value={creatorName}
          onChange={(e) => setCreatorName(e.target.value)}
          placeholder="감독 이름을 입력하세요"
          className="review-form-input"
          required
        />
      </div>

      <div className="review-form-field">
        <label className="review-form-label">
          <span className="review-form-label-icon review-form-label-icon-rating">⭐</span>
          <span>별점 *</span>
        </label>
        <div className="review-form-rating-container">
          <div className="review-form-rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="review-form-rating-star"
              >
                <Star
                  className={`w-12 h-12 ${
                    star <= (hoveredRating || rating)
                      ? 'text-amber-400 fill-amber-400 drop-shadow-lg'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          <div className="review-form-rating-display">
            <span className="review-form-rating-value">
              <span className="review-form-rating-number">{rating}</span>
              <span className="review-form-rating-max"> / 5</span>
            </span>
          </div>
        </div>
      </div>

      <div className="review-form-field review-form-field-content">
        <label htmlFor="content" className="review-form-label">
          <span className="review-form-label-icon">✍️</span>
          <span>리뷰 내용 *</span>
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="리뷰 내용을 작성하세요"
          rows={10}
          className="review-form-textarea"
          required
        />
      </div>

      <div className="review-form-actions">
        <button
          type="button"
          onClick={handleCancel}
          className="review-form-cancel-btn"
        >
          취소
        </button>
        <button
          type="submit"
          className="review-form-submit-btn"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}