import React, { useState, useEffect, useRef } from "react";
import "./Main.css";
import { assets } from "../../assets/gemini-clone-assets/assets/assets";
import sendPromptToGemini from "../../config/gemini";
import { useSearchContext } from "../../context/SearchContext";

const Main = () => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hey there! Booting up brilliance  for you",
      isCard: false,
    },
  ]);
  const messagesEndRef = useRef(null);
  const { addRecentSearch } = useSearchContext();
  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatResponse = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br/>")
      .replace(/^\d+\.\s+(.*)$/gm, "<li>$1</li>")
      .replace(/^\*\s+(.*)$/gm, "<li>$1</li>");
  };

  // Modify handleSend function:
  const handleSend = async () => {
    if (!prompt.trim()) return;

    const userMessage = {
      sender: "user",
      text: prompt,
      isCard: false,
    };

    setMessages((prev) => [...prev, userMessage]);
    setPrompt("");
    setIsLoading(true);

    try {
      const response = await sendPromptToGemini(prompt);
      const aiMessage = {
        sender: "ai",
        text: response,
        isCard: false,
      };

      setMessages((prev) => [...prev, aiMessage]);
      addRecentSearch(prompt, response); // Store with response
    } catch (error) {
      // ... error handling
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = async (cardPrompt) => {
    const userMessage = {
      sender: "user",
      text: cardPrompt,
      isCard: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await sendPromptToGemini(cardPrompt);
      const aiMessage = {
        sender: "ai",
        text: response,
        isCard: false,
      };

      setMessages((prev) => [...prev, aiMessage]);
      addRecentSearch(cardPrompt, response); // Store with response
    } catch (error) {
      // ... error handling
    } finally {
      setIsLoading(false);
    }
  };
  const handleRecentSearchClick = (search) => {
    setMessages([
      messages[0], // Keep the initial greeting
      {
        sender: "user",
        text: search.prompt,
        isCard: false,
      },
      {
        sender: "ai",
        text: search.response,
        isCard: false,
      },
    ]);
  };
  // Add this useEffect to Main.jsx
  useEffect(() => {
    const handleRecentSearchClicked = (event) => {
      handleRecentSearchClick(event.detail);
    };

    window.addEventListener("recentSearchClicked", handleRecentSearchClicked);

    return () => {
      window.removeEventListener(
        "recentSearchClicked",
        handleRecentSearchClicked
      );
    };
  }, [messages]); // Ensure we have the latest messages state
  return (
    <div className="Main">
      <div className="nav">
        <img src={assets.gemini_icon} alt="Gemini" className="gemini-icon" />
        <p>Alexa</p>
        <img src={assets.user_icon} alt="User" className="user-icon" />
      </div>

      <div className="main-container">
        {/* Chat messages area */}
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              <div className="message-content">
                <div className="avatar">
                  {message.sender === "ai" ? (
                    <img src={assets.gemini_icon} alt="Gemini" />
                  ) : (
                    <img src={assets.user_icon} alt="User" />
                  )}
                </div>
                <div
                  className="message-text"
                  dangerouslySetInnerHTML={{
                    __html: formatResponse(message.text),
                  }}
                />
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message ai loading">
              <div className="message-content">
                <div className="avatar">
                  <img src={assets.gemini_icon} alt="Gemini" />
                </div>
                <div className="message-text">
                  Generating response<span className="loading-dots">...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Only show cards if first message */}
        {messages.length <= 1 && (
          <div className="cards">
            <div
              className="card"
              onClick={() =>
                handleCardClick("Suggest me a beautiful place to visit")
              }
            >
              <p>Suggest me a beautiful place to visit</p>
              <img src={assets.compass_icon} alt="" />
            </div>
            <div
              className="card"
              onClick={() => handleCardClick("Optimize the code for me")}
            >
              <p>Optimize the code for me</p>
              <img src={assets.code_icon} alt="" />
            </div>
            <div
              className="card"
              onClick={() =>
                handleCardClick("Briefly summarise the Urban Technology")
              }
            >
              <p>Briefly summarise the Urban Technology</p>
              <img src={assets.message_icon} alt="" />
            </div>
            <div
              className="card"
              onClick={() =>
                handleCardClick(
                  "Suggest some brainstorming activities for new ideas"
                )
              }
            >
              <p>Suggest some brainstorming activities for new ideas</p>
              <img src={assets.bulb_icon} alt="" />
            </div>
          </div>
        )}

        <div className="main-bottom">
          <div className="searchbox">
            <input
              type="text"
              placeholder="Write the prompt here"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
            />
            <div>
              <img src={assets.gallery_icon} alt="Attach" />
              <img src={assets.mic_icon} alt="Voice" />
              <img
                src={assets.send_icon}
                alt="Send"
                onClick={handleSend}
                style={{ cursor: "pointer" }}
              />
            </div>
          </div>
          <div className="bottom-info">
            <p>
              Alexa is designed to be helpful, honest, and harmless. It can
              assist with a wide range of tasks, from answering questions to
              generating creative content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
