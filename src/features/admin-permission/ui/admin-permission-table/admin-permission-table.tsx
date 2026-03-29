import { Table, Badge, Button, Dropdown, Tag } from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  PoweroffOutlined,
  DeleteOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import type { TableProps, MenuProps } from 'antd';
import type { AdminPermissionListItem, GetAdminPermissionsResponse, GetAdminPermissionsRequest } from '../../types/admin-permission.type';
import styles from './admin-permission-table.module.css';

interface AdminPermissionTableProps {
  data: GetAdminPermissionsResponse | undefined;
  loading: boolean;
  params: GetAdminPermissionsRequest;
  onParamsChange: (params: GetAdminPermissionsRequest) => void;
  onDetail: (permission: AdminPermissionListItem) => void;
  onEdit: (permission: AdminPermissionListItem) => void;
  onToggleStatus: (permission: AdminPermissionListItem) => void;
  onDelete: (permission: AdminPermissionListItem) => void;
  canUpdate?: boolean;
  canDelete?: boolean;
}

export default function AdminPermissionTable({
  data,
  loading,
  params,
  onParamsChange,
  onDetail,
  onEdit,
  onToggleStatus,
  onDelete,
  canUpdate = true,
  canDelete = true,
}: AdminPermissionTableProps) {
  const getActionMenuItems = (record: AdminPermissionListItem): MenuProps['items'] => {
    const items: MenuProps['items'] = [
      {
        key: 'detail',
        icon: <EyeOutlined />,
        label: '상세 보기',
        onClick: () => onDetail(record),
      },
    ];
    if (canUpdate) {
      items.push(
        {
          key: 'edit',
          icon: <EditOutlined />,
          label: '정보 수정',
          onClick: () => onEdit(record),
        },
        {
          key: 'status',
          icon: <PoweroffOutlined />,
          label: record.isActive ? '비활성화' : '활성화',
          danger: !!record.isActive,
          onClick: () => onToggleStatus(record),
        },
      );
    }
    if (canDelete) {
      items.push(
        { type: 'divider' },
        {
          key: 'delete',
          icon: <DeleteOutlined />,
          label: '삭제',
          danger: true,
          onClick: () => onDelete(record),
        },
      );
    }
    return items;
  };

  const columns: TableProps<AdminPermissionListItem>['columns'] = [
    {
      title: '권한 ID',
      dataIndex: 'permissionId',
      width: 90,
      sorter: true,
    },
    {
      title: '표시 이름',
      dataIndex: 'displayName',
      sorter: true,
      render: (name: string | null) => name || <span className={styles.emptyValue}>—</span>,
    },
    {
      title: '설명',
      dataIndex: 'description',
      ellipsis: true,
      render: (desc: string | null) => desc || <span className={styles.emptyValue}>—</span>,
    },
    {
      title: '페이지',
      dataIndex: 'page',
      sorter: true,
      render: (_: unknown, record: AdminPermissionListItem) =>
        record.page ? (
          <Tag color="blue">{record.page.displayName}</Tag>
        ) : (
          <span className={styles.emptyValue}>—</span>
        ),
    },
    {
      title: '액션',
      dataIndex: 'action',
      sorter: true,
      render: (_: unknown, record: AdminPermissionListItem) =>
        record.action ? (
          <Tag color="green">{record.action.displayName || record.action.actionName}</Tag>
        ) : (
          <span className={styles.emptyValue}>—</span>
        ),
    },
    {
      title: '상태',
      dataIndex: 'isActive',
      width: 80,
      align: 'center',
      sorter: true,
      render: (_: number, record: AdminPermissionListItem) => (
        <Badge
          status={record.isActive ? 'success' : 'default'}
          text={record.isActive ? '활성' : '비활성'}
        />
      ),
    },
    {
      title: '',
      width: 50,
      align: 'center',
      render: (_, record) => (
        <Dropdown
          menu={{ items: getActionMenuItems(record) }}
          trigger={['click']}
          placement="bottomRight"
        >
          <Button type="text" size="small" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const handleTableChange: TableProps<AdminPermissionListItem>['onChange'] = (pagination, _, sorter) => {
    const sort = Array.isArray(sorter) ? sorter[0] : sorter;
    onParamsChange({
      ...params,
      page: pagination.current,
      limit: pagination.pageSize,
      sort: sort?.field as string | undefined,
      order: sort?.order === 'ascend' ? 'ASC' : sort?.order === 'descend' ? 'DESC' : undefined,
    });
  };

  const pageInfo = data?.pageInfo;
  const items = data?.items ?? [];
  const activeCount = items.filter((p) => p.isActive).length;
  const inactiveCount = items.filter((p) => !p.isActive).length;

  return (
    <>
      <div className={styles.statsBar}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>총</span>
          <span className={styles.statValue}>{pageInfo?.totalItems ?? 0}개</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>활성</span>
          <span className={styles.statValueActive}>{activeCount}개</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>비활성</span>
          <span className={styles.statValueInactive}>{inactiveCount}개</span>
        </div>
      </div>

      <Table
        rowKey="permissionId"
        columns={columns}
        dataSource={items}
        loading={loading}
        onChange={handleTableChange}
        pagination={{
          current: pageInfo?.page ?? 1,
          pageSize: pageInfo?.limit ?? 20,
          total: pageInfo?.totalItems ?? 0,
          showSizeChanger: true,
          showTotal: (total) => `총 ${total}건`,
        }}
      />
    </>
  );
}
