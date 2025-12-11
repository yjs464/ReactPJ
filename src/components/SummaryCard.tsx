import React, { useMemo } from 'react';
import { Review } from '../types/review';
import { Star, List, BarChart3 } from 'lucide-react';
import './SummaryCard.css';

type SortType = 'latest' | 'oldest' | 'rating-high' | 'rating-low';

interface SummaryCardProps {
  reviews: Review[];
  activeTab: 'reviews' | 'statistics';
  onTabChange: (tab: 'reviews' | 'statistics') => void;
  sortType: SortType;
  onSortChange: (sort: SortType) => void;
}

export function SummaryCard({ 
  reviews, 
  activeTab, 
  onTabChange, 
  sortType, 
  onSortChange
}: SummaryCardProps) {
  // useMemo로 평균 별점 계산 최적화
  const statistics = useMemo(() => {
    const total = reviews.length;
    if (total === 0) {
      return {
        total: 0,
        average: 0,
      };
    }

    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    const average = sum / total;

    return {
      total,
      average: Math.round(average * 10) / 10,
    };
  }, [reviews]);

  return (
    <div className="summary-card">
      <div className="summary-card-bg-decoration"></div>
      
      <div className="summary-card-content">
        <div className="summary-card-header">
          <div className="summary-card-icon">
            <Star className="w-6 h-6 text-white fill-white" />
          </div>
          <h2 className="summary-card-title">
            리뷰 요약
          </h2>
        </div>
        
        <div className="summary-card-grid">
          {/* 리뷰 목록 탭 버튼 */}
          <button
            onClick={() => onTabChange('reviews')}
            className={`summary-tab-button summary-tab-reviews ${activeTab === 'reviews' ? 'active' : ''}`}
          >
            <div className="summary-tab-label">
              <div className={`summary-tab-icon summary-tab-icon-reviews ${activeTab === 'reviews' ? 'active' : ''}`}>
                <List className="w-5 h-5" />
              </div>
              <span className="font-medium">리뷰 목록</span>
            </div>
            <div className={`summary-tab-indicator summary-tab-indicator-reviews ${activeTab === 'reviews' ? 'active' : ''}`}>
              {activeTab === 'reviews' ? '✓' : '→'}
            </div>
          </button>
          
          {/* 통계 대시보드 탭 버튼 */}
          <button
            onClick={() => onTabChange('statistics')}
            className={`summary-tab-button summary-tab-statistics ${activeTab === 'statistics' ? 'active' : ''}`}
          >
            <div className="summary-tab-label">
              <div className={`summary-tab-icon summary-tab-icon-statistics ${activeTab === 'statistics' ? 'active' : ''}`}>
                <BarChart3 className="w-5 h-5" />
              </div>
              <span className="font-medium">통계</span>
            </div>
            <div className={`summary-tab-indicator summary-tab-indicator-statistics ${activeTab === 'statistics' ? 'active' : ''}`}>
              {activeTab === 'statistics' ? '✓' : '→'}
            </div>
          </button>
          
          {/* 정렬 */}
          <div className="summary-sort-section">
            <label className="summary-sort-label">
              <span>🔄</span>
              <span>정렬</span>
            </label>
            <select
              value={sortType}
              onChange={(e) => onSortChange(e.target.value as SortType)}
              className="summary-sort-select"
            >
              <option value="latest">최신순</option>
              <option value="oldest">오래된순</option>
              <option value="rating-high">별점 높은순</option>
              <option value="rating-low">별점 낮은순</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}