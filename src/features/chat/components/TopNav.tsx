import { useNavigate } from 'react-router-dom';
import type { UserInfo } from '../../../shared/types/user.types';
import { UserAvatarMenu } from '../../../shared/components';
import { Bars3Icon } from '@heroicons/react/24/outline';
import LanguageSwitcher from '../../../shared/components/LanguageSwitcher';

import { useTranslation } from 'react-i18next';

type TopNavProps = {
  user: UserInfo | null;
  onLogout: () => void;
  onEditAvatar: () => void;
  onToggleSidebar: () => void;
};

export default function TopNav({ user, onLogout, onEditAvatar, onToggleSidebar }: TopNavProps) {
  const DEFAULT_AVATAR = '/userlogo.ico';
  const navigate = useNavigate();

  const isAuthed = Boolean(user);

  const { t } = useTranslation('chat');

  return (
    <header className="h-[64px] flex items-center px-4 md:px-6 relative z-20">
      {/* 左侧：侧边栏 + 用户入口 */}
      <div className="flex items-center gap-3">
        <button onClick={onToggleSidebar} className="p-2 rounded-lg hover:bg-black/10 transition">
          <Bars3Icon className="w-6 h-6" />
        </button>

        {isAuthed ? (
          <UserAvatarMenu
            user={{
              nickname: user!.nickname,
              avatar: user!.avatar || DEFAULT_AVATAR,
            }}
            onEditAvatar={onEditAvatar}
            onLogout={onLogout}
          />
        ) : (
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="
              flex items-center gap-2
              px-2 py-1 
              rounded-full
              bg-white/40
              hover:bg-white/60
              transition
            "
          >
            <img
              src={DEFAULT_AVATAR}
              className="w-8 h-8 rounded-full object-cover"
              alt="default avatar"
            />
            {/* 注册登录 */}
            <span className="text-sm text-gray-700 font-medium">{t('topnav.login')}</span>
          </button>
        )}

        {/* 🌍 语言切换：始终可用 */}
        <LanguageSwitcher variant="dark" />
      </div>

      <div className="flex-1" />
    </header>
  );
}
