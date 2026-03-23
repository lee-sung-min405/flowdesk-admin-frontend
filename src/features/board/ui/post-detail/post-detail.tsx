import { Descriptions, Badge, Tag, Spin, Empty } from 'antd';
import DOMPurify from 'dompurify';
import dayjs from 'dayjs';
import type { GetPostResponse } from '../../types/board.type';
import styles from './post-detail.module.css';

interface PostDetailProps {
  data: GetPostResponse | undefined;
  loading: boolean;
}

export default function PostDetail({ data, loading }: PostDetailProps) {
  if (loading) return <div className={styles.loadingContainer}><Spin /></div>;
  if (!data) return <Empty description="게시글 정보를 불러올 수 없습니다." />;

  return (
    <div className={styles.container}>
      <Descriptions bordered size="small" column={2} labelStyle={{ fontWeight: 600, width: 140 }}>
        <Descriptions.Item label="게시글 ID">{data.postId}</Descriptions.Item>
        <Descriptions.Item label="상태">
          <Badge status={data.isActive ? 'success' : 'default'} text={data.isActive ? '활성' : '비활성'} />
        </Descriptions.Item>
        <Descriptions.Item label="제목" span={2}>{data.title}</Descriptions.Item>
        <Descriptions.Item label="공지 여부">
          {data.isNotice ? <Tag color="red">공지</Tag> : <Tag>일반</Tag>}
        </Descriptions.Item>
        <Descriptions.Item label="작성자 ID">{data.userSeq}</Descriptions.Item>
        <Descriptions.Item label="게시 시작">
          {data.startDtm ? dayjs(data.startDtm).format('YYYY-MM-DD HH:mm') : <span className={styles.emptyValue}>즉시</span>}
        </Descriptions.Item>
        <Descriptions.Item label="게시 종료">
          {data.endDtm ? dayjs(data.endDtm).format('YYYY-MM-DD HH:mm') : <span className={styles.emptyValue}>제한 없음</span>}
        </Descriptions.Item>
        <Descriptions.Item label="작성일">
          {dayjs(data.createdAt).format('YYYY-MM-DD HH:mm:ss')}
        </Descriptions.Item>
        <Descriptions.Item label="수정일">
          {dayjs(data.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
        </Descriptions.Item>
      </Descriptions>

      <div className={styles.contentSection}>
        <div className={styles.contentLabel}>본문</div>
        <div className={styles.contentBody} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.content) }} />
      </div>
    </div>
  );
}
