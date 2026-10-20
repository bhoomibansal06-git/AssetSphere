import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext.jsx';
import FormInput from '../components/FormInput.jsx';

export default function SignupPage() {
  const navigate = useNavigate();
  const { register } = useSession();
  const [role, setRole] = useState('employee');
  const [form, setForm] = useState({ name: '', email: '', phone: '', department: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const update = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }));

  const submit = async event => {
    event.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await register({ role, name: form.name, email: form.email, phone: form.phone, department: form.department });
      navigate(role === 'admin' ? '/admin' : '/employee');
    } catch (reason) {
      setError(reason.message || 'Unable to create the account.');
    } finally {
      setLoading(false);
    }
  };

  return <>
    <div dangerouslySetInnerHTML={{ __html: window.nav() }} />
    <main className="auth">
      <form className="auth-card signup-card" onSubmit={submit}>
        <span className="eyebrow">CREATE YOUR WORKSPACE</span>
        <h1>Start with clarity.</h1>
        <p>Create an employee account or an administrator workspace.</p>
        <div className="role-tabs">
          <button type="button" className={role === 'employee' ? 'active' : ''} onClick={() => setRole('employee')}>Employee</button>
          <button type="button" className={role === 'admin' ? 'active' : ''} onClick={() => setRole('admin')}>Administrator</button>
        </div>
        <div className="form-row">
          <FormInput id="signup-name" name="name" label="FULL NAME" required value={form.name} onChange={update} placeholder="Your name" />
          <FormInput id="signup-id" label={role === 'admin' ? 'ADMIN ID' : 'EMPLOYEE ID'} required placeholder={role === 'admin' ? 'ADM-1001' : 'EMP-2048'} />
        </div>
        <FormInput id="signup-email" name="email" label="WORK EMAIL" type="email" autoComplete="email" required value={form.email} onChange={update} placeholder="name@company.com" />
        <div className="form-row">
          <FormInput id="signup-phone" name="phone" label="PHONE" type="tel" required value={form.phone} onChange={update} placeholder="+91 98XXX XXXXX" />
          <FormInput id="signup-department" name="department" label={role === 'admin' ? 'TEAM' : 'DEPARTMENT'} required value={form.department} onChange={update} placeholder={role === 'admin' ? 'IT Operations' : 'Product Engineering'} />
        </div>
        <div className="form-row">
          <FormInput id="signup-password" name="password" label="PASSWORD" type="password" autoComplete="new-password" required minLength={6} value={form.password} onChange={update} />
          <FormInput id="signup-confirm-password" name="confirmPassword" label="CONFIRM PASSWORD" type="password" autoComplete="new-password" required minLength={6} value={form.confirmPassword} onChange={update} />
        </div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="btn btn-primary form-submit" disabled={loading}>{loading ? 'Creating account…' : 'Create account →'}</button>
        <p className="fine">Already part of AssetSphere? <a href="#login">Sign in</a></p>
      </form>
    </main>
  </>;
}
