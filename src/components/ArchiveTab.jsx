import React from 'react';
import { RiInboxUnarchiveFill } from "react-icons/ri";

const ArchivedTab = ({ calls, archiveCall, unarchiveAll }) => {
  return (
    <div className="archived-tab">
      <button onClick={unarchiveAll}><RiInboxUnarchiveFill /> Unarchive All</button>
      {calls.map((call) => (
        <div
          key={call.id}
          className="call"
          style={{ backgroundColor: call.bgColor }} // Apply background color here
        >
          <p>{call.from} → {call.to}</p>
          <p>Type: {call.call_type}</p>
          <p>Duration: {call.duration}s</p>
          <button onClick={() => archiveCall(call.id)}>
            <RiInboxUnarchiveFill />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ArchivedTab;
