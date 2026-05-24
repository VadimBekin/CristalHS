import {useEffect} from "react";

export default function ImageModal({ image, title, onClose }: { image: string; title: string; onClose: () => void }) {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={onClose}
        >
            <div className="relative max-w-4xl max-h-[90vh] p-4">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-contain rounded-xl"
                />
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors cursor-pointer"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}