'use client';

import Link from 'next/link';
import type { MouseEventHandler, ReactNode } from 'react';

type GlowNavItemProps = {
  href: string;
  label: string;
  icon: ReactNode;
  active?: boolean;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

export default function GlowNavItem({
  href,
  label,
  icon,
  active = false,
  onClick
}: GlowNavItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`glow-nav-item ${active ? 'is-active' : ''}`}
      aria-current={active ? 'page' : undefined}
    >
      <span className="glow-nav-icon">
        <span
          className="glow-nav-ring"
          aria-hidden="true"
        />

        <span
          className="glow-nav-halo"
          aria-hidden="true"
        />

        <span
          className="glow-nav-spark"
          aria-hidden="true"
        />

        <span className="glow-nav-core">
          {icon}
        </span>
      </span>

      <span className="glow-nav-label">
        {label}
      </span>
    </Link>
  );
}