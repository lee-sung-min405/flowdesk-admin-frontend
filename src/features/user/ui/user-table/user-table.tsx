import { Table, Badge, Button, Dropdown, Tooltip } from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  PoweroffOutlined,
  KeyOutlined,
  LogoutOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import type { TableProps, MenuProps } from 'antd';
import dayjs from 'dayjs';
import type { User, GetUsersResponse, GetUsersRequest } from '../../types/user.type';
import styles from './user-table.module.css';

interface UserTableProps {
  data: GetUsersResponse | undefined;
  loading: boolean;
  params: GetUsersRequest;
  onParamsChange: (params: GetUsersRequest) => void;
  onDetail: (user: User) => void;
  onEdit: (user: User) => void;
  onToggleStatus: (user: User) => void;
  onResetPassword: (user: User) => void;
  onInvalidateTokens: (user: User) => void;
  canUpdate?: boolean;
}

export default function UserTable({
  data,
  loading,
  params,
  onParamsChange,
  onDetail,
  onEdit,
  onToggleStatus,
  onResetPassword,
  onInvalidateTokens,
  canUpdate = true,
}: UserTableProps) {
  const getActionMenuItems = (record: User): MenuProps['items'] => {
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
          label: record.isActive ? '계정 정지' : '계정 활성화',
          danger: !!record.isActive,
          onClick: () => onToggleStatus(record),
        },
        { type: 'divider' },
        {
          key: 'password',
          icon: <KeyOutlined />,
          label: '비밀번호 초기화',
          onClick: () => onResetPassword(record),
        },
        {
          key: 'tokens',
          icon: <LogoutOutlined />,
          label: '강제 로그아웃',
          danger: true,
          onClick: () => onInvalidateTokens(record),
        },
      );
    }
    return items;
  };

  const columns: TableProps<User>['columns'] = [
    {
      title: '아이디',
      dataIndex: 'userId',
      sorter: true,
    },
    {
      title: '이름',
      dataIndex: 'userName',
      sorter: true,
    },
    {
      title: '부서명',
      dataIndex: 'corpName',
      sorter: true,
    },
    {
      title: '이메일',
      dataIndex: 'userEmail',
    },
    {
      title: '상태',
      dataIndex: 'isActive',
      width: 80,
      align: 'center',
      render: (_: number, record: User) => {
        const badge = (
          <Badge
            status={record.isActive ? 'success' : 'default'}
            text={record.isActive ? '활성' : '정지'}
          />
        );
        if (!record.isActive && record.stopDtm) {
          return (
            <Tooltip title={`정지일: ${dayjs(record.stopDtm).format('YYYY-MM-DD HH:mm:ss')}`}>
              <span style={{ cursor: 'default' }}>{badge}</span>
            </Tooltip>
          );
        }
        return badge;
      },
    },
    {
      title: '등록일',
      dataIndex: 'regDtm',
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

  const handleTableChange: TableProps<User>['onChange'] = (pagination, _, sorter) => {
    const sort = Array.isArray(sorter) ? sorter[0] : sorter;
    onParamsChange({
      ...params,
      page: pagination.current,
      limit: pagination.pageSize,
      sortField: sort?.field as string | undefined,
      sortOrder: sort?.order === 'ascend' ? 'asc' : sort?.order === 'descend' ? 'desc' : undefined,
    });
  };

  const pageInfo = data?.pageInfo;
  const users = data?.items ?? [];
  const activeCount = users.filter((u) => u.isActive).length;
  const inactiveCount = users.filter((u) => !u.isActive).length;

  return (
    <>
      <div className={styles.statsBar}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>총</span>
          <span className={styles.statValue}>{pageInfo?.totalItems ?? 0}명</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>활성</span>
          <span className={styles.statValueActive}>{activeCount}명</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>정지</span>
          <span className={styles.statValueInactive}>{inactiveCount}명</span>
        </div>
      </div>

      <Table
        rowKey="userSeq"
        columns={columns}
        dataSource={users}
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
