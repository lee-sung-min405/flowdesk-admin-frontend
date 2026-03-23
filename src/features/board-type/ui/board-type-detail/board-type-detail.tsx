import { Descriptions, Badge, Spin, Empty } from 'antd';
import dayjs from 'dayjs';
import type { GetBoardTypeResponse } from '../../types/board-type.type';
import styles from './board-type-detail.module.css';

interface BoardTypeDetailProps {
  data: GetBoardTypeResponse | undefined;
  loading: boolean;
}

export default function BoardTypeDetail({ data, loading }: BoardTypeDetailProps) {
  if (loading) return <div className={styles.loadingContainer}><Spin /></div>;
  if (!data) return <Empty description="게시판 정보를 불러올 수 없습니다." />;

  return (
    <div className={styles.container}>
      <Descriptions bordered size="small" column={2} labelStyle={{ fontWeight: 600, width: 140 }}>
        <Descriptions.Item label="게시판 ID">{data.boardId}</Descriptions.Item>
        <Descriptions.Item label="상태">
          <Badge status={data.isActive ? 'success' : 'default'} text={data.isActive ? '활성' : '비활성'} />
        </Descriptions.Item>
        <Descriptions.Item label="게시판 키">
          <code className={styles.codeName}>{data.boardKey}</code>
        </Descriptions.Item>
        <Descriptions.Item label="정렬 순서">
          {data.sortOrder !== null ? data.sortOrder : <span className={styles.emptyValue}>—</span>}
        </Descriptions.Item>
        <Descriptions.Item label="게시판 이름" span={2}>{data.name}</Descriptions.Item>
        <Descriptions.Item label="설명" span={2}>
          {data.description || <span className={styles.emptyValue}>—</span>}
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
