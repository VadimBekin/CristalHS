import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import { database } from '../Firebase.tsx';
import type { NewsItem } from '../Interfaces/Interfaces.ts';
import Spinner from '../Components/Spinner';
import ImageModal from '../Components/ImageModal.tsx';
import RenderContent from '../Components/RenderContent';
import CopyInput from '../Components/CopyInput';

export default function NewsDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [news, setNews] = useState<NewsItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null);

    useEffect(() => {
        const loadNews = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const newsSnapshot = await get(ref(database, `news/${id}`));

                if (newsSnapshot.exists()) {
                    const data = newsSnapshot.val();
                    setNews({
                        id,
                        title: data.title,
                        description: data.description,
                        content: data.content || '',
                        contentBlocks: data.contentBlocks || null,
                        image: data.image || '',
                        author: data.author || 'Admin',
                        tags: data.tags || [],
                        views: data.views || 0,
                        createdAt: data.createdAt,
                        updatedAt: data.updatedAt
                    });
                } else {
                    setError('Новость не найдена');
                }
            } catch (err) {
                console.error('Ошибка загрузки новости:', err);
                setError('Не удалось загрузить новость');
            } finally {
                setLoading(false);
            }
        };

        loadNews();
    }, [id]);

    const renderContent = () => {
        if (news?.contentBlocks && news.contentBlocks.length > 0) {
            return <RenderContent blocks={news.contentBlocks} />;
        }
        if (news?.content) {
            return (
                <div className="text-gray-200 whitespace-pre-wrap leading-relaxed text-base">
                    {news.content}
                </div>
            );
        }
        return null;
    };

    if (loading) return <Spinner />;
    if (error) return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center text-red-400 py-10">
                <p>{error}</p>
                <button
                    onClick={() => navigate('/news')}
                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
                >
                    Вернуться к новостям
                </button>
            </div>
        </div>
    );
    if (!news) return null;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">

            <button
                onClick={() => navigate('/news')}
                className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
                ← Назад к новостям
            </button>

            {news.image && (
                <div
                    className="mb-6 rounded-xl overflow-hidden cursor-pointer bg-stone-800/40 border border-white/10"
                    onClick={() => setSelectedImage({ url: news.image!, title: news.title })}
                >
                    <img
                        src={news.image}
                        alt={news.title}
                        className="w-full h-64 md:h-96 object-cover hover:scale-105 transition-transform duration-300"
                    />
                </div>
            )}

            <div className="bg-stone-800/40 border border-white/10 rounded-xl p-6 mb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{news.title}</h1>

                <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                    <span>Опубликовано: {new Date(news.createdAt).toLocaleDateString('ru-RU')}</span>
                    {news.updatedAt && news.updatedAt !== news.createdAt && (
                        <span>Обновлено: {new Date(news.updatedAt).toLocaleDateString('ru-RU')}</span>
                    )}
                    {news.author && <span>Автор: {news.author}</span>}
                    <span>Просмотров: {news.views}</span>
                </div>
            </div>

            {news.tags && news.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                    {news.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-stone-700 rounded-full text-xs text-gray-300">
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            <div className="bg-stone-800/40 border border-white/10 rounded-xl p-6 mb-6">
                <p className="text-gray-200 leading-relaxed">{news.description}</p>
            </div>

            <div className="bg-stone-800/40 border border-white/10 rounded-xl p-6">
                {renderContent()}
            </div>
            {news.copyCode && (
                <div className="mt-6 bg-stone-800/40 border border-white/10 rounded-xl p-6">
                    <CopyInput value={news.copyCode} label="Код для копирования" />
                </div>
            )}
            {selectedImage && (
                <ImageModal
                    image={selectedImage.url}
                    title={selectedImage.title}
                    onClose={() => setSelectedImage(null)}
                />
            )}
        </div>
    );
}