import { useState } from 'react';
import type { ContentBlock } from '../Interfaces/Interfaces';
import ImageModal from './ImageModal.tsx';

interface RenderContentProps {
    blocks: ContentBlock[];
}

export default function RenderContent({ blocks }: RenderContentProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const renderBlock = (block: ContentBlock) => {
        switch (block.type) {
            case 'heading':
                return (
                    <h2 className="text-2xl font-bold text-white mb-4 mt-6 first:mt-0">
                        {block.content}
                    </h2>
                );
            case 'text':
                return (
                    <p className="text-gray-300 leading-relaxed mb-4 whitespace-pre-wrap">
                        {block.content}
                    </p>
                );
            case 'image':
                return (
                    <div className="my-6">
                        <img
                            src={block.content}
                            alt="content"
                            className="rounded-xl max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => setSelectedImage(block.content)}
                        />
                    </div>
                );
            case 'quote':
                return (
                    <blockquote className="border-l-4 border-yellow-500 pl-4 my-4 italic text-gray-300">
                        {block.content}
                    </blockquote>
                );
            case 'code':
                return (
                    <pre className="bg-stone-900/50 border border-white/10 rounded-lg p-4 my-4 overflow-x-auto">
                        <code className="text-gray-100 text-sm font-mono">
                            {block.content}
                        </code>
                    </pre>
                );
            case 'list':
                return (
                    <ul className="list-disc list-inside space-y-2 my-4 text-gray-300">
                        {block.content.split('\n').map((item, idx) => (
                            item.trim() && <li key={idx}>{item.trim()}</li>
                        ))}
                    </ul>
                );
            default:
                return null;
        }
    };

    return (
        <>
            {blocks.sort((a, b) => a.order - b.order).map(block => (
                <div key={block.id}>
                    {renderBlock(block)}
                </div>
            ))}

            {selectedImage && (
                <ImageModal
                    image={selectedImage}
                    title="Изображение"
                    onClose={() => setSelectedImage(null)}
                />
            )}
        </>
    );
}