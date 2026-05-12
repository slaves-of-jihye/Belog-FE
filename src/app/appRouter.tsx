import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../entities/user/model/AuthProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { BoardProvider } from './providers/BoardProvider';
import { DeadlineProvider } from './providers/DeadlineProvider';
import { Header } from '../widgets/Header/ui/Header';
import { Footer } from '../shared/ui/Footer';
import { Layout } from '../shared/ui/Layout';
import { BoardPage } from '../pages/BoardPage/ui/BoardPage';
import { LoginForm } from '../features/auth/ui/LoginForm';
import { ProtectedRoute } from '../features/auth/ui/ProtectedRoute';
import { HomePage } from '../pages/HomePage/ui/HomePage';
import { PostPage } from '../pages/PostPage/ui/PostPage';
import { CreatePostPage } from '../pages/CreatePostPage/ui/CreatePostPage';
import { ProfilePage } from '../pages/ProfilePage/ui/ProfilePage';

export function AppRouter() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <BoardProvider>
            <DeadlineProvider>
              <Header />
              <Routes>
                <Route path="/" element={<Layout><HomePage /></Layout>} />
                <Route path="/board/:boardType" element={<BoardPage />} />
                <Route path="/post/:id" element={<Layout><PostPage /></Layout>} />
                <Route path="/create" element={<ProtectedRoute><Layout><CreatePostPage /></Layout></ProtectedRoute>} />
                <Route path="/edit/:id" element={<ProtectedRoute><Layout><CreatePostPage /></Layout></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Layout><ProfilePage /></Layout></ProtectedRoute>} />
                <Route path="/login" element={<Layout><LoginForm /></Layout>} />
              </Routes>
              <Footer />
            </DeadlineProvider>
          </BoardProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
