/**
 * Token 测试工具函数 - 用于浏览器控制台测试登录过期功能
 *
 * 使用方式：
 * 1. F12 打开浏览器控制台
 * 2. 复制下面的函数代码到控制台执行
 * 3. 执行 expireTokenNow() 让 token 立即过期
 */

/**
 * 让当前的 token 立即过期
 * 使用场景：测试登录过期提示功能
 */
export function expireTokenNow() {
  const token = localStorage.getItem('auth_token');

  if (!token) {
    console.warn('❌ 未找到 token，请先登录');
    return;
  }

  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('❌ Invalid token format');
      return;
    }

    const [header, _, signature] = parts;

    // 创建新的过期 payload（1小时前过期）
    const expiredPayload = {
      exp: Math.floor(Date.now() / 1000) - 3600,
      // 保持原有的其他字段（如果有的话）
    };

    const encodedPayload = btoa(JSON.stringify(expiredPayload))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    const fakeExpiredToken = `${header}.${encodedPayload}.${signature}`;
    localStorage.setItem('auth_token', fakeExpiredToken);

    console.log('✅ Token 已设为过期');
    console.log('📋 新 Token:', fakeExpiredToken);
    console.log('⏱️  过期时间: 1小时前');
    console.log('🔄 页面将在 2 秒后刷新...');

    setTimeout(() => {
      window.location.reload();
    }, 2000);
  } catch (error) {
    console.error('❌ 修改 token 失败:', error);
  }
}

/**
 * 让当前 token 在指定秒数后过期
 * @param seconds 多少秒后过期（默认 30 秒）
 */
export function expireTokenIn(seconds = 30) {
  const token = localStorage.getItem('auth_token');

  if (!token) {
    console.warn('❌ 未找到 token，请先登录');
    return;
  }

  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('❌ Invalid token format');
      return;
    }

    const [header, _, signature] = parts;

    // 创建新的 payload，在指定秒数后过期
    const futurePayload = {
      exp: Math.floor(Date.now() / 1000) + seconds,
    };

    const encodedPayload = btoa(JSON.stringify(futurePayload))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    const newToken = `${header}.${encodedPayload}.${signature}`;
    localStorage.setItem('auth_token', newToken);

    console.log(`✅ Token 将在 ${seconds} 秒后过期`);
    console.log('📋 新 Token:', newToken);
    console.log(`⏱️  过期时间: ${new Date(Date.now() + seconds * 1000).toLocaleString()}`);
  } catch (error) {
    console.error('❌ 修改 token 失败:', error);
  }
}

/**
 * 清空 token 并重新登录
 */
export function clearTokenAndReload() {
  localStorage.removeItem('auth_token');
  console.log('✅ Token 已清空，页面刷新中...');
  setTimeout(() => {
    window.location.reload();
  }, 1000);
}

/**
 * 查看当前 token 的过期信息
 */
export function checkTokenExpiry() {
  const token = localStorage.getItem('auth_token');

  if (!token) {
    console.warn('❌ 未找到 token');
    return;
  }

  try {
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = JSON.parse(atob(base64));

    if (!json.exp) {
      console.warn('⚠️  Token 中没有 exp 字段');
      return;
    }

    const expTime = new Date(json.exp * 1000);
    const now = new Date();
    const isExpired = now >= expTime;
    const diffMs = json.exp * 1000 - Date.now();
    const diffMins = Math.floor(diffMs / 1000 / 60);

    console.log('📊 Token 过期信息:');
    console.log(
      `  签发时间 (iat): ${json.iat ? new Date(json.iat * 1000).toLocaleString() : '未知'}`,
    );
    console.log(`  过期时间 (exp): ${expTime.toLocaleString()}`);
    console.log(`  状态: ${isExpired ? '❌ 已过期' : '✅ 有效'}`);

    if (!isExpired) {
      console.log(`  剩余时间: ${diffMins} 分钟`);
    }
  } catch (error) {
    console.error('❌ 解析 token 失败:', error);
  }
}

// 在全局挂载，方便在控制台调用
declare global {
  interface Window {
    $expireToken: typeof expireTokenNow;
    $expireTokenIn: typeof expireTokenIn;
    $clearToken: typeof clearTokenAndReload;
    $checkToken: typeof checkTokenExpiry;
  }
}

if (typeof window !== 'undefined') {
  window.$expireToken = expireTokenNow;
  window.$expireTokenIn = expireTokenIn;
  window.$clearToken = clearTokenAndReload;
  window.$checkToken = checkTokenExpiry;

  console.log(`
╔════════════════════════════════════════════════════════╗
║        🔐 Token 测试工具已加载                         ║
╚════════════════════════════════════════════════════════╝

使用方式（在控制台中直接调用）：

  • $expireToken()           - 让 token 立即过期
  • $expireTokenIn(60)       - 让 token 在 60 秒后过期
  • $checkToken()            - 查看 token 过期信息
  • $clearToken()            - 清除 token 并重载页面

例：在控制台输入 $expireToken() 然后按 Enter
═══════════════════════════════════════════════════════
  `);
}
