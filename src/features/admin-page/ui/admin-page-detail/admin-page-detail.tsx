import { Descriptions, Badge, Tag, Table, Empty, Spin } from 'antd';
import {
  ApartmentOutlined,
} from '@ant-design/icons';
import type { AdminPageResponse, AdminPageChild } from '../../types/admin-page.type';
import type { TableProps } from 'antd';
import styles from './admin-page-detail.module.css';

interface AdminPageDetailProps {
  data: AdminPageResponse | undefined;
  loading: boolean;
}

export default function AdminPageDetail({ data, loading }: AdminPageDetailProps) {
  if (loading) {
    return <div className={styles.loadingContainer}><Spin /></div>;
  }

  if (!data) {
    return <Empty description="페이지 정보를 불러올 수 없습니다." />;
  }

  const childColumns: TableProps<AdminPageChild>['columns'] = [
    {
      title: '페이지 이름',
      dataIndex: 'pageName',
      render: (name: string) => <code className={styles.codeName}>{name}</code>,
    },
    {
      title: '경로',
      dataIndex: 'path',
      render: (path: string) => <code className={styles.codeName}>{path}</code>,
    },
    {
      title: '표시 이름',
      dataIndex: 'displayName',
    },
    {
      title: '상태',
      dataIndex: 'isActive',
      width: 80,
      align: 'center',
      render: (_: number, record: AdminPageChild) => (
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
  ];

  return (
    <div className={styles.container}>
      <Descriptions
        bordered
        size="small"
        column={2}
        labelStyle={{ fontWeight: 600, width: 120 }}
      >
        <Descriptions.Item label="페이지 ID">{data.pageId}</Descriptions.Item>
        <Descriptions.Item label="상태">
          <Badge
            status={data.isActive ? 'success' : 'default'}
            text={data.isActive ? '활성' : '비활성'}
          />
        </Descriptions.Item>
        <Descriptions.Item label="페이지 이름">
          <code className={styles.codeName}>{data.pageName}</code>
        </Descriptions.Item>
        <Descriptions.Item label="경로">
          <code className={styles.codeName}>{data.path}</code>
        </Descriptions.Item>
        <Descriptions.Item label="표시 이름">{data.displayName}</Descriptions.Item>
        <Descriptions.Item label="상위 페이지">
          {data.parentId ? <Tag>{data.parentId}</Tag> : <span className={styles.emptyValue}>없음 (최상위)</span>}
        </Descriptions.Item>
        <Descriptions.Item label="설명" span={2}>
          {data.description || <span className={styles.emptyValue}>—</span>}
        </Descriptions.Item>
        <Descriptions.Item label="정렬 순서">{data.sortOrder ?? '—'}</Descriptions.Item>
        <Descriptions.Item label="생성일">{new Date(data.createdAt).toLocaleString('ko-KR')}</Descriptions.Item>
        <Descriptions.Item label="수정일" span={2}>{new Date(data.updatedAt).toLocaleString('ko-KR')}</Descriptions.Item>
      </Descriptions>

      {/* 하위 페이지 섹션 */}
      <div className={styles.childrenSection}>
        <div className={styles.childrenHeader}>
          <ApartmentOutlined />
          <span>하위 페이지</span>
          <Tag>{data.children.length}</Tag>
        </div>
        {data.children.length > 0 ? (
          <Table
            rowKey="pageId"
            columns={childColumns}
            dataSource={data.children}
            pagination={false}
            size="small"
          />
        ) : (
          <div className={styles.emptyChildren}>하위 페이지가 없습니다.</div>
        )}
      </div>
    </div>
  );
}
