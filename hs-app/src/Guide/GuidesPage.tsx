import { useState, useEffect, useMemo } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '../Firebase.tsx';
import type { GuideItem } from '../Interfaces/Interfaces.tsx';
import Spinner from '../Components/Spinner';
import Pagination from '../Components/Pagination.tsx';


const CARDS_PER_PAGE = 6;

export default function GuidesPage() {
    const [guides, setGuides] = useState<GuideItem[]>([]);
    const [filteredGuides, setFilteredGuides] = useState<GuideItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);

    useEffect(() => {
        const loadGuides = async () => {
            try {
                setLoading(true);
                const guidesSnapshot = await get(ref(database, 'guides'));

                if (guidesSnapshot.exists()) {
                    const guidesData = Object.entries(guidesSnapshot.val()).map(([id, data]) => ({
                        id,
                        ...(data as Omit<GuideItem, 'id'>)
                    }));
                    const reversedGuides = guidesData.reverse() as GuideItem[];
                    setGuides(reversedGuides);
                    setFilteredGuides(reversedGuides);
                } else {
                    setGuides([]);
                    setFilteredGuides([]);
                }
            } catch (err) {
                console.error('Ошибка загрузки гайдов:', err);
                setError('Не удалось загрузить гайды');
            } finally {
                setLoading(false);
            }
        };
        setCurrentPage(1);
        loadGuides();
    }, []);


    const currentGuides = useMemo(() => {
        const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
        const endIndex = startIndex + CARDS_PER_PAGE;
        return filteredGuides.slice(startIndex, endIndex);
    }, [filteredGuides, currentPage]);

    const totalPages = useMemo(() => {
        return Math.ceil(filteredGuides.length / CARDS_PER_PAGE);
    }, [filteredGuides.length]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) return <Spinner />;
    if (error) return <div className="text-red-500 text-center py-10">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <p className="text-gray-400">Полезные руководства и стратегии для игры</p>
            </div>

            {filteredGuides.length === 0 ? (
                <div className="text-center text-gray-400 py-10">
                    {guides.length === 0
                        ? "Пока нет добавленных гайдов"
                        : "Гайды не найдены по вашему запросу"}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentGuides.map((guide) => (
                            <div
                                key={guide.id}
                                className="bg-stone-800/60 border border-white/10 rounded-xl overflow-hidden hover:scale-102 transition-transform duration-300 flex flex-col h-full"
                            >

                                <div
                                    className="h-48 overflow-hidden bg-stone-700 relative group flex-shrink-0"
                                >
                                    {guide.image ? (
                                        <>
                                            <img
                                                src={guide.image}
                                                alt={guide.title}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = '/placeholder-guide.jpg';
                                                }}
                                            />

                                        </>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                                            Нет изображения
                                        </div>
                                    )}
                                </div>

                                <div className="p-4 flex flex-col flex-1">
                                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                                        {guide.title}
                                    </h3>

                                    <p className="text-gray-300 text-sm mb-3 line-clamp-3">
                                        {guide.description}
                                    </p>
                                    <div className="mt-auto">
                                        <button
                                            onClick={() => window.location.href = `/guides/${guide.id}`}
                                            className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-500 border-white/20 text-white rounded-lg transition-colors text-sm cursor-pointer"
                                        >
                                            Читать гайд
                                        </button>
                                    </div>

                                    <div className="text-xs text-gray-300 pt-3 mt-2 border-t border-white/5">
                                        Дата публикации: {new Date(guide.createdAt).toLocaleDateString('ru-RU')}
                                        {guide.createdAt && guide.createdAt !== guide.createdAt && (
                                            <span className="ml-2">Обновлено: {new Date(guide.createdAt).toLocaleDateString('ru-RU')}</span>
                                        )}
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