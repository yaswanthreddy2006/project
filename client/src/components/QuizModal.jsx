import React, { useState } from 'react';
import { Award, Check, X, Sparkles } from 'lucide-react';
import { submitQuizResult } from '../utils/api';

const SAMPLE_QUESTIONS = [
  {
    id: 1,
    question: "What is the official domain suffix for KLU Student Emails?",
    options: ["@klu.edu", "@klu.ac.in", "@kluniversity.in", "@klu.com"],
    correct: 1
  },
  {
    id: 2,
    question: "Which digits must all valid KLU Registration Numbers start with?",
    options: ["11", "99", "88", "20"],
    correct: 1
  },
  {
    id: 3,
    question: "What minimum length is required for user passwords in KLU Auth System?",
    options: ["4 characters", "6 characters", "8 characters", "12 characters"],
    correct: 2
  }
];

export default function QuizModal({ isOpen, onClose, onQuizComplete, showToast }) {
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSelectOption = (questionIndex, optionIndex) => {
    setAnswers({ ...answers, [questionIndex]: optionIndex });
  };

  const handleSubmitQuiz = async () => {
    if (Object.keys(answers).length < SAMPLE_QUESTIONS.length) {
      showToast('Please answer all questions before submitting.', 'info');
      return;
    }

    let score = 0;
    SAMPLE_QUESTIONS.forEach((q, idx) => {
      if (answers[idx] === q.correct) score++;
    });

    setSubmitting(true);
    try {
      const res = await submitQuizResult({
        quizTitle: 'KLU Campus Essentials Quiz',
        score,
        totalQuestions: SAMPLE_QUESTIONS.length
      });

      showToast(`Quiz completed! Score: ${score}/${SAMPLE_QUESTIONS.length}`, 'success');
      onQuizComplete(res.quizScore, res.quizHistory);
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
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '560px', padding: '2rem', borderRadius: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award color="var(--accent-gold)" size={24} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Take Campus Quiz</h3>
          </div>
          <button onClick={onClose} className="btn-secondary" style={{ padding: '0.4rem', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Test your knowledge and update your student quiz score in MongoDB Atlas.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '350px', overflowY: 'auto', paddingRight: '0.5rem' }}>
          {SAMPLE_QUESTIONS.map((q, qIdx) => (
            <div key={q.id} style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--bg-card-border)' }}>
              <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                {qIdx + 1}. {q.question}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {q.options.map((opt, optIdx) => {
                  const isSelected = answers[qIdx] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(qIdx, optIdx)}
                      style={{
                        padding: '0.6rem 0.8rem',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        textAlign: 'left',
                        background: isSelected ? 'var(--primary-crimson)' : 'rgba(255, 255, 255, 0.05)',
                        color: isSelected ? '#fff' : 'var(--text-main)',
                        border: `1px solid ${isSelected ? 'var(--accent-gold)' : 'rgba(255, 255, 255, 0.1)'}`,
                        fontWeight: isSelected ? 600 : 400
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={handleSubmitQuiz} disabled={submitting} className="btn-primary">
            {submitting ? 'Saving...' : 'Submit Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
}
