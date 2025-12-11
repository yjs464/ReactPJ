import React, { useMemo } from 'react';
import { Review } from '../types/review';
import { ReviewCard } from './ReviewCard';
import './ReviewList.css';

type SortType = 'latest' | 'oldest' | 'rating-high' | 'rating-low';

interface ReviewListProps {
  reviews: Review[];
  onDelete: (id: string) => void;
  selectedGenre: string;
  sortType: SortType;
  searchQuery?: string;
}

export function ReviewList({ reviews, onDelete, selectedGenre, sortType, searchQuery }: ReviewListProps) {
  // 모든 장르 추출 (useMemo로 최적화)
  const allGenres = useMemo(() => {
    const genreSet = new Set<string>();
    reviews.forEach((review) => {
      if (review.genres) {
        review.genres.forEach((genre) => genreSet.add(genre));
      }
    });
    return Array.from(genreSet).sort();
  }, [reviews]);

  // 필터링 및 정렬된 리뷰 목록 (useMemo로 최적화)
  const filteredAndSortedReviews = useMemo(() => {
    let result = [...reviews];

    // 장르 필터링
    if (selectedGenre !== 'all') {
      result = result.filter((review) => review.genres?.includes(selectedGenre));
    }

    // 검색어 필터링
    if (searchQuery) {
      result = result.filter((review) => review.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // 정렬
    result.sort((a, b) => {
      switch (sortType) {
        case 'latest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'rating-high':
          return b.rating - a.rating;
        case 'rating-low':
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

    return result;
  }, [reviews, selectedGenre, sortType, searchQuery]);

  return (
    <div className="review-list">
      {/* 리뷰 목록 */}
      {filteredAndSortedReviews.length === 0 ? (
        <div className="review-list-empty">
          <div className="review-list-empty-icon">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="review-list-empty-title">
            {searchQuery 
              ? `"${searchQuery}" 검색 결과가 없습니다`
              : selectedGenre !== 'all' 
                ? `${selectedGenre} 장르의 리뷰가 없습니다` 
                : '리뷰가 없습니다'}
          </h3>
          <p className="review-list-empty-description">
            {searchQuery
              ? '다른 검색어로 시도해보세요'
              : selectedGenre !== 'all' 
                ? '다른 장르를 선택하거나 새 리뷰를 작성해보세요!' 
                : '첫 번째 리뷰를 작성해보세요!'}
          </p>
        </div>
      ) : (
        <div className="review-list-grid">
          {filteredAndSortedReviews.map((review) => (
            <ReviewCard key={review.id} review={review} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}