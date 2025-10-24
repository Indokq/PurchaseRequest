import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userService } from '../../../services/api/userService';
import { queryKeys } from '../../../shared/utils/queryKeys';

export const useUsers = () => {
  return useQuery({
    queryKey: queryKeys.users.all,
    queryFn: userService.getAll,
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => userService.getById(id),
    enabled: !!id,
  });
};

export const useAssignRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      userService.assignRole(userId, role),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(variables.userId) });
    },
  });
};
