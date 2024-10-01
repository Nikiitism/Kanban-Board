import React, { useState } from 'react';
import './DropdownMenu.css';

const DropdownMenu = ({grouping, ordering, setGrouping, setOrdering}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleGroupingChange = (option) => {
    setGrouping(option);
    setIsOpen(false);
  };
  const handleOrderingChange = (option) => {
    setOrdering(option);
    setIsOpen(false);
  };
  

  return (
    <div style={{width:"100%"}}>
    <div className="dropdown">
      <button className="dropdown-toggle" onClick={toggleMenu}>
        {/* <img src="https://img.icons8.com/material-outlined/24/000000/sorting-answers.png" alt="Sort" /> */}
        <img src="/settings-knobs-svgrepo-com.svg" alt="Settings" height={13} style={{transform : "rotate(90deg)"}}/>
        Display <span>&#9662;</span>
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-group">
            <label>Grouping</label>
            <select value={grouping} onChange={(e) => handleGroupingChange(e.target.value)}>
              <option value="Status">Status</option>
              <option value="User">User</option>
              <option value="Priority">Priority</option>
            </select>
          </div>
          <div className="dropdown-group">
            <label>Ordering</label>
            <select value={ordering} onChange={(e) => handleOrderingChange(e.target.value)}>
              <option value="Priority">Priority</option>
              <option value="Title">Title</option>
            </select>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default DropdownMenu;
