import React, { useState, useEffect } from 'react';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import ActivityFeed from './components/ActivityFeed.jsx';
import ArchiveTab from './components/ArchiveTab.jsx';
import { fetchActivities, archiveCall } from './api/api.js';
import { RiInboxArchiveFill, RiInboxUnarchiveFill } from "react-icons/ri";
import { MdCall } from "react-icons/md";
import { MdPhoneInTalk } from "react-icons/md";
import { MdPhoneMissed } from "react-icons/md";
import { FaVoicemail } from "react-icons/fa6";
import { RiResetRightFill } from "react-icons/ri";

const App = () => {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('unarchived');
  const [filter, setFilter] = useState('all');

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
      setCalls((prevCalls) =>
        prevCalls.map((call) =>
          call.id === id ? { ...call, is_archived: isArchived } : call
        )
      );
    } catch (error) {
      console.error('Error archiving/unarchiving call:', error);
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const toggleArchiveStatus = async (isArchived) => {
    try {
      const filteredForToggle = calls.filter(
        (call) => (activeTab === 'unarchived' ? !call.is_archived : call.is_archived)
      );
      await Promise.all(
        filteredForToggle.map((call) => archiveCall(call.id, isArchived))
      );
      setCalls((prevCalls) =>
        prevCalls.map((call) =>
          filteredForToggle.some((toggleCall) => toggleCall.id === call.id)
            ? { ...call, is_archived: isArchived }
            : call
        )
      );
    } catch (error) {
      console.error('Error updating archive status:', error);
    }
  };

  const archiveAll = () => toggleArchiveStatus(true);
  const unarchiveAll = () => toggleArchiveStatus(false);

  const resetCalls = () => {
    if (activeTab === 'archived') {
      const callsToReset = calls.filter((call) => call.is_archived);
      const newCallsState = calls.map((call) =>
        callsToReset.some((resetCall) => resetCall.id === call.id)
          ? { ...call, is_archived: false }
          : call
      );
      setCalls(newCallsState);
    } else if (activeTab === 'unarchived') {
      const callsToReset = calls.filter((call) => call.is_archived);
      const newCallsState = calls.map((call) =>
        callsToReset.some((resetCall) => resetCall.id === call.id)
          ? { ...call, is_archived: false }
          : call
      );
      setCalls(newCallsState);
    }
  };

  // Function to determine the background color based on call type
  const getCallBackgroundColor = (callType) => {
    switch (callType) {
      case 'answered':
        return '#D4F7D4'; // Light green
      case 'missed':
        return '#F7D4D4'; // Light red
      case 'voicemail':
        return '#D4E7F7'; // Light blue
      default:
        return '#FFFFFF'; // Default (white) background for other types
    }
  };

  const filteredCalls = calls.filter((call) => {
    const matchesFilter = filter === 'all' || call.call_type === filter;
    const matchesTab = activeTab === 'unarchived' ? !call.is_archived : call.is_archived;
    return matchesFilter && matchesTab;
  });

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container">
      <Header />
      <div className="container-view">
        <div className="tabs">
          <button
            onClick={() => setActiveTab('unarchived')}
            className={activeTab === 'unarchived' ? 'active' : ''}
          >
            <RiInboxUnarchiveFill /> Unarchived Calls
          </button>
          <button
            onClick={() => setActiveTab('archived')}
            className={activeTab === 'archived' ? 'active' : ''}
          >
            <RiInboxArchiveFill /> Archived Calls
          </button>
        </div>

        <div className="filter-buttons">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => handleFilterChange('all')}
            data-tooltip="View all calls"
          >
            <MdCall />
          </button>
          <button
            className={filter === 'answered' ? 'active' : ''}
            onClick={() => handleFilterChange('answered')}
            data-tooltip="View answered calls"
          >
            <MdPhoneInTalk />
          </button>
          <button
            className={filter === 'missed' ? 'active' : ''}
            onClick={() => handleFilterChange('missed')}
            data-tooltip="View missed calls"
          >
            <MdPhoneMissed />
          </button>
          <button
            className={filter === 'voicemail' ? 'active' : ''}
            onClick={() => handleFilterChange('voicemail')}
            data-tooltip="View voicemail calls"
          >
            <FaVoicemail />
          </button>
          <button
            className={filter === 'reset' ? 'active' : ''}
            onClick={resetCalls}
            data-tooltip="Reset calls"
          >
            <RiResetRightFill />
          </button>
        </div>

        {activeTab === 'unarchived' && (
          <ActivityFeed
            calls={filteredCalls.map((call) => ({
              ...call,
              bgColor: getCallBackgroundColor(call.call_type), // Add bgColor property
            }))}
            archiveCall={(id) => handleArchive(id, true)}
            archiveAll={archiveAll}
          />
        )}
        {activeTab === 'archived' && (
          <ArchiveTab
            calls={filteredCalls.map((call) => ({
              ...call,
              bgColor: getCallBackgroundColor(call.call_type), // Add bgColor property
            }))}
            archiveCall={(id) => handleArchive(id, false)}
            unarchiveAll={unarchiveAll}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default App;
