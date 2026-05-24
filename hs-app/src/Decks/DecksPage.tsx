import { useState, useEffect, useMemo } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '../Firebase.tsx';
import type { DeckItem } from '../Interfaces/Interfaces.tsx';
import CopyInput from '../Components/CopyInput.tsx';
import ImageModal from '../Components/ImageModal.tsx';
import Spinner from '../Components/Spinner';
import Pagination from "../Components/Pagination.tsx";

const CARDS_PER_PAGE = 8;

export default function DecksPage() {
    const [decks, setDecks] = useState<DeckItem[]>([]);
    const [filteredDecks, setFilteredDecks] = useState<DeckItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null);
    const [searchClass, setSearchClass] = useState('');

    useEffect(() => {
        const loadDecks = async () => {
            try {
                setLoading(true);
                const decksSnapshot = await get(ref(database, 'decks'));

                if (decksSnapshot.exists()) {
                    const decksData = Object.entries(decksSnapshot.val()).map(([id, data]) => ({
                        id,
                        ...(data as Omit<DeckItem, 'id'>)
                    }));
                    const reversedDecks = decksData.reverse() as DeckItem[];
                    setDecks(reversedDecks);
                    setFilteredDecks(reversedDecks);
                } else {
                    setDecks([]);
                    setFilteredDecks([]);
                }
            } catch (err) {
                console.error('Ошибка загрузки колод:', err);
                setError('Не удалось загрузить колоды');
            } finally {
                setLoading(false);
            }
        };

        setCurrentPage(1);
        loadDecks();
    }, []);

    useEffect(() => {
        if (!searchClass.trim()) {
            setFilteredDecks(decks);
        } else {
            const filtered = decks.filter(deck =>
                deck.title?.toLowerCase().includes(searchClass.toLowerCase())
            );
            setFilteredDecks(filtered);
        }
        setCurrentPage(1);
    }, [searchClass, decks]);

    const currentDecks = useMemo(() => {
        const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
        const endIndex = startIndex + CARDS_PER_PAGE;
        return filteredDecks.slice(startIndex, endIndex);
    }, [filteredDecks, currentPage]);

    const totalPages = useMemo(() => {
        return Math.ceil(filteredDecks.length / CARDS_PER_PAGE);
    }, [filteredDecks.length]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) return <Spinner />;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-center">
                <input
                    type="text"
                    value={searchClass}
                    onChange={(e) => setSearchClass(e.target.value)}
                    placeholder="Найти колоду..."
                    className="w-auto px-4 py-2 bg-stone-800/40 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <p className="text-gray-400 text-sm sm:text-base text-center sm:text-right">
                    Готовые сборки для игры: {filteredDecks.length} / {decks.length}
                    {filteredDecks.length > 0 && ` • Страница ${currentPage} из ${totalPages}`}
                </p>
            </div>


            {filteredDecks.length === 0 ? (
                <div className="text-center text-gray-400 py-10">
                    {decks.length === 0
                        ? "Пока нет добавленных колод"
                        : `Колоды с названием "${searchClass}" не найдены`}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {currentDecks.map((deck) => {
                            const winrateColor = deck.winrate >= 55 ? 'text-green-400' : deck.winrate >= 50 ? 'text-yellow-400' : 'text-red-400';
                            return (
                                <div key={deck.id} className="bg-stone-800/40 border border-white/10 rounded-xl overflow-hidden hover:scale-102 transition-transform duration-300 flex flex-col h-full">
                                    <div
                                        className="h-62 overflow-hidden bg-stone-700 cursor-pointer relative group flex-shrink-0"
                                        onClick={() => deck.image && setSelectedImage({ url: deck.image, title: deck.title })}
                                    >
                                        {deck.image ? (
                                            <>
                                                <img
                                                    src={deck.image}
                                                    alt={deck.title}
                                                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-104"
                                                />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <span className="text-white text-sm">🔍 Увеличить</span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                Нет изображения
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4 flex flex-col flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-lg font-bold text-white">{deck.title}</h3>
                                        </div>

                                        <div className="mt-auto">
                                            <CopyInput value={deck.code} label="Код колоды" />
                                        </div>

                                        <div className="text-xs text-gray-300 pt-3 mt-2 border-t border-white/5 flex justify-between items-center">
                                            <span>Добавлено: {new Date(deck.createdAt).toLocaleDateString('ru-RU')}</span>
                                            <span className={`text-sm font-semibold ${winrateColor}`}>winrate: {deck.winrate}%</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
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