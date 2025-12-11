import React, { useMemo } from 'react';
import { Review } from '../types/review';
import { Star, TrendingUp, Calendar } from 'lucide-react';
import './StatisticsDashboard.css';

interface StatisticsDashboardProps {
  reviews: Review[];
}

export function StatisticsDashboard({ reviews }: StatisticsDashboardProps) {
  // 전체 리뷰 통계
  const overallStats = useMemo(() => {
    if (reviews.length === 0) {
      return {
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: [0, 0, 0, 0, 0],
      };
    }

    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / reviews.length;

    const ratingDistribution = [0, 0, 0, 0, 0];
    reviews.forEach((r) => {
      ratingDistribution[r.rating - 1]++;
    });

    return {
      totalReviews: reviews.length,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingDistribution,
    };
  }, [reviews]);



  if (reviews.length === 0) {
    return (
      <div className="stats-empty">
        <div className="stats-empty-icon">
          <TrendingUp className="w-10 h-10 text-blue-600" />
        </div>
        <h3 className="text-gray-600 mb-2">통계 데이터가 없습니다</h3>
        <p className="text-gray-500">리뷰를 작성하면 통계를 확인할 수 있습니다</p>
      </div>
    );
  }

  return (
    <div className="statistics-dashboard">
      {/* 섹션 제목: 전체 리뷰 통계 */}
      <div className="stats-header-card">
        <div className="stats-header-content">
          <div className="stats-header-icon">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="stats-header-title">
              전체 리뷰 통계
            </h2>
            <p className="stats-header-subtitle">모든 리뷰의 통계 현황</p>
          </div>
        </div>
      </div>

      {/* 전체 통계 - 주요 지표 */}
      <div className="stats-grid">
        <div className="stats-card stats-card-blue">
          <div className="stats-card-header">
            <span className="stats-card-label">전체 리뷰</span>
            <div className="stats-card-icon">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="stats-card-value">{overallStats.totalReviews}</div>
          <div className="stats-card-unit">reviews</div>
        </div>

        <div className="stats-card stats-card-amber">
          <div className="stats-card-header">
            <span className="stats-card-label stats-card-label-amber">평균 별점</span>
            <div className="stats-card-icon">
              <Star className="w-5 h-5 fill-white" />
            </div>
          </div>
          <div className="stats-card-value">{overallStats.averageRating.toFixed(1)}</div>
          <div className="stats-card-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.round(overallStats.averageRating)
                    ? 'text-white fill-white'
                    : 'text-amber-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 별점 분포 */}
      <div className="stats-distribution-card">
        <div className="stats-distribution-header">
          <div className="stats-distribution-icon">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="stats-distribution-title">
              별점 분포
            </h3>
            <p className="stats-distribution-subtitle">리뷰별 평가 현황</p>
          </div>
        </div>
        <div className="stats-distribution-list">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = overallStats.ratingDistribution[rating - 1];
            const percentage = overallStats.totalReviews > 0 
              ? (count / overallStats.totalReviews) * 100 
              : 0;

            return (
              <div key={rating} className="stats-distribution-item">
                <div className="stats-distribution-rating">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <span className="text-gray-700">{rating}</span>
                </div>
                <div className="stats-distribution-bar-container">
                  <div
                    className="stats-distribution-bar"
                    style={{ width: `${Math.max(percentage, count > 0 ? 10 : 0)}%` }}
                  >
                    {count > 0 && (
                      <span className="stats-distribution-count">{count}개</span>
                    )}
                  </div>
                </div>
                <span className="stats-distribution-percentage">{percentage.toFixed(0)}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}