import type {HSCards} from "../Interfaces/Interfaces.tsx";

interface CardModalProps {
    selectedCard: HSCards | null;
    onClose: () => void;
    rarityGlows: Record<string, string>
}

export default function CardModal({selectedCard, onClose, rarityGlows}: CardModalProps) {
    if (!selectedCard) return null;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4
            backdrop-blur-sm animate-fade-in"
            onClick={handleBackdropClick}
        >
            <div className="relative flex flex-col md:flex-row items-stretch
            max-w-[calc(100%-1rem)] sm:max-w-[calc(100%-2rem)] md:max-w-2xl w-full
            mx-2 sm:mx-4 md:mx-auto p-3 sm:p-4 md:p-6 rounded-xl md:rounded-2xl gap-3
            sm:gap-4 md:gap-6 animate-scale-up border border-white/20
            bg-stone-900/30 max-h-[95vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 sm:top-3 sm:right-3 text-gray-400
                    hover:text-white transition-colors duration-200 z-20 rounded-full p-1 sm:p-0"
                    aria-label="Закрыть"
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-8 h-8 md:w-10 md:h-10 cursor-pointer"
                    >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
                <div className="w-full md:w-64 shrink-0 flex flex-col gap-2 sm:gap-3 md:gap-4">
                    <div className="flex justify-center">
                        <img
                            src={`https://art.hearthstonejson.com/v1/render/latest/ruRU/512x/${selectedCard.id}.png`}
                            alt={selectedCard.name}
                            className="w-full max-w-[180px] sm:max-w-[220px] md:max-w-none
                            md:w-full h-auto drop-shadow-2xl mx-auto"
                        />
                    </div>
                    <div className={`absolute inset-0 rounded-full blur-3xl -z-10 opacity-70 
                    ${rarityGlows[selectedCard.rarity] || 'bg-gray-500/50'}`}/>

                    <div className="flex-1 flex items-end">
                        <p
                            className="text-gray-200 bg-stone-950/30 p-2 sm:p-3 md:p-4 rounded-xl
                            border border-white/5 italic text-xs sm:text-sm md:text-base
                            leading-relaxed w-full text-center"
                            dangerouslySetInnerHTML={{
                                __html: selectedCard.artist
                                    ? `Художник:&nbsp;<strong>${selectedCard.artist}</strong>`
                                    : "Нет описания."
                            }}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-3 text-white flex-1 text-center md:text-left">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-wide text-yellow-500 break-words">{selectedCard.name}</h2>

                    <div className="flex flex-wrap gap-2 justify-center md:justify-start text-xs text-gray-400">
                        <span className="px-2 py-1 bg-stone-800/30 rounded">Мана: {selectedCard.cost ?? 0}</span>
                        <span className="px-2 py-1 bg-stone-800/30 rounded">Тип: {selectedCard.type || 'Неизвестно'}</span>
                        {selectedCard.spellSchool && (
                            <span className="px-2 py-1 bg-stone-800/30 rounded">
                                Школа: {selectedCard.spellSchool}
                            </span>
                        )}
                        <span className="px-2 py-1 bg-stone-800/30 rounded">Редкость: {selectedCard.rarity}</span>
                        <span className="px-2 py-1 bg-stone-800/30 rounded">Класс: {selectedCard.cardClass}</span>
                    </div>


                    <div className="flex-1 flex flex-col gap-3">
                        <p
                            className="text-gray-200 bg-stone-950/30 p-3 rounded-xl border border-white/5 italic text-sm md:text-base leading-relaxed flex-1 overflow-auto"
                            dangerouslySetInnerHTML={{ __html: selectedCard.text || "Нет описания." }}
                        />
                        <p
                            className="text-gray-200 bg-stone-950/30 p-3 rounded-xl border border-white/5 italic text-sm md:text-base leading-relaxed flex-1 overflow-auto"
                            dangerouslySetInnerHTML={{ __html: selectedCard.flavor || "Нет описания." }}
                        />
                        <p
                            className="text-gray-200 bg-stone-950/30 p-4 rounded-xl border border-white/5 italic text-sm md:text-base leading-relaxed w-full"
                            dangerouslySetInnerHTML={{
                                __html: selectedCard.set
                                    ? `Дополнение:&nbsp;<strong>${selectedCard.set}</strong>`
                                    : "Нет описания."
                            }}
                        />
                    </div>
                </div>

            </div>
        </div>
    )
}