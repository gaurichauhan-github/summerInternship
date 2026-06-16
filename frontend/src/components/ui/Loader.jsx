import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn.js';

export default function Loader({ fullScreen = false, label = 'Loading...', size = 'md' }) {
  const iconSize = size === 'sm' ? 18 : size === 'lg' ? 32 : 24;

  return (
    <div className={cn('flex items-center justify-center gap-3 text-slate-600', fullScreen && 'min-h-[50vh]')}>
      <Loader2 size={iconSize} className="animate-spin" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
