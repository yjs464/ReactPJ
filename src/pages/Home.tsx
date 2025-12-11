import React, { useState, useMemo } from 'react';
import { useReviewState, useReviewDispatch } from '../contexts/ReviewContext';
import { SummaryCard } from '../components/SummaryCard';
import { ReviewList } from '../components/ReviewList';
import { StatisticsDashboard } from '../components/StatisticsDashboard';
import { Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

type TabType = 'reviews' | 'statistics';
type SortType = 'latest' | 'oldest' | 'rating-high' | 'rating-low';

export function Home() {
  const { reviews } = useReviewState();
  const { onDelete } = useReviewDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TabType>('reviews');
  const [sortType, setSortType] = useState<SortType>('latest');
  const [searchQuery, setSearchQuery] = useState<string>('');

  return (
    <div className="home-container">
      {/* 배경 장식 */}
      <div className="home-bg-decoration">
        <div className="home-bg-blob home-bg-blob-1"></div>
        <div className="home-bg-blob home-bg-blob-2"></div>
        <div className="home-bg-blob home-bg-blob-3"></div>
      </div>

      <div className="home-content">
        {/* 헤더 */}
        <div className="home-header">
          <div className="home-header-content">
            <div>
              <div className="home-header-info">
                <div className="home-header-icon">
                  🎬
                </div>
                <div>
                  <h1 className="home-header-title">
                    무비 아카이브
                  </h1>
                  <p className="home-header-subtitle">나만의 영화 리뷰를 기록하고 관리하세요</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/new')}
              className="home-new-review-btn"
            >
              <Plus className="w-5 h-5" />
              새 리뷰 작성
            </button>
          </div>
        </div>

        {/* Summary Card with Tabs */}
        <div className="home-main-section">
          <div className="home-summary-section">
            <SummaryCard 
              reviews={reviews} 
              activeTab={activeTab}
              onTabChange={setActiveTab}
              sortType={sortType}
              onSortChange={setSortType}
            />
          </div>
          
          {/* 영화 검색 카드 */}
          <div className="home-search-section">
            <div className="home-search-card">
              <div className="home-search-bg-decoration"></div>
              
              <div className="home-search-content">
                <div className="home-search-header">
                  <div className="home-search-icon">
                    <Search className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="home-search-title">
                    영화 검색
                  </h2>
                </div>
                
                <div className="home-search-body">
                  <div className="home-search-input-wrapper">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="영화 제목 입력..."
                      className="home-search-input"
                    />
                    <Search className="w-5 h-5 home-search-input-icon text-gray-400" />
                  </div>
                  
                  <div className="home-search-hint">
                    <p className="home-search-hint-text">
                      💡 리뷰한 영화를 제목으로 검색할 수 있습니다
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 탭 컨텐츠 */}
        {activeTab === 'reviews' ? (
          <ReviewList 
            reviews={reviews} 
            onDelete={onDelete} 
            selectedGenre="all"
            sortType={sortType}
            searchQuery={searchQuery}
          />
        ) : (
          <StatisticsDashboard reviews={reviews} />
        )}
      </div>
    </div>
  );
}