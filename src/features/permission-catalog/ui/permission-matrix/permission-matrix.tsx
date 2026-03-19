import { useMemo, useState, useCallback } from 'react';
import { Spin, Empty, Tooltip, Tag } from 'antd';
import { CheckCircleFilled, RightOutlined, DownOutlined, FolderOutlined, FileOutlined } from '@ant-design/icons';
import type {
  GetPermissionCatalogResponse,
  CatalogPage,
  CatalogAction,
  CatalogPermission,
} from '../../types/permission-catalog.type';
import styles from './permission-matrix.module.css';

interface PermissionMatrixProps {
  data: GetPermissionCatalogResponse | undefined;
  loading: boolean;
  searchKeyword?: string;
}

interface TreeNode {
  page: CatalogPage;
  depth: number;
  children: TreeNode[];
}

/** 플랫 페이지 목록을 트리로 변환 */
function buildTree(pages: CatalogPage[]): TreeNode[] {
  const idMap = new Map<number, TreeNode>();
  const roots: TreeNode[] = [];

  for (const page of pages) {
    idMap.set(page.pageId, { page, depth: 0, children: [] });
  }

  for (const page of pages) {
    const node = idMap.get(page.pageId)!;
    if (page.parentId !== null && idMap.has(page.parentId)) {
      const parent = idMap.get(page.parentId)!;
      node.depth = parent.depth + 1;
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }

  // depth를 재귀적으로 보정
  function setDepth(nodes: TreeNode[], depth: number) {
    for (const n of nodes) {
      n.depth = depth;
      setDepth(n.children, depth + 1);
    }
  }
  setDepth(roots, 0);

  // sortOrder 기준 정렬
  function sortNodes(nodes: TreeNode[]) {
    nodes.sort((a, b) => (a.page.sortOrder ?? 0) - (b.page.sortOrder ?? 0));
    for (const n of nodes) sortNodes(n.children);
  }
  sortNodes(roots);

  return roots;
}

/** 트리를 펼친 상태에 따라 플랫 리스트로 변환 */
function flattenTree(
  nodes: TreeNode[],
  expandedIds: Set<number>,
  result: TreeNode[] = [],
): TreeNode[] {
  for (const node of nodes) {
    result.push(node);
    if (node.children.length > 0 && expandedIds.has(node.page.pageId)) {
      flattenTree(node.children, expandedIds, result);
    }
  }
  return result;
}

/** 노드 하위에 존재하는 모든 pageId를 수집 */
function collectAllIds(nodes: TreeNode[], ids: Set<number> = new Set()): Set<number> {
  for (const n of nodes) {
    ids.add(n.page.pageId);
    collectAllIds(n.children, ids);
  }
  return ids;
}

/** 검색 시 매칭된 노드 + 조상 경로를 포함하는 서브트리 필터 */
function filterTree(nodes: TreeNode[], keyword: string): TreeNode[] {
  const result: TreeNode[] = [];
  for (const node of nodes) {
    const selfMatch =
      node.page.displayName.toLowerCase().includes(keyword) ||
      node.page.pageName.toLowerCase().includes(keyword) ||
      (node.page.path && node.page.path.toLowerCase().includes(keyword));

    const filteredChildren = filterTree(node.children, keyword);

    if (selfMatch || filteredChildren.length > 0) {
      result.push({
        ...node,
        children: selfMatch ? node.children : filteredChildren,
      });
    }
  }
  return result;
}

export default function PermissionMatrix({ data, loading, searchKeyword }: PermissionMatrixProps) {
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  const tree = useMemo(() => {
    if (!data) return [];
    return buildTree(data.pages);
  }, [data]);

  // 초기 전체 확장: 트리가 바뀌면 모든 부모 노드를 열어놓기
  useMemo(() => {
    const allParentIds = new Set<number>();
    function collect(nodes: TreeNode[]) {
      for (const n of nodes) {
        if (n.children.length > 0) {
          allParentIds.add(n.page.pageId);
          collect(n.children);
        }
      }
    }
    collect(tree);
    setExpandedIds(allParentIds);
  }, [tree]);

  const filteredTree = useMemo(() => {
    if (!searchKeyword) return tree;
    return filterTree(tree, searchKeyword.toLowerCase());
  }, [tree, searchKeyword]);

  const flatRows = useMemo(() => {
    if (searchKeyword) {
      // 검색 중이면 전체 펼침
      const allIds = collectAllIds(filteredTree);
      return flattenTree(filteredTree, allIds);
    }
    return flattenTree(filteredTree, expandedIds);
  }, [filteredTree, expandedIds, searchKeyword]);

  const toggleExpand = useCallback((pageId: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(pageId)) {
        next.delete(pageId);
      } else {
        next.add(pageId);
      }
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    const allIds = collectAllIds(tree);
    setExpandedIds(allIds);
  }, [tree]);

  const collapseAll = useCallback(() => {
    setExpandedIds(new Set());
  }, []);

  if (loading) {
    return <div className={styles.loadingContainer}><Spin /></div>;
  }

  if (!data) {
    return <Empty description="권한 카탈로그를 불러올 수 없습니다." />;
  }

  const { pages, actions, permissions, matrix } = data;

  if (pages.length === 0) {
    return <Empty description="등록된 페이지가 없습니다." />;
  }

  // permissionId → CatalogPermission 맵 (툴팁용)
  const permissionMap = new Map<number, CatalogPermission>();
  for (const perm of permissions) {
    permissionMap.set(perm.permissionId, perm);
  }

  const getMatrixCell = (pageName: string, action: CatalogAction) => {
    const entries = matrix[pageName];
    if (!entries) return null;
    return entries.find((e) => e.actionName === action.actionName) ?? null;
  };

  const getPagePermissionCount = (pageName: string) => {
    return matrix[pageName]?.length ?? 0;
  };

  if (flatRows.length === 0) {
    return (
      <div className={styles.container}>
        <Empty description="검색 결과가 없습니다." />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.summaryBar}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryNumber}>{pages.length}</span>
          <span className={styles.summaryLabel}>페이지</span>
        </div>
        <div className={styles.summaryDivider} />
        <div className={styles.summaryItem}>
          <span className={styles.summaryNumber}>{actions.length}</span>
          <span className={styles.summaryLabel}>액션</span>
        </div>
        <div className={styles.summaryDivider} />
        <div className={styles.summaryItem}>
          <span className={styles.summaryNumber}>{permissions.length}</span>
          <span className={styles.summaryLabel}>권한</span>
        </div>
        {searchKeyword && (
          <>
            <div className={styles.summaryDivider} />
            <div className={styles.summaryItem}>
              <span className={styles.summaryNumber}>{flatRows.length}</span>
              <span className={styles.summaryLabel}>검색 결과</span>
            </div>
          </>
        )}
        <div className={styles.summaryActions}>
          <button type="button" className={styles.treeToggleBtn} onClick={expandAll}>
            전체 펼치기
          </button>
          <button type="button" className={styles.treeToggleBtn} onClick={collapseAll}>
            전체 접기
          </button>
        </div>
      </div>

      <div className={styles.matrixWrapper}>
        <table className={styles.matrixTable}>
          <thead>
            <tr>
              <th className={styles.stickyCol}>
                <div className={styles.headerPageCell}>페이지</div>
              </th>
              {actions.map((action) => (
                <th key={action.actionId} className={styles.actionHeader}>
                  <div className={styles.actionHeaderContent}>
                    <span className={styles.actionDisplayName}>
                      {action.displayName || action.actionName}
                    </span>
                    <code className={styles.actionCode}>{action.actionName}</code>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {flatRows.map((node, index) => {
              const { page, depth, children } = node;
              const permCount = getPagePermissionCount(page.pageName);
              const hasChildren = children.length > 0;
              const isExpanded = expandedIds.has(page.pageId);

              return (
                <tr key={page.pageId} className={index % 2 === 0 ? styles.evenRow : undefined}>
                  <td className={styles.stickyCol}>
                    <div
                      className={styles.pageCellContent}
                      style={{ paddingLeft: `${16 + depth * 20}px` }}
                    >
                      <div className={styles.pageCellMain}>
                        {hasChildren ? (
                          <button
                            type="button"
                            className={styles.expandBtn}
                            onClick={() => toggleExpand(page.pageId)}
                            aria-label={isExpanded ? '접기' : '펼치기'}
                          >
                            {isExpanded ? (
                              <DownOutlined className={styles.expandIcon} />
                            ) : (
                              <RightOutlined className={styles.expandIcon} />
                            )}
                          </button>
                        ) : (
                          <span className={styles.leafIndent} />
                        )}
                        <span className={styles.nodeIcon}>
                          {hasChildren ? (
                            <FolderOutlined />
                          ) : (
                            <FileOutlined />
                          )}
                        </span>
                        <span className={styles.pageDisplayName}>{page.displayName}</span>
                        <Tag className={styles.permCountTag}>{permCount}</Tag>
                      </div>
                      <div className={styles.pageMeta} style={{ marginLeft: hasChildren ? 38 : 38 }}>
                        <code className={styles.pageCode}>{page.pageName}</code>
                        {page.path && (
                          <span className={styles.pagePath}>{page.path}</span>
                        )}
                      </div>
                    </div>
                  </td>
                  {actions.map((action) => {
                    const entry = getMatrixCell(page.pageName, action);
                    if (!entry) {
                      return (
                        <td key={action.actionId} className={styles.cellEmpty}>
                          <span className={styles.emptyDash}>—</span>
                        </td>
                      );
                    }
                    const perm = permissionMap.get(entry.permissionId);
                    return (
                      <td key={action.actionId} className={styles.cellAssigned}>
                        <Tooltip
                          title={
                            perm ? (
                              <div className={styles.tooltipContent}>
                                <div className={styles.tooltipRow}>
                                  <span className={styles.tooltipLabel}>권한 ID</span>
                                  <span>{perm.permissionId}</span>
                                </div>
                                {perm.displayName && (
                                  <div className={styles.tooltipRow}>
                                    <span className={styles.tooltipLabel}>이름</span>
                                    <span>{perm.displayName}</span>
                                  </div>
                                )}
                                {perm.description && (
                                  <div className={styles.tooltipRow}>
                                    <span className={styles.tooltipLabel}>설명</span>
                                    <span>{perm.description}</span>
                                  </div>
                                )}
                              </div>
                            ) : undefined
                          }
                        >
                          <div className={styles.assignedCell}>
                            <CheckCircleFilled className={styles.checkIcon} />
                          </div>
                        </Tooltip>
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
