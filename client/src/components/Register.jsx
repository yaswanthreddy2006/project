import React, { useState, useEffect } from 'react';
import { User, Lock, Hash, Mail, UserPlus, CheckCircle, AlertCircle, ArrowLeft, Info } from 'lucide-react';
import { validateRegistrationNumber, generateKLUEmail } from '../utils/validation';

export default function Register({ onRegisterSuccess, switchToLogin, showToast }) {
  const [username, setUsername] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [regValidation, setRegValidation] = useState({ isValid: false, message: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto update generated email and validate registration number on input change
  useEffect(() => {
    const generated = generateKLUEmail(registrationNumber);
    setEmail(generated);

    if (registrationNumber.trim()) {
      const validation = validateRegistrationNumber(registrationNumber);
      setRegValidation(validation);
    } else {
      setRegValidation({ isValid: false, message: '' });
    }
  }, [registrationNumber]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // 1. Check missing fields
    if (!username.trim() || !registrationNumber.trim() || !password || !confirmPassword) {
      const err = 'Please fill in all required fields.';
      setErrorMsg(err);
      showToast(err, 'error');
      return;
    }

    // 2. Validate Reg No rules
    const regCheck = validateRegistrationNumber(registrationNumber);
    if (!regCheck.isValid) {
      setErrorMsg(regCheck.message);
      showToast(regCheck.message, 'error');
      return;
    }

    // 3. Password checks
    if (password.length < 8) {
      const err = 'Password must be at least 8 characters long.';
      setErrorMsg(err);
      showToast(err, 'error');
      return;
    }

    if (password !== confirmPassword) {
      const err = 'Passwords do not match.';
      setErrorMsg(err);
      showToast(err, 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          registrationNumber: registrationNumber.trim(),
          password,
          confirmPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed.');
      }

      // Store JWT session token
      localStorage.setItem('klu_jwt_token', data.token);
      showToast('Registration successful! Welcome to KLU.', 'success');
      onRegisterSuccess(data.user);
    } catch (err) {
      setErrorMsg(err.message);
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="glass-panel auth-card animate-fade-in" style={{ maxWidth: '520px' }}>
        {/* Card Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <button
            type="button"
            onClick={switchToLogin}
            style={{
              float: 'left',
              background: 'none',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.85rem'
            }}
          >
            <ArrowLeft size={16} /> Login
          </button>
          <div style={{ clear: 'both' }} />

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.5rem', marginBottom: '0.3rem' }}>
            Create Student Account
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Register your official KLU campus credentials
          </p>
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontSize: '0.875rem'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="form-group">
            <label className="form-label">Username</label>
            <div className="input-icon-wrapper">
              <User size={18} className="field-icon" />
              <input
                type="text"
                className="form-input"
                placeholder="e.g. rahul_99"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          {/* Registration Number */}
          <div className="form-group">
            <div className="form-label">
              <span>Registration Number</span>
              {registrationNumber.trim() && (
                <span className={`validation-badge ${regValidation.isValid ? 'badge-success' : 'badge-error'}`}>
                  {regValidation.isValid ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                  {regValidation.isValid ? 'Valid' : 'Must start with 99 (8-16 digits)'}
                </span>
              )}
            </div>
            <div className="input-icon-wrapper">
              <Hash size={18} className="field-icon" />
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 9921004123"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value.replace(/\D/g, ''))}
                maxLength={16}
              />
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Info size={12} /> Rule: Starts with 99; total 8 to 16 digits.
            </span>
          </div>

          {/* Automatically Generated Email Field (Readonly) */}
          <div className="form-group">
            <div className="form-label">
              <span>Official College Email</span>
              <span className="validation-badge badge-success">Auto-Generated</span>
            </div>
            <div className="input-icon-wrapper">
              <Mail size={18} className="field-icon" />
              <input
                type="email"
                className="form-input"
                value={email}
                readOnly
                disabled
                placeholder="<RegistrationNumber>@klu.ac.in"
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">
              <span>Password</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Min 8 chars</span>
            </label>
            <div className="input-icon-wrapper">
              <Lock size={18} className="field-icon" />
              <input
                type="password"
                className="form-input"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div className="input-icon-wrapper">
              <Lock size={18} className="field-icon" />
              <input
                type="password"
                className="form-input"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.85rem' }}
          >
            {loading ? 'Creating Account...' : (
              <>
                <UserPlus size={18} /> Register Account
              </>
            )}
          </button>
        </form>

        <div style={{
          marginTop: '1.5rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--bg-card-border)',
          textAlign: 'center',
          fontSize: '0.875rem',
          color: 'var(--text-muted)'
        }}>
          Already registered?{' '}
          <button
            type="button"
            onClick={switchToLogin}
            style={{
              background: 'none',
              color: 'var(--accent-gold)',
              fontWeight: 700,
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
          >
            Sign In Here
          </button>
        </div>
      </div>
    </div>
  );
}
