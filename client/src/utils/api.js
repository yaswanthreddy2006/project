const API_BASE_URL = '/api/auth';

const getAuthHeaders = () => {
  const token = localStorage.getItem('klu_jwt_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const registerUser = async (data) => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message || 'Registration failed');
  }
  return resData;
};

export const loginUser = async (data) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message || 'Login failed');
  }
  return resData;
};

export const fetchUserProfile = async () => {
  const response = await fetch(`${API_BASE_URL}/me`, {
    headers: getAuthHeaders()
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message || 'Session expired. Please login again.');
  }
  return resData.user;
};

export const submitQuizResult = async (quizData) => {
  const response = await fetch(`${API_BASE_URL}/quiz`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(quizData)
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message || 'Failed to submit quiz');
  }
  return resData;
};

export const submitBooking = async (bookingData) => {
  const response = await fetch(`${API_BASE_URL}/booking`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(bookingData)
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message || 'Failed to submit booking');
  }
  return resData;
};
