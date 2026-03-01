# Playwright 演示自动化测试文档（用于比赛演示，非生产测试代码）

> 说明：本文件用于比赛演示，示例代码为演示用伪代码/最小可运行片段，不代表项目中真实完整的自动化测试实践。请勿将其视为生产级测试用例。

**目标**

- 在比赛演示中，通过自动化脚本快速演示主要功能流程（登录 -> 打开 Chat -> 发送消息 -> 验证界面反馈）。

**仓库相关文件**

- Playwright 配置：`playwright.config.ts`
- 演示入口页面：`index.html`
- 主要前端代码目录：`src/`（示例会引用 `src/features/chat/pages/Chat.tsx` 等）

**环境准备（示例基于 Windows）**

- Node.js (建议 v16+)
- 包管理器：`pnpm`（项目中已使用）

安装依赖（在项目根目录执行）：

```bash
pnpm install
pnpm exec playwright install
```

如果你只想运行演示脚本，也可以先安装 Playwright 测试运行器：

```bash
pnpm add -D @playwright/test
pnpm exec playwright install
```

**演示用示例测试（TypeScript/伪代码）**

- 说明：以下为演示流程的简化测试，用于现场展示「自动打开页面并完成一条消息发送」的过程，未包含断言健壮性、错误处理或并发场景。

```ts
// tests/demo-chat.spec.ts
import { test, expect } from '@playwright/test';

// 演示：从首页进入 Chat 页面并发送一条消息
test('demo: open chat and send message (demo-only)', async ({ page }) => {
  // 1. 打开站点
  await page.goto('http://localhost:5173/');

  // 2. 演示登录（如果项目使用假登录可跳过）
  // 这里使用演示账号的伪流程：点击“登录” -> 输入邮箱 -> 点击登录
  await page.click('text=Login');
  await page.fill('input[name="email"]', 'demo@example.com');
  await page.fill('input[name="password"]', 'demopassword');
  await page.click('button:has-text("Sign in")');

  // 可选：等待登录完成并跳转
  await page.waitForURL('**/chat**');

  // 3. 打开对话窗口（根据项目 UI 调整选择器）
  await page.click('text=Chat');
  await page.waitForSelector('textarea[aria-label="message-input"]');

  // 4. 发送消息
  const demoMessage = '比赛演示：你好，AsePal！';
  await page.fill('textarea[aria-label="message-input"]', demoMessage);
  await page.click('button:has-text("Send")');

  // 5. 演示用简单验证：检查消息气泡出现
  const lastBubble = await page.locator('.message-bubble').last();
  await expect(lastBubble).toContainText(demoMessage);
});
```

**如何运行演示测试**

- 本地启动前端（Vite）：

```bash
pnpm dev
# 或者
pnpm run dev
```

- 在另一个终端运行 Playwright 测试（演示脚本）：

```bash
pnpm exec playwright test tests/demo-chat.spec.ts --headed --project=chromium
```

说明：使用 `--headed` 在有界面模式下展示浏览器窗口，`--project=chromium` 指定 Chromium，便于现场展示。

**演示流程建议（比赛现场）**

- 启动步骤：先本地运行 `pnpm dev` 并确认页面能在 `http://localhost:5173/` 访问。
- 在演示前，确保演示账号/假数据可用，或把登录步骤替换成跳过登录（比如直接打开 `/#/chat`）。
- 运行测试时用 `--headed` 参数，调低或关闭网络拦截以减少延迟。
- 给观众解释：脚本模拟用户操作（点击、输入、发送），并展示页面上实时变化；若需要录屏，可配合 `--trace` 或 Playwright 的录制功能。

**演示脚本的限制与注意事项**

- 本文档与示例仅用于演示，并未替换项目中正式的测试策略。
- 选择器（如 `textarea[aria-label="message-input"]`、`.message-bubble`）需要根据实际项目代码调整。
- 若页面有防机器人或验证码，演示前需安排演示账户绕过或使用测试环境。
- 演示时推荐使用 `--headed`、`slowMo`（Playwright 配置中）以便观众看清每一步。

**可选增强（非必须，用于更好观感）**

- 在 `playwright.config.ts` 中为演示配置：
  - `use: { headless: false, viewport: { width: 1280, height: 720 }, launchOptions: { slowMo: 50 } }`
  - 启用录像或截图保存：`video: 'on'` 或 `trace: 'on'`

示例片段（加入 `playwright.config.ts`）：

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    headless: false,
    viewport: { width: 1280, height: 720 },
    launchOptions: { slowMo: 50 },
    video: 'retain-on-failure',
  },
});
```

**演示检查清单**

- [ ] 本地能正常启动 `pnpm dev` 并访问页面
- [ ] 确认演示账号/数据可用
- [ ] 预演至少一次，确保选择器与页面流程一致
- [ ] 使用 `--headed` 并开启 `slowMo` 以便观众观察

**附：建议的展示台词要点（中文）**

- “现在我将用一个自动化脚本展示从打开页面到在 Chat 里发送消息的完整用户流程。”
- “该脚本会在浏览器中逐步执行点击与输入，最后把消息发送并验证结果。”
- “注意：这仅为展示脚本，并非完整测试覆盖，仅用于比赛演示目的。”

---

如果你希望，我可以：

- 把上面的示例脚本添加到仓库 `tests/demo-chat.spec.ts`（实际文件）并提交；
- 或根据你的演示账号/页面选择器调整脚本选择器以确保演示成功。

请选择下一步操作。
