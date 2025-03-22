import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "../components/Modal";
import Notification from "../components/Notification";
import iconNewMessage from "../assets/edit.png";
import defaultAvatar from "../assets/i2.png";

function Messaging() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [bossMessages, setBossMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("regular");
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    color: ""
  });

  const chatEndRef = useRef(null);

  // Notification handler
  const triggerNotification = (msg, color) => {
    setNotification({ show: true, message: msg, color });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }));
    }, 5000);
  };

  // Fetch users or boss messages based on active tab
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === "regular") {
          const response = await fetch(
            "https://stock-managment-2.onrender.com/users/user",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("ACCESS_TOKEN")}`
              }
            }
          );
          if (!response.ok) throw new Error(`Error: ${response.status}`);
          const data = await response.json();
          setUsers(data.users);
        } else {
          const response = await fetch("https://your-api.com/boss-messages", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("ACCESS_TOKEN")}`
            }
          });
          if (!response.ok) throw new Error("Failed to fetch boss messages");
          const data = await response.json();
          setBossMessages(data.messages);
        }
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch messages from API
  const fetchMessages = async () => {
    try {
      const res = await fetch(`https://stock-managment-2.onrender.com/messages`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("ACCESS_TOKEN")}`
        }
      });
      if (!res.ok) {
        triggerNotification("Failed to fetch messages", "bg-red-500");
        return;
      }
      const data = await res.json();
      triggerNotification("Messages retrieved successfully", "bg-green-500");
      setMessages(data.messages);
    } catch (error) {
      triggerNotification(`Error: ${error.message}`, "bg-red-500");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!selectedUser || !message.trim()) {
      triggerNotification("Please select a user and enter a message", "bg-red-500");
      return;
    }
    setModalOpen(true);
    try {
      const res = await fetch(`https://stock-managment-2.onrender.com/messages/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("ACCESS_TOKEN")}`
        },
        body: JSON.stringify({
          text: message,
          recipient: selectedUser
        })
      });
      if (res.ok) {
        triggerNotification("Message sent successfully", "bg-green-500");
        fetchMessages();
        setMessage("");
      } else {
        triggerNotification("Failed to send message", "bg-red-500");
      }
    } catch (error) {
      console.error(error);
      triggerNotification(`Error: ${error.message}`, "bg-red-500");
    } finally {
      setModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow p-4 flex items-center justify-between">
        <h1 className="text-[20px] font-bold text-blue-500">Messaging</h1>
      </header>

      {/* Tab Navigation */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setActiveTab("regular")}
          className={`px-6 py-2 rounded-l-md transition-colors duration-200 ${
            activeTab === "regular"
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-600 shadow"
          }`}
        >
          Send Messages
        </button>
        <button
          onClick={() => setActiveTab("boss")}
          className={`px-6 py-2 rounded-r-md transition-colors duration-200 ${
            activeTab === "boss"
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-600 shadow"
          }`}
        >
          Boss Messages
        </button>
      </div>

      {/* Main Content */}
      <main className="flex flex-1 overflow-hidden mt-4 p-5">
        {activeTab === "regular" ? (
          <>
            {/* Sidebar with User List */}
            <aside className="w-1/3 bg-blue-100 rounded-md p-4 border-r overflow-y-auto">
              <h2 className="text-lg font-semibold mb-4">Users</h2>
              {loading ? (
                <p className="text-gray-500">Loading users...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <ul>
                  {users.map((user) => (
                    <li
                      key={user.id}
                      onClick={() => setSelectedUser(user.name)}
                      className={`flex items-center p-2 rounded cursor-pointer hover:bg-blue-50 transition-colors ${
                        selectedUser === user.name ? "bg-blue-300" : ""
                      }`}
                    >
                      <img
                        src={defaultAvatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full mr-2 object-cover"
                      />
                      <span className="text-[16px] font-semibold text-white ">{user.name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </aside>

            {/* Chat Window */}
            <section className="flex-1 flex flex-col bg-gray-50">
              <div className="flex-1 p-4 overflow-y-auto">
                {selectedUser ? (
                  <div className="space-y-4">
                    {messages
                      .filter(
                        (msg) =>
                          msg.recipient === selectedUser ||
                          msg.sender === selectedUser
                      )
                      .map((msg, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`max-w-md p-3 rounded-lg ${
                            msg.sender === selectedUser
                              ? "bg-gray-200 self-start flex justify-between"
                              : "bg-blue-500 self-end text-white flex justify-between"
                          }`}
                        >
                          <p>{msg.text}</p>
                          <p className="text-xs text-gray-600 mt-3">
                            {new Date(msg.date).toLocaleDateString('en-GB', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
}) || ""}
                          </p>
                          

                        </motion.div>
                      ))}
                    <div ref={chatEndRef} />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <p>Select a user to start chatting.</p>
                  </div>
                )}
              </div>
              {/* Input Area */}
              <div className="p-4 border-t bg-white">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                  >
                    Send
                  </button>
                </div>
              </div>
            </section>
          </>
        ) : (
          // Boss Messages Tab
          <div className="w-full p-4">
            <h2 className="text-lg font-semibold mb-4">Boss Messages</h2>
            <div className="border p-4 h-[400px] overflow-y-auto bg-white rounded">
              {loading ? (
                <p>Loading messages...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <ul className="space-y-4">
                  {bossMessages.map((msg, index) => (
                    <li key={index} className="p-3 bg-gray-50 rounded shadow">
                      <p className="text-blue-500 font-semibold">Boss:</p>
                      <p className="text-gray-700">{msg.text}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {msg.time || ""}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modal for Sending Message */}
      <AnimatePresence>
        {modalOpen && (
          <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative p-8 w-[500px] max-w-md"
            >
              <div className="bg-gray-900 rounded-2xl shadow-xl p-6 relative overflow-hidden">
                {/* Animated background elements */}
                <motion.div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-100 rounded-full animate-pulse" />
                <motion.div className="absolute -bottom-20 -right-20 w-40 h-40 bg-green-100 rounded-full animate-pulse" />
                {/* Main content */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="relative w-24 h-24 mb-6">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="50%"
                        cy="50%"
                        r="40"
                        fill="none"
                        strokeWidth="8"
                        strokeLinecap="round"
                        className="stroke-gray-200"
                      />
                      <circle
                        cx="50%"
                        cy="50%"
                        r="40"
                        fill="none"
                        strokeWidth="8"
                        strokeLinecap="round"
                        className="stroke-blue-500 animate-progress"
                        style={{
                          strokeDasharray: 251,
                          strokeDashoffset: 251,
                          animation: "progress 2s ease-out forwards"
                        }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-12 h-12 animate-spin" viewBox="0 0 24 24">
                        <path
                          className="fill-blue-500"
                          d="M12 22C17.5228 22 22 17.5228 22 12H19C19 15.866 15.866 19 12 19V22Z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="space-y-4 text-center">
                    <h3 className="text-2xl font-bold text-white animate-pulse">
                      Sending message
                      <span className="inline-block ml-1 space-x-1">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <span
                            key={i}
                            className="inline-block animate-bounce"
                            style={{ animationDelay: `${i * 0.1}s` }}
                          >
                            .
                          </span>
                        ))}
                      </span>
                    </h3>
                    <p className="text-gray-600 animate-pulse delay-500">
                      Securing your connection...
                    </p>
                  </div>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="mt-6 px-6 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-full transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
              <style jsx>{`
                @keyframes progress {
                  to {
                    stroke-dashoffset: 50;
                  }
                }
                @keyframes spin {
                  to {
                    transform: rotate(360deg);
                  }
                }
                .animate-progress {
                  animation: progress 2s ease-out forwards;
                }
                .animate-spin {
                  animation: spin 1.5s linear infinite;
                }
              `}</style>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Notification */}
      <AnimatePresence>
        {notification.show && (
          <Notification
            message={notification.message}
            color={notification.color}
            duration={5000}
            onClose={() =>
              setNotification((prev) => ({ ...prev, show: false }))
            }
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Messaging;
