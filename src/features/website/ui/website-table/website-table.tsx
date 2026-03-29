import { Table, Badge, Button, Dropdown } from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  PoweroffOutlined,
  DeleteOutlined,
  MoreOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import type { TableProps, MenuProps } from 'antd';
import dayjs from 'dayjs';
import type { Website, GetWebsitesResponse, GetWebsitesRequest } from '../../types/website.type';
import styles from './website-table.module.css';

interface WebsiteTableProps {
  data: GetWebsitesResponse | undefined;
  loading: boolean;
  params: GetWebsitesRequest;
  onParamsChange: (params: GetWebsitesRequest) => void;
  onDetail: (website: Website) => void;
  onEdit: (website: Website) => void;
  onToggleStatus: (website: Website) => void;
  onDelete: (website: Website) => void;
  canUpdate?: boolean;
  canDelete?: boolean;
}

export default function WebsiteTable({
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
}: WebsiteTableProps) {
  const getActionMenuItems = (record: Website): MenuProps['items'] => {
    const items: MenuProps['items'] = [
      { key: 'detail', icon: <EyeOutlined />, label: '상세 보기', onClick: () => onDetail(record) },
    ];
    if (canUpdate) {
      items.push(
        { key: 'edit', icon: <EditOutlined />, label: '정보 수정', onClick: () => onEdit(record) },
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
        { key: 'delete', icon: <DeleteOutlined />, label: '삭제', danger: true, onClick: () => onDelete(record) },
      );
    }
    return items;
  };

  const columns: TableProps<Website>['columns'] = [
    {
      title: '웹사이트 코드',
      dataIndex: 'webCode',
      width: 200,
      sorter: true,
      render: (code: string) => <code className={styles.webCode}>{code}</code>,
    },
    {
      title: '제목',
      dataIndex: 'webTitle',
      sorter: true,
      ellipsis: true,
      render: (title: string, record: Website) => (
        <div className={styles.titleCell}>
          {record.webImg && (
            <img src={record.webImg} alt={title} className={styles.thumbnail} />
          )}
          <span className={styles.titleText}>{title}</span>
        </div>
      ),
    },
    {
      title: 'URL',
      dataIndex: 'webUrl',
      ellipsis: true,
      sorter: true,
      render: (url: string) => (
        <a href={url} target="_blank" rel="noopener noreferrer" className={styles.urlLink}>
          {url} <LinkOutlined />
        </a>
      ),
    },
    {
      title: '중복허용',
      dataIndex: 'duplicateAllowAfterDays',
      width: 100,
      align: 'center',
      render: (days: number) => <span>{days}일</span>,
    },
    {
      title: '담당자',
      dataIndex: 'userName',
      width: 120,
      ellipsis: true,
    },
    {
      title: '생성일',
      dataIndex: 'createdAt',
      width: 170,
      sorter: true,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '상태',
      dataIndex: 'isActive',
      width: 90,
      align: 'center',
      render: (_: number, record: Website) => (
        <Badge status={record.isActive ? 'success' : 'default'} text={record.isActive ? '활성' : '비활성'} />
      ),
    },
    {
      title: '',
      width: 50,
      align: 'center',
      render: (_, record) => (
        <Dropdown menu={{ items: getActionMenuItems(record) }} trigger={['click']} placement="bottomRight">
          <Button type="text" size="small" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const handleTableChange: TableProps<Website>['onChange'] = (pagination, _, sorter) => {
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
  const websites = data?.items ?? [];
  const activeCount = websites.filter((w) => w.isActive).length;
  const inactiveCount = websites.filter((w) => !w.isActive).length;

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
        rowKey="webCode"
        columns={columns}
        dataSource={websites}
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
