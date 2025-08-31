"use client"

import axios from "axios";
import { useState, KeyboardEvent } from "react";

interface Message {
  sender: "Me" | "Senorita";
  text: string;
}

export default function Home() {
  const aiGirlfriendImages = [
    "/image/aigf1.jpg",
    "/image/aigf2.jpg",
    "/image/aigf3.jpg"
  ];

  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleInput = async () => {
    if (inputText.trim() === "" || !selectedImage) return;

    setChatHistory((prevHistory) => [...prevHistory, { sender: "Me", text: inputText }]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await axios.post("/api/gf-reply", { prompt: inputText });

      const { reply } = response.data;

      setChatHistory((prevHistory) => [...prevHistory, { sender: "Senorita", text: reply }]);
    } catch (error) {
      console.error("AI conversation failed:", error);
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { sender: "Senorita", text: "I'm sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      handleInput();
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 text-black p-4">
      <h1 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Your AI Girlfriend</h1>

      {!selectedImage && (
        <>
          <h2 className="text-xl font-semibold mb-6 text-center">Choose your AI Girlfriend</h2>
          <div className="flex flex-col md:flex-row md:justify-center items-center space-y-4 md:space-x-4 md:space-y-0 mb-6 max-w-lg mx-auto">
            {aiGirlfriendImages.map((imageUrl, index) => (
              <div
                key={index}
                onClick={() => setSelectedImage(imageUrl)}
                className="cursor-pointer transform hover:scale-105 transition-transform duration-200 rounded-lg shadow-lg overflow-hidden border-2 border-transparent hover:border-blue-500 w-full md:w-1/3"
              >
                <img src={imageUrl} alt={`AI Girlfriend ${index + 1}`} className="w-full h-auto rounded-lg" />
              </div>
            ))}
          </div>
        </>
      
      )}

      {selectedImage && (
        <div className="w-full max-w-5xl flex flex-col md:flex-row md:justify-center md:items-start md:space-x-8">
          <div className="relative w-full md:w-1/2 mb-6 md:mb-0 rounded-lg shadow-xl overflow-hidden">
            <img src={selectedImage} alt="Selected AI Girlfriend" className="w-full h-auto" />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 bg-white text-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-200 transition-colors"
            >
              
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001m-4.992 0h-4.992m4.992 0L19.231 2.484M16.023 9.348L12.42 12.95m4.992 0l4.992 0m-4.992 0L19.231 2.484M16.023 9.348h-4.992m4.992 0h4.992" />
              </svg>
            </button>
          </div>
          <div className="w-full md:w-1/2 flex flex-col">
            <div className="chat-container bg-white rounded-lg shadow-lg p-4 w-full flex-grow overflow-y-auto mb-4" style={{ height: '500px' }}>
              <h1 className="flex items-center justify-center font-bold text-3xl ">Chat with me</h1>
              {chatHistory.map((message, index) => (
                <div
                  key={index}
                  className={`chat-message mb-2 p-2 rounded-lg ${
                    message.sender === "Senorita" ? "bg-blue-100 text-left" : "bg-green-100 text-right ml-auto"
                  }`}
                >
                  <span className="block font-semibold text-black">
                    {message.sender === "Senorita" ? "Senorita" : "Me"}:
                  </span>
                  {message.text}
                </div>
              ))}
              {isLoading && (
                <div className="chat-message mb-2 p-2 rounded-lg bg-blue-100 text-left">
                  <span className="block font-semibold text-black">Senorita:</span>
                  Typing...
                </div>
              )}
            </div>
            <div className="input-container flex items-center w-full">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Start a conversation..."
                className="flex-grow border-2 border-gray-300 rounded-l-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={handleInput}
                className="bg-blue-500 text-white px-6 py-3 rounded-r-lg disabled:bg-gray-400 font-bold hover:bg-blue-600 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
