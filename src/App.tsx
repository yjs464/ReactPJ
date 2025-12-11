import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ReviewProvider } from './contexts/ReviewContext';
import { Home } from './pages/Home';
import { NewReview } from './pages/NewReview';
import { EditReview } from './pages/EditReview';

export default function App() {
  return (
    <ReviewProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/new" element={<NewReview />} />
          <Route path="/edit/:id" element={<EditReview />} />
        </Routes>
      </Router>
    </ReviewProvider>
  );
}
