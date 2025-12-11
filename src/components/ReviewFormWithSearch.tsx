import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Star, Search, Film, X } from 'lucide-react';
import { Review, MovieDetails, MovieSearchResult } from '../types/review';
import { searchMovies, getMovieDetails, getPosterUrl, getGenreNames } from '../services/tmdb';
import { useNavigate } from 'react-router-dom';
import './ReviewFormWithSearch.css';

interface ReviewFormWithSearchProps {
  initialData?: Review;
  onSubmit: (data: any) => void;
  submitLabel: string;
  existingReviews?: Review[];
  currentReviewId?: string;
}

export function ReviewFormWithSearch({
  initialData,
  onSubmit,
  submitLabel,
  existingReviews,
  currentReviewId,
}: ReviewFormWithSearchProps) {
  const navigate = useNavigate();
  
  // 검색 관련
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MovieSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 선택된 영화 정보
  const [selectedMovie, setSelectedMovie] = useState<MovieDetails | null>(
    initialData ? {
      id: initialData.tmdbId || 0,
      title: initialData.title,
      poster_path: initialData.posterUrl || null,
      release_date: initialData.releaseYear || '',
      overview: '',
      director: initialData.creatorName,
      genres: initialData.genres || [],
    } : null
  );

  // 리뷰 정보
  const [rating, setRating] = useState(initialData?.rating || 5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [content, setContent] = useState(initialData?.content || '');

  // 실시간 검색
  useEffect(() => {
    // 이전 타이머 취소
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // 검색어가 비어있으면 결과 초기화
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    // 검색어가 2글자 이상일 때만 검색
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    // 디바운스: 500ms 후 검색 실행
    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await searchMovies(searchQuery);
        setSearchResults(results);
        setShowDropdown(true);
      } catch (error) {
        console.error('검색 실패:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 영화 선택
  const handleSelectMovie = async (movie: MovieSearchResult) => {
    // 중복 체크: 이미 리뷰한 영화인지 확인
    if (existingReviews && existingReviews.length > 0) {
      const isDuplicate = existingReviews.some((review) => {
        // 수정 중인 경우 현재 리뷰는 제외
        if (currentReviewId && review.id === currentReviewId) {
          return false;
        }
        // TMDB ID로 중복 체크
        return review.tmdbId === movie.id;
      });

      if (isDuplicate) {
        alert('이미 리뷰한 영화입니다.');
        return;
      }
    }

    try {
      const details = await getMovieDetails(movie.id);
      if (details) {
        setSelectedMovie(details);
        setShowDropdown(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('영화 정보 조회 실패:', error);
    }
  };

  // 선택 취소
  const handleClearSelection = () => {
    setSelectedMovie(null);
    setSearchResults([]);
    setShowDropdown(false);
  };

  // 폼 제출
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedMovie) {
      alert('영화를 검색하여 선택해주세요.');
      return;
    }

    if (!content.trim()) {
      alert('리뷰 내용을 입력해주세요.');
      return;
    }

    onSubmit({
      title: selectedMovie.title,
      creatorName: selectedMovie.director,
      rating,
      content: content.trim(),
      posterUrl: selectedMovie.poster_path ? getPosterUrl(selectedMovie.poster_path) : undefined,
      tmdbId: selectedMovie.id || undefined,
      releaseYear: selectedMovie.release_date ? selectedMovie.release_date.split('-')[0] : undefined,
      genres: selectedMovie.genres || undefined,
    });

    // 등록 후 홈으로 이동
    navigate('/');
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit} className="review-form-with-search">
      {/* 영화 검색 섹션 */}
      <div className="search-section">
        <label className="search-label">
          <span className="search-label-icon">
            <Search className="w-4 h-4" />
          </span>
          <span>영화 검색 *</span>
        </label>

        {/* 선택된 영화 표시 */}
        {selectedMovie ? (
          <div className="selected-movie-card">
            <div className="selected-movie-content">
              {selectedMovie.poster_path && (
                <div className="selected-movie-poster">
                  <img
                    src={getPosterUrl(selectedMovie.poster_path)}
                    alt={selectedMovie.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="selected-movie-info">
                <h3 className="selected-movie-title">{selectedMovie.title}</h3>
                <p className="selected-movie-director">감독: {selectedMovie.director}</p>
                {selectedMovie.release_date && (
                  <p className="selected-movie-year">개봉: {selectedMovie.release_date.split('-')[0]}</p>
                )}
                {selectedMovie.genres && selectedMovie.genres.length > 0 && (
                  <div className="selected-movie-genres">
                    {selectedMovie.genres.map((genre, index) => (
                      <span
                        key={index}
                        className="selected-movie-genre"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={handleClearSelection}
                className="movie-clear-btn"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* 검색 입력 - 드롭다운 형식 */}
            <div className="search-input-wrapper" ref={dropdownRef}>
              <div className="search-input-container">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (searchResults.length > 0) {
                      setShowDropdown(true);
                    }
                  }}
                  placeholder="영화 제목을 입력하세요 (예: 인터)"
                  className="search-input"
                />
                <Search className={`w-5 h-5 search-icon ${isSearching ? 'searching' : ''}`} />
                
                {isSearching && (
                  <div className="search-loading-spinner">
                    <div className="search-loading-spinner-inner"></div>
                  </div>
                )}
              </div>

              <p className="search-hint">
                💡 영화 제목을 입력하면 자동으로 검색됩니다
              </p>

              {/* 드롭다운 검색 결과 */}
              {showDropdown && searchQuery.trim().length >= 2 && (
                <div className="search-dropdown">
                  {searchResults.length === 0 && !isSearching ? (
                    <div className="search-dropdown-empty">
                      <Film className="search-dropdown-empty-icon" />
                      <p className="text-gray-600">검색 결과가 없습니다</p>
                      <p className="text-sm text-gray-500 mt-1">다른 제목으로 검색해보세요</p>
                    </div>
                  ) : (
                    <div className="search-dropdown-results">
                      {searchResults.map((movie) => {
                        const genres = getGenreNames(movie.genre_ids);
                        return (
                          <button
                            key={movie.id}
                            type="button"
                            onClick={() => handleSelectMovie(movie)}
                            className="search-result-item"
                          >
                            <div className="search-result-poster">
                              {movie.poster_path ? (
                                <img
                                  src={getPosterUrl(movie.poster_path)}
                                  alt={movie.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="search-result-poster-placeholder">
                                  <Film className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="search-result-info">
                              <h4 className="search-result-title">{movie.title}</h4>
                              <div className="search-result-meta">
                                {movie.release_date && (
                                  <span className="search-result-year">{movie.release_date.split('-')[0]}</span>
                                )}
                                {genres.length > 0 && (
                                  <>
                                    <span className="search-result-separator">•</span>
                                    <span className="search-result-genres">
                                      {genres.slice(0, 3).join(', ')}
                                    </span>
                                  </>
                                )}
                              </div>
                              {movie.overview && (
                                <p className="search-result-overview">{movie.overview}</p>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* 별점 선택 */}
      <div className="rating-section">
        <label className="rating-label">
          <span className="rating-label-icon">⭐</span>
          <span>별점 *</span>
        </label>
        <div className="rating-container">
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="rating-star"
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
          <div className="rating-display">
            <span className="rating-value">
              <span className="rating-number">{rating}</span>
              <span className="rating-max"> / 5</span>
            </span>
          </div>
        </div>
      </div>

      {/* 리뷰 내용 */}
      <div className="content-section">
        <label className="content-label">
          <span className="content-label-icon">✍️</span>
          <span>리뷰 내용 *</span>
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="이 작품에 대한 당신의 생각을 자유롭게 작성해주세요"
          rows={10}
          className="content-textarea"
          required
        />
      </div>

      {/* 버튼 */}
      <div className="form-actions">
        <button
          type="button"
          onClick={handleCancel}
          className="form-cancel-btn"
        >
          취소
        </button>
        <button
          type="submit"
          className="form-submit-btn"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}