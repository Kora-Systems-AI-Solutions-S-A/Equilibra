import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';
import { useNotificationStore, NotificationType } from '@/store/notification.store';

const iconMap: Record<NotificationType, React.ReactElement> = {
    success: <CheckCircle2 className="text-emerald-500" size={20} />,
    warning: <AlertTriangle className="text-amber-500" size={20} />,
    error: <AlertCircle className="text-red-500" size={20} />,
    info: <Info className="text-blue-500" size={20} />,
};

const themeMap: Record<NotificationType, { bgColor: string; borderColor: string; textColor: string }> = {
    success: {
        bgColor: 'bg-emerald-100',
        borderColor: 'border-emerald-200',
        textColor: 'text-emerald-900',
    },
    warning: {
        bgColor: 'bg-amber-100',
        borderColor: 'border-amber-200',
        textColor: 'text-amber-900',
    },
    error: {
        bgColor: 'bg-red-100',
        borderColor: 'border-red-200',
        textColor: 'text-red-900',
    },
    info: {
        bgColor: 'bg-blue-100',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-900',
    },
};

export const NotificationContainer: React.FC = () => {
    const { notifications, hideNotification } = useNotificationStore();

    return (
        <div className="fixed top-8 right-8 z-[9999] flex flex-col gap-3 pointer-events-none">
            <AnimatePresence>
                {notifications.map((notification) => {
                    const theme = themeMap[notification.type];
                    return (
                        <motion.div
                            key={notification.id}
                            layout
                            initial={{ opacity: 0, x: 50, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                            className={`pointer-events-auto flex items-center gap-3 p-4 rounded-xl border shadow-lg w-80 ${theme.bgColor} ${theme.borderColor}`}
                            style={{
                                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)'
                            }}
                        >
                            <div className="flex-shrink-0">{iconMap[notification.type]}</div>
                            <p className={`text-sm font-bold ${theme.textColor} flex-1`}>
                                {notification.message}
                            </p>
                            <button
                                onClick={() => hideNotification(notification.id)}
                                className={`p-1 rounded-lg transition-colors flex-shrink-0 hover:bg-black/5`}
                            >
                                <X size={16} className={`${theme.textColor} opacity-60`} />
                            </button>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
};
