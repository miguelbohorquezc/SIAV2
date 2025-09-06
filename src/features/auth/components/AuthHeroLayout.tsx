import type { PropsWithChildren } from 'react';
import { useMemo } from 'react';
import { BRANDING } from '@/shared/constants/branding';

interface Props {
  imageUrl?: string;
  overlay?: number; // 0 a 1
}

type CSSVars = React.CSSProperties & Record<'--auth-bg' | '--auth-overlay', string>;

export default function AuthHeroLayout({
  imageUrl,
  overlay,
  children,
}: PropsWithChildren<Props>) {
  const bg = useMemo(() => imageUrl ?? BRANDING.AUTH_HERO_IMAGE, [imageUrl]);
  const ov = useMemo(() => overlay ?? BRANDING.AUTH_HERO_OVERLAY, [overlay]);

  const style: CSSVars = {
    ['--auth-bg']: `url("${bg}")`,
    ['--auth-overlay']: String(ov),
  };

  return (
    <section className="auth-hero" style={style} aria-label="Fondo de autenticación">
      <div className="auth-panel">{children}</div>
    </section>
  );
}
