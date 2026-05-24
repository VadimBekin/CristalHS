import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, get, remove } from 'firebase/database';
import { database } from '../Firebase.tsx';
import type { NewsItem, GuideItem, DeckItem } from '../Interfaces/Interfaces.tsx';
import AddNews from './AddNews';
import AddGuide from './AddGuide';
import AddDeck from './AddDeck';
import EditNews from './EditBtn/EditNews.tsx';
import EditGuide from './EditBtn/EditGuide.tsx';
import EditDeck from './EditBtn/EditDeck.tsx';

type TabType = 'news' | 'guides' | 'decks';

export default function AdminPanel() {
    const [activeTab, setActiveTab] = useState<TabType>('news');
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingItem, setEditingItem] = useState<NewsItem | GuideItem | DeckItem | null>(null);
    const [news, setNews] = useState<NewsItem[]>([]);
    const [guides, setGuides] = useState<GuideItem[]>([]);
    const [decks, setDecks] = useState<DeckItem[]>([]);
    const navigate = useNavigate();

    const loadData = async () => {

        const newsSnapshot = await get(ref(database, 'news'));
        if (newsSnapshot.exists()) {
            const newsData = Object.entries(newsSnapshot.val()).map(([id, data]) => ({
                id,
                ...(data as Omit<NewsItem, 'id'>)
            }));
            setNews(newsData.reverse() as NewsItem[]);
        }

        const guidesSnapshot = await get(ref(database, 'guides'));
        if (guidesSnapshot.exists()) {
            const guidesData = Object.entries(guidesSnapshot.val()).map(([id, data]) => ({
                id,
                ...(data as Omit<GuideItem, 'id'>)
            }));
            setGuides(guidesData.reverse() as GuideItem[]);
        }

        const decksSnapshot = await get(ref(database, 'decks'));
        if (decksSnapshot.exists()) {
            const decksData = Object.entries(decksSnapshot.val()).map(([id, data]) => ({
                id,
                ...(data as Omit<DeckItem, 'id'>)
            }));
            setDecks(decksData.reverse() as DeckItem[]);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('isAdmin');
        navigate('/admin/login');
    };

    const handleDelete = async (collection: string, id: string) => {
        if (confirm('Удалить?')) {
            await remove(ref(database, `${collection}/${id}`));
            loadData();
        }
    };

    const handleEdit = (item: NewsItem | GuideItem | DeckItem) => {
        setEditingItem(item);
        setShowEditModal(true);
    };

    const getAddButtonText = () => {
        switch (activeTab) {
            case 'news': return 'новость';
            case 'guides': return 'гайд';
            case 'decks': return 'колоду';
        }
    };

    const handleEditSuccess = () => {
        loadData();
        setShowEditModal(false);
        setEditingItem(null);
    };

    return (
        <div className="min-h-screen bg-stone-900 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-white">Админ-панель</h1>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
                    >
                        Выйти
                    </button>
                </div>

                <div className="flex gap-2 mb-6 border-b border-white/10">
                    <button
                        onClick={() => setActiveTab('news')}
                        className={`px-6 py-3 rounded-t-lg transition-colors ${
                            activeTab === 'news' ? 'bg-yellow-600 text-white' : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        Новости
                    </button>
                    <button
                        onClick={() => setActiveTab('guides')}
                        className={`px-6 py-3 rounded-t-lg transition-colors ${
                            activeTab === 'guides' ? 'bg-yellow-600 text-white' : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        Гайды
                    </button>
                    <button
                        onClick={() => setActiveTab('decks')}
                        className={`px-6 py-3 rounded-t-lg transition-colors ${
                            activeTab === 'decks' ? 'bg-yellow-600 text-white' : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        Колоды
                    </button>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="mb-6 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors"
                >
                    + Добавить {getAddButtonText()}
                </button>

                {activeTab === 'news' && (
                    <div className="space-y-3">
                        {news.map((item) => (
                            <div key={item.id} className="bg-stone-800/50 border border-white/10 rounded-xl p-4 flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="text-white font-semibold">{item.title}</h3>
                                    <p className="text-gray-400 text-sm">{item.description?.slice(0, 100)}...</p>
                                    <p className="text-gray-500 text-xs mt-1">{new Date(item.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="px-3 py-1 bg-blue-600/50 hover:bg-blue-600 text-white rounded-lg transition-colors"
                                    >
                                        Редактировать
                                    </button>
                                    <button
                                        onClick={() => handleDelete('news', item.id)}
                                        className="px-3 py-1 bg-red-600/50 hover:bg-red-600 text-white rounded-lg transition-colors"
                                    >
                                        Удалить
                                    </button>
                                </div>
                            </div>
                        ))}
                        {news.length === 0 && <p className="text-gray-500 text-center py-8">Нет новостей</p>}
                    </div>
                )}

                {activeTab === 'guides' && (
                    <div className="space-y-3">
                        {guides.map((item) => (
                            <div key={item.id} className="bg-stone-800/50 border border-white/10 rounded-xl p-4 flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="text-white font-semibold">{item.title}</h3>
                                    <p className="text-gray-400 text-sm">{item.description?.slice(0, 100)}...</p>
                                    <p className="text-gray-500 text-xs mt-1">{new Date(item.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="px-3 py-1 bg-blue-600/50 hover:bg-blue-600 text-white rounded-lg transition-colors"
                                    >
                                        Редактировать
                                    </button>
                                    <button
                                        onClick={() => handleDelete('guides', item.id)}
                                        className="px-3 py-1 bg-red-600/50 hover:bg-red-600 text-white rounded-lg transition-colors"
                                    >
                                        Удалить
                                    </button>
                                </div>
                            </div>
                        ))}
                        {guides.length === 0 && <p className="text-gray-500 text-center py-8">Нет гайдов</p>}
                    </div>
                )}

                {activeTab === 'decks' && (
                    <div className="space-y-3">
                        {decks.map((item) => (
                            <div key={item.id} className="bg-stone-800/50 border border-white/10 rounded-xl p-4 flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="text-white font-semibold">{item.title}</h3>
                                    <p className="text-gray-400 text-sm">Винрейт: {item.winrate}%</p>
                                    <p className="text-gray-500 text-xs mt-1">{new Date(item.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="px-3 py-1 bg-blue-600/50 hover:bg-blue-600 text-white rounded-lg transition-colors"
                                    >
                                        Редактировать
                                    </button>
                                    <button
                                        onClick={() => handleDelete('decks', item.id)}
                                        className="px-3 py-1 bg-red-600/50 hover:bg-red-600 text-white rounded-lg transition-colors"
                                    >
                                        Удалить
                                    </button>
                                </div>
                            </div>
                        ))}
                        {decks.length === 0 && <p className="text-gray-500 text-center py-8">Нет колод</p>}
                    </div>
                )}

                {showModal && activeTab === 'news' && (
                    <AddNews onSuccess={() => { loadData(); setShowModal(false); }} onCancel={() => setShowModal(false)} />
                )}
                {showModal && activeTab === 'guides' && (
                    <AddGuide onSuccess={() => { loadData(); setShowModal(false); }} onCancel={() => setShowModal(false)} />
                )}
                {showModal && activeTab === 'decks' && (
                    <AddDeck onSuccess={() => { loadData(); setShowModal(false); }} onCancel={() => setShowModal(false)} />
                )}

                {showEditModal && editingItem && activeTab === 'news' && (
                    <EditNews
                        news={editingItem as NewsItem}
                        onSuccess={handleEditSuccess}
                        onCancel={() => setShowEditModal(false)}
                    />
                )}
                {showEditModal && editingItem && activeTab === 'guides' && (
                    <EditGuide
                        guide={editingItem as GuideItem}
                        onSuccess={handleEditSuccess}
                        onCancel={() => setShowEditModal(false)}
                    />
                )}
                {showEditModal && editingItem && activeTab === 'decks' && (
                    <EditDeck
                        deck={editingItem as DeckItem}
                        onSuccess={handleEditSuccess}
                        onCancel={() => setShowEditModal(false)}
                    />
                )}
            </div>
        </div>
    );
}