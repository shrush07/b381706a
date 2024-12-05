import React from 'react';

const ActivityFeed = ({ calls, archiveCall, archiveAll }) => {
  return (
    <div className="activity-feed">
      <button onClick={archiveAll}>Archive All</button>
      {calls.map((call) => (
        <div key={call.id} className="call">
          <p>To:{call.from} → From:{call.to}</p>
          <p>Type: {call.call_type}</p>
          <p>Duration: {call.duration}s</p>
          <button onClick={() => archiveCall(call.id)}>Archive</button>
        </div>
      ))}
    </div>
  );
};

export default ActivityFeed;
