# AIハーネス設計書（マスター仕様・修正版）— Claude Code優先

## 0. この文書の位置づけ

この文書は **最終成果物ではない**。新規React案件向けに `CLAUDE.md` / `.claude/rules/` / `.claude/skills/` / `.claude/agents/` を**生成するための入力仕様書**。

- 元ネタ: [規約原文素材.md](./規約原文素材.md)（4.1/4.2/4.3/5.1の転記元を集約。旧 `temp/SKILL準備用.md` への依存は解消済み）
- 使い方: 各セクションの「生成指示」を渡して、該当ファイルを1本ずつ（または章単位でまとめて）生成させる。4.1/4.2/4.3/5.1は本文を転記する際に `規約原文素材.md` の対応見出しを参照する。
- 本文は要約・方針のみを記載し、全文転記はしない（転記は生成時に `規約原文素材.md` から展開する）。
- `AGENTS.md` は必須成果物ではない。他のAIツールと規約を共有する必要がある場合に限り、共通規約として設け、`CLAUDE.md` から `@AGENTS.md` でimportする。

## 1. 対象プロジェクトの前提

- 対象: このリポジトリとは別の、新規React案件（詳細未定、PoC段階）
- 想定スタック: React + TypeScript、状態管理は TanStack Query（サーバー状態）+ React Hook Form/Zod（フォーム）
- UI作成の想定フロー: Figmaから生成されたコードを `generated/` 配下へ配置し、構造分析と実装計画を経て `src/` 側へモックReact実装する。
- `generated/` の実際の配置、生成ツール、更新方法、直接編集の可否は現時点では未確定。PoCでは「原則として直接編集しない参照元」として扱い、案件ルール確定後に更新する。
- 想定モノレポ構成（確定ではなく初期案。実際の案件構成が決まり次第更新）:

```text
<project-root>/
├── CLAUDE.md
├── AGENTS.md                         # 任意。複数AIツール間で規約を共有する場合のみ
├── .claude/
│   ├── rules/
│   ├── skills/
│   └── agents/
├── generated/                        # Figma由来の生成コード（配置は未確定）
└── src/ (or apps/<app>/src/)
    └── features/
        └── [機能名]/
            ├── components/
            ├── hooks/
            ├── services/
            ├── types/
            │   ├── *.types.ts
            │   ├── *.schema.ts
            │   └── index.ts
            ├── tests/
            └── index.tsx
```

- ツール: Claude Code を主ターゲットとする。GitHub Copilot等への展開は8章を参照（今回はスコープ外）。

## 2. 命名・配置ルール

| 種別 | 配置 | 命名 |
|---|---|---|
| Claude Code常時ロード規約 | `CLAUDE.md`（ルート直下） | 固定名 |
| AIツール共通規約（任意） | `AGENTS.md`（ルート直下） | 固定名。使用する場合は`CLAUDE.md`からimport |
| 条件付きルール | `.claude/rules/<topic>.md` | kebab-case、1トピック1ファイル |
| Skill | `.claude/skills/<name>/SKILL.md` | kebab-case、ディレクトリ名=スラッシュコマンド名 |
| Subagent | `.claude/agents/<name>.md` | kebab-case、`name`フィールドと一致必須 |

使い分けは以下とする。

- 全作業で常に必要な最小限の指示: `CLAUDE.md`
- 特定のファイルパスに適用する規約: `.claude/rules/`
- 特定タスクの手順・知識・ワークフロー: `.claude/skills/`
- 独立した役割、ツール権限、コンテキストを持たせる作業者: `.claude/agents/`

Subagentのfrontmatterにある `skills:` は `.claude/skills/<name>/SKILL.md` をプリロードするための項目であり、`.claude/rules/` のファイルを指定する項目ではない。Ruleは対象パスに応じて適用されるため、Rule名を `skills:` に記載しない。

## 3. `CLAUDE.md` 生成指示

**役割**: Claude Codeの全セッションで常時ロードする規約。技術スタック・ディレクトリ規約・生成コードの基本方針・利用可能なagent/skillへのポインタのみを軽量に記載し、詳細は各rules/skillsに委譲する。200行未満を目安とする。

