import { useMemo, useState, useCallback } from 'react';
import { Checkbox, Tooltip, Spin, Popover, Button, Badge, Divider } from 'antd';
import {
  RightOutlined,
  DownOutlined,
  FolderOutlined,
  FileOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  StopOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import type { AdminPageListItem } from '@features/admin-page';
import type { AdminPermissionListItem } from '../../types/admin-permission.type';
import styles from './admin-permission-matrix.module.css';

interface TreeNode extends AdminPageListItem {
  children: TreeNode[];
  depth: number;
}

export interface MatrixAction {
  actionId: number;
  actionName: string;
  displayName: string | null;
}

interface AdminPermissionMatrixProps {
  pages: AdminPageListItem[];
  actions: MatrixAction[];
  permissions: AdminPermissionListItem[];
  loading?: boolean;
  onCreate?: (pageId: number, actionId: number) => void;
  onDetail?: (permissionId: number) => void;
  onEdit?: (permission: AdminPermissionListItem) => void;
  onToggleStatus?: (permission: AdminPermissionListItem) => void;
  onDelete?: (permission: AdminPermissionListItem) => void;
}

/** pageId-actionId → permissionId lookup */
function buildPermissionMap(permissions: AdminPermissionListItem[]) {
  const map = new Map<string, AdminPermissionListItem>();
  for (const p of permissions) {
    map.set(`${p.pageId}-${p.actionId}`, p);
  }
  return map;
}

/** Flat page list → tree sorted by sortOrder */
function buildTree(pages: AdminPageListItem[]): TreeNode[] {
  const map = new Map<number, TreeNode>();
  const roots: TreeNode[] = [];

  for (const p of pages) {
    map.set(p.pageId, { ...p, children: [], depth: 0 });
  }

  for (const node of map.values()) {
    if (node.parentId && map.has(node.parentId)) {
      map.get(node.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  const sort = (nodes: TreeNode[]) => {
    nodes.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    for (const n of nodes) sort(n.children);
  };
  sort(roots);

  // Assign depths
  const assignDepth = (nodes: TreeNode[], depth: number) => {
    for (const n of nodes) {
      n.depth = depth;
      assignDepth(n.children, depth + 1);
    }
  };
  assignDepth(roots, 0);

  return roots;
}

/** Flatten tree into ordered list for rendering */
function flattenTree(nodes: TreeNode[], expandedSet: Set<number>): TreeNode[] {
  const result: TreeNode[] = [];
  const walk = (list: TreeNode[]) => {
    for (const node of list) {
      result.push(node);
      if (node.children.length > 0 && expandedSet.has(node.pageId)) {
        walk(node.children);
      }
    }
  };
  walk(nodes);
  return result;
}

export default function AdminPermissionMatrix({
  pages,
  actions,
  permissions,
  loading,
  onCreate,
  onDetail,
  onEdit,
  onToggleStatus,
  onDelete,
}: AdminPermissionMatrixProps) {
  const tree = useMemo(() => buildTree(pages), [pages]);
  const permMap = useMemo(() => buildPermissionMap(permissions), [permissions]);

  // All nodes collapsed by default
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const flatNodes = useMemo(() => flattenTree(tree, expanded), [tree, expanded]);

  // Track which popover is open (only one at a time)
  const [openPopover, setOpenPopover] = useState<string | null>(null);

  const toggleExpand = useCallback((pageId: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(pageId)) next.delete(pageId);
      else next.add(pageId);
      return next;
    });
  }, []);

  const expandAll = useCallback(() => setExpanded(new Set(pages.map((p) => p.pageId))), [pages]);
  const collapseAll = useCallback(() => setExpanded(new Set()), []);

  if (loading) {
    return (
      <div className={styles.loading}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.tableControls}>
        <button type="button" className={styles.expandBtn} onClick={expandAll}>
          모두 펼치기
        </button>
        <span className={styles.controlDivider}>|</span>
        <button type="button" className={styles.expandBtn} onClick={collapseAll}>
          모두 접기
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.matrix}>
          <thead>
            <tr>
              <th className={styles.pageHeader}>페이지</th>
              {actions.map((action) => (
                <th key={action.actionId} className={styles.actionHeader}>
                  <Tooltip title={action.displayName || action.actionName}>
                    {action.displayName || action.actionName}
                  </Tooltip>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {flatNodes.length === 0 && (
              <tr>
                <td colSpan={actions.length + 1} className={styles.empty}>
                  등록된 페이지가 없습니다.
                </td>
              </tr>
            )}
            {flatNodes.map((node) => {
              const hasChildren = node.children.length > 0;
              const isExpanded = expanded.has(node.pageId);

              return (
                <tr key={node.pageId} className={node.depth === 0 ? styles.parentRow : styles.childRow}>
                  <td className={styles.pageCell}>
                    <div className={styles.pageName} style={{ paddingLeft: node.depth * 24 }}>
                      {hasChildren ? (
                        <button
                          type="button"
                          className={styles.toggleBtn}
                          onClick={() => toggleExpand(node.pageId)}
                          aria-label={isExpanded ? '접기' : '펼치기'}
                        >
                          {isExpanded ? <DownOutlined /> : <RightOutlined />}
                        </button>
                      ) : (
                        <span className={styles.togglePlaceholder} />
                      )}
                      <span className={styles.pageIcon}>
                        {hasChildren ? <FolderOutlined /> : <FileOutlined />}
                      </span>
                      <span className={styles.pageDisplayName}>{node.displayName}</span>
                      <span className={styles.pageCode}>{node.pageName}</span>
                    </div>
                  </td>
                  {actions.map((action) => {
                    const key = `${node.pageId}-${action.actionId}`;
                    const perm = permMap.get(key);
                    const isInactive = perm && !perm.isActive;

                    return (
                      <td key={action.actionId} className={styles.actionCell}>
                        {perm ? (
                          <Popover
                            open={openPopover === key}
                            onOpenChange={(visible) => setOpenPopover(visible ? key : null)}
                            trigger="click"
                            placement="bottom"
                            content={
                              <div className={styles.popoverContent}>
                                <div className={styles.popoverHeader}>
                                  <span className={styles.popoverLabel}>
                                    {perm.displayName || `${node.displayName} - ${action.displayName || action.actionName}`}
                                  </span>
                                  <Badge
                                    status={perm.isActive ? 'success' : 'error'}
                                    text={perm.isActive ? '활성' : '비활성'}
                                    className={styles.popoverBadge}
                                  />
                                </div>
                                <Divider className={styles.popoverDivider} />
                                <div className={styles.popoverActions}>
                                  <Button
                                    size="small"
                                    type="text"
                                    icon={<EyeOutlined />}
                                    className={styles.popoverBtn}
                                    onClick={() => { setOpenPopover(null); onDetail?.(perm.permissionId); }}
                                  >
                                    상세
                                  </Button>
                                  <Button
                                    size="small"
                                    type="text"
                                    icon={<EditOutlined />}
                                    className={styles.popoverBtn}
                                    onClick={() => { setOpenPopover(null); onEdit?.(perm); }}
                                  >
                                    수정
                                  </Button>
                                  <Button
                                    size="small"
                                    type="text"
                                    icon={perm.isActive ? <StopOutlined /> : <CheckCircleOutlined />}
                                    danger={!!perm.isActive}
                                    className={styles.popoverBtn}
                                    onClick={() => { setOpenPopover(null); onToggleStatus?.(perm); }}
                                  >
                                    {perm.isActive ? '비활성화' : '활성화'}
                                  </Button>
                                  <Button
                                    size="small"
                                    type="text"
                                    icon={<DeleteOutlined />}
                                    danger
                                    className={styles.popoverBtn}
                                    onClick={() => { setOpenPopover(null); onDelete?.(perm); }}
                                  >
                                    삭제
                                  </Button>
                                </div>
                              </div>
                            }
                          >
                            <Tooltip title={isInactive ? '비활성 권한' : '활성 권한'}>
                              {isInactive ? (
                                <span className={styles.inactiveIcon}>
                                  <StopOutlined />
                                </span>
                              ) : (
                                <span className={styles.activeIcon}>
                                  <Checkbox checked />
                                </span>
                              )}
                            </Tooltip>
                          </Popover>
                        ) : (
                          <Tooltip title={`${node.displayName} - ${action.displayName || action.actionName} 권한 추가`}>
                            <button
                              type="button"
                              className={styles.addBtn}
                              onClick={() => onCreate?.(node.pageId, action.actionId)}
                            >
                              <PlusOutlined />
                            </button>
                          </Tooltip>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
