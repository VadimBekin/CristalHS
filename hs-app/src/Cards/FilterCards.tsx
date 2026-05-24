import {  useState, useEffect } from "react";
import { useDebounce } from "../Huks/useDebounce.tsx";

interface FiltersProps {
    onFilterChange: (filters: FilterState) => void;
    cards: any[];
}

export interface FilterState {
    rarity: string[];
    cardClass: string[];
    set: string[];
    manaCost: number[];
    searchQuery: string;
}

export default function FilterCards({onFilterChange, cards}: FiltersProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [filters, setFilters] = useState<FilterState>({
        rarity: [] as string[],
        cardClass: [] as string[],
        set: [] as string[],
        manaCost: [] as number[],
        searchQuery: ''
    });
    const debouncedSearchQuery = useDebounce(filters.searchQuery, 500);

    const rarities = [...new Set(cards.map(c => c.rarity).filter(Boolean))];
    const cardClasses = [...new Set(cards.map(c => c.cardClass).filter(Boolean))];
    const sets = [...new Set(cards.map(c => c.set).filter(Boolean))];
    const costMana = [...new Set(cards.map(c => c.cost).filter(c => c !== undefined).sort((a, b) => a - b))];


    useEffect(() => {
        const allFilters: FilterState = {
            ...filters,
            searchQuery: debouncedSearchQuery
        };
        onFilterChange(allFilters);
    }, [filters.rarity, filters.cardClass, filters.set, filters.manaCost, debouncedSearchQuery]);


    function handleCheckboxChange(key: keyof typeof filters, value: string) {
        setFilters(prev => {
            const current = prev[key] as string[];
            const updated = current.includes(value)
                ? current.filter(v => v !== value)
                : [...current, value];
            return { ...prev, [key]: updated };
        });
    }

    function handleManaChange(value: number) {
        setFilters(prev => {
            const updated = prev.manaCost.includes(value)
                ? prev.manaCost.filter(v => v !== value)
                : [...prev.manaCost, value];
            return { ...prev, manaCost: updated };
        });
    }

    function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFilters(prev => ({ ...prev, searchQuery: e.target.value }));
    }

    function resetFilters () {
        setFilters({
            rarity: [],
            cardClass: [],
            manaCost: [],
            set: [],
            searchQuery: ''
        });
        onFilterChange({
            rarity: [],
            cardClass: [],
            manaCost: [],
            set: [],
            searchQuery: ''
        })
    }

    function hasActiveFilters () {
        return filters.rarity.length > 0 ||
            filters.cardClass.length > 0 ||
            filters.set.length > 0 ||
            filters.manaCost.length > 0 ||
            filters.searchQuery !== '';
    };

    return (
        <div className="mb-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden w-full flex items-center justify-between px-4 py-3 bg-stone-800/50 rounded-xl border border-white/10 mb-3"
            >
                <span className="text-white font-medium">Фильтры</span>
                <span className="text-gray-400">{isOpen ? '▲' : '▼'}</span>
            </button>

            <div className={`${isOpen ? 'block' : 'hidden md:block'} bg-stone-900/40 border border-white/5 rounded-2xl p-4`}>
                <div className="mb-5">

                    <input
                        type="text"
                        placeholder="Введите название карты..."
                        value={filters.searchQuery}
                        onChange={handleSearchChange}
                        className="w-full px-4 py-2 bg-stone-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 transition-colors"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                    <div>
                        <h4 className="font-medium text-gray-300 mb-2">Редкость:</h4>
                        <div className="space-y-1.5 max-h-32 overflow-y-auto">
                            {rarities.map(rarity => (
                                <label key={rarity} className="flex items-center gap-2 cursor-pointer text-sm text-gray-400 hover:text-gray-300">
                                    <input
                                        type="checkbox"
                                        checked={filters.rarity.includes(rarity)}
                                        onChange={() => handleCheckboxChange('rarity', rarity)}
                                        className="w-4 h-4 rounded border-gray-600 bg-stone-800 accent-yellow-500  opacity-60"
                                    />
                                    <span className={
                                        rarity === 'COMMON' ? 'text-slate-400' :
                                            rarity === 'RARE' ? 'text-blue-400' :
                                                rarity === 'EPIC' ? 'text-purple-400' :
                                                    rarity === 'LEGENDARY' ? 'text-amber-400' :
                                                        'text-gray-400'
                                    }>
                                        {rarity === 'COMMON' ? 'Обычная' :
                                            rarity === 'RARE' ? 'Редкая' :
                                                rarity === 'EPIC' ? 'Эпическая' :
                                                    rarity === 'LEGENDARY' ? 'Легендарная' :
                                                        rarity || 'Неизвестно'}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-medium text-gray-300 mb-2">Классы:</h4>
                        <div className="space-y-1.5 max-h-32 overflow-y-auto">
                            {cardClasses.map(className => (
                                <label key={className} className="flex items-center gap-2 cursor-pointer text-sm text-gray-400 hover:text-gray-300">
                                    <input
                                        type="checkbox"
                                        checked={filters.cardClass.includes(className)}
                                        onChange={() => handleCheckboxChange('cardClass', className)}
                                        className="w-4 h-4 rounded border-gray-600 bg-stone-800 accent-yellow-500 opacity-60"
                                    />
                                    <span>{className === 'Neutral' ? 'Нейтральный' : className}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-medium text-gray-300 mb-2">Дополнения:</h4>
                        <div className="space-y-1.5 max-h-32 overflow-y-auto">
                            {sets.map(set => (
                                <label key={set} className="flex items-center gap-2 cursor-pointer text-sm text-gray-400 hover:text-gray-300">
                                    <input
                                        type="checkbox"
                                        checked={filters.set.includes(set)}
                                        onChange={() => handleCheckboxChange('set', set)}
                                        className="w-4 h-4 rounded-md border-gray-600 bg-stone-800 accent-yellow-500 cursor-pointer opacity-60"
                                    />
                                    <span>{set}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-medium text-gray-300 mb-2">Стоимость маны:</h4>
                        <div className="flex flex-wrap gap-1.5">
                            {costMana.map(cost => (
                                <button
                                    key={cost}
                                    onClick={() => handleManaChange(cost)}
                                    className={`
                                        w-8 h-8 rounded-lg text-sm font-medium transition-all cursor-pointer
                                        ${filters.manaCost.includes(cost)
                                        ? 'bg-yellow-600 text-white shadow-md scale-105'
                                        : 'bg-stone-800/50 text-gray-400 hover:bg-stone-700/70'
                                    }
                                    `}
                                >
                                    {cost}
                                </button>
                            ))}
                        </div>
                    </div>

                </div>
                {hasActiveFilters() && (
                    <div className="mt-5 pt-4 border-t border-white/10">
                        <button
                            onClick={resetFilters}
                            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
                        >
                            Сбросить все фильтры
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}


