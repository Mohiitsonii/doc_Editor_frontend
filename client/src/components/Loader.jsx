import React from 'react';

const Loader = () => {
    return (
        <div className="spinner-border text-primary my-5" role="status">
            <span className="visually-hidden">Loading...</span>
            <style jsx>{`
                .spinner-border {
                    border-color: #4A90E2; /* A brighter shade of blue */
                    color: #4A90E2; /* Ensure the spinner itself is blue */
                }
            `}</style>
        </div>
    );
}

export default Loader;
