import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';

const ContractsPage = () => {
  const [contracts, setContracts] = useState([]);
  const [selectedContract, setSelectedContract] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch contracts from the API
  const handleFindContract = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("ACCESS_TOKEN");
      if (!token) {
        console.log("No token found");
      }
  
      const res = await fetch("https://stock-managment-2.onrender.com/contracts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await res.json();
  
      if (res.status === 200) {
        setContracts(data.contracts);
        console.log(data.contracts);
      }
    } catch (error) {
      console.log("Fetching contracts failed:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFindContract();
  }, []);

  const openModal = (contract) => {
    setSelectedContract(contract);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedContract(null);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-[20px] font-bold mb-4">Contracts</h2>
      <div className="bg-white shadow-md rounded-md p-4">
        {loading ? (
          <p>Loading contracts...</p>
        ) : contracts.length > 0 ? (
          <ul>
            {contracts.map((contract) => (
              <li key={contract.id} className="border-b py-2 bg-gray-100 p-2 flex justify-between">
                <span>{contract.operatorName}</span>
                <button
                  className="bg-gray-500 text-white font-semibold text-[14px] px-3 py-1 rounded-md hover:bg-blue-600"
                  onClick={() => openModal(contract)}
                >
                  View Details
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No contracts available.</p>
        )}
      </div>

      {modalOpen && selectedContract && (
        <Modal isOpen={modalOpen} onClose={closeModal}>
          <div className="p-4 bg-white rounded-md">
            <h3 className="text-lg font-bold mb-2">{selectedContract.title}</h3>
            <p><strong>Name:</strong> {selectedContract.operatorName}</p>
            <p><strong>Email:</strong> {selectedContract.email}</p>
            <p><strong>Phone:</strong> {selectedContract.phone}</p>
            <p><strong>District:</strong> {selectedContract.district}</p>
            <p><strong>Start Date:</strong> {selectedContract.startingDate}</p>
            <p><strong>End Date:</strong> {selectedContract.endingDate}</p>
            <button
              className="mt-4 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ContractsPage;
