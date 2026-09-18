import { useEffect, useState } from 'react';
import { Cookie, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { hasAuthCookieConsent, setAuthCookieConsent } from '../../store/authStore';

export const CookieConsent = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isAuthEntryRoute = location.pathname === '/login' || location.pathname === '/register';
    setIsVisible(isAuthEntryRoute && !hasAuthCookieConsent());
  }, [location.pathname]);

  if (!isVisible) return null;

  const dismiss = () => setIsVisible(false);

  const accept = () => {
    setAuthCookieConsent(true);
    dismiss();
  };

  return (
    <aside className="cc-cookie-banner" role="dialog" aria-label="Cookie preferences">
      <div className="cc-cookie-copy">
        <span className="cc-cookie-icon" aria-hidden="true"><Cookie size={18} /></span>
        <div>
          <strong>Keep your workspace ready</strong>
          <p>Allow a secure sign-in cookie so you can return without logging in again.</p>
        </div>
      </div>
      <div className="cc-cookie-actions">
        <button type="button" className="cc-cookie-dismiss" onClick={dismiss}>Not now</button>
        <button type="button" className="cc-button cc-button--bright cc-cookie-accept" onClick={accept}>Allow cookies</button>
        <button type="button" className="cc-cookie-close" aria-label="Dismiss cookie notice" onClick={dismiss}>
          <X size={16} />
        </button>
      </div>
    </aside>
  );
};
