import { FC } from 'react';

interface SideBarProps {
  input1: string[];
 
}

const sideBar: FC<SideBarProps> = ({ input1 }) => {
  return (
    <div className="sidebar">
      <ul className="sidebarList">
        {input1.map ((stuff:string)=>(

        <li key={stuff+1} ><a href="#" className="btn btn-block">{stuff}</a></li>

        ))}
       
        
      </ul>
    </div>
  );
};

export default sideBar;