**含める内容**:

- プロジェクト概要（1〜2行）
- 技術スタック（React/TS/状態管理ライブラリ）
- `features/[機能名]/{components,hooks,services,types,tests}` のディレクトリ規約（元ネタ: 「Reactレビュー観点」内の「2. 適切なファイルに責務を分離」節のフォルダ構成図）
- `generated/` はFigma由来の生成コードであり、原則として直接編集せず実装時の参照元として扱うこと
- 実装前に生成コードを分析し、計画への人間承認後に実装すること
- 利用可能なagent一覧と役割（generated-code-analyst / plan-writer / react-generator / react-reviewer）と呼び出しタイミング
- 利用可能なskill一覧（react-self-check / analyze-generated-ui / react-feature-pipeline）
- ビルド・テストコマンド（案件確定後に追記）

**含めない内容**: TypeScript/React詳細規約の本文（rulesに委譲）、レビュー観点の詳細（skillに委譲）、各subagentの詳細手順（agentsに委譲）

### 3.1 `AGENTS.md` を併用する場合

複数のAIツールで共通規約を管理する必要がある場合のみ、共通部分を `AGENTS.md` に置く。この場合、`CLAUDE.md` の先頭付近で次のようにimportする。

```markdown
@AGENTS.md

## Claude Code specific rules

<!-- Claude Code固有のagent/skill運用のみを記載 -->
```

Claude Codeのみを対象とするPoCでは、`AGENTS.md` を設けず `CLAUDE.md` に集約してよい。どちらを採用するかは、他AIツールとの共通化方針が確定するまで未確定とする。

## 4. `.claude/rules/` 生成指示

本文は元メモのMarkdownをほぼそのまま採用し、frontmatterのみ `paths:` 形式に変換する。

### 4.1 `typescript.md`

- 元ネタ: [規約原文素材.md](./規約原文素材.md) の「4.1 typescript.md 用原文」
- frontmatter: `paths: ["**/*.ts", "**/*.tsx"]`
- 含める見出し: 型安全の基本 / Interface vs Type Alias / 命名規則 / Generics / ユーティリティ型 / React固有の型 / エラーハンドリング / JSDoc
- 注意: JSDocの「画面IDを記載しない」ルールはこのプロジェクトの画面IDの命名規則が確定してから補記する（要確認事項として明記）

### 4.2 `react-component.md`

- 元ネタ: [規約原文素材.md](./規約原文素材.md) の「4.2 react-component.md 用原文」
- frontmatter: `paths: ["**/*.tsx"]`
- 含める見出し: 基本原則 / コンポーネント設計（単一責任・Props設計・コンポジション） / パフォーマンス最適化 / 状態管理 / ファイル命名 / テスト配置 / アクセシビリティ
- パフォーマンス最適化では、`React.memo` / `useMemo` / `useCallback` の使用自体を品質条件にしない。不要なmemoizationを避け、再レンダー計測、参照同一性が必要な依存関係、計算コスト等の必要性を説明できる場合のみ利用する。
- 元メモにあった `react-design-system` Skillへの参照は、このプロジェクトでは共通UIライブラリが未確定のため、生成時は保留コメントとして残す。

### 4.3 `react-validation.md`

- 元ネタ: [規約原文素材.md](./規約原文素材.md) の「4.3 react-validation.md 用原文」
- frontmatter: `paths: ["**/*.tsx", "**/*.schema.ts"]`
- 含める内容: Zod+RHF方針、画面仕様書制約→Zodスキーマのマッピング表（そのまま転記）

### 4.4 `react-review-summary.md`

- 元ネタ: 「Reactレビュー観点」セクションの「レビュー観点（10項目）」表と「指摘形式」表のみ（詳細補足は含めない）
- frontmatter: `paths: ["**/*.ts", "**/*.tsx"]`
- 役割: 常駐の軽量チェックリスト。詳細は5.1の `react-self-check` Skillを参照させる一文を末尾に入れる。
- memoizationの観点は「使われているか」ではなく、「不要なmemoizationがなく、利用箇所では必要性を説明できるか」とする。

