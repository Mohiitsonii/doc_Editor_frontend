import React from "react";

const Modal = ({ modalId, handleEvent, title, content, isInfo = false, userInitials = "U" }) => {
    return (
        <div
            className="modal fade"
            id={modalId}
            tabIndex={-1}
            aria-labelledby={`${modalId}Label`}
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content rounded-lg shadow-lg overflow-hidden">
                    <div className="modal-header bg-blue-600 p-4 text-white flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-white text-blue-600 rounded-full w-14 h-14 flex items-center justify-center font-bold text-2xl shadow-lg">
                                {userInitials}
                            </div>

                            <h1 className="text-xl font-semibold">{title}</h1>
                        </div>
                        <button
                            type="button"
                            className="text-white hover:text-gray-200 focus:outline-none"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        >
                            <i className="bi bi-x-lg text-2xl"></i>
                        </button>
                    </div>

                    <div className="modal-body p-6 bg-gray-50 text-gray-800">
                        {content}
                    </div>
                    {isInfo && (
                        <div className="flex justify-end bg-gray-100 p-4">
                            <button
                                type="button"
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:ring focus:ring-blue-300 transition duration-200"
                                data-bs-dismiss="modal"
                            >
                                Close
                            </button>
                        </div>
                    )}
                    {!isInfo && (
                        <div className="flex justify-between p-4 bg-gray-100">
                            <button
                                type="button"
                                onClick={handleEvent}
                                className="px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 focus:ring focus:ring-red-300 transition duration-200"
                                data-bs-dismiss="modal"
                            >
                                Confirm
                            </button>
                            <button
                                type="button"
                                className="px-6 py-3 bg-gray-400 text-white rounded-lg shadow-md hover:bg-gray-500 focus:ring focus:ring-gray-300 transition duration-200"
                                data-bs-dismiss="modal"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;
