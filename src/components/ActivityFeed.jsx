import React from 'react';
import { RiInboxArchiveFill } from "react-icons/ri";

const ActivityFeed = ({ calls, archiveCall, archiveAll }) => {
  return ( 
    <div className="activity-feed">
      <button onClick={archiveAll}><RiInboxArchiveFill /> Archive All</button>
      {calls.map((call) => (
        <div key={call.id} className="call">
          <div className="call-info">
            <p className="call-from"> {call.from}</p>
            <p className="call-to">{call.to || "Unknown"}</p>
            <p className="call-type">{call.call_type}</p>
            <p className="call-duration">{call.duration}s</p>
            <p className="call-time">
              {new Date(call.created_at).toLocaleString()}
            </p>
          </div>
          <button onClick={() => archiveCall(call.id)}><RiInboxArchiveFill />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ActivityFeed;