### 4.5 `generated-code.md`

- 新規設計
- frontmatter:

  ```yaml
  ---
  paths:
    - "generated/**/*"
  ---
  ```

- 含める内容:
  - `generated/` 配下はFigma由来の自動生成コードである。
  - 原則として直接編集せず、`src/` 側へ実装する際の参照元として扱う。
  - 業務ロジックを追加しない。
  - `generated/` 配下からアプリケーションロジックを直接参照しない。
  - `generated/` から `src/` へ構造・見た目・振る舞いを移植または再設計する場合は、変更理由と差分を説明する。
  - 解析作業では、コンポーネント構造、Props、State、Event、Style、固定値、Mockデータ、再利用候補、生成コード固有依存、アクセシビリティ、実装上のリスクを確認する。
  - 緊急修正等で直接編集が必要な場合の承認手順は未確定であり、案件ルール確定後に追記する。

## 5. `.claude/skills/` 生成指示

### 5.1 `react-self-check`

- 元ネタ: [規約原文素材.md](./規約原文素材.md) の「5.1 react-self-check Skill 用原文」（詳細補足＝1〜10項目の確認ポイント）
- frontmatter案:

  ```yaml
  name: react-self-check
  description: "Reactコードの詳細レビューチェックリスト。コード品質・責務分離・型・スタイリング・パフォーマンス・XSS観点の確認ポイントを提供する。Use when Reactコードをレビューする、またはreact-reviewer subagentから参照される。"
  ```

- 本文: 10項目それぞれの確認ポイントを元メモからほぼそのまま転記する。
- パフォーマンスの確認ポイントは、不要な `React.memo` / `useMemo` / `useCallback` が導入されていないこと、および導入理由を説明できることへ修正する。
- `react-reviewer` agentの `skills:` フィールドでプリロードされる想定（5.3とは独立して単体でも `/react-self-check` 起動可）。

### 5.2 `analyze-generated-ui`

- 新規設計
- 目的: Figma由来の `generated/` コードを変更せずに分析し、React実装計画の入力となる構造化された分析結果を作成する。
- frontmatter案:

  ```yaml
  name: analyze-generated-ui
  description: "Figma由来のgeneratedコードを読み取り、コンポーネント構造・状態・イベント・スタイル・モックデータ・再利用候補・実装リスクを分析する。Use when generatedコードからReact実装計画を作る前。"
  argument-hint: "[generated配下の対象パス]"
  ```

- 本文の出力形式案:
  1. Component structure
  2. Props
  3. State
  4. User events
  5. Styles and design dependencies
  6. Fixed values and mock data
  7. Reusable components
  8. Generated-code-specific dependencies
  9. Accessibility findings
  10. Risks and open questions
  11. Proposed application structure
- 分析結果の保存先は `.generated-analysis/<feature>.md` を初期案とする。ただし、リポジトリへ残すか一時成果物とするかは未確定であり、PoCで決定する。
- 実行担当として `generated-code-analyst` subagentを利用する。

### 5.3 `react-feature-pipeline`

- 新規設計（元メモには無いが、「Reactのagentを作成するうえで心掛けること」の内容を実行可能な手順に落とし込む）
- 目的: **Figma → `generated/` → 分析 → 計画 → 人間承認 → 実装 → レビュー**を、人間承認ゲート付きで順に実行する手順書。
- 画面仕様書・単体テスト仕様書が存在する場合は、生成コードと併せて分析・計画の入力とする。仕様書の有無と配置は未確定。
- frontmatter案:

  ```yaml
  name: react-feature-pipeline
  description: "Figma由来のgeneratedコードと関連仕様を分析し、人間承認を経てReact機能一式を実装・レビューする一連の手順。Use when generatedコードを起点に新規React機能を実装するとき。"
  disable-model-invocation: true
  argument-hint: "[generated配下の対象パス] [任意: 仕様書パス]"
  ```

