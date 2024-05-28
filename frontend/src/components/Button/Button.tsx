import React, { ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  buttonType: 'primary' | 'secondary';
  className?: string;
}

function Button({ buttonType, children, className, ...props }: Props) {
  const primaryClasses = 'bg-slate-900 text-white hover:bg-slate-700';
  const secondaryClasses =
    'bg-white text-slate-900 hover:bg-slate-50 border border-slate-900';

  const cssClasses =
    buttonType === 'primary' ? primaryClasses : secondaryClasses;
  const propClasses = className ?? '';

  return (
    <button
      {...props}
      className={`inline-flex justify-center rounded-lg text-sm font-semibold py-2.5 px-4 ${propClasses} ${cssClasses}`}
    >
      {children}
    </button>
  );
}
export default Button;
