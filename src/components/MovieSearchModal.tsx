import React, { useState, useCallback } from 'react';
import { Search, X, Film, Calendar } from 'lucide-react';
import { MovieSearchResult, MovieDetails } from '../types/review';
import { searchMovies, getMovieDetails, getPosterUrl } from '../services/tmdb';
import './MovieSearchModal.css';

interface MovieSearchModalProps {
  onSelect: (movie: MovieDetails) => void;
  onClose: () => void;
}

export function MovieSearchModal({ onSelect, onClose }: MovieSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MovieSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    try {
      const results = await searchMovies(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('검색 실패:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery]);

  const handleSelectMovie = async (movie: MovieSearchResult) => {
    try {
      const details = await getMovieDetails(movie.id);
      if (details) {
        onSelect(details);
        onClose();
      }
    } catch (error) {
      console.error('영화 정보 조회 실패:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* 헤더 */}
        <div className="modal-header">
          <div className="modal-header-icon">
            <div className="modal-header-icon-bg">
              <Film className="w-5 h-5 text-white" />
            </div>
            <h2 className="modal-title">
              영화 검색
            </h2>
          </div>
          <button
            onClick={onClose}
            className="modal-close-btn"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* 검색 입력 */}
        <div className="modal-search-section">
          <div className="modal-search-form">
            <div className="modal-search-input-wrapper">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="영화 제목을 입력하세요 (예: 인터스텔라)"
                className="modal-search-input"
              />
              <Search className="w-5 h-5 text-gray-400 modal-search-icon" />
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="modal-search-btn"
            >
              {isSearching ? '검색 중...' : '검색'}
            </button>
          </div>
          <p className="modal-search-hint">
            💡 TMDB API 키를 설정하지 않은 경우 샘플 데이터가 표시됩니다
          </p>
        </div>

        {/* 검색 결과 */}
        <div className="modal-results">
          {!hasSearched ? (
            <div className="modal-empty-state">
              <div className="modal-empty-icon modal-empty-icon-search">
                <Search className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-gray-600 mb-2">영화를 검색하세요</h3>
              <p className="text-gray-500">제목을 입력하고 검색 버튼을 눌러주세요</p>
            </div>
          ) : isSearching ? (
            <div className="modal-empty-state">
              <div className="modal-loading-icon"></div>
              <p className="text-gray-600">검색 중...</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="modal-empty-state">
              <div className="modal-empty-icon modal-empty-icon-gray">
                <Film className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-gray-600 mb-2">검색 결과가 없습니다</h3>
              <p className="text-gray-500">다른 제목으로 검색해보세요</p>
            </div>
          ) : (
            <div className="modal-results-list">
              {searchResults.map((movie) => (
                <button
                  key={movie.id}
                  onClick={() => handleSelectMovie(movie)}
                  className="modal-movie-item"
                >
                  {/* 포스터 */}
                  <div className="modal-movie-poster">
                    {movie.poster_path ? (
                      <img
                        src={getPosterUrl(movie.poster_path)}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="modal-movie-poster-placeholder">
                        <Film className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* 정보 */}
                  <div className="modal-movie-info">
                    <h3 className="modal-movie-title">
                      {movie.title}
                    </h3>
                    {movie.release_date && (
                      <div className="modal-movie-year">
                        <Calendar className="w-3 h-3" />
                        <span>{movie.release_date.split('-')[0]}</span>
                      </div>
                    )}
                    {movie.overview && (
                      <p className="modal-movie-overview">
                        {movie.overview}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
