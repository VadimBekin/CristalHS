import { useState } from 'react';
import { ref, update } from 'firebase/database';
import { database } from '../../Firebase.tsx';
import type { DeckItem } from '../../Interfaces/Interfaces.tsx';

interface EditDeckProps {
    deck: DeckItem;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function EditDeck({ deck, onSuccess, onCancel }: EditDeckProps) {
    const [title, setTitle] = useState(deck.title);
    const [code, setCode] = useState(deck.code);
    const [winrate, setWinrate] = useState(deck.winrate);
    const [image, setImage] = useState(deck.image || '');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await update(ref(database, `decks/${deck.id}`), {
                title,
                code,
                winrate: Number(winrate),
                image: image || null,
                updatedAt: new Date().toISOString()
            });
            onSuccess();
        } catch (error) {
            console.error('Ошибка обновления колоды:', error);
            alert('Не удалось обновить колоду');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-stone-800 rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold text-white mb-4">Редактировать колоду</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-300 text-sm mb-2">Название колоды</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 bg-stone-700 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300 text-sm mb-2">Код колоды</label>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full px-3 py-2 bg-stone-700 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300 text-sm mb-2">Винрейт (%)</label>
                        <input
                            type="number"
                            value={winrate}
                            onChange={(e) => setWinrate(Number(e.target.value))}
                            min="0"
                            max="100"
                            step="0.1"
                            className="w-full px-3 py-2 bg-stone-700 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 text-sm mb-2">URL изображения</label>
                        <input
                            type="url"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            className="w-full px-3 py-2 bg-stone-700 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        />
                        {image && (
                            <div className="mt-2">
                                <img
                                    src={image}
                                    alt={title}
                                    className="w-full h-32 object-contain rounded-lg bg-stone-700"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Сохранение...' : 'Сохранить'}
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                        >
                            Отмена
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}