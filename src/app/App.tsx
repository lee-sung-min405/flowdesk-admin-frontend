import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Spin } from 'antd';
import { ProtectedRoute } from './ProtectedRoute';
import MainLayout from './layouts/main-layout';

const LoginPage = lazy(() => import('@pages/login/login-page'));
const SignupPage = lazy(() => import('@pages/signup/signup-page'));
const DashboardPage = lazy(() => import('@pages/dashboard/dashboard-page'));
const MypagePage = lazy(() => import('@pages/mypage/mypage-page'));
const UserPage = lazy(() => import('@pages/user/user-page'));
const TenantPage = lazy(() => import('@pages/tenant/tenant-page'));
const SuperDashboardPage = lazy(() => import('@pages/super-dashboard/super-dashboard-page'));
const AdminPageManagePage = lazy(() => import('@pages/admin-page-manage/admin-page-manage-page'));
const AdminActionManagePage = lazy(() => import('@pages/admin-action-manage/admin-action-manage-page'));
const AdminPermissionManagePage = lazy(() => import('@pages/admin-permission-manage/admin-permission-manage-page'));
const PermissionCatalogPage = lazy(() => import('@pages/permission-catalog/permission-catalog-page'));
const RoleManagePage = lazy(() => import('@pages/role-manage/role-manage-page'));
const TenantStatusManagePage = lazy(() => import('@pages/tenant-status-manage/tenant-status-manage-page'));

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
        <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}><Spin size="large" /></div>}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* 인증 필요 + MainLayout 적용 라우트 */}
            <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/mypage" element={<MypagePage />} />
              <Route path="/users" element={<UserPage />} />
              <Route path="/tenants" element={<TenantPage />} />
              <Route path="/super/dashboard" element={<SuperDashboardPage />} />
              <Route path="/permissions/admin/pages" element={<AdminPageManagePage />} />
              <Route path="/permissions/admin/actions" element={<AdminActionManagePage />} />
              <Route path="/permissions/admin/permissions" element={<AdminPermissionManagePage />} />
              <Route path="/permissions/catalog" element={<PermissionCatalogPage />} />
              <Route path="/roles" element={<RoleManagePage />} />
              <Route path="/tenants/status" element={<TenantStatusManagePage />} />
            </Route>

            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
