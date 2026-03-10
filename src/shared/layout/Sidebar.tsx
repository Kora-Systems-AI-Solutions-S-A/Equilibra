import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store/ui.store';
import {
  LayoutDashboard,
  Settings,
  ChevronLeft,
  ChevronRight,
  Scale,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuthStore } from '@/store/auth.store';

export const Sidebar = () => {
  const { sidebarCollapsed, toggleSidebar, setPageTransitionLoading } = useUIStore();
  const { logout, user } = useAuthStore();
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setIsMobileOpen(false);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = async () => {
    setPageTransitionLoading(true, "A encerrar a sessão...");
    try {
      await logout();
    } catch (err) {
      setPageTransitionLoading(false);
    }
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/home' },
  ];

  const sidebarWidth = sidebarCollapsed ? 64 : 240;
  const mobileSidebarWidth = 280;

  const handleToggle = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      toggleSidebar();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{
          width: isMobile ? mobileSidebarWidth : sidebarWidth,
          x: isMobile ? (isMobileOpen ? 0 : -mobileSidebarWidth) : 0
        }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className={cn(
          "bg-dark-graphite flex flex-col py-6 justify-between shrink-0 h-full fixed left-0 top-0 z-50 border-r border-slate-800/50",
          isMobile && "shadow-2xl"
        )}
      >
        {/* Toggle Button - Integrated Handle */}
        <button
          onClick={handleToggle}
          className={cn(
            "absolute top-[36px] left-full w-5 h-10 bg-dark-graphite border border-slate-800/50 border-l-0 rounded-r-lg flex items-center justify-center shadow-sm text-slate-400 hover:text-white hover:brightness-150 transition-colors"
          )}
        >
          {isMobile
            ? (isMobileOpen ? <ChevronLeft size={12} strokeWidth={4} /> : <ChevronRight size={12} strokeWidth={4} />)
            : (sidebarCollapsed ? <ChevronRight size={12} strokeWidth={4} /> : <ChevronLeft size={12} strokeWidth={4} />)
          }
        </button>

        <div className="flex flex-col w-full gap-8">
          {/* Header */}
          <div className="flex items-center w-full px-4 gap-3 overflow-hidden h-10 shrink-0">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
              <Scale className="text-dark-graphite" size={20} strokeWidth={3} />
            </div>
            <AnimatePresence>
              {(isMobile || !sidebarCollapsed) && (
                <motion.span
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -4 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="text-lg font-bold text-white tracking-tight whitespace-nowrap"
                >
                  Equilibra
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2 w-full px-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => isMobile && setIsMobileOpen(false)}
                title={!isMobile && sidebarCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 p-2 rounded-xl transition-all duration-200 group relative overflow-hidden',
                    isActive ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  )
                }
              >
                <div className="w-8 h-8 flex items-center justify-center shrink-0">
                  <item.icon size={22} className="transition-transform duration-200 group-hover:scale-110" />
                </div>
                <AnimatePresence>
                  {(isMobile || !sidebarCollapsed) && (
                    <motion.span
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -4 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="font-medium whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Subtle hover indicator */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-primary transition-all duration-200 group-hover:h-1/2 rounded-r-full" />
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer / Profile Block */}
        <div className="w-full px-2">
          <div className={cn(
            "flex w-full rounded-xl transition-all duration-200 overflow-hidden",
            !isMobile && sidebarCollapsed ? "flex-col items-center gap-2 bg-transparent p-2" : "items-center gap-3 bg-slate-800/40 p-2 border border-slate-700/30"
          )}>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-700 shrink-0 bg-slate-800 flex items-center justify-center">
              {user?.avatarUrl ? (
                <img
                  alt="User profile"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  src={user.avatarUrl}
                />
              ) : (
                <span className="text-xs font-bold text-primary">{user?.name?.charAt(0) || 'U'}</span>
              )}
            </div>

            <AnimatePresence>
              {(isMobile || !sidebarCollapsed) && (
                <motion.div
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -4 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="flex-1 min-w-0 flex items-center justify-between"
                >
                  <div className="flex flex-col min-w-0">
                    <p className="text-sm font-bold text-white truncate">{user?.name || 'Utilizador'}</p>
                    <p className="text-[10px] text-slate-500 truncate">Plano Premium</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => alert('Configurações (em breve)')}
                      className="text-slate-400 hover:text-white transition-all duration-200 p-1.5 hover:bg-slate-700/40 rounded-lg active:scale-95"
                      title="Configurações"
                    >
                      <Settings size={16} />
                    </button>
                    <button
                      onClick={handleLogout}
                      className="text-slate-400 hover:text-red-400 transition-all duration-200 p-1.5 hover:bg-red-500/10 rounded-lg active:scale-95"
                      title="Sair"
                    >
                      <LogOut size={16} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!isMobile && sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                className="flex flex-col gap-2 items-center w-full"
              >
                <div className="w-4 h-px bg-slate-700/50 my-1" />
                <button
                  onClick={() => alert('Configurações (em breve)')}
                  className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-800/50"
                  title="Configurações"
                >
                  <Settings size={18} />
                </button>
                <button
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/10"
                  title="Sair"
                >
                  <LogOut size={18} />
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  );
};
