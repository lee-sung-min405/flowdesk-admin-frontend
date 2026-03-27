import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@features/auth/model/auth.store';
import { authStorage } from '@features/auth/lib/auth-storage';
import { useMe } from '@features/auth/model/use-me';
import type { MenuTree } from '@features/auth/types/auth.type';

/** menuTree에서 모든 리프 노드의 path를 추출 */
function collectPaths(tree: MenuTree[]): string[] {
  const paths: string[] = [];
  for (const node of tree) {
    if (node.path) paths.push(node.path);
    if (node.children?.length) paths.push(...collectPaths(node.children));
  }
  return paths;
}

/** 권한 검사를 건너뛰는 경로 */
const PUBLIC_PATHS = ['/home', '/mypage'];

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const storeToken = useAuthStore((state) => state.accessToken);
  const isLoggedIn = !!storeToken || !!authStorage.getAccessToken();
  const { me, menuTree } = useMe();
  const { pathname } = useLocation();

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  // me가 아직 로드되지 않았거나 공통 경로는 통과
  if (!me || PUBLIC_PATHS.includes(pathname)) return children;

  // menuTree에서 허용된 경로 목록 추출
  const allowedPaths = collectPaths(menuTree);
  if (!allowedPaths.includes(pathname)) {
    return <Navigate to="/403" replace />;
  }

  return children;
}
