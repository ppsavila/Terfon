import React from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <header className="modal-header">
                    <h2>{title}</h2>
                    <button className="close-btn" onClick={onClose}><X size={24} /></button>
                </header>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
}
