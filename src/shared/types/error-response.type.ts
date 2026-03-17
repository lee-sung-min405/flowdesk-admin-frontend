// 공통 에러 응답 타입
export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    statusCode: number;
  };
  meta: {
    requestId: string;
    timestamp: string;
    path: string;
  };
}
