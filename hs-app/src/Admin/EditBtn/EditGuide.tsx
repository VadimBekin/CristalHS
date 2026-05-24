import { useState } from 'react';
import { ref, update } from 'firebase/database';
import { database } from '../../Firebase.tsx';
import type { GuideItem, ContentBlock } from '../../Interfaces/Interfaces.tsx';
import ContentEditor from '../ContentEditor/ContentEditor.tsx';

interface EditGuideProps {
    guide: GuideItem;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function EditGuide({ guide, onSuccess, onCancel }: EditGuideProps) {
    const [title, setTitle] = useState(guide.title);
    const [description, setDescription] = useState(guide.description);
    const [content, _setContent] = useState(guide.content || '');
    const [image, setImage] = useState(guide.image || '');
    const [author, setAuthor] = useState(guide.author || 'Admin');
    const [tags, setTags] = useState(guide.tags ? guide.tags.join(', ') : '');
    const [className, setClassName] = useState(guide.className || '');
    const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>(guide.contentBlocks || []);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
            const updateData: any = {
                title,
                description,
                updatedAt: new Date().toISOString()
            };

            if (content) updateData.content = content;
            if (image) updateData.image = image;
            if (author) updateData.author = author;
            if (tagsArray.length > 0) updateData.tags = tagsArray;
            if (contentBlocks.length > 0) updateData.contentBlocks = contentBlocks;
            if (className) updateData.className = className;

            await update(ref(database, `guides/${guide.id}`), updateData);
            onSuccess();
        } catch (error) {
            console.error('Ошибка обновления:', error);
            alert('Не удалось обновить гайд');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-stone-800 rounded-xl p-6 max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-white mb-4">Редактировать гайд</h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label className="block text-gray-300 mb-2">Название *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 bg-stone-700 border border-white/10 rounded-lg text-white"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 mb-2">Краткое описание *</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 bg-stone-700 border border-white/10 rounded-lg text-white"
                            rows={3}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 mb-2">URL изображения</label>
                        <input
                            type="url"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            className="w-full px-3 py-2 bg-stone-700 border border-white/10 rounded-lg text-white"
                        />
                        {image && (
                            <div className="mt-2">
                                <img src={image} alt="preview" className="h-32 rounded-lg object-cover bg-stone-700" />
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-300 mb-2">Автор</label>
                        <input
                            type="text"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            className="w-full px-3 py-2 bg-stone-700 border border-white/10 rounded-lg text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 mb-2">Класс</label>
                        <input
                            type="text"
                            value={className}
                            onChange={(e) => setClassName(e.target.value)}
                            className="w-full px-3 py-2 bg-stone-700 border border-white/10 rounded-lg text-white"
                            placeholder="Воин, Маг, Разбойник..."
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 mb-2">Теги (через запятую)</label>
                        <input
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            className="w-full px-3 py-2 bg-stone-700 border border-white/10 rounded-lg text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 mb-2">Гибкий редактор контента</label>
                        <ContentEditor blocks={contentBlocks} onChange={setContentBlocks} />
                    </div>

                    <div className="flex gap-2 pt-4">
                        <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg">
                            {loading ? 'Сохранение...' : 'Сохранить'}
                        </button>
                        <button type="button" onClick={onCancel} className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg">
                            Отмена
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}