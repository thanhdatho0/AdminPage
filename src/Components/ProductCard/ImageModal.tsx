import React from 'react';

const ImageModal: React.FC<{ images: string[]; onClose: () => void }> = ({ images, onClose }) => {
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300">
            <div className="bg-gray-800 p-6 rounded-lg shadow-2xl max-w-lg w-full animate-fade-in">
                <button
                    onClick={onClose}
                    className="text-white mb-4 self-end px-3 py-1 rounded-full bg-red-500 hover:bg-red-600 transition duration-200"
                >
                    Close
                </button>
                <div className="grid grid-cols-2 gap-3">
                    {images.map((img, idx) => (
                        <img
                            key={idx}
                            src={img}
                            alt={`Product image ${idx}`}
                            className="rounded-lg object-cover w-full h-40 transform hover:scale-105 transition duration-200"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ImageModal;