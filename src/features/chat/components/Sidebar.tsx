import {
  ChatBubbleLeftRightIcon,
  CpuChipIcon,
  InformationCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  SunIcon,
  MoonIcon,
} from '@heroicons/react/24/outline';

import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import type { UserInfo } from '../../../shared/types/user.types';

type SidebarProps = {
  user?: UserInfo | null;
  onClose?: () => void;
  onOpenUserInfo?: () => void;
};

export default function Sidebar({ user, onClose, onOpenUserInfo }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation('chat');
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  // 主题状态：只支持 'light' | 'dark'，默认为 'light'
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('themeMode');
    return (saved as 'light' | 'dark') || 'light';
  });

  // 应用主题
  useEffect(() => {
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  function go(path: string) {
    navigate(path);
    onClose?.();
  }

  function toggleTheme() {
    // 在 light 和 dark 之间切换
    const newMode = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(newMode);
    localStorage.setItem('themeMode', newMode);
  }

  const DEFAULT_AVATAR = '/userlogo.ico';
  const isAuthed = Boolean(user);
  const displayName = user?.nickname || t('topnav.login');
  const displayPhone = user?.phone || '未绑定手机号';

  return (
    <aside
      className="
        h-full
        w-[260px]
        flex flex-col
        bg-gray-50 dark:bg-gray-900
        border-r border-gray-200 dark:border-gray-700
      "
    >
      {/* 侧栏标题 */}
      <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Asepal</h1>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle theme"
        >
          {themeMode === 'dark' ? (
            <SunIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          ) : (
            <MoonIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          )}
        </button>
      </div>

      {/* 侧栏用户信息 */}
      <div className="px-4 pt-4">
        <button
          type="button"
          onClick={() => {
            if (isAuthed) {
              onOpenUserInfo?.();
            } else {
              navigate('/login');
              onClose?.();
            }
          }}
          className="
            w-full
            flex items-center gap-3
            rounded-xl border border-gray-200 dark:border-gray-700
            px-3 py-2
            bg-white/80 hover:bg-white
            dark:bg-gray-800/80 dark:hover:bg-gray-800
            transition-colors
            text-left
          "
        >
          <img
            src={user?.avatar || DEFAULT_AVATAR}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
          />
          <div className="min-w-0">
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
              {displayName}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{displayPhone}</div>
          </div>
        </button>
      </div>

      {/* 主导航区 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {/* 功能导航下拉菜单 */}
        <DropdownMenu
          title="功能导航"
          isOpen={isMenuOpen}
          onToggle={() => setIsMenuOpen(!isMenuOpen)}
        >
          {/* 询问星洲 */}
          <MenuItem
            icon={CpuChipIcon}
            active={location.pathname === '/chat'}
            onClick={() => go('/chat')}
          >
            {t('sidebar.ask')}
          </MenuItem>
          {/* 关于星洲 */}
          <MenuItem
            icon={InformationCircleIcon}
            active={location.pathname === '/landing'}
            onClick={() => go('/landing')}
          >
            {t('sidebar.about')}
          </MenuItem>
          {/* 关于我们 */}
          <MenuItem
            icon={InformationCircleIcon}
            active={location.pathname === '/about'}
            onClick={() => go('/about')}
          >
            {t('sidebar.aboutUs')}
          </MenuItem>
          {/* 投诉反馈 */}
          <MenuItem
            icon={ChatBubbleLeftRightIcon}
            active={location.pathname === '/chat/complaint'}
            onClick={() => go('/chat/complaint')}
          >
            {t('sidebar.feedback')}
          </MenuItem>
          {/* 聊天室（敬请期待） */}
          <MenuItem icon={ChatBubbleLeftRightIcon} disabled>
            {t('sidebar.chatroom')}
            <span className="ml-1 text-xs opacity-70">{t('sidebar.comingSoon')}</span>
          </MenuItem>
        </DropdownMenu>
      </div>
    </aside>
  );
}

function DropdownMenu({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  const childrenArray = Array.isArray(children) ? children : [children];

  return (
    <div className="space-y-1">
      <button
        onClick={onToggle}
        className="
          w-full flex items-center justify-between
          px-3 py-2 rounded-md
          text-sm font-medium text-gray-700 dark:text-gray-300
          hover:bg-gray-200 dark:hover:bg-gray-800
          transition-colors
        "
      >
        <span>{title}</span>
        {isOpen ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
      </button>
      <div
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${isOpen ? 'max-h-[600px] mt-1' : 'max-h-0'}
        `}
      >
        <div className="space-y-1">
          {childrenArray.map((child, index) => (
            <div
              key={index}
              className={`
                transition-all duration-300 ease-out
                ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}
              `}
              style={{
                transitionDelay: isOpen ? `${index * 50}ms` : '0ms',
              }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MenuItem({
  icon: Icon,
  active,
  disabled,
  onClick,
  children,
}: {
  icon: any;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`
        flex items-center gap-3
        px-3 py-2 rounded-md
        text-sm
        transition-colors
        ${
          active
            ? 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
            : disabled
              ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer'
        }
      `}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === 'Enter' || e.key === ' ') onClick?.();
      }}
    >
      <Icon className="w-5 h-5 shrink-0 opacity-80" />
      <span>{children}</span>
    </div>
  );
}
