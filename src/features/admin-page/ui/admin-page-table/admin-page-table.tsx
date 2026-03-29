import { Table, Badge, Button, Dropdown, Tag } from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  PoweroffOutlined,
  DeleteOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import type { TableProps, MenuProps } from 'antd';
import type { AdminPageListItem, GetAdminPagesResponse, GetAdminPagesRequest } from '../../types/admin-page.type';
import styles from './admin-page-table.module.css';

interface AdminPageTableProps {
  data: GetAdminPagesResponse | undefined;
  loading: boolean;
  params: GetAdminPagesRequest;
  onParamsChange: (params: GetAdminPagesRequest) => void;
  onDetail: (page: AdminPageListItem) => void;
  onEdit: (page: AdminPageListItem) => void;
  onToggleStatus: (page: AdminPageListItem) => void;
  onDelete: (page: AdminPageListItem) => void;
  canUpdate?: boolean;
  canDelete?: boolean;
}

export default function AdminPageTable({
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
}: AdminPageTableProps) {
  const getActionMenuItems = (record: AdminPageListItem): MenuProps['items'] => {
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

  const columns: TableProps<AdminPageListItem>['columns'] = [
    {
      title: '페이지 이름',
      dataIndex: 'pageName',
      sorter: true,
      render: (name: string, record: AdminPageListItem) => (
        <span className={record.parentId ? styles.childName : styles.rootName}>{name}</span>
      ),
    },
    {
      title: '경로',
      dataIndex: 'path',
      render: (path: string) => <code className={styles.pathCode}>{path}</code>,
    },
    {
      title: '표시 이름',
      dataIndex: 'displayName',
      sorter: true,
    },
    {
      title: '상위 페이지',
      dataIndex: 'parent',
      render: (_: unknown, record: AdminPageListItem) =>
        record.parent ? (
          <Tag>{record.parent.displayName}</Tag>
        ) : (
          <span className={styles.noParent}>—</span>
        ),
    },
    {
      title: '상태',
      dataIndex: 'isActive',
      width: 80,
      align: 'center',
      sorter: true,
      render: (_: number, record: AdminPageListItem) => (
        <Badge
          status={record.isActive ? 'success' : 'default'}
          text={record.isActive ? '활성' : '비활성'}
        />
      ),
    },
    {
      title: '정렬',
      dataIndex: 'sortOrder',
      width: 70,
      align: 'center',
      render: (val: number | null) => val ?? '—',
    },
    {
      title: '하위',
      dataIndex: 'childCount',
      width: 70,
      align: 'center',
      sorter: true,
      render: (count: number) => (
        <span className={count > 0 ? styles.countActive : styles.countZero}>{count}</span>
      ),
    },
    {
      title: '권한',
      dataIndex: 'permissionCount',
      width: 70,
      align: 'center',
      sorter: true,
      render: (count: number) => (
        <span className={count > 0 ? styles.countActive : styles.countZero}>{count}</span>
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

  const handleTableChange: TableProps<AdminPageListItem>['onChange'] = (pagination, _, sorter) => {
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
        rowKey="pageId"
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
