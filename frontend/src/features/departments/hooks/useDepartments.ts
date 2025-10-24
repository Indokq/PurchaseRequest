import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { departmentService } from '../../../services/api/departmentService';
import { queryKeys } from '../../../shared/utils/queryKeys';
import type { CreateDepartmentDto, UpdateDepartmentDto } from '../../../shared/types';

export const useDepartments = () => {
  return useQuery({
    queryKey: queryKeys.departments.all,
    queryFn: departmentService.getAll,
  });
};

export const useDepartment = (id: string) => {
  return useQuery({
    queryKey: queryKeys.departments.detail(id),
    queryFn: () => departmentService.getById(id),
    enabled: !!id,
  });
};

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDepartmentDto) => departmentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.departments.all });
    },
  });
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDepartmentDto }) =>
      departmentService.update(id, data),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.departments.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.departments.detail(variables.id) });
    },
  });
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => departmentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.departments.all });
    },
  });
};
