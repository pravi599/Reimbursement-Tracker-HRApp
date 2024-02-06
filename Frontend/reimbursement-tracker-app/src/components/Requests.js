import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UpdateTracking from './UpdateTracking';
import AddPayments from './AddPayments';
import './Requests.css';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [viewTrackingDetails, setViewTrackingDetails] = useState(null);
  const [updateTrackingDetails, setUpdateTrackingDetails] = useState(null);
  const [documentModal, setDocumentModal] = useState({ isOpen: false, documentUrl: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedPaymentRequest, setSelectedPaymentRequest] = useState(null);
  const [isUpdateTrackingClicked, setIsUpdateTrackingClicked] = useState(false);
  const [isMakePaymentVisible, setIsMakePaymentVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://localhost:7007/api/Request');
        setRequests(response.data);
        setFilteredRequests(response.data);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchData();
  }, []);

  const handleViewTrackingClick = async (requestId) => {
    try {
      const response = await axios.get(`https://localhost:7007/api/Tracking/request/${requestId}`);
      setViewTrackingDetails(response.data);
      setSelectedRequest(requestId);
    } catch (error) {
      console.error('Error fetching tracking details:', error);
    }
  };

  const handleUpdateTrackingClick = async (requestId) => {
    try {
      const response = await axios.get(`https://localhost:7007/api/Tracking/request/${requestId}`);
      setUpdateTrackingDetails(response.data);
      setIsUpdateTrackingClicked(true);
    } catch (error) {
      console.error('Error fetching tracking details:', error);
    }
  };

  const handleCloseViewTrackingModal = () => {
    setViewTrackingDetails(null);
    setIsUpdateTrackingClicked(false); // Reset the flag when closing view tracking
  };

  const handleCloseUpdateTrackingModal = () => {
    setUpdateTrackingDetails(null);
    setIsMakePaymentVisible(true); // Set the flag to show Make Payment button
  };

  const handleViewDocument = (documentUrl) => {
    setDocumentModal({ isOpen: true, documentUrl });
  };

  const handleCloseDocumentModal = () => {
    setDocumentModal({ isOpen: false, documentUrl: '' });
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const handleSearchButtonClick = () => {
    const query = searchQuery.trim().toLowerCase();

    const filteredRequests = requests.filter((request) =>
      request.expenseCategory.toLowerCase().includes(query) ||
      request.username.toLowerCase().includes(query)
    );

    setFilteredRequests(filteredRequests);
  };

  const handleMakePaymentClick = (request) => {
    setSelectedPaymentRequest(request);
    setIsMakePaymentVisible(false); // Reset the flag when opening make payment
  };

  const resetSelectedPaymentRequest = () => {
    setSelectedPaymentRequest(null);
  };

  return (
    <div>
      <h2>Requests</h2>
      <div className='container'>
        <input
          className="search-bar"
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button className="search-button" onClick={handleSearchButtonClick}>
          Search
        </button>
      </div>
      <div className="request-container">
        {filteredRequests.map((request) => (
          <div key={request.requestId} className="request-box">
            <h3>Request ID: {request.requestId}</h3>
            <p>Username: {request.username}</p>
            <p>Expense Category: {request.expenseCategory}</p>
            <p>Amount: {request.amount}</p>
            <p>
              Document:
              <button onClick={() => handleViewDocument(request.document)} className="Button">View Document</button>
            </p>
            <p>Description: {request.description}</p>
            <p>Request Date: {new Date(request.requestDate).toLocaleString()}</p>
            <div className="actions">
              <button
                onClick={() => handleViewTrackingClick(request.requestId)}
                className="btn btn-primary btnreq"
              >
                View Tracking
              </button>

              {selectedRequest === request.requestId && (
                <button
                  onClick={() => handleUpdateTrackingClick(request.requestId)}
                  className="btn btn-warning btnreq"
                >
                  Update Tracking
                </button>
              )}

              {isMakePaymentVisible && selectedRequest === request.requestId && (
                <button
                  onClick={() => handleMakePaymentClick(request)}
                  className="btn btn-success btnreq"
                >
                  Make Payment
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
 
      {selectedRequest && viewTrackingDetails && (
        <div className="modal">
          <div className="modal-content">
            <div>
              <h2>View Tracking</h2>
              <label>
                Request ID:
                <input type="text" name="requestId" value={viewTrackingDetails.requestId} readOnly />
              </label>
              <label>
                Tracking ID:
                <input type="text" name="trackingId" value={viewTrackingDetails.trackingId} readOnly />
              </label>
              <label>
                Tracking Status:
                <input type="text" name="trackingStatus" value={viewTrackingDetails.trackingStatus} readOnly />
              </label>
              <label>
                Approval Date:
                <input name="approvalDate" value={viewTrackingDetails.approvalDate || ''} readOnly />
              </label>
              <label>
                Reimbursement Date:
                <input name="reimbursementDate" value={viewTrackingDetails.reimbursementDate || ''} readOnly />
              </label>
              <div>
                <button onClick={handleCloseViewTrackingModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
 
 {selectedRequest && updateTrackingDetails && (
        <div className="modal">
          <div className="modal-content">
            <UpdateTracking
              requestId={selectedRequest.requestId}
              trackingDetails={updateTrackingDetails}
              onUpdateTracking={() => {
                handleCloseUpdateTrackingModal();
              }}
              onClose={handleCloseUpdateTrackingModal}
              username={selectedRequest.username}
            />
          </div>
        </div>
      )}

      {documentModal.isOpen && (
        <div className="document-modal">
          <div className="document-content">
            <button className="close-btn" onClick={handleCloseDocumentModal}>
              <span>&times;</span>
            </button>
            <iframe src={documentModal.documentUrl} title="Document Viewer" width="100%" height="100%" />
          </div>
        </div>
      )}

      {selectedPaymentRequest && (
        <div className="modal">
          <div className="modal-content">
            <AddPayments
              request={selectedPaymentRequest}
              amount={selectedPaymentRequest.amount}
              requestId={selectedPaymentRequest.requestId}
              username={selectedPaymentRequest.username}
              onClose={resetSelectedPaymentRequest}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Requests;
