import type { MenuTree, Permissions, PermissionAction } from '../types/auth.type';

export function hasPermission(
  permissions: Permissions,
  pageName: string,
  action: PermissionAction,
): boolean {
  return permissions[`${pageName}.${action}`] === true;
}

export function hasReadPermission(
  permissions: Permissions,
  pageName: string,
): boolean {
  return hasPermission(permissions, pageName, 'read');
}

/**
 * menuTree에서 read 권한이 없는 메뉴를 재귀적으로 제거합니다.
 * - leaf 노드: 자신의 read 권한 체크
 * - 부모 노드: children 필터링 후 남은 자식이 없으면 부모도 제거
 */
export function filterMenuTree(
  menuTree: MenuTree[],
  permissions: Permissions,
): MenuTree[] {
  return menuTree
    .filter((node) => hasReadPermission(permissions, node.pageName))
    .map((node) => ({
      ...node,
      children: filterMenuTree(node.children, permissions),
    }))
    .filter((node) => node.children.length > 0 || !hasChildren(menuTree, node.pageName))
    .sort((a, b) => a.order - b.order);
}

function hasChildren(originalTree: MenuTree[], pageName: string): boolean {
  const original = originalTree.find((n) => n.pageName === pageName);
  return !!original && original.children.length > 0;
}

/**
 * menuTree를 flat하게 펼쳐서 path → displayName 맵을 생성합니다.
 * breadcrumb 등에서 경로 이름 조회에 사용됩니다.
 */
export function buildPathNameMap(menuTree: MenuTree[]): Record<string, string> {
  const map: Record<string, string> = {};

  function traverse(nodes: MenuTree[]) {
    for (const node of nodes) {
      if (node.path && !node.path.includes(':')) {
        map[node.path] = node.displayName;
      }
      if (node.children.length > 0) {
        traverse(node.children);
      }
    }
  }

  traverse(menuTree);
  return map;
}
