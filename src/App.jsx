import React from "react";
import Sidebar from "./component/Sidebar/sidebar";
import Main from "./component/Main/Main";
import { SearchProvider } from "./context/SearchContext";

const App = () => {
  return (
    <SearchProvider>
      <Sidebar />
      <Main />
    </SearchProvider>
  );
};

export default App;
