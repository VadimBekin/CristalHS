import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import { database } from '../Firebase.tsx';
import type { GuideItem } from '../Interfaces/Interfaces.ts';
import Spinner from '../Components/Spinner';
import RenderContent from '../Components/RenderContent';
import CopyInput from '../Components/CopyInput';

export default function GuideDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [guide, setGuide] = useState<GuideItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadGuide = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const guideSnapshot = await get(ref(database, `guides/${id}`));

                if (guideSnapshot.exists()) {
                    setGuide({
                        id,
                        ...(guideSnapshot.val() as Omit<GuideItem, 'id'>)
                    });
                } else {
                    setError('Гайд не найден');
                }
            } catch (err) {
                console.error('Ошибка загрузки гайда:', err);
                setError('Не удалось загрузить гайд');
            } finally {
                setLoading(false);
            }
        };
        loadGuide();
    }, [id]);

    if (loading) return <Spinner />;
    if (error) return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center text-red-400 py-10">
                <p>{error}</p>
                <button
                    onClick={() => navigate('/guides')}
                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
                >
                    Вернуться к гайдам
                </button>
            </div>
        </div>
    );
    if (!guide) return null;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <button
                onClick={() => navigate('/guides')}
                className="mb-6 flex items-center gap-2 text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
                ← Назад к гайдам
            </button>

            {guide.image && (
                <div className="mb-6 rounded-xl overflow-hidden bg-stone-800/40 border border-white/10">
                    <img
                        src={guide.image}
                        alt={guide.title}
                        className="w-full h-64 md:h-96 object-cover hover:scale-105 transition-transform duration-300"
                    />
                </div>
            )}

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{guide.title}</h1>

            <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-300 border-b border-white/10 pb-4 justify-between">
                <span>Добавлено: {new Date(guide.createdAt).toLocaleDateString('ru-RU')}</span>
                {guide.author && <span>Автор: {guide.author}</span>}
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
                {guide.className && (
                    <span className="px-3 py-1 bg-stone-700/50 border border-white/10 rounded-full text-sm text-yellow-400">
                    {guide.className}
                    </span>
                )}

                {guide.tags && guide.tags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 bg-stone-700/50 border border-white/10 rounded-full text-sm text-gray-300">
                    #{tag}
                    </span>
                ))}
            </div>

            <div className="bg-stone-800/60 border border-white/10 rounded-xl p-6 md:p-8">
                <div className="prose prose-invert max-w-none">
                    <div className="text-gray-200 whitespace-pre-wrap leading-relaxed text-base">
                        {guide.description}
                    </div>

                    {guide.contentBlocks && guide.contentBlocks.length > 0 ? (
                        <div className="mt-8 pt-8 border-t border-white/10">
                            <RenderContent blocks={guide.contentBlocks} />
                        </div>
                    ) : guide.content && (
                        <div className="mt-8 pt-8 border-t border-white/10">
                            <div className="text-gray-200 whitespace-pre-wrap leading-relaxed text-base">
                                {guide.content}
                            </div>
                        </div>
                    )}

                </div>
            </div>
            {guide.deckCode && (
                <div className="mt-6 bg-stone-800/40 border border-white/10 rounded-xl p-6">
                    <CopyInput value={guide.deckCode} label="Код колоды для копирования" />
                </div>
            )}
        </div>
    );
}