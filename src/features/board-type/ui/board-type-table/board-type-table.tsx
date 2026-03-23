import { Table, Badge, Button, Dropdown } from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  PoweroffOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import type { TableProps, MenuProps } from 'antd';
import dayjs from 'dayjs';
import type { BoardType, GetBoardTypesResponse } from '../../types/board-type.type';
import styles from './board-type-table.module.css';

interface BoardTypeTableProps {
  data: GetBoardTypesResponse | undefined;
  loading: boolean;
  onDetail: (boardType: BoardType) => void;
  onEdit: (boardType: BoardType) => void;
  onToggleStatus: (boardType: BoardType) => void;
}

export default function BoardTypeTable({
  data,
  loading,
  onDetail,
  onEdit,
  onToggleStatus,
}: BoardTypeTableProps) {
  const getActionMenuItems = (record: BoardType): MenuProps['items'] => [
    { key: 'detail', icon: <EyeOutlined />, label: '상세 보기', onClick: () => onDetail(record) },
    { key: 'edit', icon: <EditOutlined />, label: '정보 수정', onClick: () => onEdit(record) },
    { type: 'divider' },
    {
      key: 'status',
      icon: <PoweroffOutlined />,
      label: record.isActive ? '비활성화' : '활성화',
      danger: !!record.isActive,
      onClick: () => onToggleStatus(record),
    },
  ];

  const columns: TableProps<BoardType>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'boardId',
      width: 70,
      align: 'center',
    },
    {
      title: '게시판 키',
      dataIndex: 'boardKey',
      width: 180,
      render: (key: string) => <code className={styles.boardKey}>{key}</code>,
    },
    {
      title: '게시판 이름',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '설명',
      dataIndex: 'description',
      ellipsis: true,
      render: (desc: string | null) =>
        desc || <span className={styles.emptyValue}>—</span>,
    },
    {
      title: '정렬',
      dataIndex: 'sortOrder',
      width: 80,
      align: 'center',
      render: (order: number | null) =>
        order !== null ? order : <span className={styles.emptyValue}>—</span>,
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
      width: 90,
      align: 'center',
      render: (_: number, record: BoardType) => (
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

  const items = data?.items ?? [];
  const activeCount = items.filter((b) => b.isActive).length;
  const inactiveCount = items.filter((b) => !b.isActive).length;

  return (
    <>
      <div className={styles.statsBar}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>총</span>
          <span className={styles.statValue}>{items.length}개</span>
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
        rowKey="boardId"
        columns={columns}
        dataSource={items}
        loading={loading}
        pagination={false}
      />
    </>
  );
}
