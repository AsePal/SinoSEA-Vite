import {
  ChatBubbleLeftRightIcon,
  CpuChipIcon,
  InformationCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  SunIcon,
  MoonIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';

import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { useTranslation } from 'react-i18next';
import { fetchChatConversations } from '../../../shared/api/chat';
import type { ChatConversation } from '../types/chat.types';
import type { UserInfo } from '../../../shared/types/user.types';

type SidebarProps = {
  user?: UserInfo | null;
  onClose?: () => void;
  onOpenUserInfo?: () => void;
  onSelectConversation?: (id: string) => void;
  activeConversationId?: string | null;
};

type Lang = 'zh-CN' | 'en-US' | 'vi-VN' | 'th-TH';

const LANGS: { code: Lang; label: string }[] = [
  { code: 'zh-CN', label: '中文' },
  { code: 'en-US', label: 'English' },
  { code: 'vi-VN', label: 'Tiếng Việt' },
  { code: 'th-TH', label: 'ไทย' },
];

function getLangKey(lng: string) {
  if (lng.startsWith('zh')) return 'zh';
  if (lng.startsWith('vi')) return 'vi';
  if (lng.startsWith('th')) return 'th';
  return 'en';
}

export default function Sidebar({
  user,
  onClose,
  onOpenUserInfo,
  onSelectConversation,
  activeConversationId,
}: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation('chat');
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [hasMoreConversations, setHasMoreConversations] = useState(false);
  const [convLoading, setConvLoading] = useState(false);
  const [convError, setConvError] = useState<string | null>(null);
  const langButtonRef = useRef<HTMLDivElement>(null);
  const lastConversationIdRef = useRef<string | null>(null);
  const convLoadingRef = useRef(false);

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

  // 点击外部关闭语言菜单
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langButtonRef.current && !langButtonRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
    };

    if (isLangOpen) {
      document.addEventListener('mousedown', handler);
    }
    return () => document.removeEventListener('mousedown', handler);
  }, [isLangOpen]);

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

  async function switchLang(lang: Lang) {
    const now = i18n.resolvedLanguage || i18n.language;
    if (now === lang) {
      setIsLangOpen(false);
      return;
    }
    localStorage.setItem('lang', lang);
    await i18n.changeLanguage(lang);
    setIsLangOpen(false);
  }

  const loadConversations = useCallback(
    async (reset = false) => {
      if (!user || convLoadingRef.current) return;

      if (reset) {
        lastConversationIdRef.current = null;
        setConversations([]);
        setHasMoreConversations(false);
      }

      setConvError(null);
      setConvLoading(true);
      convLoadingRef.current = true;

      try {
        const data = await fetchChatConversations({
          limit: 20,
          lastId: reset ? undefined : (lastConversationIdRef.current ?? undefined),
        });

        setHasMoreConversations(data.hasMore);
        setConversations((prev) => (reset ? data.items : [...prev, ...data.items]));

        const tailId = data.items.length ? data.items[data.items.length - 1].id : null;
        lastConversationIdRef.current = tailId;
      } catch (err) {
        setHasMoreConversations(false);
        setConvError(t('sidebar.conversationError'));
      } finally {
        setConvLoading(false);
        convLoadingRef.current = false;
      }
    },
    [user, t],
  );

  useEffect(() => {
    if (!user) {
      setConversations([]);
      setHasMoreConversations(false);
      setConvError(null);
      lastConversationIdRef.current = null;
      return;
    }

    loadConversations(true);
  }, [user, loadConversations]);

  const current = i18n.resolvedLanguage ?? i18n.language ?? 'zh-CN';

  const DEFAULT_AVATAR = '/userlogo.ico';
  const isAuthed = Boolean(user);
  const displayName = user?.nickname || t('topnav.login');
  const displayPhone = isAuthed
    ? user?.phone || t('userInfoModal.unboundPhone')
    : t('sidebar.notLoggedIn');

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
        <div className="flex items-center gap-2">
          {/* 语言切换按钮容器 */}
          <div ref={langButtonRef} className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="ui-tooltip p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              aria-label={t('tooltips.toggleLanguage')}
              data-tooltip={t('tooltips.toggleLanguage')}
            >
              <GlobeAltIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            {/* 语言选择窗口 */}
            <AnimatePresence>
              {isLangOpen && (
                <motion.div
                  initial={{ x: -260 }}
                  animate={{ x: 0 }}
                  exit={{ x: -260 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="fixed left-0 top-0 w-[260px] h-full bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-50 flex flex-col"
                >
                  {/* 窗口顶部标题栏 */}
                  <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {t('sidebar.language')}
                    </h2>
                    <button
                      onClick={() => setIsLangOpen(false)}
                      className="ui-tooltip p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                      aria-label={t('tooltips.closeLanguageMenu')}
                      data-tooltip={t('tooltips.closeLanguageMenu')}
                    >
                      <svg
                        className="w-5 h-5 text-gray-600 dark:text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* 语言列表 */}
                  <div className="flex-1 overflow-y-auto px-4 py-4">
                    <div className="space-y-1">
                      {LANGS.map((lang) => {
                        const isActive = current.startsWith(getLangKey(lang.code));
                        return (
                          <button
                            key={lang.code}
                            type="button"
                            onClick={() => switchLang(lang.code)}
                            className={`
                              w-full text-left px-4 py-3 rounded-lg text-sm transition-colors
                              ${
                                isActive
                                  ? 'bg-blue-500 text-white font-medium'
                                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
                              }
                            `}
                          >
                            {lang.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 主题切换按钮 */}
          <button
            onClick={toggleTheme}
            className="ui-tooltip relative p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            aria-label={t('tooltips.toggleTheme')}
            data-tooltip={t('tooltips.toggleTheme')}
          >
            <div className="relative w-5 h-5">
              <motion.div
                key="sun"
                initial={false}
                animate={{
                  scale: themeMode === 'dark' ? 1 : 0,
                  rotate: themeMode === 'dark' ? 0 : -90,
                  opacity: themeMode === 'dark' ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="absolute inset-0"
              >
                <SunIcon className="w-5 h-5 text-amber-500" />
              </motion.div>
              <motion.div
                key="moon"
                initial={false}
                animate={{
                  scale: themeMode === 'light' ? 1 : 0,
                  rotate: themeMode === 'light' ? 0 : 90,
                  opacity: themeMode === 'light' ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="absolute inset-0"
              >
                <MoonIcon className="w-5 h-5 text-indigo-500" />
              </motion.div>
            </div>
          </button>
        </div>
      </div>

      {/* 侧栏用户信息 */}
      <div className="px-4 pt-4">
        <div className="relative">
          <motion.div
            aria-hidden="true"
            layoutId="user-info-card"
            className="
              pointer-events-none
              absolute inset-0
              z-40
              w-full
              flex items-center gap-3
              rounded-xl border border-gray-200 dark:border-gray-700
              px-3 py-2
              bg-white/80
              dark:bg-gray-800/80
              text-left
              opacity-0
            "
          >
            <motion.img
              src={user?.avatar || DEFAULT_AVATAR}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
              layoutId="user-info-avatar"
            />
            <div className="min-w-0">
              <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                {displayName}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {displayPhone}
              </div>
            </div>
          </motion.div>
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
              ui-tooltip w-full
              flex items-center gap-3
              rounded-xl border border-gray-200 dark:border-gray-700
              px-3 py-2
              bg-white/80 hover:bg-white
              dark:bg-gray-800/80 dark:hover:bg-gray-800
              transition-colors
              text-left
            "
            aria-label={isAuthed ? t('tooltips.openUserInfo') : t('tooltips.goLogin')}
            data-tooltip={isAuthed ? t('tooltips.openUserInfo') : t('tooltips.goLogin')}
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
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {displayPhone}
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* 主导航区 */}
      <div className="flex-1 min-h-0 overflow-hidden px-4 py-4 space-y-2">
        {/* 功能导航下拉菜单 */}
        <DropdownMenu
          title={t('sidebar.title')}
          isOpen={isMenuOpen}
          onToggle={() => setIsMenuOpen(!isMenuOpen)}
        >
          <MenuItem
            icon={CpuChipIcon}
            active={location.pathname === '/chat'}
            onClick={() => go('/chat')}
          >
            {t('sidebar.ask')}
          </MenuItem>
          <MenuItem
            icon={InformationCircleIcon}
            active={location.pathname === '/about'}
            onClick={() => go('/about')}
          >
            {t('sidebar.aboutUs')}
          </MenuItem>
          <MenuItem
            icon={ChatBubbleLeftRightIcon}
            active={location.pathname === '/chat/complaint'}
            onClick={() => go('/chat/complaint')}
          >
            {t('sidebar.feedback')}
          </MenuItem>
        </DropdownMenu>

        {/* 历史对话 */}
        <DropdownMenu
          title={t('sidebar.history')}
          isOpen={isHistoryOpen}
          onToggle={() => setIsHistoryOpen(!isHistoryOpen)}
        >
          <div className="h-[calc(100vh-330px)] min-h-[220px] flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto pr-1 space-y-2">
              {!isAuthed && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {t('sidebar.historyLoginTip')}
                </div>
              )}

              {isAuthed && (
                <>
                  {convError && (
                    <div className="text-xs text-red-500 dark:text-red-400">{convError}</div>
                  )}

                  {!convError && !convLoading && conversations.length === 0 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {t('sidebar.noHistory')}
                    </div>
                  )}

                  {conversations.length > 0 && (
                    <ul className="space-y-1">
                      {conversations.map((item) => (
                        <li
                          key={item.id}
                          onClick={() => {
                            onSelectConversation?.(item.id);
                            onClose?.();
                          }}
                          className={`
                          rounded-md border px-3 py-2
                          text-sm transition-colors cursor-pointer
                          ${
                            item.id === activeConversationId
                              ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/40 text-blue-800 dark:text-blue-100'
                              : 'border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 text-gray-800 dark:text-gray-100 hover:border-blue-500 dark:hover:border-blue-400'
                          }
                        `}
                        >
                          <div className="truncate font-medium">
                            {item.title || t('sidebar.untitledConversation')}
                          </div>
                          <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                            {new Date(item.updatedAt).toLocaleString()}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}

                  {convLoading && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {t('sidebar.loadingHistory')}
                    </div>
                  )}
                </>
              )}
            </div>

            {isAuthed && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => loadConversations(false)}
                  disabled={convLoading || (!hasMoreConversations && !convError)}
                  className="
                    w-full text-xs font-medium
                    px-3 py-2
                    rounded-md border border-gray-200 dark:border-gray-700
                    text-gray-700 dark:text-gray-200
                    hover:bg-gray-100 dark:hover:bg-gray-800
                    disabled:opacity-60 disabled:cursor-not-allowed
                  "
                >
                  {convLoading
                    ? t('sidebar.loadingHistory')
                    : !hasMoreConversations && !convError
                      ? t('sidebar.loadedAll')
                      : t('sidebar.loadMore')}
                </button>
              </div>
            )}
          </div>
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
