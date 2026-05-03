# my-toybox-clip

App Clip / Universal Link 用のランディング（GitHub Pages プロジェクトサイト）。  
公開 URL: `https://koshimizu-takehito.github.io/my-toybox-clip/`（`/<screen-id>/` が各デモ画面）。

[apple-app-site-association](https://koshimizu-takehito.github.io/.well-known/apple-app-site-association) は **引き続き** [`.well-known`](https://github.com/Koshimizu-Takehito/.well-known) リポジトリで配信。パスは `/my-toybox-clip/*` に一致。

## 新規画面ページの追加

[iOS `ClipScreenCatalog`](https://github.com/Koshimizu-Takehito/my-toybox) の `clips` と **同じ `clip_screen_id`** で、このリポジトリ直下に `<clip_screen_id>/index.html` を追加する（`layout: clip_landing`）。

## GitHub リポジトリ作成・Pages（初回）

1. GitHub でリポジトリ `my-toybox-clip` を作成（Public）。
2. このディレクトリを push：`git remote add origin …` → `git push -u origin main`
3. **Settings → Pages** で **Deploy from branch**、`main` / **root**（Jekyll は GitHub がビルド）。

## ローカルで Jekyll

```bash
cd my-toybox-clip
bundle install   # 初回のみ
bundle exec jekyll serve --baseurl /my-toybox-clip
```

ブラウザ: `http://127.0.0.1:4000/my-toybox-clip/`
