const BASE_URL = 'https://aircall-api.onrender.com';

// Fetch activities (calls)
export const fetchActivities = async () => {
  const response = await fetch(`${BASE_URL}/activities`);
  if (!response.ok) throw new Error('Failed to fetch activities');
  return response.json();
};

// Archive or unarchive a specific call
export const archiveCall = async (id, isArchived) => {
  const response = await fetch(`${BASE_URL}/activities/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ is_archived: isArchived }),
  });

  const contentType = response.headers.get('Content-Type');
  const responseData = contentType?.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    console.error('API Error:', responseData);
    throw new Error('Failed to archive/unarchive call');
  }
  return responseData;
};

// Reset all activities (calls) to the initial state
export const resetActivities = async () => {
  const response = await fetch(`${BASE_URL}/reset`, { method: 'PATCH' });
  if (!response.ok) throw new Error('Failed to reset activities');
};


// Fetch a single activity by ID
export const fetchActivityDetails = async (id) => {
  const response = await fetch(`${BASE_URL}/activities/${id}`);
  return handleResponse(response);
};
