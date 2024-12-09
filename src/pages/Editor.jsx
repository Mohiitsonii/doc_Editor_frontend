import React, { useCallback, useEffect, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import QuillCursors from 'quill-cursors';
import { useSupplier } from '../context/supplierContext';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { updateDocument } from '../helpers/docs/doc.helper'; 

Quill.register('modules/cursors', QuillCursors); 

const Editor = () => {
  const { darkMode, setQuill, currentDoc } = useSupplier(); 
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
  
        editorInstance.clipboard.dangerouslyPasteHTML(currentDoc.content);
      }
  }, [currentDoc, editorInstance]);
  
  const saveDocument = async () => {
    try {
      if (!id) {
        console.error('Document ID is missing');
        return;
      }

      const result = await updateDocument(
        id,
        { title, content },
        auth?.token
      );

      if (result.status === 200) {
        console.log('Document saved successfully');
      } else {
        console.log('Failed to save document:', result.message);
      }
    } catch (error) {
      console.error('Error while saving document:', error.message);
    }
  };

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
