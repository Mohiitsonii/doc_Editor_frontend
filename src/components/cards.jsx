import React from "react";
import Card from "./Card";
import Loader from "./Loader";

const CardGrid = ({ data = [], deleteEvent, loading }) => {
    console.log(data); 

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {!loading ? (
                Array.isArray(data.data) ? (
                    data.data.map((cardData, index) => (
                        <div
                            key={index}
                            className="w-full p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition"
                        >
                            <Card cardData={cardData} deleteEvent={deleteEvent} />
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center text-gray-500">
                        No documents found.
                    </div>
                )
            ) : (
                <div className="col-span-full text-center">
                    <div className="spinner-border text-blue-500" role="status">
<Loader/>                    </div>
                </div>
            )}
        </div>
    );
};

export default CardGrid;
