import React, { useState } from 'react';
import { User, Mail, Hash, Award, Calendar, LogOut, Plus, ShieldCheck, History, CheckCircle2 } from 'lucide-react';
import QuizModal from './QuizModal';
import BookingModal from './BookingModal';

export default function Dashboard({ user, setUser, onLogout, showToast }) {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  if (!user) return null;

  const handleQuizComplete = (newScore, newHistory) => {
    setUser({
      ...user,
      quizScore: newScore,
      quizHistory: newHistory
    });
  };

  const handleBookingComplete = (newBookingHistory) => {
    setUser({
      ...user,
      bookingHistory: newBookingHistory
    });
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', minHeight: 'calc(100vh - 80px)' }}>
      {/* Header Banner */}
      <div className="glass-panel animate-fade-in" style={{
        padding: '2rem',
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, rgba(155, 27, 48, 0.4) 0%, rgba(17, 24, 39, 0.9) 100%)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ position: 'relative' }}>
            <img
              src={user.profileImage || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.registrationNumber}`}
              alt="Avatar"
              style={{
                width: '88px',
                height: '88px',
                borderRadius: '50%',
                border: '3px solid var(--accent-gold)',
                background: '#ffffff',
                boxShadow: '0 8px 20px rgba(0,0,0,0.4)'
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: 2,
              right: 2,
              background: '#10b981',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              border: '3px solid #111827'
            }} title="Active Session" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{user.username}</h2>
              <span className="validation-badge badge-success">
                <ShieldCheck size={14} /> Verified Student
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              KL University Campus Student Portal • Registered on {new Date(user.createdAt || Date.now()).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Quick Stats & Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => setIsQuizOpen(true)} className="btn-secondary">
            <Plus size={16} /> Take Quiz
          </button>
          <button onClick={() => setIsBookingOpen(true)} className="btn-primary">
            <Calendar size={16} /> Book Facility
          </button>
          <button onClick={onLogout} className="btn-danger">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Grid Layout: Profile Details & Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Student Profile Card */}
        <div className="glass-panel animate-fade-in" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--bg-card-border)', paddingBottom: '0.75rem' }}>
            <User color="var(--accent-gold)" size={20} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Student Profile</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>USERNAME</span>
              <p style={{ fontSize: '1.05rem', fontWeight: 600, marginTop: '0.1rem' }}>{user.username}</p>
            </div>

            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>REGISTRATION NUMBER</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.1rem' }}>
                <Hash size={16} color="var(--accent-cyan)" />
                <span style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'monospace', color: 'var(--accent-cyan)' }}>
                  {user.registrationNumber}
                </span>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>COLLEGE EMAIL</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.1rem' }}>
                <Mail size={16} color="var(--accent-gold)" />
                <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {user.email}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quiz Score Card */}
        <div className="glass-panel animate-fade-in" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--bg-card-border)', paddingBottom: '0.75rem' }}>
            <Award color="var(--accent-gold)" size={20} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Quiz Performance</h3>
          </div>

          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Quiz Score
            </span>
            <h2 style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--accent-gold)', lineHeight: 1, margin: '0.5rem 0' }}>
              {user.quizScore || 0}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Completed {user.quizHistory ? user.quizHistory.length : 0} quiz attempts
            </p>
          </div>

          <button
            onClick={() => setIsQuizOpen(true)}
            className="btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            <Plus size={16} /> Attempt New Campus Quiz
          </button>
        </div>

      </div>

      {/* History Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        
        {/* Quiz History */}
        <div className="glass-panel animate-fade-in" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--bg-card-border)', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <History color="var(--accent-gold)" size={20} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Quiz History</h3>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {user.quizHistory?.length || 0} records
            </span>
          </div>

          {(!user.quizHistory || user.quizHistory.length === 0) ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '0.95rem' }}>No quiz attempts yet.</p>
              <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Click "Attempt New Campus Quiz" to complete a test.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '280px', overflowY: 'auto' }}>
              {user.quizHistory.map((item, idx) => (
                <div key={idx} style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '0.85rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid var(--bg-card-border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{item.quizTitle}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(item.completedAt).toLocaleString()}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                      {item.score} / {item.totalQuestions} ({item.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Booking History */}
        <div className="glass-panel animate-fade-in" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--bg-card-border)', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Calendar color="var(--accent-cyan)" size={20} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Booking History</h3>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {user.bookingHistory?.length || 0} records
            </span>
          </div>

          {(!user.bookingHistory || user.bookingHistory.length === 0) ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '0.95rem' }}>No facility bookings yet.</p>
              <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Click "Book Facility" to reserve campus study rooms or labs.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '280px', overflowY: 'auto' }}>
              {user.bookingHistory.map((item, idx) => (
                <div key={idx} style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '0.85rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid var(--bg-card-border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{item.facilityName}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Date: {item.bookingDate} | Slot: {item.timeSlot}
                    </span>
                  </div>
                  <span className="validation-badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <CheckCircle2 size={12} /> {item.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Modals */}
      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onQuizComplete={handleQuizComplete}
        showToast={showToast}
      />

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onBookingComplete={handleBookingComplete}
        showToast={showToast}
      />
    </div>
  );
}
