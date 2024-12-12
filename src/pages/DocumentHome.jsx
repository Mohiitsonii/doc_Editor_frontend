import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import CardGrid from "../components/cards";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import { createNewDoc, deleteTheDoc, getAllLoggedInUserDocs } from "../helpers/docs/doc.helper";
import { toast } from "react-toastify";
import { useSupplier } from "../context/supplierContext";
import { useNavigate } from "react-router-dom";

const DocumentHome = () => {
  const { auth } = useAuth();
  const [data, setData] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { loading, setLoading, shouldUpdate, triggerUpdate, socket } = useSupplier();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth) {
      toast.error("Please Login to continue");
      navigate("/");
    }
  }, [auth]);


  useEffect(() => {
    const setDocuments = async () => {
      try {
        const documents = await getAllLoggedInUserDocs(auth?.token);
    
        if (documents?.status === 200) {
          console.log("Fetched Documents:", documents?.data.data);
          setData(documents?.data);
    
          // Add a check to ensure socket is ready before joining
          if (socket && socket.connected) {
            documents?.data.data.forEach((doc) => {
              console.log(`Attempting to join room: ${doc._id}`);
              socket.emit("joinRoom", {  
                roomId: doc._id,
                username: auth?.user?.username || "Anonymous"  
              });
            });
          } else {
            console.warn('Socket not ready or not connected');
            
            if (socket) {
              socket.on('connect', () => {
                console.log('Socket reconnected, joining rooms');
                documents?.data.data.forEach((doc) => {
                  socket.emit("joinRoom", {  
                    roomId: doc._id,
                    username: auth?.user?.username || "Anonymous"  
                  });
                });
              });
            }
          }
    
          return;
        }
    
        toast.error(documents?.message);
      } catch (error) {
        console.error("Error fetching documents:", error);
        toast.error("Failed to fetch documents.");
      }
    };
    
    if (auth?.token) {
      setDocuments();
      document.title = `Welcome ${auth?.user?.username} 👋`;
    }
  }, [auth?.token, shouldUpdate, socket, auth?.user?.username]);


  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await createNewDoc(title, content, auth?.token);

      if (result?.status === 201) {
        toast.success("Document Created Successfully");
        setTitle("");
        setContent("");

        const closeModalButton = document.getElementById("closeTheModal");
        if (closeModalButton) closeModalButton.click();

        const documents = await getAllLoggedInUserDocs(auth?.token);
        if (documents?.status === 200) {
          setData(documents?.data);

          // Trigger socket join for the new document
          if (socket) {
            socket.emit("joinRoom", { roomId: result.data._id });
          }
        }

        return;
      }

      toast.error(result?.message);
    } catch (error) {
      console.error("Error creating document:", error);
      toast.error("An error occurred while creating the document.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const res = await deleteTheDoc(id, auth?.token);
      if (res?.status === 200) {
        toast.success(res.message);
        triggerUpdate();
        return;
      }

      toast.error(res?.message);
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("An error occurred while deleting the document.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <button
            type="button"
            className="btn btn-light"
            onClick={() => navigate('/home')}
            style={{ border: '1px solid #ccc' }}
          >
            <i className="bi bi-arrow-left"></i> Back
          </button>
          <button
            type="button"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-xl hover:bg-blue-700 text-lg font-semibold flex items-center transition duration-300"
            data-bs-toggle="modal"
            data-bs-target="#createDoc"
          >
            <i className="bi bi-plus-circle-fill mr-2"></i>Create New Document
          </button>
        </div>

        <CardGrid data={data} deleteEvent={handleDelete} loading={loading} />

        <Modal
          modalId="createDoc"
          content={
            <form
              className="space-y-8 bg-gradient-to-br from-blue-500 to-blue-700 p-8 rounded-3xl shadow-2xl max-w-lg mx-auto transition-all duration-500 ease-in-out"
              onSubmit={handleAdd}
            >
              <h2 className="text-3xl font-bold text-center mb-4 text-white">Create New Document</h2>
              <p className="text-center text-blue-200 mb-6 text-lg">
                Add a title and content to create your document.
              </p>
              <div className="w-full">
                <label
                  htmlFor="title"
                  className="block text-lg font-semibold mb-2 tracking-wide text-white"
                >
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-4 border border-blue-300 bg-white text-gray-900 rounded-lg focus:ring-4 focus:ring-blue-400 focus:outline-none transition duration-300 placeholder-gray-500"
                  id="title"
                  placeholder="Enter document title"
                  required
                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="content"
                  className="block text-lg font-semibold mb-2 tracking-wide text-white"
                >
                  Content
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-40 p-4 border border-blue-300 bg-white text-gray-900 rounded-lg focus:ring-4 focus:ring-blue-400 focus:outline-none transition duration-300 placeholder-gray-500 resize-none shadow-sm"
                  id="content"
                  placeholder="Enter document content"
                  required
                ></textarea>
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-500 font-bold rounded-lg shadow-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 focus:outline-none transition duration-300 ease-in-out"
                >
                  {loading ? "Creating..." : "Create Document"}
                </button>
              </div>
            </form>
          }
        />
      </div>
    </div>
  );
};

export default DocumentHome;
