export interface Review {
  id: string;
  title: string;
  creatorName: string; // 감독
  rating: number; // 1-5
  content: string;
  posterUrl?: string; // 영화 포스터 이미지 URL
  tmdbId?: number; // TMDB API ID
  releaseYear?: string; // 개봉년도
  genres?: string[]; // 장르 목록
  createdAt: string;
  updatedAt: string;
}

export interface MovieSearchResult {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  overview: string;
  genre_ids: number[]; // 장르 ID 배열
}

export interface MovieDetails {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  overview: string;
  director: string;
  genres: string[]; // 장르 이름 배열
}