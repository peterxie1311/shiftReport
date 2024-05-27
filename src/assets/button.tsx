import React from 'react';
import axios from 'axios';

interface MyButtonProps {
postData : String[]

}

const MyButton: React.FC<MyButtonProps> = ({postData}) => {
  const handleClick = () => {
    console.log('Button clicked!');
    
    axios.post<{ message: string }>('http://localhost:8080/api/data', postData)
      .then(response => {
        console.log('Response:', response.data);
        
      })
      .catch(error => {
        console.error('Error:', error);
      });

    // Call the onClick function if provided
  
  };

  return (
    <button onClick={handleClick}>Click Me</button>
  );

};

export default MyButton;
