import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="cc-auth">
      {/* Fullscreen video background */}
      <video
        className="cc-auth-video"
        src="/login.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="cc-auth-video-overlay" />

      <aside className="cc-auth-aside">
        <a className="cc-wordmark" href="/">CAPACITY <i>CONNECT</i></a>
        <div className="cc-auth-brand-text">
          <h2 className="cc-serif">Build stronger<br/>capabilities.</h2>
          <p>Understand skills, identify capability gaps, and build smarter growth paths across your organization.</p>
        </div>
      </aside>
      <div className="cc-auth-form"><div className="cc-auth-form-inner">
        <a className="cc-wordmark lg:hidden" href="/">CAPACITY <i>CONNECT</i></a>
        <div className="mt-12 mb-8"><div className="cc-auth-kicker">YOUR WORKSPACE</div><h2 className="cc-serif">{title}</h2>{subtitle && <p className="cc-auth-subtitle">{subtitle}</p>}</div>{children}
      </div></div>
    </div>
  );
};
