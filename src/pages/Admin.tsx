import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UsersManagement } from '@/components/admin/UsersManagement';
import { AdminStats } from '@/components/admin/AdminStats';

export default function Admin() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage user accounts and balances</p>
        </div>

        <AdminStats />

        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
          </CardHeader>
          <CardContent>
            <UsersManagement />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
