# 哑铃训练卡

这是一个基于 Vite + React 的移动端训练打卡页面，支持组间休息计时器。

## 本地运行

```bash
npm install
npm run dev
```

## 部署到 GitHub Pages

首次部署前，把远程仓库地址替换为你自己的仓库：

```bash
git init
git add .
git commit -m "Initial workout tracker"
git branch -M main
git remote add origin https://github.com/<你的用户名>/<仓库名>.git
git push -u origin main
npm run deploy
```

`vite.config.js` 会优先读取 `GITHUB_REPOSITORY` 环境变量来生成 GitHub Pages 子路径。使用 `npm run deploy` 时，如果没有设置该变量，默认仓库名为 `workout-tracker`；如果你的仓库不是这个名字，请把配置中的默认值改成实际仓库名，或在 PowerShell 中先执行：

```powershell
$env:GITHUB_REPOSITORY = "你的用户名/你的仓库名"
npm run deploy
```

然后在 GitHub 仓库的 **Settings → Pages** 中，将 **Source** 设为 **Deploy from a branch**，分支选择 `gh-pages`，目录选择 `/ (root)`，保存即可。
