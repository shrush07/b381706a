import React, { useState, useEffect } from 'react';
import Header from './Header.jsx';
import ActivityFeed from './components/ActivityFeed.jsx';
import ArchiveTab from './components/ArchiveTab.jsx';
import { fetchActivities, archiveCall, resetActivities } from './api/api.js';

const App = () => {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch activities when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchActivities(); // Call the fetchActivities function
        setCalls(data);  // Set the activities data in the state
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Archive or unarchive a single call
  const handleArchive = async (id, isArchived) => {
    try {
      await archiveCall(id, isArchived);
      setCalls((prevCalls) =>
        prevCalls.map((call) =>
          call.id === id ? { ...call, is_archived: isArchived } : call
        )
      );
    } catch (error) {
      console.error('Error archiving call:', error);
    }
  };

  // Archive all calls
  const archiveAll = async () => {
    try {
      await Promise.all(
        calls.filter((call) => !call.is_archived).map((call) =>
          archiveCall(call.id, true)
        )
      );
      setCalls((prevCalls) =>
        prevCalls.map((call) => ({ ...call, is_archived: true }))
      );
    } catch (error) {
      console.error('Error archiving all calls:', error);
    }
  };

  // Unarchive all calls
  const unarchiveAll = async () => {
    try {
      await Promise.all(
        calls.filter((call) => call.is_archived).map((call) =>
          archiveCall(call.id, false)
        )
      );
      setCalls((prevCalls) =>
        prevCalls.map((call) => ({ ...call, is_archived: false }))
      );
    } catch (error) {
      console.error('Error unarchiving all calls:', error);
    }
  };

  if (loading) return <p>Loading...</p>;

  const activeCalls = calls.filter((call) => !call.is_archived);
  const archivedCalls = calls.filter((call) => call.is_archived);

  return (
    <div className="container">
      <Header />
      <div className="container-view">
        <h1>Activity Feed</h1>
        <ActivityFeed
          calls={activeCalls}
          archiveCall={(id) => handleArchive(id, true)}
          archiveAll={archiveAll}
        />
        <h1>Archived Calls</h1>
        <ArchiveTab
          calls={archivedCalls}
          archiveCall={(id) => handleArchive(id, false)}
          unarchiveAll={unarchiveAll}
        />
      </div>
    </div>
  );
};

export default App;
