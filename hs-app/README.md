# CristalHS

Веб-приложение для фанатов Hearthstone с коллекцией карт, гайдами, колодами и новостями.


## О проекте

Проект представляет собой информационный портал для игроков в Hearthstone, включающий:
- Просмотр карт с фильтрацией и поиском
- Гайды и стратегии от опытных игроков
- Готовые колоды с кодами для импорта
- Новости игры и обновлений
- Админ-панель для управления контентом


## Технологии

- **React 18** - UI библиотека
- **TypeScript** - типизация
- **Vite** - сборщик проекта
- **Tailwind CSS** - стилизация
- **Firebase Realtime Database** - база данных
- **React Router DOM v6** - маршрутизация
- **Axios** - HTTP запросы

## Структура проекта

src/
├── Admin/
│   ├── ContentEditor/
│   │   └── ContentEditor.tsx
│   ├── EditBtn/
│   │   ├── EditDeck.tsx
│   │   ├── EditGuide.tsx
│   │   └──  EditNews.tsx
│   ├── AddDeck.tsx
│   ├── AddGuide.tsx
│   ├── AddNews.tsx
│   ├── AdminLogin.tsx
│   ├── AdminPanel.tsx
│   └── ProtectedRoute.tsx
│
├── App/
│   └── Root.tsx                
│
├── assets/  
│
├── Cards/                      
│   ├── FilterCards.tsx
│   ├── MainCards.tsx
│   └── ModalInfo.tsx
│
├── Components/                 
│   ├── CopyInput.tsx
│   ├── ImageModal.tsx          
│   ├── Pagination.tsx
│   ├── RenderContent.tsx
│   └── Spinner.tsx
│
├── Decks/                      
│   └── DecksPage.tsx
│
├── Guide/                      
│   ├── GuideDetailPage.tsx
│   └── GuidesPage.tsx
│
├── Hooks/                      
│   └── useDebounce.ts
│
├── Interfaces/                 
│   └── Interfaces.ts
│
├── MainPage/                    
│   ├── NewsDetailPage.tsx
│   └── NewsPage.tsx
│
├── Firebase.tsx                
├── App.tsx                     
├── main.tsx                    
└── style.css    


### Требования
- Node.js 18+
- npm

```bash
# 1. Клонируйте репозиторий
git clone https://github.com/VadimBekin/CristalHS.git

# 2. Перейдите в папку проекта
cd hs-app

# 3. Установите зависимости
npm install

# 4. Запустите проект
npm run dev