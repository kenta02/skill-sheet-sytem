# フロントエンド方針

## 現在の構成

- React + TypeScript + Vite。`vite.config.ts`は`@vitejs/plugin-react`を使用する。
- エントリは`src/main.tsx`、ルート画面は`src/App.tsx`。現在は簡単な画面とCSSが中心で、ルーティング・フォーム・API連携の構成は未実装。
- 既存のコンポーネント構成・命名・CSSの使い方に合わせる。将来の構成を見越したディレクトリや仕組みを先に増やさない。

## 実装方針

- 型安全性を優先し、`any`や型アサーションを安易に使わない。外部入力は必要に応じて検証する。
- API呼び出し処理をUIコンポーネントへ直接埋め込みすぎない。画面コンポーネントは必要に応じて表示と処理を分け、肥大化を防ぐ。
- 不要なグローバルステート管理・custom hook・共通化を増やさない。実際の再利用や責務分離に必要な範囲で導入する。
- 検証には`pnpm --filter web build`と`pnpm --filter web lint`を使用する。現時点でテスト用scriptはない。

## 確認事項

- React Router／React Hook Form／Zod／TanStack Query／MUIは現在未導入。必要な機能を実装する際に導入方針を確認する。
- 導入時の確認対象：フォームはReact Hook Form + Zod、Server StateはTanStack Query、ルーティングはReact Routerとする方針、およびMUIの利用範囲・スタイル規約。確定前に導入済みの前提でコードを書かない。
