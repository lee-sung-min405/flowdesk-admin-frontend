import { Card } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import styles from './signup-page.module.css';
import { SignupForm } from '@features/auth';
import { useAuthStore } from '@features/auth/model/auth.store';
import { authStorage } from '@features/auth/lib/auth-storage';

export default function SignupPage() {
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
						<div className={styles.logoSubtitle}>회원가입</div>
					</div>
				</div>
				<SignupForm />
				<div className={styles.loginText}>
					이미 계정이 있으신가요? <Link to="/login">로그인</Link>
				</div>
				<div className={styles.copyright}>
					Flowdesk Admin © 2026 All rights reserved.
				</div>
			</Card>
		</div>
	);
}
