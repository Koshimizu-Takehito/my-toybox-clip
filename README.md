# my-toybox-clip

App Clip / Universal Link 用のランディング（GitHub Pages プロジェクトサイト）。  
公開 URL: `https://koshimizu-takehito.github.io/my-toybox-clip/`（`/<screen-id>/` が各デモ画面）。

## Associated Domains（AASA）

[apple-app-site-association](https://koshimizu-takehito.github.io/.well-known/apple-app-site-association) は [.well-known](https://github.com/Koshimizu-Takehito/.well-known) リポジトリで配信しています。`/my-toybox-clip/*` と一致するよう `paths` を維持してください。

## 新規デモページの追加

1. [my-toybox の `RouteCatalog.availableRoutes`](https://github.com/Koshimizu-Takehito/my-toybox/blob/main/Packages/Sources/MyToyboxScreens/RouteCatalog.swift) と **同じ `Screen.rawValue`** 名で、リポジトリ直下に `<screen-id>/index.html` を追加する（`layout: clip_landing`、`title` / 必要なら `clip_screen_id` をフロントマターに含める）。
2. **同じ ID** を [`_data/clip_screens.yml`](_data/clip_screens.yml) の `ids` リストに追加する（ホームの `?screen=` 用バナーで参照します）。

公開ページでは開発者向けの細部（パス形式や Jekyll 設定ファイル名）は説明しません。運用の詳細はこの README に集約しています。

## 日英表示（同一 URL）

利用者向け文言は [`_data/clip_i18n.yml`](_data/clip_i18n.yml) の **`ja` / `en` を同じキー構造で**編集します。新規文言を足すときは **必ず両言語**を揃えてください。

- **キー**: ドット区切りで参照されます（例: `home.banner.title`）。HTML 側は `data-i18n` / `data-i18n-html`（HTML 断片が必要なときのみ）に同じパスを書きます。
- **言語の決まり方**: `localStorage` キー `clip_lang`（`ja` | `en`）→ なければブラウザの `navigator.languages` で `ja` / `en` を推定 → それ以外は `ja`。
- **英語初回のチラつき**: `en` のときだけ `html.clip-i18n-boot` で本文を一瞬非表示にし、`assets/js/clip-locale.js` 適用後に表示します。
- **リンクを含む文**: `data-i18n-html` と `__BASE__` プレースホルダ（404 のホーム URL 等）を使えます。信頼できる静的ソースのみで使うこと。

README（開発者向け）や `meta.title_404` など未使用キーがあっても害はありませんが、整理したい場合は削除可です。

## App Store ID（`_config.yml`）

`mytoybox.app_store_id` に数値の Apple ID を設定すると、Smart App Banner と App Store ボタンが表示されます。未設定時は利用者向けに「入手先案内は準備中」とだけ出ます。

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