- 本文の手順案:
  1. Figmaから出力済みの `generated/` 対象パスと、利用可能な画面仕様書・単体テスト仕様書を確認する。Figmaからの生成操作自体をpipelineに含めるかは未確定とする。
  2. `generated-code-analyst` subagentを起動し、対象を読み取り専用で分析する。
  3. 分析結果を入力として `plan-writer` subagentを起動し、`src/features/[機能名]/` への実装計画を作成する。
  4. 分析結果、要確認事項、実装計画を人間に提示し、明示的な承認を得るまで停止する。
  5. 承認後、`react-generator` subagentを起動し、1つのfeatureを一貫して実装する。PoC初期は内部subagentへの並列委任を行わない。
  6. 完了後、`react-reviewer` subagentを起動し、生成コード、承認済み計画、実装結果を比較しながら `react-self-check` の観点でレビューする。
  7. 指摘（must/should/nit/ask）と、生成コード・計画・実装の主な差分を人間に提示して終了する。

## 6. `.claude/agents/` 生成指示

共通方針: 元メモの「不明点は開発者に確認する」「進捗を定期報告する」は全agent共通の振る舞いとして各system promptの末尾に入れる。ただし、曖昧点を勝手に補完せず、成果物の「要確認事項」に明記する。

### 6.1 `generated-code-analyst`

- frontmatter案:

  ```yaml
  name: generated-code-analyst
  description: "Figma由来のgeneratedコードを読み取り専用で分析し、React実装計画の入力となる構造化された分析結果を作成する。Use when generatedコードから新規機能の実装を始める前。"
  tools: Read, Grep, Glob
  skills: analyze-generated-ui
  ```

- 読み取り専用（Edit/Write/Bash禁止）とし、`generated/` およびアプリ側既存構成を変更しない。
- 分析項目: Component構造 / Props / State / Event / Style / 固定値 / Mockデータ / 再利用候補 / generated固有依存 / アクセシビリティ / アプリ実装時の注意点 / リスク / 要確認事項。
- 分析結果の永続化が必要な場合は、親agentが出力を受け取り `.generated-analysis/<feature>.md` へ保存する。保存方針は未確定。

### 6.2 `plan-writer`

- frontmatter案:

  ```yaml
  name: plan-writer
  description: "generatedコードの分析結果と関連仕様を読み、React実装のタスク分解（ページ/フォーム/テーブル/モーダル/フック/サービス/型/テストの生成計画）を作成する。Use when generated-code-analystの分析完了後。"
  tools: Read, Grep, Glob, Write
  ```

- 役割: 分析結果・生成コード・仕様書を解釈し、計画ファイル（例: `plan.md`）を出力するのみ。コード生成は行わない。
- 計画には、生成コードから維持する事項、アプリ向けに変更する事項、その理由、対象ファイル、テスト方針を含める。
- 不明点・曖昧点がある場合は計画に「要確認事項」として明記し、断定しない。

### 6.3 `react-generator`

- frontmatter案:

  ```yaml
  name: react-generator
  description: "承認済みの計画に基づき、Reactのpage/form/table/modal/hook/service/type/testを機能ディレクトリ直下に生成する。Use when generatedコードの分析とplan-writerの計画が人間に承認された後。"
  tools: Read, Write, Edit, Grep, Glob
  ```

- `.claude/rules/typescript.md`、`.claude/rules/react-component.md`、`.claude/rules/react-validation.md` は対象ファイルパスに応じて適用されるため、frontmatterの `skills:` には記載しない。
- 元ネタの指示を反映:
  - 実装コードは必ず `features/[機能名]/` 直下に生成する。
  - テストコードは `features/[機能名]/tests/` 配下に生成する。
  - `generated/` は参照元として扱い、原則として編集しない。
  - 承認済み計画から逸脱する必要が生じた場合は作業を止め、理由と変更案を人間へ提示する。
  - `React.memo` / `useMemo` / `useCallback` は常用せず、必要性を具体的に説明できる場合のみ利用する。
