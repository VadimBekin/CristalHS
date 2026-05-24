import { useState } from 'react';
import { ref, push, set } from 'firebase/database';
import { database } from '../Firebase.tsx';
import ContentEditor from './ContentEditor/ContentEditor.tsx';
import type { ContentBlock } from '../Interfaces/Interfaces.tsx';
import CopyInput from '../Components/CopyInput';

interface AddGuideProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export default function AddGuide({ onSuccess, onCancel }: AddGuideProps) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        content: '',
        image: '',
        author: 'Admin',
        tags: '',
        deckCode: '',
        winrate: 50,
        className: ''
    });
    const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const guidesRef = ref(database, 'guides');
        const newGuideRef = push(guidesRef);
        const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);

        await set(newGuideRef, {
            title: formData.title,
            description: formData.description,
            content: formData.content,
            contentBlocks: contentBlocks.length > 0 ? contentBlocks : null,
            image: formData.image || null,
            author: formData.author,
            deckCode: formData.deckCode || null,
            tags: tagsArray.length > 0 ? tagsArray : null,
            winrate: Number(formData.winrate),
            className: formData.className || null,
            views: 0,
            createdAt: new Date().toISOString()
        });

        setLoading(false);
        onSuccess();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <div className="bg-stone-900 rounded-2xl border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-y-auto my-8">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-white mb-4">Добавить гайд</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div>
                            <label className="block text-gray-300 mb-2">Название гайда *</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                className="w-full px-4 py-2 bg-stone-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-500/50"
                                placeholder="Как собрать колоду..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-300 mb-2">Краткое описание *</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                rows={3}
                                className="w-full px-4 py-2 bg-stone-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-500/50"
                                placeholder="Краткое описание гайда..."
                                required
                            />
                        </div>

                        <div>
                            <CopyInput
                                value={formData.deckCode}
                                label="Код колоды для копирования"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Пользователи смогут скопировать код колоды
                            </p>
                        </div>

                        <div>
                            <label className="block text-gray-300 mb-2">URL изображения</label>
                            <input
                                type="url"
                                value={formData.image}
                                onChange={(e) => setFormData({...formData, image: e.target.value})}
                                className="w-full px-4 py-2 bg-stone-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-500/50"
                                placeholder="https://example.com/image.jpg"
                            />
                            {formData.image && (
                                <div className="mt-2">
                                    <img
                                        src={formData.image}
                                        alt="preview"
                                        className="h-32 rounded-lg object-cover bg-stone-700"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                </div>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                                Рекомендуемый размер: 800x400px
                            </p>
                        </div>

                        <div>
                            <label className="block text-gray-300 mb-2">Автор</label>
                            <input
                                type="text"
                                value={formData.author}
                                onChange={(e) => setFormData({...formData, author: e.target.value})}
                                className="w-full px-4 py-2 bg-stone-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-500/50"
                                placeholder="Admin"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-300 mb-2">Класс</label>
                            <input
                                type="text"
                                value={formData.className}
                                onChange={(e) => setFormData({...formData, className: e.target.value})}
                                className="w-full px-4 py-2 bg-stone-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-500/50"
                                placeholder="Воин, Маг, Разбойник..."
                            />
                        </div>

                        <div>
                            <label className="block text-gray-300 mb-2">Теги (через запятую)</label>
                            <input
                                type="text"
                                value={formData.tags}
                                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                                className="w-full px-4 py-2 bg-stone-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-500/50"
                                placeholder="стратегия, колода, советы"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-300 mb-2">Полный текст (простой вариант)</label>
                            <textarea
                                value={formData.content}
                                onChange={(e) => setFormData({...formData, content: e.target.value})}
                                rows={6}
                                className="w-full px-4 py-2 bg-stone-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-500/50 font-mono text-sm"
                                placeholder="Используйте редактор ниже для более сложного форматирования"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-300 mb-2">Гибкий редактор контента</label>
                            <ContentEditor blocks={contentBlocks} onChange={setContentBlocks} />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Сохранение...' : 'Сохранить гайд'}
                            </button>
                            <button
                                type="button"
                                onClick={onCancel}
                                className="flex-1 py-2 bg-stone-700 hover:bg-stone-600 text-white rounded-lg transition-colors"
                            >
                                Отмена
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}