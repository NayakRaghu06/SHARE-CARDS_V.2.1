import React, { createContext, useContext, useState } from 'react';

const InboxContext = createContext({
  unreadInboxCount: 0,
  setUnreadInboxCount: () => {},
});

export const InboxProvider = ({ children }) => {
  const [unreadInboxCount, setUnreadInboxCount] = useState(0);
  return (
    <InboxContext.Provider value={{ unreadInboxCount, setUnreadInboxCount }}>
      {children}
    </InboxContext.Provider>
  );
};

export const useInbox = () => useContext(InboxContext);
