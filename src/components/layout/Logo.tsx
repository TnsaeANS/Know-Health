import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';
import { Activity } from 'lucide-react'; // Using Activity as a generic health pulse icon

const Logo = () => {
  return (
    <Link href="/" className="flex items-center space-x-2 text-primary hover:opacity-80 transition-opacity">
      <Activity className="h-8 w-8" />
      <span className="font-headline text-2xl font-semibold">{APP_NAME}</span>
    </Link>
  );
};

export default Logo;
