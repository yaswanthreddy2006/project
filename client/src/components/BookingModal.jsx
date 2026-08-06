import React, { useState } from 'react';
import { Calendar, Clock, Building2, X } from 'lucide-react';
import { submitBooking } from '../utils/api';

const FACILITIES = [
  'KLU Central Library - Silent Study Room 3',
  'Advanced AI & Robotics Lab - Workstation 12',
  'Campus Indoor Sports Complex - Badminton Court B',
  'Student Innovation Center - Conference Room A'
];

const TIME_SLOTS = [
  '09:00 AM - 11:00 AM',
  '11:30 AM - 01:30 PM',
  '02:00 PM - 04:00 PM',
  '04:30 PM - 06:30 PM'
];

export default function BookingModal({ isOpen, onClose, onBookingComplete, showToast }) {
  const [facilityName, setFacilityName] = useState(FACILITIES[0]);
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await submitBooking({ facilityName, bookingDate, timeSlot });
      showToast('Facility booked successfully and saved to MongoDB!', 'success');
      onBookingComplete(res.bookingHistory);
      onClose();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2rem', borderRadius: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 color="var(--accent-cyan)" size={24} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Book Campus Facility</h3>
          </div>
          <button onClick={onClose} className="btn-secondary" style={{ padding: '0.4rem', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Campus Facility</label>
            <select
              className="form-input"
              value={facilityName}
              onChange={(e) => setFacilityName(e.target.value)}
              style={{ cursor: 'pointer' }}
            >
              {FACILITIES.map((fac, idx) => (
                <option key={idx} value={fac} style={{ background: '#111827', color: '#fff' }}>
                  {fac}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Booking Date</label>
            <div className="input-icon-wrapper">
              <Calendar size={18} className="field-icon" />
              <input
                type="date"
                className="form-input"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Time Slot</label>
            <div className="input-icon-wrapper">
              <Clock size={18} className="field-icon" />
              <select
                className="form-input"
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                style={{ cursor: 'pointer' }}
              >
                {TIME_SLOTS.map((slot, idx) => (
                  <option key={idx} value={slot} style={{ background: '#111827', color: '#fff' }}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Confirming...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
