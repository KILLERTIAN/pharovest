// components/Modal.js
import React from 'react';
import { Transition } from '@headlessui/react';

const Modal = ({ open, onClose, children }) => {
    return (
        <Transition show={open} as="div" className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 py-6">
                <Transition.Child
                    as="div"
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    className="fixed inset-0 bg-black bg-opacity-50"
                />
                <Transition.Child
                    as="div"
                    enter="ease-out duration-300"
                    enterFrom="transform scale-75"
                    enterTo="transform scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="transform scale-100"
                    leaveTo="transform scale-75"
                    className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-auto"
                >
                    {children}
                </Transition.Child>
            </div>
        </Transition>
    );
};

export default Modal;
