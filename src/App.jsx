import React, { useState, useEffect } from 'react';
import Header from './Header.jsx';
import ActivityFeed from './components/ActivityFeed.jsx';
import ArchiveTab from './components/ArchiveTab.jsx';
import { fetchActivities, archiveCall } from './api/api.js';

const App = () => {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('unarchived');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchActivities();
        setCalls(data);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleArchive = async (id, isArchived) => {
    try {
      await archiveCall(id, isArchived);
      setCalls(prevCalls =>
        prevCalls.map(call =>
          call.id === id ? { ...call, is_archived: isArchived } : call
        )
      );
    } catch (error) {
      console.error('Error archiving/unarchiving call:', error);
    }
  };

  const archiveAll = async () => {
    await toggleArchiveStatus(true);
  };

  const unarchiveAll = async () => {
    await toggleArchiveStatus(false);
  };

  const toggleArchiveStatus = async (isArchived) => {
    try {
      await Promise.all(
        calls
          .filter(call => call.is_archived !== isArchived)
          .map(call => archiveCall(call.id, isArchived))
      );
      setCalls(prevCalls =>
        prevCalls.map(call => ({ ...call, is_archived: isArchived }))
      );
    } catch (error) {
      console.error('Error updating archive status:', error);
    }
  };

  if (loading) return <p>Loading...</p>;

  const activeCalls = calls.filter(call => !call.is_archived);
  const archivedCalls = calls.filter(call => call.is_archived);

  return (
    <div className="container">
      <Header />
      <div className="container-view">
        <h1>Activity Feed</h1>
        <div className="tabs">
          <button
            onClick={() => setActiveTab('unarchived')}
            className={activeTab === 'unarchived' ? 'active' : ''}
          >
            Unarchived Calls
          </button>
          <button
            onClick={() => setActiveTab('archived')}
            className={activeTab === 'archived' ? 'active' : ''}
          >
            Archived Calls
          </button>
        </div>

        {activeTab === 'unarchived' && (
          <ActivityFeed
            calls={activeCalls}
            archiveCall={id => handleArchive(id, true)}
            archiveAll={archiveAll}
          />
        )}
        {activeTab === 'archived' && (
          <ArchiveTab
            calls={archivedCalls}
            archiveCall={id => handleArchive(id, false)}
            unarchiveAll={unarchiveAll}
          />
        )}
      </div>
    </div>
  );
};

export default App;
