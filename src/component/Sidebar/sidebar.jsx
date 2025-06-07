import React from "react";
import { useState } from "react";
import "./sidebar.css";
import { assets } from "../../assets/gemini-clone-assets/assets/assets";
import { useSearchContext } from "../../context/SearchContext";

const Sidebar = () => {
  const [Extended, setExtended] = React.useState(false);
  const { recentSearches } = useSearchContext();

  return (
    <div className="sidebar">
      <div className="sidebar-top">
        <img
          onClick={() => setExtended((prev) => !prev)}
          className="menu"
          src={assets.menu_icon}
          alt=""
        />
        <div className="new-chat">
          <img src={assets.plus_icon} alt="" />
          {Extended ? <p>New Chat</p> : null}
        </div>
        {Extended ? (
          <div className="recent">
            <p className="Recent-title">Recent</p>
            {recentSearches.map((search, index) => (
              <div
                className="recent-entry"
                key={index}
                onClick={() => {
                  // Dispatch custom event to Main component
                  window.dispatchEvent(
                    new CustomEvent("recentSearchClicked", { detail: search })
                  );
                }}
              >
                <img src={assets.message_icon} alt="" />
                <p>{search.prompt}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
      <div className="sidebar-bottom">
        <div className="bottom-item recent-entry">
          <img src={assets.question_icon} alt="" />
          {Extended ? <p>Help</p> : null}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.history_icon} alt="" />
          {Extended ? <p>History</p> : null}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.setting_icon} alt="" />
          {Extended ? <p>Setting</p> : null}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
