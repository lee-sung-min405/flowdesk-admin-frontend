import { useMemo } from 'react';
import { useAuthStore } from './auth.store';
import {
  filterMenuTree,
  hasPermission as checkPermission,
  buildPathNameMap,
} from '../lib/permission';
import type { PermissionAction, UseMeReturn } from '../types/auth.type';

export function useMe(): UseMeReturn {
  const me = useAuthStore((state) => state.me);

  const menuTree = useMemo(
    () => (me ? filterMenuTree(me.menuTree, me.permissions) : []),
    [me],
  );

  const pathNameMap = useMemo(() => buildPathNameMap(menuTree), [menuTree]);

  const permissions = me?.permissions ?? {};

  const hasPermission = useMemo(
    () => (pageName: string, action: PermissionAction) =>
      checkPermission(permissions, pageName, action),
    [permissions],
  );

  return { me, menuTree, pathNameMap, permissions, hasPermission };
}
