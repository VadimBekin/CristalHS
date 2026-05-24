import './style.css';
import Root from './App/Root.tsx';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainCards from './Cards/MainCards.tsx';
import DecksPage from './Decks/DecksPage.tsx';
import AdminPanel from './Admin/AdminPanel.tsx';
import AdminLogin from './Admin/AdminLogin.tsx';
import ProtectedRoute from './Admin/ProtectedRoute.tsx';
import GuidesPage from './Guide/GuidesPage.tsx';
import GuideDetailPage from './Guide/GuideDetailPage.tsx';
import NewsPage from "./MainPage/NewsPage.tsx";
import NewsDetailPage from "./MainPage/NewsDetailPage.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            {
                index: true,
              element: <NewsPage />,

            },
            {
              path: 'news',
              element: <NewsPage />,
            },
            {
              path: 'news/:id',
                element: <NewsDetailPage />
            },
            {
            path: 'cards',
            element: <MainCards />
            },
            {
                path: 'decks',
                element: <DecksPage />
            },
            {
                path: 'guides',
                element: <GuidesPage />
            },
            {
                path: 'guides/:id',
                element: <GuideDetailPage />
            }
        ]
    },
    {
        path: "/admin/login",
        element: <AdminLogin />
    },
    {
        path: "/admin",
        element: (
            <ProtectedRoute>
                <AdminPanel />
            </ProtectedRoute>
        )
    }

])

export default function App() {
    return (
        <>
            <RouterProvider router={router} />
        </>
    )
}


