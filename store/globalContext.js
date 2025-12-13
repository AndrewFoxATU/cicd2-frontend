import { createContext, useState } from "react";

const GlobalContext = createContext();

export function GlobalContextProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  function updateGlobals(action) {
    switch (action.cmd) {
      case "login":
        setCurrentUser(action.user);
        break;

      case "logout":
        setCurrentUser(null);
        break;

      default:
        console.warn("Unknown action:", action);
    }
  }

  return (
    <GlobalContext.Provider
      value={{
        theGlobalObject: { currentUser },
        updateGlobals,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export default GlobalContext;
