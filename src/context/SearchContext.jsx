import React, { createContext, useState, useEffect, useContext } from "react";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [recentSearches, setRecentSearches] = useState(() => {
    const savedSearches = localStorage.getItem("recentSearches");
    return savedSearches ? JSON.parse(savedSearches) : [];
  });

  useEffect(() => {
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
  }, [recentSearches]);

  const addRecentSearch = (prompt, response) => {
    setRecentSearches((prev) => {
      // Remove duplicates and keep only 5 most recent
      const updated = [
        { prompt, response },
        ...prev.filter((item) => item.prompt !== prompt),
      ].slice(0, 5);
      return updated;
    });
  };

  return (
    <SearchContext.Provider value={{ recentSearches, addRecentSearch }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  return useContext(SearchContext);
};
