import { Descriptions, Badge, Spin, Empty, Tag } from 'antd';
import dayjs from 'dayjs';
import type { GetBlockWordResponse } from '../../types/block-word.type';
import type { MatchType } from '../../types/block-word.type';
import styles from './block-word-detail.module.css';

const MATCH_TYPE_MAP: Record<MatchType, { label: string; color: string }> = {
  EXACT: { label: '정확히 일치', color: 'blue' },
  CONTAINS: { label: '포함', color: 'green' },
  REGEX: { label: '정규식', color: 'orange' },
};

interface BlockWordDetailProps {
  data: GetBlockWordResponse | undefined;
  loading: boolean;
}

export default function BlockWordDetail({ data, loading }: BlockWordDetailProps) {
  if (loading) {
    return <div className={styles.loadingContainer}><Spin /></div>;
  }

  if (!data) {
    return <Empty description="금칙어 정보를 불러올 수 없습니다." />;
  }

  const mapped = MATCH_TYPE_MAP[data.matchType];

  return (
    <div className={styles.container}>
      <Descriptions
        bordered
        size="small"
        column={2}
        labelStyle={{ fontWeight: 600, width: 120 }}
      >
        <Descriptions.Item label="ID">{data.dbwIdx}</Descriptions.Item>
        <Descriptions.Item label="상태">
          <Badge
            status={data.isActive ? 'success' : 'default'}
            text={data.isActive ? '활성' : '비활성'}
          />
        </Descriptions.Item>
        <Descriptions.Item label="금칙어">
          <code>{data.blockWord}</code>
        </Descriptions.Item>
        <Descriptions.Item label="매칭 타입">
          <Tag color={mapped.color}>{mapped.label}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="차단 사유" span={2}>
          {data.reason || <span className={styles.emptyValue}>—</span>}
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
