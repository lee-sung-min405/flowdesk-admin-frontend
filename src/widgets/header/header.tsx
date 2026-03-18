import { useEffect, useState } from 'react';
import { Badge, Dropdown, message, Modal, Popover } from 'antd';
import type { MenuProps } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useMe } from '@features/auth/model/use-me';
import { useLogout } from '@features/auth/model/use-logout';
import { ChangePasswordForm } from '@features/auth';
import Breadcrumb from '@widgets/breadcrumb/breadcrumb';
import type { HeaderProps } from './header.type';
import styles from './header.module.css';

export default function Header({ collapsed, onToggleCollapsed }: HeaderProps) {
  const { me } = useMe();
  const [notificationCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const navigate = useNavigate();
  const logout = useLogout();

  useEffect(() => {
    const container = document.querySelector('[data-scroll-area]');
    if (!container) return;
    const handleScroll = () => setScrolled(container.scrollTop > 0);
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const profileMenuItems: MenuProps['items'] = [
    ...(me?.user.corpName
      ? [
          {
            key: 'tenant-info',
            label: me.user.corpName,
            disabled: true,
            className: styles.tenantMenuItem,
          },
          { type: 'divider' as const },
        ]
      : []),
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '내 정보',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '비밀번호 변경',
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '로그아웃',
      danger: true,
    },
  ];

  const handleProfileMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      logout();
    } else if (key === 'profile') {
      navigate('/mypage');
    } else if (key === 'settings') {
      setPasswordModalOpen(true);
    } else {
      message.info('준비 중인 기능입니다');
    }
  };

  const notificationContent = (
    <div className={styles.notificationPanel}>
      <div className={styles.notificationHeader}>알림</div>
      <div className={styles.notificationEmpty}>
        <BellOutlined style={{ fontSize: 28, color: 'var(--color-text-secondary)', marginBottom: 8 }} />
        <span>새 알림이 없습니다</span>
      </div>
    </div>
  );

  return (
    <header className={styles.header} data-scrolled={scrolled}>
      <div className={styles.left}>
        <button
          className={styles.toggleBtn}
          onClick={onToggleCollapsed}
          aria-label={collapsed ? '사이드바 펼치기' : '사이드바 접기'}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>
        <Breadcrumb />
      </div>

      <div className={styles.right}>
        {/* 테넌트 뱃지 */}
        {me?.user.corpName && (
          <div className={styles.tenantBadge}>
            {me.user.corpName}
          </div>
        )}

        {/* 알림 */}
        <Popover
          content={notificationContent}
          trigger="click"
          placement="bottomRight"
          arrow={false}
        >
          <button className={styles.iconBtn} aria-label="알림">
            <Badge count={notificationCount} size="small" offset={[-2, 2]}>
              <BellOutlined className={styles.iconBtnIcon} />
            </Badge>
          </button>
        </Popover>

        {/* 프로필 드롭다운 */}
        <Dropdown
          menu={{ items: profileMenuItems, onClick: handleProfileMenuClick }}
          trigger={['click']}
          placement="bottomRight"
        >
          <button className={styles.profileBtn}>
            <div className={styles.profileAvatar}>
              {me?.user.userName?.charAt(0) ?? 'U'}
            </div>
            <span className={styles.profileName}>
              {me?.user.userName ?? '사용자'}
            </span>
          </button>
        </Dropdown>
      </div>

      <Modal
        title="비밀번호 변경"
        open={passwordModalOpen}
        onCancel={() => setPasswordModalOpen(false)}
        footer={null}
        destroyOnClose
        width={480}
      >
        <ChangePasswordForm
          onSuccess={() => {
            setPasswordModalOpen(false);
            message.success('비밀번호가 변경되었습니다');
          }}
          onCancel={() => setPasswordModalOpen(false)}
        />
      </Modal>
    </header>
  );
}
