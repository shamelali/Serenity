import { AuthProvider } from '@/components/auth';
import { ClientRoot } from './ClientRoot';

export default function Home() {
  return (
    <AuthProvider>
      <ClientRoot />
    </AuthProvider>
  );
}
