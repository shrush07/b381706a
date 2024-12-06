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




const App = () => {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('unarchived'); 
  const [filter, setFilter] = useState("all");
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

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const filteredCalls =
    filter === "all"
      ? calls
      : calls.filter((call) => call.call_type === filter);

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
            className={filter === "all" ? "active" : ""}
            onClick={() => handleFilterChange("all")}
            data-tooltip="View all calls"
          >
            <MdCall />
          </button>
          <button
            className={filter === "answered" ? "active" : ""}
            onClick={() => handleFilterChange("answered")}
            data-tooltip="View answered calls"
          >
            <MdPhoneInTalk />
          </button>
          <button
            className={filter === "missed" ? "active" : ""}
            onClick={() => handleFilterChange("missed")}
            data-tooltip="View missed calls"
          >
            <MdPhoneMissed />
          </button>
          <button
            className={filter === "voicemail" ? "active" : ""}
            onClick={() => handleFilterChange("voicemail")}
            data-tooltip="View voicemail calls"
          >
            <FaVoicemail />
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
      <Footer />
    </div>
  );
};

export default App;
