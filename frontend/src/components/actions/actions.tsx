import React, { FC } from 'react';

export const Actions: FC = ({ children }) => {
  return (
    <div className={`Actions`}>
      {children}
    </div>
  );
};