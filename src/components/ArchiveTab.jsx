import React from 'react';
import { RiInboxUnarchiveFill } from "react-icons/ri";

const ArchivedTab = ({ calls, archiveCall, unarchiveAll }) => {
  return (
    <div className="archived-tab">
      <button onClick={unarchiveAll} className="unarchive-all">
        <RiInboxUnarchiveFill /> Unarchive All
      </button>
      {calls.map((call) => {
        // Format the date
        const formattedDate = new Date(call.created_at).toISOString().split('T')[0]; // yyyy-mm-dd
        // Format the duration
        const formattedDuration = new Date(call.duration * 1000).toISOString().substr(11, 5); // hh:mm
        // Format the time
        const formattedTime = new Date(call.created_at).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });

        return (
          <div key={call.id} className="call">
            <div className="call-info">
              {/* Left Side: Date, Duration, Time */}
              <div className="call-left">
                <p className="call-date">{formattedDate}</p>
                <p className="call-duration-time">
                  {formattedDuration} | {formattedTime}
                </p>
              </div>

              {/* Right Side: Unarchive Button */}
              <div className="call-right">
                <button
                  className="unarchive-btn"
                  onClick={() => archiveCall(call.id)}
                >
                  <RiInboxUnarchiveFill />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ArchivedTab;
