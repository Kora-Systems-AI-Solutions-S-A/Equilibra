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
import { motion } from 'motion/react';

export const Sidebar = () => {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/app/home' },
  ];

  return (
    <motion.aside 
      animate={{ width: sidebarCollapsed ? 84 : 240 }}
      className="bg-dark-graphite flex flex-col items-center py-8 justify-between shrink-0 h-full fixed left-0 top-0 z-50 border-r border-slate-800/50"
    >
      {/* Toggle Button - Floating Tab */}
      <button 
        onClick={toggleSidebar}
        className={cn(
          "absolute top-[36px] w-5 h-10 bg-dark-graphite border border-slate-800/50 border-l-0 rounded-r-lg flex items-center justify-center shadow-sm text-slate-400 hover:text-white hover:brightness-150 transition-all z-50",
          sidebarCollapsed ? "-right-[12px]" : "-right-[10px]"
        )}
      >
        {sidebarCollapsed ? <ChevronRight size={12} strokeWidth={4} /> : <ChevronLeft size={12} strokeWidth={4} />}
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
              title={sidebarCollapsed ? item.label : undefined}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-4 p-3 rounded-xl transition-colors group',
                  isActive ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:text-white',
                  sidebarCollapsed ? 'justify-center' : 'justify-start'
                )
              }
            >
              <item.icon size={24} />
              {!sidebarCollapsed && (
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
          sidebarCollapsed ? "flex-col" : "bg-slate-800/40 p-3 rounded-2xl border border-slate-700/30"
        )}>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-700 shrink-0">
            <img
              alt="User profile"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBE2WrhyRt6tesOraeKtyBzv3LUoOWznmvIFW_tLWnM17FHR-bHOVpKF6K4Yc5awGwYOr7I_lUhR5s93kYfG4CLB_jo5NPl4olePpNeWJh1dUTD75Lwzb9NRZbspglm1_QUiX01ZWAd-uknUBxgzBoPVWCPvTcy4LqGJYicFSuWTaewgSX1HQCHoTTLuv5dQT0s89qzodskAopwhb2NMRJfDFCtwBw5gPDsl6xI-b6NsN4-EeMOGeo0FN_fV3sDLFQGMMKXOUUccU"
            />
          </div>
          
          {!sidebarCollapsed && (
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

          {sidebarCollapsed && (
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
  );
};
