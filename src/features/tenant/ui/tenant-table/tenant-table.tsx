import { Table, Badge, Button, Dropdown } from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  PoweroffOutlined,
  DeleteOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import type { TableProps, MenuProps } from 'antd';
import dayjs from 'dayjs';
import type { Tenant, GetTenantsResponse, GetTenantsRequest } from '../../types/tenant.type';
import styles from './tenant-table.module.css';

interface TenantTableProps {
  data: GetTenantsResponse | undefined;
  loading: boolean;
  params: GetTenantsRequest;
  onParamsChange: (params: GetTenantsRequest) => void;
  onDetail: (tenant: Tenant) => void;
  onEdit: (tenant: Tenant) => void;
  onToggleStatus: (tenant: Tenant) => void;
  onDelete: (tenant: Tenant) => void;
  canUpdate?: boolean;
  canDelete?: boolean;
}

export default function TenantTable({
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
}: TenantTableProps) {
  const getActionMenuItems = (record: Tenant): MenuProps['items'] => {
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

  const columns: TableProps<Tenant>['columns'] = [
    {
      title: '테넌트 ID',
      dataIndex: 'tenantId',
      width: 100,
      sorter: true,
    },
    {
      title: '테넌트명',
      dataIndex: 'tenantName',
      sorter: true,
    },
    {
      title: '표시 이름',
      dataIndex: 'displayName',
      sorter: true,
    },
    {
      title: '도메인',
      dataIndex: 'domain',
    },
    {
      title: '사용자 수',
      dataIndex: 'userCount',
      width: 100,
      align: 'center',
      render: (count: number) => (
        <span className={styles.userCount}>{count}명</span>
      ),
    },
    {
      title: '상태',
      dataIndex: 'isActive',
      width: 80,
      align: 'center',
      render: (_: number, record: Tenant) => (
        <Badge
          status={record.isActive ? 'success' : 'default'}
          text={record.isActive ? '활성' : '비활성'}
        />
      ),
    },
    {
      title: '생성일',
      dataIndex: 'createdAt',
      width: 170,
      sorter: true,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '수정일',
      dataIndex: 'updatedAt',
      width: 170,
      sorter: true,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
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

  const handleTableChange: TableProps<Tenant>['onChange'] = (pagination, _, sorter) => {
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
  const tenants = data?.items ?? [];
  const activeCount = tenants.filter((t) => t.isActive).length;
  const inactiveCount = tenants.filter((t) => !t.isActive).length;

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
        rowKey="tenantId"
        columns={columns}
        dataSource={tenants}
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
