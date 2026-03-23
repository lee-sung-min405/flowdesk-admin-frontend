import { Table, Badge, Tag, Button, Dropdown } from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import type { TableProps, MenuProps } from 'antd';
import dayjs from 'dayjs';
import type { Post, GetPostsResponse, GetPostsRequest } from '../../types/board.type';
import styles from './post-table.module.css';

interface PostTableProps {
  data: GetPostsResponse | undefined;
  loading: boolean;
  params: GetPostsRequest;
  onParamsChange: (params: GetPostsRequest) => void;
  onDetail: (post: Post) => void;
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
}

export default function PostTable({
  data,
  loading,
  params,
  onParamsChange,
  onDetail,
  onEdit,
  onDelete,
}: PostTableProps) {
  const getActionMenuItems = (record: Post): MenuProps['items'] => [
    { key: 'detail', icon: <EyeOutlined />, label: '상세 보기', onClick: () => onDetail(record) },
    { key: 'edit', icon: <EditOutlined />, label: '수정', onClick: () => onEdit(record) },
    { type: 'divider' },
    { key: 'delete', icon: <DeleteOutlined />, label: '삭제', danger: true, onClick: () => onDelete(record) },
  ];

  const columns: TableProps<Post>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'postId',
      width: 70,
      align: 'center',
    },
    {
      title: '제목',
      dataIndex: 'title',
      ellipsis: true,
      render: (title: string, record: Post) => (
        <div className={styles.titleCell}>
          {record.isNotice ? <Tag color="red">공지</Tag> : null}
          <span className={styles.titleText}>{title}</span>
        </div>
      ),
    },
    {
      title: '게시 기간',
      width: 220,
      render: (_, record: Post) => {
        if (!record.startDtm && !record.endDtm) return <span className={styles.emptyValue}>제한 없음</span>;
        const start = record.startDtm ? dayjs(record.startDtm).format('YYYY-MM-DD') : '—';
        const end = record.endDtm ? dayjs(record.endDtm).format('YYYY-MM-DD') : '—';
        return <span>{start} ~ {end}</span>;
      },
    },
    {
      title: '작성일',
      dataIndex: 'createdAt',
      width: 170,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '상태',
      dataIndex: 'isActive',
      width: 90,
      align: 'center',
      render: (_: number, record: Post) => (
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

  const handleTableChange: TableProps<Post>['onChange'] = (pagination) => {
    onParamsChange({
      ...params,
      page: pagination.current,
      limit: pagination.pageSize,
    });
  };

  const pageInfo = data?.pageInfo;

  return (
    <Table
      rowKey="postId"
      columns={columns}
      dataSource={data?.items ?? []}
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
  );
}
