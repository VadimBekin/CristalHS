import { useState } from 'react';
import { ref, push, set } from 'firebase/database';
import { database } from '../Firebase.tsx';

interface AddDeckProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export default function AddDeck({ onSuccess, onCancel }: AddDeckProps) {
    const [formData, setFormData] = useState({
        title: '',
        image: '',
        code: '',
        winrate: 50
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const decksRef = ref(database, 'decks');
        const newDeckRef = push(decksRef);

        await set(newDeckRef, {
            ...formData,
            winrate: Number(formData.winrate),
            createdAt: new Date().toISOString()
        });

        setLoading(false);
        onSuccess();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-stone-900 rounded-2xl border border-white/10 w-full max-w-lg">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-white mb-4">Добавить колоду</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-300 mb-2">Название</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                className="w-full px-4 py-2 bg-stone-800 border border-white/10 rounded-lg text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-2">URL изображения</label>
                            <input
                                type="url"
                                value={formData.image}
                                onChange={(e) => setFormData({...formData, image: e.target.value})}
                                className="w-full px-4 py-2 bg-stone-800 border border-white/10 rounded-lg text-white"
                                placeholder="https://..."
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-2">Код колоды</label>
                            <textarea
                                value={formData.code}
                                onChange={(e) => setFormData({...formData, code: e.target.value})}
                                rows={3}
                                className="w-full px-4 py-2 bg-stone-800 border border-white/10 rounded-lg text-white font-mono text-sm"
                                placeholder="AAECAZ8FAA..."
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-2">Винрейт (%)</label>
                            <input
                                type="number"
                                step="0.1"
                                value={formData.winrate}
                                onChange={(e) => setFormData({...formData, winrate: parseFloat(e.target.value)})}
                                className="w-full px-4 py-2 bg-stone-800 border border-white/10 rounded-lg text-white"
                                required
                            />
                        </div>
                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Сохранение...' : 'Сохранить'}
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