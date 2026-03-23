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
import type { BlockIp, GetBlockIpsResponse, GetBlockIpsRequest } from '../../types/block-ip.type';
import styles from './block-ip-table.module.css';

interface BlockIpTableProps {
  data: GetBlockIpsResponse | undefined;
  loading: boolean;
  params: GetBlockIpsRequest;
  onParamsChange: (params: GetBlockIpsRequest) => void;
  onDetail: (record: BlockIp) => void;
  onEdit: (record: BlockIp) => void;
  onToggleStatus: (record: BlockIp) => void;
  onDelete: (record: BlockIp) => void;
}

export default function BlockIpTable({
  data,
  loading,
  params,
  onParamsChange,
  onDetail,
  onEdit,
  onToggleStatus,
  onDelete,
}: BlockIpTableProps) {
  const getActionMenuItems = (record: BlockIp): MenuProps['items'] => [
    {
      key: 'detail',
      icon: <EyeOutlined />,
      label: '상세 보기',
      onClick: () => onDetail(record),
    },
    {
      key: 'edit',
      icon: <EditOutlined />,
      label: '사유 수정',
      onClick: () => onEdit(record),
    },
    {
      key: 'status',
      icon: <PoweroffOutlined />,
      label: record.isActive ? '비활성화' : '활성화',
      danger: !!record.isActive,
      onClick: () => onToggleStatus(record),
    },
    { type: 'divider' },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: '삭제',
      danger: true,
      onClick: () => onDelete(record),
    },
  ];

  const columns: TableProps<BlockIp>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'dbiIdx',
      width: 80,
    },
    {
      title: 'IP 주소',
      dataIndex: 'blockIp',
      render: (ip: string) => <code>{ip}</code>,
    },
    {
      title: '차단 사유',
      dataIndex: 'reason',
      ellipsis: true,
      render: (reason: string | null) => reason || <span style={{ color: 'var(--color-text-tertiary)' }}>—</span>,
    },
    {
      title: '생성일',
      dataIndex: 'createdAt',
      width: 170,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '상태',
      dataIndex: 'isActive',
      width: 80,
      align: 'center',
      render: (_: number, record: BlockIp) => (
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

  const handleTableChange: TableProps<BlockIp>['onChange'] = (pagination) => {
    onParamsChange({
      ...params,
      page: pagination.current,
      limit: pagination.pageSize,
    });
  };

  const pageInfo = data?.pageInfo;
  const items = data?.items ?? [];
  const activeCount = items.filter((i) => i.isActive).length;
  const inactiveCount = items.filter((i) => !i.isActive).length;

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
        rowKey="dbiIdx"
        columns={columns}
        dataSource={items}
        loading={loading}
        onChange={handleTableChange}
        pagination={{
          current: pageInfo?.currentPage ?? 1,
          pageSize: pageInfo?.pageSize ?? 20,
          total: pageInfo?.totalItems ?? 0,
          showSizeChanger: true,
          showTotal: (total) => `총 ${total}건`,
        }}
      />
    </>
  );
}
