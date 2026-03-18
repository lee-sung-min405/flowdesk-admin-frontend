import type { MenuProps } from 'antd';
import type { MenuTree } from '@features/auth/types/auth.type';
import { menuIconMap } from './menu-icon-map';

type MenuItem = Required<MenuProps>['items'][number];

/**
 * 서버에서 내려온 MenuTree[]를 Ant Design Menu의 items 배열로 변환합니다.
 * - key: node.path (라우팅용)
 * - icon: menuIconMap에서 pageName으로 조회
 * - children: 재귀 변환 (빈 배열이면 생략)
 */
export function buildMenuItems(menuTree: MenuTree[]): MenuItem[] {
  return menuTree.map((node): MenuItem => {
    const hasChildren = node.children.length > 0;

    if (hasChildren) {
      return {
        key: node.pageName,
        icon: menuIconMap[node.pageName] ?? null,
        label: node.displayName,
        children: buildMenuItems(node.children),
      };
    }

    return {
      key: node.path,
      icon: menuIconMap[node.pageName] ?? null,
      label: node.displayName,
    };
  });
}
