import { axiosInstance } from '@shared/api/axios';

interface UpdateUserRolesPayload {
  add?: number[];
  remove?: number[];
}

interface UpdateUserRolesResult {
  userSeq: number;
  assignedRoleIds: number[];
}

/**
 * 사용자에게 역할을 추가합니다.
 * PATCH /users/:userSeq/roles { add: [roleId] }
 */
export async function addUserToRoleApi(userSeq: number, roleId: number): Promise<UpdateUserRolesResult> {
  const data: UpdateUserRolesPayload = { add: [roleId] };
  const response = await axiosInstance.patch<UpdateUserRolesResult>(`/users/${userSeq}/roles`, data);
  return response.data;
}

/**
 * 사용자에서 역할을 제거합니다.
 * PATCH /users/:userSeq/roles { remove: [roleId] }
 */
export async function removeUserFromRoleApi(userSeq: number, roleId: number): Promise<UpdateUserRolesResult> {
  const data: UpdateUserRolesPayload = { remove: [roleId] };
  const response = await axiosInstance.patch<UpdateUserRolesResult>(`/users/${userSeq}/roles`, data);
  return response.data;
}
