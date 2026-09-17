"use client";

import styles from "./Modal.module.css";

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
}) {
    if (!isOpen) {
        return null;
    }

    return (
        <div
            className={styles.overlay}
            onClick={onClose}
        >
            <div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    className={styles.closeButton}
                    onClick={onClose}
                >
                    ×
                </button>

                {title && <h2>{title}</h2>}

                {children}
            </div>
        </div>
    );
}
