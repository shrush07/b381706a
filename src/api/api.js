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

  if (!response.ok) {
    throw new Error(`Failed to update call. Status: ${response.status}`);
  }

  const text = await response.text(); // Get the raw response text
  console.log('Raw response:', text); // Log the raw response for debugging

  try {
    const data = JSON.parse(text); // Try parsing the response as JSON
    return data;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    console.log('Response text:', text); // Log the response for debugging
    throw new Error('Failed to parse response as JSON');
  }
};

// Reset all activities (calls) to initial state
export const resetActivities = async () => {
  const response = await fetch(`${BASE_URL}/reset`, { method: 'PATCH' });
  if (!response.ok) throw new Error('Failed to reset activities');
};
