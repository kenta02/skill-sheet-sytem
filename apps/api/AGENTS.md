# バックエンド方針

## 現在の構成

- NestJS + TypeScript（ESM／NodeNext）、Prisma + PostgreSQL。相対importは既存実装に合わせて`.js`拡張子を付ける。
- 現在は基本のApp Controller／Serviceと`src/prisma/prisma.service.ts`が中心で、feature-first構成やUseCase／Repositoryはまだ未実装。
- Prisma定義は`prisma/schema.prisma`、接続・Migration設定は`prisma.config.ts`。`DATABASE_URL`を使用し、PrismaServiceは`@prisma/adapter-pg`で接続する。
- Prisma Clientの生成先は`src/generated/prisma`。生成コードを直接編集しない。

## 機能実装時の責務

- 新しい業務機能はfeature-firstでまとめ、基本フローを`Controller -> UseCase -> Repository -> Prisma -> PostgreSQL`とする。
- ControllerはHTTP入出力・レスポンス変換などのHTTP境界に集中する。Prisma ModelをそのままAPI Responseにせず、公開項目を明示したレスポンス型へ変換する。
- UseCaseはアプリケーションフローを担当し、複数DB操作の整合性が必要な場合のトランザクション境界候補とする。
- RepositoryはDBアクセスに集中する。不要なRepository interfaceやClean Architectureの追加レイヤーを作らない。
- Serviceは再利用する業務ロジックが実際に必要な場合のみ追加する。既存のAppService／PrismaServiceを理由なく作り直さない。
- 日本語コメントは、意図や理由の説明が必要な箇所に限定する。

## DB・Migration

- 主キーはUUID。Prismaのフィールドは既存のcamelCaseに合わせ、DBカラムは`@map`等でsnake_caseに対応させる。
- 年月データは`DATE`（`@db.Date`）で月初日固定とする。生年月日など、年月ではない日付にはこの固定ルールを適用しない。
- 重要な整合性は必要に応じてPostgreSQL側でも保証する。Prismaで表現できないCHECK制約はMigration SQLで補う。
- 既存Migrationには人数・期間・ステータスと終了月・月初日のCHECK制約がある。schemaだけでなくSQLも確認し、制約を維持する。
- 適用済みMigrationを直接編集しない。変更は新しいMigrationで追加し、適用状況が不明な場合は確認事項として残す。

## 検証

- 変更に応じて`pnpm --filter api build`、`lint`、`test`を実行する。HTTP経路の検証には`test:e2e`を使用する（Vitest）。
- フォーマットは既存のPrettier設定に合わせる。`format`は書き込みを行うため、無関係なファイルを変更しない。
