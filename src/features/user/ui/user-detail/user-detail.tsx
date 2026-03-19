import { Descriptions, Badge, Tag, Spin, Empty } from 'antd';
import dayjs from 'dayjs';
import type { GetUserResponse } from '../../types/user.type';
import styles from './user-detail.module.css';

interface UserDetailProps {
  data: GetUserResponse | undefined;
  loading: boolean;
}

export default function UserDetail({ data, loading }: UserDetailProps) {
  if (loading) {
    return <div className={styles.loadingContainer}><Spin /></div>;
  }

  if (!data) {
    return <Empty description="사용자 정보를 불러올 수 없습니다." />;
  }

  return (
    <div className={styles.container}>
      <Descriptions
        bordered
        size="small"
        column={2}
        labelStyle={{ fontWeight: 600, width: 120 }}
      >
        <Descriptions.Item label="사용자 ID">
          <code className={styles.codeName}>{data.userId}</code>
        </Descriptions.Item>
        <Descriptions.Item label="상태">
          <Badge
            status={data.isActive ? 'success' : 'default'}
            text={data.isActive ? '활성' : '정지'}
          />
        </Descriptions.Item>
        <Descriptions.Item label="이름">{data.userName}</Descriptions.Item>
        <Descriptions.Item label="회사명">{data.corpName}</Descriptions.Item>
        <Descriptions.Item label="이메일" span={2}>
          {data.userEmail || <span className={styles.emptyValue}>—</span>}
        </Descriptions.Item>
        <Descriptions.Item label="전화번호">
          {data.userTel || <span className={styles.emptyValue}>—</span>}
        </Descriptions.Item>
        <Descriptions.Item label="휴대폰">
          {data.userHp || <span className={styles.emptyValue}>—</span>}
        </Descriptions.Item>
        <Descriptions.Item label="등록일">
          {dayjs(data.regDtm).format('YYYY-MM-DD HH:mm:ss')}
        </Descriptions.Item>
        <Descriptions.Item label="정지일">
          {data.stopDtm
            ? dayjs(data.stopDtm).format('YYYY-MM-DD HH:mm:ss')
            : <span className={styles.emptyValue}>—</span>}
        </Descriptions.Item>
        <Descriptions.Item label="역할" span={2}>
          {data.availableRoles && data.assignedRoleIds.length > 0
            ? data.availableRoles
                .filter((role) => data.assignedRoleIds.includes(role.roleId))
                .map((role) => (
                  <Tag key={role.roleId} className={styles.roleTag} color="blue">
                    {role.displayName}
                  </Tag>
                ))
            : <span className={styles.emptyValue}>역할 없음</span>}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
}
