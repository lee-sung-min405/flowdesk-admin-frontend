// 공통 에러 메시지 추출 및 안내 로직
// 모든 API 에러 응답을 일관적으로 처리

import axios from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';

// 에러 메시지 매핑 테이블
const ERROR_MESSAGE_MAP: Record<string, string> = {
  AUTH001_401: '인증에 실패했습니다.',
  AUTH101_403: '권한이 부족합니다.',
  VAL001_400: '입력값이 올바르지 않습니다.',
  BIZ001_409: '비즈니스 충돌 오류가 발생했습니다.',
  RES001_404: '요청한 리소스를 찾을 수 없습니다.',
  USER001_409: '이미 존재하는 사용자입니다.',
  USER001_404: '사용자를 찾을 수 없습니다.',
};

// axios 공식 isAxiosError 사용
function isErrorResponse(error: unknown): error is ErrorResponse {
  if (typeof error !== 'object' || error === null || !('error' in error)) {
    return false;
  }
  const inner = (error as { error: unknown }).error;
  if (typeof inner !== 'object' || inner === null) return false;
  return (
    'code' in inner &&
    typeof (inner as { code?: unknown }).code === 'string' &&
    'statusCode' in inner &&
    typeof (inner as { statusCode?: unknown }).statusCode === 'number'
  );
}

function normalizeMessage(message: unknown): string | null {
  if (typeof message === 'string' && message.trim()) return message;
  if (Array.isArray(message)) {
    const values = message.filter((v): v is string => typeof v === 'string' && Boolean(v.trim()));
    return values.length ? values.join(', ') : null;
  }
  return null;
}

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') {
      return '요청 시간이 초과되었습니다. 다시 시도해주세요.';
    }

    if (!error.response) {
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        return '네트워크 오류가 발생했습니다. 다시 시도해주세요.';
      }
      return '서버 응답이 없습니다. 잠시 후 다시 시도해주세요.';
    }

    const payload = error.response.data;

    if (isErrorResponse(payload)) {
      const { code, statusCode, message } = payload.error;
      const key = `${code}_${statusCode}`;
      const mapped = ERROR_MESSAGE_MAP[key];
      if (mapped) return mapped;
      return normalizeMessage(message) ?? '알 수 없는 오류가 발생했습니다.';
    }

    return '요청 처리 중 오류가 발생했습니다.';
  }

  if (isErrorResponse(error)) {
    const { code, statusCode, message } = error.error;
    const key = `${code}_${statusCode}`;
    return ERROR_MESSAGE_MAP[key] ?? normalizeMessage(message) ?? '알 수 없는 오류가 발생했습니다.';
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return '알 수 없는 오류가 발생했습니다.';
}
