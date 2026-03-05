import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store/ui.store';
import { 
  LayoutDashboard, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  Scale
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Sidebar = () => {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
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

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/app/home' },
  ];

  const sidebarWidth = sidebarCollapsed ? 84 : 240;
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
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={cn(
          "bg-dark-graphite flex flex-col items-center py-8 justify-between shrink-0 h-full fixed left-0 top-0 z-50 border-r border-slate-800/50",
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

        <div className="flex flex-col items-center w-full gap-10">
          <div className="flex items-center justify-center w-full px-6">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0">
              <Scale className="text-dark-graphite" size={24} strokeWidth={3} />
            </div>
          </div>

          <nav className="flex flex-col gap-4 w-full px-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => isMobile && setIsMobileOpen(false)}
                title={!isMobile && sidebarCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-4 p-3 rounded-xl transition-colors group',
                    isActive ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:text-white',
                    !isMobile && sidebarCollapsed ? 'justify-center' : 'justify-start'
                  )
                }
              >
                <item.icon size={24} />
                {(isMobile || !sidebarCollapsed) && (
                  <span className="font-medium whitespace-nowrap">{item.label}</span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer / Profile Block */}
        <div className="w-full px-4">
          <div className={cn(
            "flex items-center gap-3 w-full transition-all duration-300",
            !isMobile && sidebarCollapsed ? "flex-col" : "bg-slate-800/40 p-3 rounded-2xl border border-slate-700/30"
          )}>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-700 shrink-0">
              <img
                alt="User profile"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBE2WrhyRt6tesOraeKtyBzv3LUoOWznmvIFW_tLWnM17FHR-bHOVpKF6K4Yc5awGwYOr7I_lUhR5s93kYfG4CLB_jo5NPl4olePpNeWJh1dUTD75Lwzb9NRZbspglm1_QUiX01ZWAd-uknUBxgzBoPVWCPvTcy4LqGJYicFSuWTaewgSX1HQCHoTTLuv5dQT0s89qzodskAopwhb2NMRJfDFCtwBw5gPDsl6xI-b6NsN4-EeMOGeo0FN_fV3sDLFQGMMKXOUUccU"
              />
            </div>
            
            {(isMobile || !sidebarCollapsed) && (
              <div className="flex-1 min-w-0 flex items-center justify-between">
                <div className="flex flex-col min-w-0">
                  <p className="text-sm font-bold text-white truncate">Misty</p>
                  <p className="text-[10px] text-slate-500 truncate">Premium Plan</p>
                </div>
                <button 
                  onClick={() => alert('Configurações (em breve)')}
                  className="text-slate-400 hover:text-white transition-colors p-1"
                  title="Configurações"
                >
                  <Settings size={18} />
                </button>
              </div>
            )}

            {!isMobile && sidebarCollapsed && (
              <button 
                onClick={() => alert('Configurações (em breve)')}
                className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800/50"
                title="Configurações"
              >
                <Settings size={20} />
              </button>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  );
};
