import React, { useState, useEffect } from "react";
import icon1 from "../assets/edit.png";
import i1 from "../assets/i1.png";
import Modal from "../components/Modal";

function Messaging() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [bossMessages, setBossMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modelOpen, setModelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("regular");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://your-api.com/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("ACCESS_TOKEN")}`,
          },
        });
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        setUsers(data.users);
      } catch (err) {
        setError("Failed to fetch users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const fetchBossMessages = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://your-api.com/boss-messages", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("ACCESS_TOKEN")}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch boss messages');
        const data = await response.json();
        setBossMessages(data.messages);
      } catch (err) {
        setError("Failed to fetch boss messages.");
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === "regular") {
      fetchUsers();
    } else {
      fetchBossMessages();
    }
  }, [activeTab]);

  const handleSendMessage = () => {
    if (!selectedUser || !message) return;
    setMessages([...messages, { user: selectedUser, text: message }]);
    setMessage("");
  };

  return (
    <div>
      {activeTab === "regular" && (
        <div className="p-5 sm:w-[970px] w-full flex justify-end">
          <div className="flex justify-evenly">
            <div onClick={() => setModelOpen(true)} className="ml-2 cursor-pointer flex">
              <p className="text-[12px] text-gray-700 mr-2 mt-1 font-semibold">New Message</p>
              <img src={icon1} className="w-7 h-7" alt="New Message" />
            </div>
          </div>
        </div>
      )}

      <div className="flex mb-5">
        <button
          onClick={() => setActiveTab("regular")}
          className={`px-4 py-2 rounded-l-md ${
            activeTab === "regular" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Send Messages
        </button>
        <button
          onClick={() => setActiveTab("boss")}
          className={`px-4 py-2 rounded-r-md ${
            activeTab === "boss" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Boss Messages
        </button>
      </div>

      {activeTab === "regular" ? (
        <div className="p-5 w-full shadow-md rounded-md">
          <div className="flex items-center gap-4 mb-4">
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="border p-2 rounded-md w-full"
            >
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user.id} value={user.name}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div className="border p-4 h-[300px] overflow-auto rounded-md bg-gray-50">
            {messages.map((msg, index) => (
              <div key={index} className="mb-2">
                <p className="text-blue-500 font-semibold">{msg.user}:</p>
                <p className="text-gray-700">{msg.text}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-4">
            <input
              type="text"
              className="border p-2 rounded-md flex-grow"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <div className="p-5 w-full shadow-md rounded-md">
          <div className="border p-4 h-[300px] overflow-auto rounded-md bg-gray-50">
            {loading ? (
              <p>Loading messages...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              bossMessages.map((msg, index) => (
                <div key={index} className="mb-2">
                  <p className="text-blue-500 font-semibold">Boss:</p>
                  <p className="text-gray-700">{msg.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <Modal isOpen={modelOpen} onClose={() => setModelOpen(false)}>
        <div className="p-4">Compose your message...</div>
      </Modal>
    </div>
  );
}

export default Messaging;