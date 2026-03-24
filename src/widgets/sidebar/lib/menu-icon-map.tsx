import {
  AppstoreOutlined,
  BlockOutlined,
  FileTextOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  TeamOutlined,
  SettingOutlined,
  AuditOutlined,
  UserOutlined,
  LockOutlined,
  GlobalOutlined,
  SecurityScanOutlined,
  LayoutOutlined,
  ContainerOutlined,
  ReadOutlined,
  CustomerServiceOutlined,
  DashboardOutlined,
  UnorderedListOutlined,
  CalendarOutlined,
} from '@ant-design/icons';

/**
 * pageName → Ant Design 아이콘 매핑
 * 새 메뉴가 추가되면 이 파일에만 아이콘을 등록하면 됩니다.
 */
export const menuIconMap: Record<string, React.ReactNode> = {
  // 슈퍼 관리자
  'super': <SafetyOutlined />,
  'super.dashboard': <AppstoreOutlined />,
  'super.tenants': <BlockOutlined />,
  'super.pages': <FileTextOutlined />,
  'super.actions': <ThunderboltOutlined />,
  'super.permissions': <LockOutlined />,

  // 사용자 & 권한
  'user_management': <TeamOutlined />,
  'roles': <AuditOutlined />,
  'users': <UserOutlined />,
  'permissions': <SafetyOutlined />,

  // 생성 및 시스템 관리
  'system_management': <SettingOutlined />,
  'tenants.status': <BlockOutlined />,
  'security': <SecurityScanOutlined />,
  'websites': <GlobalOutlined />,
  'board_types': <LayoutOutlined />,

  // 콘텐츠 관리
  'content_management': <ContainerOutlined />,
  'boards.posts': <ReadOutlined />,

  // 상담 관리
  'counsel_management': <CustomerServiceOutlined />,
  'counsels.dashboard': <DashboardOutlined />,
  'counsels': <UnorderedListOutlined />,
  'counsels.calendar': <CalendarOutlined />,
};
