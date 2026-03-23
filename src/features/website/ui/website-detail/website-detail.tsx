import { Descriptions, Badge, Spin, Empty, Tag } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { GetWebsiteResponse } from '../../types/website.type';
import styles from './website-detail.module.css';

interface WebsiteDetailProps {
  data: GetWebsiteResponse | undefined;
  loading: boolean;
}

export default function WebsiteDetail({ data, loading }: WebsiteDetailProps) {
  if (loading) return <div className={styles.loadingContainer}><Spin /></div>;
  if (!data) return <Empty description="웹사이트 정보를 불러올 수 없습니다." />;

  return (
    <div className={styles.container}>
      {data.webImg && (
        <div className={styles.imagePreview}>
          <img src={data.webImg} alt={data.webTitle} className={styles.previewImg} />
        </div>
      )}
      <Descriptions bordered size="small" column={2} labelStyle={{ fontWeight: 600, width: 140 }}>
        <Descriptions.Item label="웹사이트 코드">
          <code className={styles.codeName}>{data.webCode}</code>
        </Descriptions.Item>
        <Descriptions.Item label="상태">
          <Badge status={data.isActive ? 'success' : 'default'} text={data.isActive ? '활성' : '비활성'} />
        </Descriptions.Item>
        <Descriptions.Item label="제목" span={2}>{data.webTitle}</Descriptions.Item>
        <Descriptions.Item label="URL" span={2}>
          <a href={data.webUrl} target="_blank" rel="noopener noreferrer" className={styles.urlLink}>
            {data.webUrl} <LinkOutlined />
          </a>
        </Descriptions.Item>
        <Descriptions.Item label="관리자">
          <Tag>{data.userName}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="중복허용 기간">
          {data.duplicateAllowAfterDays}일
        </Descriptions.Item>
        <Descriptions.Item label="설명" span={2}>
          {data.webDesc || <span className={styles.emptyValue}>—</span>}
        </Descriptions.Item>
        <Descriptions.Item label="메모" span={2}>
          {data.webMemo || <span className={styles.emptyValue}>—</span>}
        </Descriptions.Item>
        <Descriptions.Item label="생성일">
          {dayjs(data.createdAt).format('YYYY-MM-DD HH:mm:ss')}
        </Descriptions.Item>
        <Descriptions.Item label="수정일">
          {dayjs(data.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
}
