import { MovieSearchResult, MovieDetails } from '../types/review';

// TMDB API 키 
const TMDB_API_KEY = 'b021a1c5cb08be3eaa00cd7bc3c18ad2';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// 장르 ID to 이름 매핑
const GENRE_MAP: { [key: number]: string } = {
  28: '액션',
  12: '모험',
  16: '애니메이션',
  35: '코미디',
  80: '범죄',
  99: '다큐멘터리',
  18: '드라마',
  10751: '가족',
  14: '판타지',
  36: '역사',
  27: '공포',
  10402: '음악',
  9648: '미스터리',
  10749: '로맨스',
  878: 'SF',
  10770: 'TV 영화',
  53: '스릴러',
  10752: '전쟁',
  37: '서부',
};

// 장르 ID를 이름으로 변환
const getGenreNames = (genreIds: number[]): string[] => {
  return genreIds.map(id => GENRE_MAP[id] || '기타').filter((name, index, self) => self.indexOf(name) === index);
};

// 영화 검색
export const searchMovies = async (query: string): Promise<MovieSearchResult[]> => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=ko-KR`
    );

    if (!response.ok) {
      throw new Error('영화 검색에 실패했습니다');
    }

    const data = await response.json();
    return (data.results || []).slice(0, 10);
  } catch (error) {
    console.error('TMDB API Error (searchMovies):', error);
    return [];
  }
};

// 영화 상세 정보 조회 (감독 및 장르 정보 포함)
export const getMovieDetails = async (movieId: number): Promise<MovieDetails | null> => {
  try {
    // 영화 기본 정보
    const movieResponse = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=ko-KR`
    );

    if (!movieResponse.ok) {
      throw new Error('영화 정보를 가져올 수 없습니다');
    }

    const movieData = await movieResponse.json();

    // 크레딧 정보 (감독)
    const creditsResponse = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}/credits?api_key=${TMDB_API_KEY}`
    );

    let director = '정보 없음';
    if (creditsResponse.ok) {
      const creditsData = await creditsResponse.json();
      const directorInfo = creditsData.crew.find((person: any) => person.job === 'Director');
      if (directorInfo) {
        director = directorInfo.name;
      }
    }

    // 장르 정보 추출
    const genres = movieData.genres ? movieData.genres.map((g: any) => g.name) : [];

    return {
      id: movieData.id,
      title: movieData.title,
      poster_path: movieData.poster_path,
      release_date: movieData.release_date,
      overview: movieData.overview,
      director,
      genres,
    };
  } catch (error) {
    console.error('TMDB API Error (getMovieDetails):', error);
    return null;
  }
};

// 포스터 URL 생성
export const getPosterUrl = (posterPath: string | null): string | undefined => {
  if (!posterPath) return undefined;
  return `${TMDB_IMAGE_BASE_URL}${posterPath}`;
};

export { getGenreNames };