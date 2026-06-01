import React from 'react';
import { Lightbulb, AlertTriangle, Info, HelpCircle } from 'lucide-react';
import type { CalloutBlock } from '@/types/module-v2';
import { BlockContext } from './BlockRegistry';

interface Props {
  block: CalloutBlock;
  context: BlockContext;
}

const variantStyles = {
  tip: {
    icon: Info,
    className: 'bg-blue-50 border-blue-200 text-blue-800',
    iconClass: 'text-blue-500',
  },
  warning: {
    icon: AlertTriangle,
    className: 'bg-amber-50 border-amber-200 text-amber-800',
    iconClass: 'text-amber-500',
  },
  'why-it-matters': {
    icon: Lightbulb,
    className: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    iconClass: 'text-yellow-500',
  },
  reflection: {
    icon: HelpCircle,
    className: 'bg-purple-50 border-purple-200 text-purple-800',
    iconClass: 'text-purple-500',
  },
};

export const CalloutBlockRenderer: React.FC<Props> = ({ block }) => {
  const style = variantStyles[block.variant] ?? variantStyles.tip;
  const Icon = style.icon;

  return (
    <div className={`my-4 flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ${style.className}`}>
      <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${style.iconClass}`} />
      <span className="leading-relaxed">{block.content}</span>
    </div>
  );
};
