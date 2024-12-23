import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';

const Loading = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        backgroundColor: '#f4f4f4',
      }}
    >
      <ProgressSpinner
        style={{ width: '50px', height: '50px' }}
        strokeWidth="8"
        animationDuration=".5s"
        aria-label="Loading"
      />
      <h3 style={{ marginTop: '20px', color: '#0a74da' }}>กำลังโหลดข้อมูล...</h3>
    </div>
  );
};

export default Loading;
