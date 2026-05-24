import { useState, useEffect, useMemo } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '../Firebase.tsx';
import type { NewsItem } from '../Interfaces/Interfaces.ts';
import Spinner from '../Components/Spinner';
import Pagination from '../Components/Pagination.tsx';

const NEWS_PER_PAGE = 6;

export default function NewsPage() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);

    useEffect(() => {
        const loadNews = async () => {
            try {
                setLoading(true);
                const newsSnapshot = await get(ref(database, 'news'));

                if (newsSnapshot.exists()) {
                    const newsData = Object.entries(newsSnapshot.val()).map(([id, data]) => ({
                        id,
                        ...(data as Omit<NewsItem, 'id'>)
                    }));
                    const reversedNews = newsData.reverse() as NewsItem[];
                    setNews(reversedNews);
                    setFilteredNews(reversedNews);
                } else {
                    setNews([]);
                    setFilteredNews([]);
                }
            } catch (err) {
                console.error('Ошибка загрузки новостей:', err);
                setError('Не удалось загрузить новости');
            } finally {
                setLoading(false);
            }
        };
        setCurrentPage(1);
        loadNews();
    }, []);

    const currentNews = useMemo(() => {
        const startIndex = (currentPage - 1) * NEWS_PER_PAGE;
        const endIndex = startIndex + NEWS_PER_PAGE;
        return filteredNews.slice(startIndex, endIndex);
    }, [filteredNews, currentPage]);

    const totalPages = useMemo(() => {
        return Math.ceil(filteredNews.length / NEWS_PER_PAGE);
    }, [filteredNews.length]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) return <Spinner />;
    if (error) return <div className="text-red-500 text-center py-10">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Новости</h1>
                <p className="text-gray-400">Свежие новости и обновления игры</p>
            </div>

            {filteredNews.length === 0 ? (
                <div className="text-center text-gray-400 py-10">
                    {news.length === 0
                        ? "Пока нет добавленных новостей"
                        : "Новости не найдены по вашему запросу"}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentNews.map((item) => (
                            <div
                                key={item.id}
                                className="bg-stone-800/60 border border-white/10 rounded-xl overflow-hidden hover:scale-102 transition-transform duration-300 flex flex-col h-full"
                            >
                                {item.image && (
                                    <div
                                        className="h-48 overflow-hidden bg-stone-700 relative group flex-shrink-0"
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                        />

                                    </div>
                                )}

                                <div className="p-4 flex flex-col flex-1">
                                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                                        {item.title}
                                    </h3>

                                    <p className="text-gray-300 text-sm mb-3 line-clamp-3">
                                        {item.description}
                                    </p>
                                    <div className="mt-auto">
                                        <button
                                            onClick={() => window.location.href = `/news/${item.id}`}
                                            className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-500 border-white/20 text-white rounded-lg transition-colors text-sm cursor-pointer"
                                        >
                                            Открыть новость
                                        </button>
                                    </div>

                                    <div className="mt-auto">
                                        <div className="text-xs text-gray-300 pt-3 border-t border-white/5">
                                            Дата публикации: {new Date(item.createdAt).toLocaleDateString('ru-RU')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </>
            )}
        </div>
    );
}