import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSupplier } from '../context/supplierContext.jsx';
import { toast } from 'react-toastify';
import Modal from '../components/Modal.jsx';
import { addCollaboratorToDoc, getAllCollaborators } from '../helpers/docs/doc.helper.js';
import { useAuth } from '../context/AuthContext.jsx';
import Editor from './Editor.jsx';

const EditDocument = () => {
  const [collaboratorEmail, setCollaboratorEmail] = useState('');
  const [collaborators, setCollaborators] = useState([]);
  const [isModified, setIsModified] = useState(false);
  const [title, setTitle] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const { auth } = useAuth();
  const { currentDoc, loading, socket, setCurrentDoc, triggerUpdate, quill, setLoading } = useSupplier();
  const { id } = useParams();

  useEffect(() => {
    if (currentDoc) {
      setTitle(currentDoc.title);
      console.log('fghj',currentDoc)
    }
  }, [currentDoc]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setIsModified(true);
  };

  const handleAddCollaborator = async () => {
    setLoading(true);
    const res = await addCollaboratorToDoc(currentDoc?._id, collaboratorEmail, auth?.token).finally(() =>
      setLoading(false)
    );
    if (res?.status === 200 && res?.data?.success) {
      setCollaboratorEmail('');
      toast.success(res?.data?.message);
      triggerUpdate();
      return;
    }
    toast.error(res?.data?.error || 'Failed to add collaborator');
  };

  useEffect(() => {
    if (quill == null || !currentDoc?._id) return;
  
    // Emit event to fetch the document
    socket.emit('get-doc', { docId: currentDoc?._id });
  
    // Load the initial document content
    socket.once('load-document', (document) => {
      quill.setContents(document);
      quill.enable();
    });
  
  
    const handleSaveDocReceive = (data) => {
      console.log('Received document update:', data);

      if (data && data.docId === id && editorRef.current) {
        if (data.title) {
          console.log('1')
          setTitle(data.title);
        }
        setContent('fdghjkl');
      }
    };

    socket.on('save-doc-receive', handleSaveDocReceive);
  
    // Clean up event listeners on unmount
    return () => {
      socket.off('load-document');
      socket.off('save-doc-receive');
    };
  }, [quill, socket, currentDoc]);
  

  useEffect(() => {
    if (isModalOpen && auth?.token && currentDoc?._id) {
      fetchCollaborators();
    }
  }, [isModalOpen, auth, currentDoc]);

  const fetchCollaborators = async () => {
    setLoading(true);
    try {
      const res = await getAllCollaborators(currentDoc?._id, auth?.token);
      if (res?.status === 200 && res?.data?.success) {
        setCollaborators(res?.data?.data || []);
      } else {
        toast.error(res?.data?.message || 'Failed to fetch collaborators');
      }
    } catch (error) {
      toast.error('Failed to fetch collaborators');
    } finally {
      setLoading(false);
    }
  };

  const saveDocumentImmediately = () => {
    if (isModified) {
      const updatedContent = quill?.getContents();
      const updatedDocument = {
        title,
        content: updatedContent,
      };

      socket.emit('save-doc', { docId: currentDoc?._id, data: updatedContent }, (error) => {
        if (error) {
          console.error(error);
        } else {
          toast.success('Document saved successfully');
          setIsModified(false);
        }
      });

      updateDocument(currentDoc?._id, updatedDocument, auth?.token)
        .then((res) => {
          if (res.status === 200) {
            toast.success('Document updated successfully');
            setIsModified(false);
          } else {
            toast.error('Failed to update document');
          }
        })
        .catch((error) => {
          console.error('Failed to update document', error);
          toast.error('Failed to update document');
        });
    }
  };

  // Log collaborators for debugging
  useEffect(() => {
    console.log('Collaborators:', collaborators);
  }, [collaborators]);

  return (
    <div className="edit-document-container" style={{ height: '100vh', backgroundColor: '#f7f8fa' }}>
      {/* Top Navbar */}
      <div
        className="top-navbar d-flex align-items-center justify-content-between px-4 py-2"
        style={{
          backgroundColor: '#fff',
          borderBottom: '1px solid #ddd',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <button
          type="button"
          className="btn btn-light"
          onClick={() => {
            saveDocumentImmediately();
            navigate('/documents');
          }}
          style={{ border: '1px solid #ccc' }}
        >
          <i className="bi bi-arrow-left"></i> Back
        </button>
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          style={{
            fontSize: '1.5rem',
            fontWeight: '500',
            margin: 0,
            border: 'none',
            borderBottom: '2px solid #ddd',
            width: '50%',
            textAlign: 'center',
            background: 'transparent',
            outline: 'none',
          }}
          placeholder="Untitled Document"
        />
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => fetchCollaborators()}
          data-bs-toggle="modal"
          data-bs-target="#collaborators"
          style={{ fontWeight: '500' }}
        >
          <i className="bi bi-people-fill"></i> Collaborators
        </button>
      </div>

      {/* Main Content */}
      <div className="d-flex" style={{ height: 'calc(100vh - 60px)' }}>
        {/* Sidebar */}
        <div
          className="sidebar px-3 py-4"
          style={{
            width: '300px',
            backgroundColor: '#fff',
            borderRight: '1px solid #ddd',
            overflowY: 'auto',
          }}
        >
          <div className="mb-4">
            <h5 style={{ fontWeight: '500' }}>Collaborators</h5>
            <button
              className="btn btn-primary w-100"
              data-bs-toggle="modal"
              data-bs-target="#addCollaborator"
              style={{ fontWeight: '500' }}
            >
              <i className="bi bi-person-plus"></i> Add Collaborator
            </button>
          </div>
          <div>
            <h6>All Collaborators ({collaborators.length})</h6>
            <ul className="list-group">
              {collaborators.map((user) => (
                <li key={user._id} className="list-group-item">
                  <i className="bi bi-person-circle"></i> {user.username}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Editor */}
        <div
          className="editor-container flex-grow-1 p-4"
          style={{
            backgroundColor: '#fff',
            borderRadius: '8px',
            margin: '20px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Editor />
        </div>
      </div>

      {/* Modals */}
      <Modal
        title="Add Collaborator"
        modalId="addCollaborator"
        content={
          <div>
            <p>Enter the email of the user you want to add as a collaborator</p>
            <div className="input-group">
              <input
                type="email"
                value={collaboratorEmail}
                onChange={(e) => setCollaboratorEmail(e.target.value)}
                className="form-control"
                placeholder="Email"
              />
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
              <button className="btn btn-primary" onClick={handleAddCollaborator}>
                Add
              </button>
            </div>
          </div>
        }
      />

      <Modal
        title="Collaborators"
        modalId="collaborators"
        content={
          <div>
            <h5>Collaborators List</h5>
            <ul className="list-group">
              {collaborators.length > 0 ? (
                collaborators.map((user) => (
                  <li key={user._id} className="list-group-item d-flex align-items-center">
                    <i className="bi bi-person-circle me-2"></i>
                    {user.username}
                  </li>
                ))
              ) : (
                <li className="list-group-item text-muted">No collaborators found</li>
              )}
            </ul>
          </div>
        }
      />
    </div>
  );
};


export default EditDocument;