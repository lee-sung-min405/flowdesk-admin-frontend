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
import type { BlockHp, GetBlockHpsResponse, GetBlockHpsRequest } from '../../types/block-hp.type';
import styles from './block-hp-table.module.css';

interface BlockHpTableProps {
  data: GetBlockHpsResponse | undefined;
  loading: boolean;
  params: GetBlockHpsRequest;
  onParamsChange: (params: GetBlockHpsRequest) => void;
  onDetail: (record: BlockHp) => void;
  onEdit: (record: BlockHp) => void;
  onToggleStatus: (record: BlockHp) => void;
  onDelete: (record: BlockHp) => void;
}

export default function BlockHpTable({
  data,
  loading,
  params,
  onParamsChange,
  onDetail,
  onEdit,
  onToggleStatus,
  onDelete,
}: BlockHpTableProps) {
  const getActionMenuItems = (record: BlockHp): MenuProps['items'] => [
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

  const columns: TableProps<BlockHp>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'dbhIdx',
      width: 80,
    },
    {
      title: '휴대폰 번호',
      dataIndex: 'blockHp',
      render: (hp: string) => <code>{hp}</code>,
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
      render: (_: number, record: BlockHp) => (
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

  const handleTableChange: TableProps<BlockHp>['onChange'] = (pagination) => {
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
        rowKey="dbhIdx"
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
