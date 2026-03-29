import { Collapse, Badge, Button, Dropdown, Empty } from 'antd';
import {
  EditOutlined,
  EyeOutlined,
  PoweroffOutlined,
  DeleteOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import type { TenantStatusGroup, TenantStatus } from '../../types/tenant-status.type';
import styles from './status-group-list.module.css';

interface StatusGroupListProps {
  groups: TenantStatusGroup[];
  onDetail: (item: TenantStatus) => void;
  onEdit: (item: TenantStatus) => void;
  onToggleActive: (item: TenantStatus) => void;
  onDelete: (item: TenantStatus) => void;
  canUpdate?: boolean;
  canDelete?: boolean;
}

export default function StatusGroupList({
  groups,
  onDetail,
  onEdit,
  onToggleActive,
  onDelete,
  canUpdate = true,
  canDelete = true,
}: StatusGroupListProps) {
  if (groups.length === 0) {
    return <Empty description="등록된 상태가 없습니다." />;
  }

  const items = groups.map((group) => ({
    key: group.statusGroup,
    label: (
      <div className={styles.groupHeader}>
        <code className={styles.groupName}>{group.statusGroup}</code>
        <span className={styles.groupCount}>{group.count}개 상태</span>
      </div>
    ),
    children: (
      <StatusTable
        items={group.items}
        onDetail={onDetail}
        onEdit={onEdit}
        onToggleActive={onToggleActive}
        onDelete={onDelete}
        canUpdate={canUpdate}
        canDelete={canDelete}
      />
    ),
  }));

  return (
    <Collapse
      className={styles.collapse}
      defaultActiveKey={groups.map((g) => g.statusGroup)}
      items={items}
    />
  );
}

/* ── 그룹 내 상태 테이블 ── */

interface StatusTableProps {
  items: TenantStatus[];
  onDetail: (item: TenantStatus) => void;
  onEdit: (item: TenantStatus) => void;
  onToggleActive: (item: TenantStatus) => void;
  onDelete: (item: TenantStatus) => void;
  canUpdate?: boolean;
  canDelete?: boolean;
}

function StatusTable({ items, onDetail, onEdit, onToggleActive, onDelete, canUpdate = true, canDelete = true }: StatusTableProps) {
  if (items.length === 0) {
    return <div className={styles.emptyGroup}>상태가 없습니다.</div>;
  }

  const getActionMenuItems = (item: TenantStatus): MenuProps['items'] => {
    const menuItems: MenuProps['items'] = [
      {
        key: 'detail',
        icon: <EyeOutlined />,
        label: '상세 보기',
        onClick: () => onDetail(item),
      },
    ];
    if (canUpdate) {
      menuItems.push(
        {
          key: 'edit',
          icon: <EditOutlined />,
          label: '정보 수정',
          onClick: () => onEdit(item),
        },
        {
          key: 'status',
          icon: <PoweroffOutlined />,
          label: item.isActive ? '비활성화' : '활성화',
          danger: !!item.isActive,
          onClick: () => onToggleActive(item),
        },
      );
    }
    if (canDelete) {
      menuItems.push(
        { type: 'divider' },
        {
          key: 'delete',
          icon: <DeleteOutlined />,
          label: '삭제',
          danger: true,
          onClick: () => onDelete(item),
        },
      );
    }
    return menuItems;
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th style={{ width: 40, textAlign: 'center' }}>#</th>
            <th>상태명</th>
            <th>상태 키</th>
            <th>설명</th>
            <th style={{ width: 100, textAlign: 'center' }}>활성 여부</th>
            <th style={{ width: 50, textAlign: 'center' }}></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.tenantStatusId}>
              <td style={{ textAlign: 'center' }}>
                <span className={styles.sortOrder}>{item.sortOrder}</span>
              </td>
              <td>
                <div className={styles.nameCell}>
                  <span
                    className={styles.colorSwatch}
                    style={{ backgroundColor: item.color }}
                  />
                  <span className={styles.statusName}>{item.statusName}</span>
                </div>
              </td>
              <td>
                <code className={styles.statusKey}>{item.statusKey}</code>
              </td>
              <td>
                <span className={styles.description}>
                  {item.description || <span className={styles.emptyValue}>—</span>}
                </span>
              </td>
              <td style={{ textAlign: 'center' }}>
                <Badge
                  status={item.isActive ? 'success' : 'default'}
                  text={item.isActive ? '활성' : '비활성'}
                />
              </td>
              <td style={{ textAlign: 'center' }}>
                <Dropdown
                  menu={{ items: getActionMenuItems(item) }}
                  trigger={['click']}
                  placement="bottomRight"
                >
                  <Button type="text" size="small" icon={<MoreOutlined />} />
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
