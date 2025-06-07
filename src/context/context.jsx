import { createContext } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const Onsent = async (prompt) => {
    await runChat(prompt);
  };
  Onsent("What is react");

  const contextvalue = {};
  return (
    <Context.Provider value={contextvalue}>{props.children}</Context.Provider>
  );
};
export default ContextProvider;
