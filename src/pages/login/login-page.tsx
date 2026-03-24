import { Card } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import styles from './login-page.module.css';
import { LoginForm } from '@features/auth';
import { useAuthStore } from '@features/auth/model/auth.store';
import { authStorage } from '@features/auth/lib/auth-storage';

export default function LoginPage() {
	const navigate = useNavigate();
	const storeToken = useAuthStore((state) => state.accessToken);
	useEffect(() => {
		if (storeToken || authStorage.getAccessToken()) {
			navigate('/home', { replace: true });
		}
	}, [navigate, storeToken]);
	return (
		<div className={styles.container}>
			<Card className={styles.card}>
				<div className={styles.logoWrapper}>
					<div className={styles.logoTitleWrapper}>
						<div className={styles.logoText}>FlowDesk Admin</div>
						<div className={styles.logoSubtitle}>관리자 시스템 로그인</div>
					</div>
				</div>
				<LoginForm />
				<div className={styles.signupText}>
					아직 계정이 없으신가요? <Link to="/signup">회원가입</Link>
				</div>
				<div className={styles.copyright}>
					Flowdesk Admin © 2026 All rights reserved.
				</div>
			</Card>
		</div>
	);
}
