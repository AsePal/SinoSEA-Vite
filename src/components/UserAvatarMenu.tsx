import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { UserInfo } from '../types/user';


export default function UserAvatarMenu({
    user,
    onEditAvatar,
}: {
    user: UserInfo;
    onEditAvatar: () => void;
}) {

    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // 点击外部自动关闭
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div ref={containerRef} className="relative">
            {/* 头像 */}
            <button
                type="button"
                onClick={() => setOpen(v => !v)}
                className=" flex items-center gap-3 px-2 py-1 rounded-lg hover:bg-white/10 transition"
            >
                <img
                    src={user.avatar || '/images/default-avatar.png'}
                    alt="avatar"
                    className="w-9 h-9 rounded-full object-cover"
                />

                <span className="font-semibold text-orange-300 whitespace-nowrap">
                    {user.nickname}
                </span>
            </button>


            {/* 下拉菜单 */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={{
                            type: 'spring',
                            stiffness: 320,
                            damping: 22,
                        }}
                        className=" absolute left-0 top-full mt-2  w-64 
                        rounded-xl bg-white shadow-lg border z-[9999] "
                    >
                        {/* 用户信息 */}
                        <div className="px-4 py-4 border-b text-center">
                            <div className="flex justify-center mb-2">
                                <img
                                    src={user.avatar || '../public/userlogo.ico'}
                                    className="w-14 h-14 rounded-full object-cover"
                                />
                            </div>
                            <div className="font-semibold text-gray-800">
                                {user.nickname}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                                用户信息
                            </div>
                        </div>

                        {/* 操作区 */}
                        <div className="py-4 px-3">
                            <MenuItem
                                label="修改头像"
                                onClick={() => {
                                    console.log('🔥 点击了修改头像');
                                    setOpen(false);      // ① 关闭菜单
                                    onEditAvatar();     // ② 通知父组件
                                }}
                            />
                            <MenuItem label="修改昵称" />
                            <MenuItem label="修改手机号" />
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function MenuItem({
    label,
    onClick,
}: {
    label: string;
    onClick?: () => void;
}) {

    return (
        <button
            type="button"
            onClick={onClick}
            className="  w-full px-4 py-2 text-sm text-left
             text-gray-700 hover:bg-gray-100
                transition-colors
            "
        >
            {label}
        </button>

    );
}
