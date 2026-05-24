import { useState } from 'react';
import type { ContentBlock } from '../../Interfaces/Interfaces.tsx';

interface ContentEditorProps {
    blocks: ContentBlock[];
    onChange: (blocks: ContentBlock[]) => void;
}

export default function ContentEditor({ blocks, onChange }: ContentEditorProps) {
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const addBlock = (type: ContentBlock['type']) => {
        const newBlock: ContentBlock = {
            id: Date.now().toString(),
            type,
            content: '',
            order: blocks.length
        };
        onChange([...blocks, newBlock]);
    };

    const updateBlock = (id: string, content: string) => {
        const updatedBlocks = blocks.map(block =>
            block.id === id ? { ...block, content } : block
        );
        onChange(updatedBlocks);
    };

    const deleteBlock = (id: string) => {
        const updatedBlocks = blocks.filter(block => block.id !== id);
        onChange(updatedBlocks);
    };

    const moveBlock = (fromIndex: number, toIndex: number) => {
        const updated = [...blocks];
        const [moved] = updated.splice(fromIndex, 1);
        updated.splice(toIndex, 0, moved);
        onChange(updated.map((block, idx) => ({ ...block, order: idx })));
    };

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex !== null && draggedIndex !== index) {
            moveBlock(draggedIndex, index);
            setDraggedIndex(index);
        }
    };

    const renderBlock = (block: ContentBlock) => {
        switch (block.type) {
            case 'heading':
                return (
                    <input
                        type="text"
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, e.target.value)}
                        placeholder="Заголовок..."
                        className="w-full px-3 py-2 bg-stone-700 border border-white/10 rounded-lg text-white text-xl font-bold"
                    />
                );
            case 'text':
                return (
                    <textarea
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, e.target.value)}
                        placeholder="Текст..."
                        rows={4}
                        className="w-full px-3 py-2 bg-stone-700 border border-white/10 rounded-lg text-white"
                    />
                );
            case 'image':
                return (
                    <div>
                        <input
                            type="url"
                            value={block.content}
                            onChange={(e) => updateBlock(block.id, e.target.value)}
                            placeholder="URL изображения..."
                            className="w-full px-3 py-2 bg-stone-700 border border-white/10 rounded-lg text-white mb-2"
                        />
                        {block.content && (
                            <img
                                src={block.content}
                                alt="preview"
                                className="max-h-48 rounded-lg object-contain bg-stone-700"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }}
                            />
                        )}
                    </div>
                );
            case 'quote':
                return (
                    <textarea
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, e.target.value)}
                        placeholder="Цитата..."
                        rows={2}
                        className="w-full px-3 py-2 bg-stone-700 border-l-4 border-yellow-500 italic text-gray-300 rounded-r-lg"
                    />
                );
            case 'code':
                return (
                    <textarea
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, e.target.value)}
                        placeholder="Код..."
                        rows={6}
                        className="w-full px-3 py-2 bg-stone-900/40 border border-white/10 rounded-lg text-gray-100 font-mono text-sm"
                    />
                );
            case 'list':
                return (
                    <textarea
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, e.target.value)}
                        placeholder="Элементы списка (каждый с новой строки)..."
                        rows={4}
                        className="w-full px-3 py-2 bg-stone-700 border border-white/10 rounded-lg text-white"
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-4">
                <button
                    type="button"
                    onClick={() => addBlock('heading')}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm text-white transition-colors"
                >
                    Заголовок
                </button>
                <button
                    type="button"
                    onClick={() => addBlock('text')}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm text-white transition-colors"
                >
                    Текст
                </button>
                <button
                    type="button"
                    onClick={() => addBlock('image')}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm text-white transition-colors"
                >
                    Изображение
                </button>
                <button
                    type="button"
                    onClick={() => addBlock('quote')}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm text-white transition-colors"
                >
                    Цитата
                </button>
                <button
                    type="button"
                    onClick={() => addBlock('code')}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm text-white transition-colors"
                >
                    Код
                </button>
                <button
                    type="button"
                    onClick={() => addBlock('list')}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm text-white transition-colors"
                >
                    Список
                </button>
            </div>

            {blocks.length === 0 && (
                <div className="text-center text-gray-400 py-8 border-2 border-dashed border-white/10 rounded-lg">
                    Нажмите на кнопку выше, чтобы добавить контент
                </div>
            )}

            <div className="space-y-3">
                {blocks.map((block, index) => (
                    <div
                        key={block.id}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        className="bg-stone-800/40 border border-white/10 rounded-lg p-4 cursor-move transition-all hover:border-blue-500"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex gap-2">
                                <span className="text-xs text-gray-400">
                                    {block.type === 'heading' && 'Заголовок'}
                                    {block.type === 'text' && 'Текст'}
                                    {block.type === 'image' && 'Изображение'}
                                    {block.type === 'quote' && 'Цитата'}
                                    {block.type === 'code' && 'Код'}
                                    {block.type === 'list' && 'Список'}
                                </span>
                                <span className="text-xs text-gray-500">⋮⋮ (перетащите)</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => deleteBlock(block.id)}
                                className="text-red-400 hover:text-red-300 text-sm transition-colors"
                            >
                                ✕ Удалить
                            </button>
                        </div>
                        {renderBlock(block)}
                    </div>
                ))}
            </div>
        </div>
    );
}