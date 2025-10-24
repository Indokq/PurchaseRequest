import React from 'react';
import { Users, Mail, Building } from 'lucide-react';
import { useUsers } from '../hooks/useUsers';
import { Badge, Card, Spinner } from '../../../shared/components';

export const UserListPage: React.FC = () => {
  const { data: users, isLoading, error } = useUsers();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-rose-400">Error loading users: {(error as any).message}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Users</h1>
          <p className="text-slate-400">Manage system users and roles</p>
        </div>
      </div>

      {users && users.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <Card key={user.id} className="p-6 hover:border-primary/30 transition-colors">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/20 w-12 h-12 flex items-center justify-center text-primary font-semibold text-lg">
                  {user.fullName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white mb-1">{user.fullName}</h3>
                  <p className="text-sm text-slate-400 mb-1">@{user.username}</p>
                  
                  {user.email && (
                    <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{user.email}</span>
                    </div>
                  )}
                  
                  {user.departmentName && (
                    <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
                      <Building className="w-4 h-4" />
                      <span>{user.departmentName}</span>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    {user.roles?.map((role) => (
                      <Badge key={role} variant="secondary">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-300 mb-2">No users found</h3>
          <p className="text-slate-500">No users available</p>
        </Card>
      )}
    </div>
  );
};
