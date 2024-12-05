import React from 'react';

const ArchivedTab = ({ calls, archiveCall, unarchiveAll }) => {
  return (
    <div className="archived-tab">
      <button onClick={unarchiveAll}>Unarchive All</button>
      {calls.map((call) => (
        <div key={call.id} className="call">
          <p>{call.from} → {call.to}</p>
          <p>Type: {call.call_type}</p>
          <p>Duration: {call.duration}s</p>
          <button onClick={() => archiveCall(call.id)}>Unarchive</button>
        </div>
      ))}
    </div>
  );
};

export default ArchivedTab;
