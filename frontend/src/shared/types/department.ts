import type { BaseEntity } from './common';

export interface DepartmentResponse extends BaseEntity {
  code: string;
  name: string;
  description?: string;
  managerName?: string;
  isActive: boolean;
}

export type Department = DepartmentResponse;

export interface CreateDepartmentDto {
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface UpdateDepartmentDto extends CreateDepartmentDto {
  id: string;
}
