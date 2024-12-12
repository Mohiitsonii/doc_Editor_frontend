import React from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import { useSupplier } from '../context/supplierContext';

const Card = ({ cardData, deleteEvent }) => {
  const navigate = useNavigate();
  const { setCurrentDoc } = useSupplier();
  const getContentPreview = (content) => {
    if (!content) {
      return 'No content available';
    }
    const plainText = typeof content === 'string' ? content : content?.text || ''; // Adjust logic for nested objects
    return plainText.length > 50 ? `${plainText.slice(0, 50)}...` : plainText;
  };
  

  return (
    <>
      {cardData?.title && (
        <div className="col-12">
          <div className="card bg-light text-dark shadow-sm h-100">
            <div className="card-body d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title text-primary mb-0">{cardData?.title || 'Untitled'}</h5>
                <small className="text-muted">
                  {new Date(cardData?.createdAt).toLocaleDateString()}
                </small>
              </div>
              <p className="text-muted mb-2">Owner: {cardData?.owner?.username}</p>
              <p className="card-text mb-4">{getContentPreview(cardData?.content)}</p>

              <div className="d-flex justify-content-between mt-auto">
                <button
                  className="btn btn-outline-danger"
                  data-bs-toggle="modal"
                  data-bs-target={`#deleteDoc${cardData?._id}`}
                >
                  <i className="bi bi-trash3-fill me-2"></i>Delete
                </button>
                <button
                  onClick={() => {
                    setCurrentDoc(cardData);
                    navigate(`/edit/${cardData._id}`); 
                  }}
                  className="btn btn-outline-success"
                >
                  <i className="bi bi-pencil-square me-2"></i>Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal
        title="Delete Document"
        modalId={`deleteDoc${cardData?._id}`}
        content={
          <>
            <p className="lead text-danger">
              Are you sure you want to delete the document <strong>{cardData?.title}</strong>?
            </p>
            <div className="d-flex justify-content-end mt-4">
              <button
                type="button"
                className="btn btn-secondary me-2"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => deleteEvent(cardData._id)}
                data-bs-dismiss="modal"
                className="btn btn-danger"
              >
                Delete
              </button>
            </div>
          </>
        }
      />
    </>
  );
};

export default Card;
