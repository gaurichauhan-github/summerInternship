import { AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn.js';

export default function ErrorMessage({ className, message = 'Something went wrong.' }) {
  return (
    <div className={cn('flex items-start gap-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700', className)}>
      <AlertCircle className="mt-0.5 shrink-0" size={18} />
      <p>{message}</p>
    </div>
  );
}
