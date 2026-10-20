import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext.jsx';
import FormInput from '../components/FormInput.jsx';

export default function LoginPage() {
  const navigate = useNavigate();
  const { authenticate } = useSession();
  const [role, setRole] = useState('employee');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async event => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authenticate({ role, email, password, remember });
      navigate(role === 'admin' ? '/admin' : '/employee');
    } catch (reason) {
      setError(reason.message || 'Unable to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return <>
    <div dangerouslySetInnerHTML={{ __html: window.nav() }} />
    <main className="auth">
      <form className="auth-card" onSubmit={submit}>
        <span className="eyebrow">SECURE WORKSPACE ACCESS</span>
        <h1>Welcome back.</h1>
        <p>Choose your workspace and continue to AssetSphere.</p>
        <div className="role-tabs">
          <button type="button" className={role === 'employee' ? 'active' : ''} onClick={() => setRole('employee')}>Employee</button>
          <button type="button" className={role === 'admin' ? 'active' : ''} onClick={() => setRole('admin')}>Administrator</button>
        </div>
        <FormInput id="login-email" label="WORK EMAIL" type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} placeholder="you@company.com" />
        <FormInput id="login-password" label="PASSWORD" type="password" autoComplete="current-password" required minLength={6} value={password} onChange={event => setPassword(event.target.value)} placeholder="Enter your password" />
        <div className="remember-row">
          <label><input type="checkbox" checked={remember} onChange={event => setRemember(event.target.checked)} /> Remember me</label>
          <a href="#faq">Need help?</a>
        </div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="btn btn-primary form-submit" disabled={loading}>{loading ? 'Signing in…' : 'Continue to workspace →'}</button>
        <p className="fine">Demo access: use any valid email and a 6+ character password.<br />Employee defaults to Aarav Mehta.</p>
      </form>
    </main>
  </>;
}
