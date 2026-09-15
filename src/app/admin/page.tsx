import { RoleGate } from '@/components/RoleGate';

export default function AdminPage() {
  return <RoleGate role="super_admin" />;
}
