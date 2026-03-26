import { useMemo, useState } from 'react';
import { Button, Modal, message } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  BankOutlined,
  CalendarOutlined,
  IdcardOutlined,
  LockOutlined,
  LogoutOutlined,
  SafetyCertificateOutlined,
  EditOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useMe, useLogout, useLogoutAll, ChangePasswordForm, ProfileEditForm } from '@features/auth';
import styles from './mypage-page.module.css';

export default function MypagePage() {
  const { me, permissions } = useMe();
  const logout = useLogout();
  const logoutAll = useLogoutAll();
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [logoutAllLoading, setLogoutAllLoading] = useState(false);

  const permissionEntries = useMemo(() => {
    if (!permissions) return [];
    return Object.entries(permissions)
      .filter(([, v]) => v)
      .map(([key]) => key);
  }, [permissions]);

  const handleLogoutAll = async () => {
    setLogoutAllLoading(true);
    try {
      await logoutAll();
    } catch {
      message.error('전체 로그아웃에 실패했습니다.');
      setLogoutAllLoading(false);
    }
  };

  if (!me) {
    return (
      <div className={styles.emptyState}>
        <UserOutlined style={{ fontSize: 48 }} />
        <span>사용자 정보를 불러올 수 없습니다.</span>
      </div>
    );
  }

  const { user, roles } = me;

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        {/* ── 왼쪽 영역 ── */}
        <div className={styles.mainCol}>
          {/* 프로필 카드 */}
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h2 className={styles.cardTitle}>프로필 정보</h2>
                <p className={styles.cardDesc}>기본 정보를 확인하고 수정할 수 있습니다.</p>
              </div>
              <Button icon={<EditOutlined />} onClick={() => setProfileModalOpen(true)}>수정</Button>
            </div>

            <div className={styles.profileHero}>
              <div className={styles.avatar}>
                {user.userName?.charAt(0) ?? 'U'}
              </div>
              <div className={styles.heroText}>
                <span className={styles.heroName}>{user.userName}</span>
                <span className={styles.heroId}>@{user.userId}</span>
              </div>
            </div>

            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}><UserOutlined /> 이름</div>
                <div className={styles.infoValue}>{user.userName || '-'}</div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}><IdcardOutlined /> 사용자 ID</div>
                <div className={styles.infoValue}>{user.userId || '-'}</div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}><MailOutlined /> 이메일</div>
                <div className={styles.infoValue}>{user.userEmail || '-'}</div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}><BankOutlined /> 부서명</div>
                <div className={styles.infoValue}>{user.corpName || '-'}</div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}><PhoneOutlined /> 전화번호</div>
                <div className={styles.infoValue}>{user.userTel || '-'}</div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}><PhoneOutlined /> 휴대폰</div>
                <div className={styles.infoValue}>{user.userHp || '-'}</div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}><CalendarOutlined /> 가입일</div>
                <div className={styles.infoValue}>
                  {user.regDtm ? dayjs(user.regDtm).format('YYYY. M. D.') : '-'}
                </div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>상태</div>
                <div className={styles.infoValue}>
                  <span className={`${styles.statusBadge} ${user.isActive ? styles.statusActive : styles.statusInactive}`}>
                    {user.isActive ? '활성' : '비활성'}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.cardFooter}>
              <Button icon={<LockOutlined />} size="large" onClick={() => setPasswordModalOpen(true)}>
                비밀번호 변경
              </Button>
            </div>
          </section>
        </div>

        {/* ── 오른쪽 영역 ── */}
        <div className={styles.sideCol}>
          {/* 역할 */}
          <section className={styles.card}>
            <div className={styles.sideCardHeader}>
              <h3 className={styles.cardTitle}>역할</h3>
            </div>
            <p className={styles.cardDesc}>부여된 역할 목록입니다.</p>
            <div className={styles.roleTags}>
              {roles.length > 0
                ? roles.map((role) => (
                    <span key={role} className={styles.roleTag}>{role}</span>
                  ))
                : <span className={styles.emptyText}>부여된 역할이 없습니다.</span>
              }
            </div>
          </section>

          {/* 권한 요약 */}
          <section className={styles.card}>
            <div className={styles.sideCardHeader}>
              <SafetyCertificateOutlined className={styles.sideCardIcon} />
              <h3 className={styles.cardTitle}>권한 요약</h3>
            </div>
            <p className={styles.cardDesc}>보유한 권한 정보입니다.</p>

            <div className={styles.permissionSummary}>
              <span className={styles.permissionLabel}>전체 권한 수</span>
              <span className={styles.permissionCount}>{permissionEntries.length}</span>
            </div>

            {permissionEntries.length > 0 && (
              <>
                <div className={styles.permissionListTitle}>주요 권한</div>
                <div className={styles.permissionList}>
                  {permissionEntries.map((key) => (
                    <div key={key} className={styles.permissionItem}>{key}</div>
                  ))}
                </div>
              </>
            )}
          </section>
        </div>
      </div>

      {/* ── 보안 설정 (전체 너비) ── */}
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h2 className={styles.cardTitle}>보안 설정</h2>
            <p className={styles.cardDesc}>계정 보안과 관련된 설정을 관리할 수 있습니다.</p>
          </div>
        </div>

        <div className={styles.securityRow}>
          <div>
            <div className={styles.securityRowTitle}>현재 기기에서 로그아웃</div>
            <div className={styles.securityRowDesc}>이 기기에서만 로그아웃됩니다.</div>
          </div>
          <Button icon={<LogoutOutlined />} size="large" onClick={logout}>
            로그아웃
          </Button>
        </div>

        <div className={`${styles.securityRow} ${styles.securityRowDanger}`}>
          <div>
            <div className={styles.securityRowTitle}>모든 기기에서 로그아웃</div>
            <div className={styles.securityRowDesc}>모든 기기에서 즉시 로그아웃됩니다.</div>
          </div>
          <Button
            icon={<LogoutOutlined />}
            size="large"
            danger
            type="primary"
            loading={logoutAllLoading}
            onClick={handleLogoutAll}
          >
            모든 기기에서 로그아웃
          </Button>
        </div>
      </section>

      {/* ── 비밀번호 변경 모달 ── */}
      <Modal
        title="비밀번호 변경"
        open={passwordModalOpen}
        onCancel={() => setPasswordModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <ChangePasswordForm
          onSuccess={() => {
            setPasswordModalOpen(false);
            message.success('비밀번호가 변경되었습니다.');
          }}
          onCancel={() => setPasswordModalOpen(false)}
        />
      </Modal>

      {/* ── 프로필 수정 모달 ── */}
      <Modal
        title="프로필 수정"
        open={profileModalOpen}
        onCancel={() => setProfileModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <ProfileEditForm
          defaultValues={{
            corpName: user.corpName || '',
            userName: user.userName || '',
            userEmail: user.userEmail || '',
            userTel: user.userTel || '',
            userHp: user.userHp || '',
          }}
          onSuccess={() => {
            setProfileModalOpen(false);
            message.success('프로필이 수정되었습니다.');
          }}
          onCancel={() => setProfileModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
