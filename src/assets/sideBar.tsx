import React, { FC } from 'react';

interface SideBarProps {
  input1: string;
 
}

const sideBar: FC<SideBarProps> = ({ input1 }) => {
  return (
    <div className="sidebar">
      <ul className="sidebarList">
        <li><a href="#" className="btn btn-block">{input1}</a></li>
        
      </ul>
    </div>
  );
};

export default sideBar;
