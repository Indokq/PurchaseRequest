export interface UserDto {
  id: string;
  email: string;
  username?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  employeeId: string;
  departmentId: string;
  departmentName?: string;
  roles: string[];
  isActive: boolean;
  createdAt: string;
}

export type User = UserDto;

export interface RoleDto {
  id: string;
  name: string;
  description: string;
}

export interface UpdateRoleRequest {
  roleName: string;
}
