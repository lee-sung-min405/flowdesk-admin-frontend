import { Table, Badge, Button, Dropdown, Tag } from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  PoweroffOutlined,
  DeleteOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import type { TableProps, MenuProps } from 'antd';
import dayjs from 'dayjs';
import type { BlockWord, GetBlockWordsResponse, GetBlockWordsRequest } from '../../types/block-word.type';
import type { MatchType } from '../../types/block-word.type';
import styles from './block-word-table.module.css';

const MATCH_TYPE_MAP: Record<MatchType, { label: string; color: string }> = {
  EXACT: { label: '정확히 일치', color: 'blue' },
  CONTAINS: { label: '포함', color: 'green' },
  REGEX: { label: '정규식', color: 'orange' },
};

interface BlockWordTableProps {
  data: GetBlockWordsResponse | undefined;
  loading: boolean;
  params: GetBlockWordsRequest;
  onParamsChange: (params: GetBlockWordsRequest) => void;
  onDetail: (record: BlockWord) => void;
  onEdit: (record: BlockWord) => void;
  onToggleStatus: (record: BlockWord) => void;
  onDelete: (record: BlockWord) => void;
}

export default function BlockWordTable({
  data,
  loading,
  params,
  onParamsChange,
  onDetail,
  onEdit,
  onToggleStatus,
  onDelete,
}: BlockWordTableProps) {
  const getActionMenuItems = (record: BlockWord): MenuProps['items'] => [
    {
      key: 'detail',
      icon: <EyeOutlined />,
      label: '상세 보기',
      onClick: () => onDetail(record),
    },
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
    { type: 'divider' },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: '삭제',
      danger: true,
      onClick: () => onDelete(record),
    },
  ];

  const columns: TableProps<BlockWord>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'dbwIdx',
      width: 80,
    },
    {
      title: '금칙어',
      dataIndex: 'blockWord',
      render: (word: string) => <code>{word}</code>,
    },
    {
      title: '매칭 타입',
      dataIndex: 'matchType',
      width: 120,
      align: 'center',
      render: (type: MatchType) => {
        const mapped = MATCH_TYPE_MAP[type];
        return <Tag color={mapped.color}>{mapped.label}</Tag>;
      },
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
      render: (_: number, record: BlockWord) => (
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

  const handleTableChange: TableProps<BlockWord>['onChange'] = (pagination) => {
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
        rowKey="dbwIdx"
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
