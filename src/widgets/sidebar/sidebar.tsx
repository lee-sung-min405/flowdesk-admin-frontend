import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Tooltip } from 'antd';
import {
  BlockOutlined,
  LeftOutlined,
  RightOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useMe } from '@features/auth/model/use-me';
import { useLogout } from '@features/auth/model/use-logout';
import { buildMenuItems } from './lib/build-menu-items';
import type { SidebarProps } from './sidebar.type';
import styles from './sidebar.module.css';

export default function Sidebar({ collapsed, onCollapse }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { me, menuTree } = useMe();
  const logout = useLogout();

  const menuItems = useMemo(() => buildMenuItems(menuTree), [menuTree]);
  const defaultOpenKeys = useMemo(
    () => menuTree.map((node) => node.pageName),
    [menuTree],
  );

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 768px)');
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
      if (e.matches) {
        setMobileOpen(false);
      }
    };
    handleChange(mql);
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setMobileOpen(!collapsed);
    }
  }, [collapsed, isMobile]);

  useEffect(() => {
    if (isMobile) {
      setMobileOpen(false);
      onCollapse(true);
    }
  }, [location.pathname, isMobile, onCollapse]);

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key.startsWith('/')) {
      navigate(key);
    }
  };

  const closeMobile = () => {
    setMobileOpen(false);
    onCollapse(true);
  };

  const isCollapsed = !isMobile && collapsed;

  return (
    <>
      <div
        className={styles.overlay}
        data-visible={mobileOpen}
        onClick={closeMobile}
      />
      <aside
        className={styles.sidebar}
        data-collapsed={isCollapsed}
        data-mobile-open={mobileOpen}
        aria-label="메인 네비게이션"
      >
        {/* 로고 영역 */}
        <Tooltip title="FlowDesk Admin" placement="right" open={isCollapsed ? undefined : false}>
          <div className={styles.logo} onClick={() => navigate('/home')}>
            <div className={styles.logoIcon}>
              <BlockOutlined style={{ fontSize: 22 }} />
            </div>
            <div className={styles.logoTextGroup}>
              <span className={styles.logoTitle}>FlowDesk</span>
              <span className={styles.logoSubtitle}>Admin</span>
              <span className={styles.logoDesc}>관리자콘솔</span>
            </div>
          </div>
        </Tooltip>

        {/* 접기/펼치기 버튼 */}
        {!isMobile && (
          <button
            className={styles.collapseBtn}
            onClick={() => onCollapse(!collapsed)}
            aria-label={isCollapsed ? '사이드바 펼치기' : '사이드바 접기'}
            aria-expanded={!isCollapsed}
          >
            {isCollapsed ? <RightOutlined /> : <LeftOutlined />}
            {!isCollapsed && <span>사이드바 접기</span>}
          </button>
        )}

        {/* 메뉴 */}
        <div className={styles.menuWrapper}>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            defaultOpenKeys={defaultOpenKeys}
            items={menuItems}
            onClick={handleMenuClick}
            inlineCollapsed={isCollapsed}
          />
        </div>

        {/* 하단: 사용자 정보 + 로그아웃 */}
        <div className={styles.footer}>
          {me && (
            <Tooltip title={me.user.userName} placement="right" open={isCollapsed ? undefined : false}>
              <div
                className={styles.userInfo}
                onClick={() => navigate('/mypage')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') navigate('/mypage'); }}
              >
                <div className={styles.userAvatar}>
                  {me.user.userName?.charAt(0) ?? 'U'}
                </div>
                {!isCollapsed && (
                  <div className={styles.userText}>
                    <span className={styles.userName}>{me.user.userName}</span>
                    <span className={styles.userEmail}>{me.user.userEmail}</span>
                  </div>
                )}
              </div>
            </Tooltip>
          )}
          <Tooltip title="로그아웃" placement="right" open={isCollapsed ? undefined : false}>
            <button className={styles.logoutBtn} onClick={logout} aria-label="로그아웃">
              <LogoutOutlined />
              {!isCollapsed && <span>로그아웃</span>}
            </button>
          </Tooltip>
        </div>
      </aside>
    </>
  );
}
