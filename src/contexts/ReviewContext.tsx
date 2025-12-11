import React, { createContext, useContext, useReducer, useCallback, useEffect, ReactNode } from 'react';
import { Review } from '../types/review';

// State Context
interface ReviewState {
  reviews: Review[];
}

const ReviewStateContext = createContext<ReviewState | undefined>(undefined);

// Dispatch Context
interface ReviewDispatchContextType {
  onCreate: (review: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdate: (id: string, review: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onDelete: (id: string) => void;
}

const ReviewDispatchContext = createContext<ReviewDispatchContextType | undefined>(undefined);

// Reducer
type Action =
  | { type: 'SET_REVIEWS'; payload: Review[] }
  | { type: 'CREATE_REVIEW'; payload: Review }
  | { type: 'UPDATE_REVIEW'; payload: Review }
  | { type: 'DELETE_REVIEW'; payload: string };

function reviewReducer(state: ReviewState, action: Action): ReviewState {
  switch (action.type) {
    case 'SET_REVIEWS':
      return { reviews: action.payload };
    case 'CREATE_REVIEW':
      return { reviews: [action.payload, ...state.reviews] };
    case 'UPDATE_REVIEW':
      return {
        reviews: state.reviews.map((review) =>
          review.id === action.payload.id ? action.payload : review
        ),
      };
    case 'DELETE_REVIEW':
      return {
        reviews: state.reviews.filter((review) => review.id !== action.payload),
      };
    default:
      return state;
  }
}

// Provider
const STORAGE_KEY = 'review-log-data';

export function ReviewProvider({ children }: { children: ReactNode }) {
  // localStorage에서 초기 데이터 로드
  const getInitialState = (): ReviewState => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { reviews: JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Failed to load reviews from localStorage:', error);
    }
    return { reviews: [] };
  };

  const [state, dispatch] = useReducer(reviewReducer, null, getInitialState);

  // state 변경 시 localStorage에 저장
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.reviews));
    } catch (error) {
      console.error('Failed to save reviews to localStorage:', error);
    }
  }, [state.reviews]);

  // useCallback으로 메모이제이션된 함수들
  const onCreate = useCallback((reviewData: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newReview: Review = {
      ...reviewData,
      id: `review-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      updatedAt: now,
    };
    dispatch({ type: 'CREATE_REVIEW', payload: newReview });
  }, []);

  const onUpdate = useCallback((id: string, reviewData: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>) => {
    const existingReview = state.reviews.find((r) => r.id === id);
    if (!existingReview) return;

    const updatedReview: Review = {
      ...reviewData,
      id,
      createdAt: existingReview.createdAt,
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: 'UPDATE_REVIEW', payload: updatedReview });
  }, [state.reviews]);

  const onDelete = useCallback((id: string) => {
    dispatch({ type: 'DELETE_REVIEW', payload: id });
  }, []);

  return (
    <ReviewStateContext.Provider value={state}>
      <ReviewDispatchContext.Provider value={{ onCreate, onUpdate, onDelete }}>
        {children}
      </ReviewDispatchContext.Provider>
    </ReviewStateContext.Provider>
  );
}

// Custom Hooks
export function useReviewState() {
  const context = useContext(ReviewStateContext);
  if (context === undefined) {
    throw new Error('useReviewState must be used within a ReviewProvider');
  }
  return context;
}

export function useReviewDispatch() {
  const context = useContext(ReviewDispatchContext);
  if (context === undefined) {
    throw new Error('useReviewDispatch must be used within a ReviewProvider');
  }
  return context;
}
