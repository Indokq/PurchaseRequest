import React from 'react';
import { Building, Plus, Users } from 'lucide-react';
import { useDepartments } from '../hooks/useDepartments';
import { Badge, Button, Card, Spinner } from '../../../shared/components';

export const DepartmentListPage: React.FC = () => {
  const { data: departments, isLoading, error } = useDepartments();

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
        <p className="text-rose-400">Error loading departments: {(error as any).message}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Departments</h1>
          <p className="text-slate-400">Manage organization departments</p>
        </div>
        <Button variant="primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Department
        </Button>
      </div>

      {departments && departments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((department) => (
            <Card key={department.id} className="p-6 hover:border-primary/30 transition-colors">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-amber-500/20 p-3 text-amber-400">
                  <Building className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white mb-1">{department.name}</h3>
                  {department.description && (
                    <p className="text-sm text-slate-400 mb-3 line-clamp-2">{department.description}</p>
                  )}
                  {department.managerName && (
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Users className="w-4 h-4" />
                      <span>Manager: {department.managerName}</span>
                    </div>
                  )}
                  <div className="mt-3">
                    <Badge variant={department.isActive ? 'success' : 'secondary'}>
                      {department.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Building className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-300 mb-2">No departments found</h3>
          <p className="text-slate-500">Get started by adding your first department</p>
        </Card>
      )}
    </div>
  );
};
