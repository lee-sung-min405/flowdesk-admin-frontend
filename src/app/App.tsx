import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginPage from '@pages/login/login-page';
import SignupPage from '@pages/signup/signup-page';
import DashboardPage from '@pages/dashboard/dashboard-page';
import MypagePage from '@pages/mypage/mypage-page';
import UserPage from '@pages/user/user-page';
import { ProtectedRoute } from './ProtectedRoute';
import MainLayout from './layouts/main-layout';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* 인증 필요 + MainLayout 적용 라우트 */}
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/mypage" element={<MypagePage />} />
            <Route path="/users" element={<UserPage />} />
          </Route>

          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
