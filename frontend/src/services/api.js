const API_BASE_URL = 'http://localhost:8000';

export const fetchStudies = async () => {
  const response = await fetch(`${API_BASE_URL}/studies`);
  if (!response.ok) {
    throw new Error('Failed to fetch studies');
  }
  return response.json();
};

export const createStudy = async (studyData) => {
  const response = await fetch(`${API_BASE_URL}/studies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(studyData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create study');
  }
  return response.json();
};

export const completeStudy = async (id) => {
  const response = await fetch(`${API_BASE_URL}/studies/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: 'completado' }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to complete study');
  }
  return response.json();
};
