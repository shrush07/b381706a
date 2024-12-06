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
          <div className="call-info">
              {/* Left Side: To, From, Type */}
              <div className="call-left">
                <p> {call.to || "Unknown"}</p>
                <p> {call.from || "Unknown"}</p>
                <p><span
                    className={`call-type ${call.call_type === "missed" ? "missed-call" : ""}`}
                  >
                    {call.call_type}
                  </span></p>
              </div>

              {/* Right Side: Date, Duration, Time, Archive/Unarchive */}
              <div className="call-right">
                <div className="call-details">
                  <span className="call-date">{formattedDate}</span>
                  <span className="call-duration-time">
                    {formattedDuration} | {formattedTime}
                  </span>
                </div>
                <button
                  className="unarchive-btn"
                  onClick={() => archiveCall(call.id)}
                >
                  {call.is_archived ? <RiInboxUnarchiveFill /> : <RiInboxArchiveFill />}
                </button>
              </div>
            </div>
        );
      })}
    </div>
  );
};

export default ArchivedTab;