- **PoC初期方針**: 1つの `react-generator` が1つのfeatureを一貫して実装する。page/form/table/modal/hook/service/type/testを内部subagentへ並列委任する構成は保留する。
- **将来拡張**: feature内の責務・型・Props・命名・状態管理の共有契約が確立し、PoCで効果と整合性を検証できた後に限り、内部subagentへの並列委任と `Agent` ツールの追加を検討する。

### 6.4 `react-reviewer`

- frontmatter案:

  ```yaml
  name: react-reviewer
  description: "generatedコード、承認済み計画、実装結果を比較し、react-self-check観点でmust/should/nit/ask形式の指摘を行う。Use when 実装完了後のセルフレビュー時。"
  tools: Read, Grep, Glob
  skills: react-self-check
  ```

- 読み取り専用（Edit/Write/Bash禁止）とし、修正は人間または `react-generator` に委ねる。
- 実装コード単体だけでなく、次の対応関係を確認する。
  - `generated/` では何が表現されていたか。
  - 承認済み計画では何を維持・変更すると決めたか。
  - 実装結果は計画どおりか。差異がある場合、その理由が記録されているか。
- memoizationは「利用されているか」ではなく、「不要な利用がなく、必要な利用には根拠があるか」をレビューする。

## 7. 生成後の検証・運用ルール

- 生成直後に、利用中のClaude Codeバージョンで有効な検証方法を確認し、agent/skillのfrontmatterパースエラーがないか検証する。具体的な検証コマンドは現時点では未確定であり、導入時の公式仕様に合わせる。
- `CLAUDE.md` は200行未満を目安に保つ。超過した場合は詳細をrules/skillsへ移動する。
- `AGENTS.md` を併用する場合は、共通規約とClaude Code固有規約が重複・矛盾していないことを確認する。
- Rule名をsubagentの `skills:` に指定していないこと、および指定したSkillが `.claude/skills/` に実在することを確認する。
- `generated/` に意図しない変更がないことを実装・レビュー工程で確認する。
- 案件のディレクトリ構成、Figma生成物の配置・更新方法、仕様書の有無、分析結果の保存方針が確定した時点で、1章・3章・4.5節・5.2節・5.3節を実態に合わせて更新する。
- PoCではまず、1 Agentが1 featureを一貫して実装する方式を評価する。並列化は、共有契約と評価指標が定まってから将来拡張として検証する。

## 8. 将来拡張: Copilot（`.github`）対応が必要になった場合

- 共通規約を `AGENTS.md` に置く場合、`CLAUDE.md` から `@AGENTS.md` でimportし、Claude Code固有の運用だけを `CLAUDE.md` に残す。
- `.claude/rules/*.md` の本文を転用する場合は、導入時点のCopilot仕様を確認し、必要な配置・frontmatterへ変換する。
- `.claude/skills/*/SKILL.md` の互換性と検出対象ディレクトリは、導入時点の各ツールの公式仕様で再確認する。
- `.claude/agents/*.md` を他ツール向けagentへ変換する場合は、tools名、権限モデル、Skillのプリロード方法、人間承認ゲートの互換性を確認する。
- 本章の具体的な変換ルールは、GitHub Copilot等への展開方針が決まるまで未確定とする。

## 9. PoCでの確認事項

PoCでは、次の事項を確定させる。

- `generated/` の正式な配置、生成単位、更新方法、直接編集可否
- Figmaからのコード生成操作をpipelineの対象に含めるか
- 画面仕様書・単体テスト仕様書の有無と配置
- `.generated-analysis/` と計画ファイルをリポジトリへ保存するか、一時成果物とするか
- `AGENTS.md` を複数AIツール向け共通規約として採用するか
- ビルド、lint、テスト、型チェックの正式コマンド
- 共通UIライブラリ、デザインシステム、画面ID・機能IDの命名規則
- 実装時間、レビュー指摘数、手戻り数、人間による修正量などのPoC評価指標
- 内部subagentによる並列実装へ進むための共有契約と判定基準
