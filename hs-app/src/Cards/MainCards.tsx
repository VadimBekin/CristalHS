import {useEffect, useState, useMemo } from "react";
import axios from "axios";
import type {HSCards} from "../Interfaces/Interfaces.tsx";
import Spinner from '../Components/Spinner.tsx';
import CardModal from "./ModalInfo.tsx";
import Pagination from "../Components/Pagination.tsx";
import FilterCards from "./FilterCards.tsx";
import type {FilterState} from "./FilterCards.tsx";

let cachedCardsData: HSCards[] | null = null;
const CARDS_PER_PAGE = 18;

export default function MainCards() {
    const [cards, setCards] = useState<HSCards[]>([]);
    const [loading, setLoading] = useState<boolean>(!cachedCardsData);
    const [error, setError] = useState<string | null>(null);
    const [selectedCard, setSelectedCard] = useState<HSCards | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [filteredCards, setFilteredCards] = useState<HSCards[]>([]);
    const [filters, setFilters] = useState<FilterState>({
        rarity: [],
        cardClass: [],
        set: [],
        manaCost: [],
        searchQuery: ''
    });

    const applyFilters = (cardsArray: HSCards[], activeFilters: FilterState) => {
        return cardsArray.filter(card => {
            if (activeFilters.rarity.length > 0 && !activeFilters.rarity.includes(card.rarity)) {
                return false;
            }
            if (activeFilters.cardClass.length > 0 && !activeFilters.cardClass.includes(card.cardClass)) {
                return false;
            }
            if (activeFilters.set.length > 0 && !activeFilters.set.includes(card.set)) {
                return false;
            }
            if (activeFilters.manaCost.length > 0 && !activeFilters.manaCost.includes(card.cost)) {
                return false;
            }
            if (activeFilters.searchQuery && !card.name.toLowerCase().includes(activeFilters.searchQuery.toLowerCase())) {
                return false;
            }
            return true;
        });
    };

    useEffect(() => {
        const fetchCards = async () => {
            if (cachedCardsData) {
                setCards(cachedCardsData);
                return;
            }
            try {
                setLoading(true);
                const response = await axios.get<HSCards[]>(
                    import.meta.env.VITE_JSON_API
                );
                cachedCardsData = response.data;
                setCards(response.data);

            } catch (err) {
                setError(`Error: ${err}`);
            } finally {
                setLoading(false);
            }
        };
        const filtered = applyFilters(cards, filters);
        setFilteredCards(filtered);
        setCurrentPage(1);
        fetchCards();
    }, [filters, cards]);

    function handleFilterChange (newFilters: FilterState) {
        setFilters(newFilters);
    };

    const sortedAndFilteredCards = useMemo(() => {
        const cleanedCards = cards
            .filter((card, index, self) => index === self.findIndex(c => c.name === card.name))
            .filter(c => c.set !== 'HERO_SKINS');
        const filtered = applyFilters(cleanedCards, filters);
        return filtered.sort((a, b) => a.name.localeCompare(b.name, 'ru-RU'));
    }, [cards, filters]);

    const totalPages = useMemo(() => {
        return Math.max(1, Math.ceil(sortedAndFilteredCards.length / CARDS_PER_PAGE));
    }, [sortedAndFilteredCards]);


    const currentCards = useMemo(() => {
        const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
        return sortedAndFilteredCards.slice(startIndex, startIndex + CARDS_PER_PAGE);
    }, [sortedAndFilteredCards, currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) return <Spinner />;
    if (error) return <div className="text-red-500">{error}</div>;

    const rarityGlows: Record<string, string> = {
        COMMON: 'bg-slate-400/30 group-hover:bg-slate-400/40',
        RARE: 'bg-blue-500/30 group-hover:bg-blue-500/50',
        EPIC: 'bg-purple-500/30 group-hover:bg-purple-500/50',
        LEGENDARY: 'bg-amber-500/40 group-hover:bg-amber-500/60 shadow-[0_0_30px_rgba(245,158,11,0.2)]',
    };



    return (
        <div>
            <FilterCards onFilterChange={handleFilterChange} cards={cards} />
            <div className="text-right text-gray-400 text-sm mb-2">
                Найдено карт: {filteredCards.length}
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 p-4 sm:p-6 bg-stone-900/40 border border-white/5 rounded-2xl">
                {currentCards.map((card) => (
                    <div key={card.id} className="group flex flex-col items-center">
                        <div
                            onClick={() => setSelectedCard(card)}
                            className="relative transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-2 cursor-pointer">
                            <img
                                src={`https://art.hearthstonejson.com/v1/render/latest/ruRU/512x/${card.id}.png`}
                                alt={card.name}
                                className="w-full h-auto drop-shadow-lg"
                                loading="lazy"
                            />

                            <div className={`
                                absolute
                                inset-0
                                opacity-0
                                group-hover:opacity-100
                                transition-all
                                duration-300
                                rounded-full
                                blur-2xl
                                -z-10
                                ${rarityGlows[card.rarity] || 'bg-gray-500/30 group-hover:bg-gray-500/40'}
                            `}/>
                        </div>
                    </div>
                ))}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange}/>
            <CardModal
                selectedCard={selectedCard}
                onClose={() => setSelectedCard(null)}
                rarityGlows={rarityGlows}
            />

        </div>
    )
}