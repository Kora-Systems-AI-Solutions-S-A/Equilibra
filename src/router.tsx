import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from './layouts/AppShell';
import { DashboardPage } from './pages/DashboardPage';

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex-1 flex items-center justify-center">
    <h1 className="text-2xl font-bold text-slate-400">{title}</h1>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/app/home" replace />,
  },
  {
    path: '/login',
    element: <PlaceholderPage title="Login Page" />,
  },
  {
    path: '/app',
    element: <AppShell />,
    children: [
      {
        path: 'home',
        element: <DashboardPage />,
      },
      {
        path: 'monthly-summary',
        element: <PlaceholderPage title="Resumo Mensal" />,
      },
      {
        path: 'income',
        element: <PlaceholderPage title="Entradas de Renda" />,
      },
      {
        path: 'debts',
        element: <PlaceholderPage title="Planejamento de Dívidas" />,
      },
    ],
  },
]);
