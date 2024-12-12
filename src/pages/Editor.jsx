import React, { useCallback, useEffect, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import QuillCursors from 'quill-cursors';
import { useSupplier } from '../context/supplierContext';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateDocument } from '../helpers/docs/doc.helper'; 

Quill.register('modules/cursors', QuillCursors);

const Editor = () => {
  const { darkMode, setQuill, currentDoc, socket } = useSupplier();
  const { id } = useParams();
  const { auth } = useAuth();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [editorInstance, setEditorInstance] = useState(null);

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;
    wrapper.innerHTML = '';

    const editor = document.createElement('div');
    editor.style.minHeight = '30em';
    editor.style.maxHeight = '80em';
    editor.style.borderRadius = '10px';

    if (darkMode) {
      editor.classList.add('bg-dark', 'text-white');
      editor.style.color = 'white';
    } else {
      editor.classList.add('bg-light', 'text-black');
      editor.style.color = 'black';
    }

    wrapper.append(editor);

    const q = new Quill(editor, {
      theme: 'snow',
      modules: {
        cursors: true,
        toolbar: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline'],
          ['image', 'code-block'],
        ],
      },
      clipboard: true,
    });

    setQuill(q);

    q.on('text-change', () => {
      const newContent = q.root.innerHTML;
      setContent(newContent);
    });

    setEditorInstance(q);
  }, [darkMode, setQuill]);

  useEffect(() => {
    if (currentDoc && editorInstance) {
      setTitle(currentDoc.title || '');
      
      if (currentDoc.content) {
        editorInstance.root.innerHTML = currentDoc.content;
        setContent(currentDoc.content); // Sync content with the editor
      } else {
        console.warn('No content found for the document');
      }
    }
  }, [currentDoc, editorInstance]);
  const saveDocument = async () => {
    try {
      if (!id) {
        console.error('Document ID is missing');
        return;
      }

      const htmlContent = editorInstance.root.innerHTML;
  
      const updatedDocument = { title, content: htmlContent };
  
      const result = await updateDocument(id, updatedDocument, auth?.token);
  
      if (result.status === 200) {
        console.log('Document saved successfully');
  
        console.log('updateddoc',updateDocument)
        socket.emit('save-doc', { docId: id, data: updatedDocument });
  
      } else {
        console.log('Failed to save document:', result.message);
      }
    } catch (error) {
      console.error('Error while saving document:', error.message);
    }
  };
  

  // Listen for 'save-doc-receive' event and update the editor content
  useEffect(() => {
    const handleSaveDocReceive = (data) => {
      console.log('Received document update:', data);

      if (data) {
        // console.log('16789',data,editorInstance)
        
        if (editorInstance) {
          console.log('1fgf',data)

          if (data.data.title) {
            console.log('1',data)
console.log('56789',data.data.title)
            setTitle(data.data.title);
          }
          console.log('6t789',data.data.content)

          setContent('fghjk');
        }
      }
    };

    socket.on('save-doc-receive', handleSaveDocReceive);

    // Cleanup listener on component unmount
    return () => {
      socket.off('save-doc-receive', handleSaveDocReceive);
    };
  }, [editorInstance, socket, id]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveDocument();
    }, 10000);

    return () => clearTimeout(timeoutId);
  }, [content, title]);

  return (
    <div className="editor-page">
      <h1 className="text-center my-4">Document Editor</h1>
      <div className="container">
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Enter document title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)} 
        />
        <div ref={wrapperRef}></div>

        <textarea
          className="form-control mt-3"
          rows="5"
          placeholder="View or update content here..."
          value={content}
          onChange={(e) => {
            const updatedContent = e.target.value;
            setContent(updatedContent);
            if (editorInstance) {
              editorInstance.root.innerHTML = updatedContent;
            }
          }}
        ></textarea>
      </div>
    </div>
  );
};

export default Editor;
