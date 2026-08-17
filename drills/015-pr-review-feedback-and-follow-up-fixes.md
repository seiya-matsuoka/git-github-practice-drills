# 015. Pull Request のレビュー指摘に追加修正する

> Pull Request 作成後にレビューコメントを確認し、同じ作業 branch へ追加修正を commit・push して対応する

## 想定シチュエーション

Team Portal の更新情報に優先度を追加する変更を実装し、Pull Request を作成した。  
Pull Request の確認中に、実装内容について追加修正してほしい点が見つかった。  
最初のレビュー指摘では、データ上の `high` / `normal` がそのまま表示されているため、日本語の表示名へ変換するよう求められた。  
その修正を同じ作業 branch に追加 commit して push した後、さらに優先度の値の意味をドキュメントへ記載するよう指摘された。  
2つ目の指摘にも追加 commit で対応し、Pull Request 上で修正内容を確認してから各 conversation を解決する。  
最後に Pull Request を merge し、ローカルの `main` と branch を整理する。

この課題では、Pull Request を作成して終わりではなく、レビュー指摘を受けて追加修正を行い、同じ Pull Request を更新しながら merge まで進める流れを確認する。

```text
初回実装・commit・push
↓
Pull Request を作成
↓
レビューコメントを追加
↓
追加修正を commit・push
↓
Pull Request の更新を確認
↓
追加のレビューコメントへ対応
↓
conversation を解決
↓
merge
↓
ローカル main の同期と branch 整理
```

## この課題の目的

この課題では、Pull Request のレビュー指摘に追加修正する流れとして、次の内容を確認する。

- 作業 branch で初回実装を行う
- 変更を commit・push して Pull Request を作成する
- Pull Request の `Files changed` で差分を確認する
- 変更行へ line comment を追加する
- レビュー指摘を確認してローカルで追加修正する
- 追加修正を新しい commit として記録する
- 同じ作業 branch へ push して Pull Request を更新する
- Pull Request 上で追加 commit と差分を確認する
- レビューコメントへ返信する
- 対応済みの conversation を解決する
- 複数回のレビュー指摘へ順番に対応する
- Pull Request を merge する
- merge 後の `main` を同期し、branch を整理する

## 使用する主な操作

- status / diff
- branch の作成・切り替え
- add / commit / push
- Pull Request の作成
- `Files changed` の確認
- line comment の追加
- review feedback への追加修正
- comment への返信
- conversation の解決
- Pull Request の merge
- pull
- branch の削除
- prune

## 事前状態

この課題は、次の状態から開始する想定とする。

- 014 の課題が完了している
- 現在の branch は `main`
- 作業ツリーは clean
- `origin` が設定されている
- ローカルの `main` が `origin/main` を tracking している
- `practice/team-portal/` が存在する
- `practice/team-portal/data/updates.json` が存在する
- `practice/team-portal/src/app.js` が存在する
- `practice/team-portal/styles.css` が存在する
- `practice/team-portal/docs/project-overview.md` が存在する
- 更新情報には `owner` が存在する
- 更新カードでは担当チームが表示される想定になっている

この課題で変更するファイルは次の通り。

```text
practice/
  team-portal/
    data/
      updates.json
    docs/
      project-overview.md
    src/
      app.js
    styles.css
```

## 課題内容

この課題では、更新情報に優先度を追加する初回実装を行い、Pull Request 作成後に2回のレビュー指摘へ追加修正で対応する。

### 1. 作業 branch を作成する

`main` が最新状態であることを確認した後、次の作業 branch を作成する。

```text
feature/add-update-priority
```

### 2. 更新情報に優先度を追加する

#### `practice/team-portal/data/updates.json`

各更新情報へ `priority` を追加する。  
追加する値は次の通り。

```text
id: 1 → high
id: 2 → normal
id: 3 → normal
id: 4 → high
id: 5 → normal
id: 6 → normal
```

1件目の変更例：

```json
{
  "id": 1,
  "title": "v1.4.0 をリリースしました",
  "summary": "ダッシュボードの表示速度を改善し、更新情報の表示を整理しました。",
  "category": "release",
  "date": "2026-07-08",
  "owner": "Product Team",
  "priority": "high"
}
```

残りのデータにも同じ位置へ `priority` を追加する。

#### `practice/team-portal/src/app.js`

`createUpdateCard` 内で、担当チームを作成している処理の後に優先度表示を追加する。

```javascript
const priority = document.createElement("p");
priority.className = "update-card__priority";
priority.textContent = update.priority;
```

カードへ要素を追加している処理を変更する。

変更前：

```javascript
meta.append(category, date);
article.append(meta, title, summary, owner);
```

変更後：

```javascript
meta.append(category, date);
article.append(meta, title, summary, owner, priority);
```

#### `practice/team-portal/styles.css`

担当チーム表示のスタイル付近に、次の定義を追加する。

```css
.update-card__priority {
  margin: 8px 0 0;
  color: #64748b;
  font-size: 0.8rem;
  font-weight: 700;
}
```

### 3. 初回実装を commit・push する

3ファイルの変更状態と差分を確認し、1つの commit にまとめる。

commit message：

```text
feat: 更新情報に優先度を追加
```

作業 branch を GitHub へ push し、tracking branch を設定する。

### 4. Pull Request を作成する

GitHub 上で、次の Pull Request を作成する。

base branch：

```text
main
```

compare branch：

```text
feature/add-update-priority
```

Pull Request title：

```text
feat: 更新情報に優先度を追加
```

Pull Request body：

```markdown
## Summary

- 更新情報データに優先度を追加
- 更新カードに優先度を表示
- 優先度表示用のスタイルを追加

## Checks

- [x] 6件の更新情報に `priority` が追加されている
- [x] `app.js` に優先度表示の処理が追加されている
- [x] 優先度表示用の CSS が追加されている
```

Pull Request 作成後、`Commits` と `Files changed` を確認する。  
この時点では merge しない。

### 5. 1つ目のレビュー指摘を追加する

Pull Request の `Files changed` で `practice/team-portal/src/app.js` を開く。  
次の行へ、レビュー指摘を想定した line comment を追加する。

```javascript
priority.textContent = update.priority;
```

comment：

```text
`high` / `normal` がそのまま表示されるため、利用者向けの日本語表記へ変換してください。
```

この課題では、別アカウントによる review を必須とせず、自分で追加した comment をレビュー指摘として扱う。  
comment を追加した後、ローカルで修正作業へ戻る。

### 6. 1つ目のレビュー指摘へ追加修正する

`practice/team-portal/src/app.js` の `categoryLabels` の後に、次の定義を追加する。

```javascript
const priorityLabels = {
  high: "高",
  normal: "通常",
};
```

優先度を表示している処理を変更する。

変更前：

```javascript
priority.textContent = update.priority;
```

変更後：

```javascript
priority.textContent = `優先度: ${priorityLabels[update.priority] ?? update.priority}`;
```

差分を確認し、レビュー指摘への修正だけを追加 commit にする。

commit message：

```text
fix: 優先度の表示名を整える
```

同じ作業 branch へ push する。  
push 後、GitHub 上の同じ Pull Request に新しい commit と差分が追加されていることを確認する。

### 7. 1つ目のレビューコメントへ返信する

1つ目の review comment へ、次の内容で返信する。

```text
対応しました。`high` / `normal` を日本語の表示名へ変換するよう修正しました。
```

修正内容が Pull Request 上で確認できたら、この conversation はまだ解決せず、2つ目のレビュー指摘へ進む。

### 8. 2つ目のレビュー指摘を追加する

Pull Request の `Files changed` で `practice/team-portal/data/updates.json` を確認する。  
追加した `priority` の行へ、次の line comment を追加する。

```text
`priority` で使用する値の意味が分かるように、ドキュメントへ `high` / `normal` の定義を追記してください。
```

### 9. 2つ目のレビュー指摘へ追加修正する

`practice/team-portal/docs/project-overview.md` の更新情報に関する説明へ、次の内容を追記する。

```markdown
### 優先度

`priority` には次の値を使用する。

- `high`: 優先度が高い更新情報
- `normal`: 通常の更新情報
```

差分を確認し、この変更だけを追加 commit にする。

commit message：

```text
docs: 更新情報の優先度定義を追記
```

同じ作業 branch へ push する。  
push 後、Pull Request に3つの commit が含まれていることを確認する。

### 10. レビューコメントへ返信して conversation を解決する

2つ目の review comment へ、次の内容で返信する。

```text
対応しました。`priority` で使用する値と意味をドキュメントへ追記しました。
```

1つ目と2つ目の review comment について、修正内容が確認できたものから `Resolve conversation` を実行する。  
すべてのレビュー指摘が対応済みになっていることを確認する。

### 11. Pull Request を merge する

Pull Request の `Commits` で、次の3つの commit が含まれていることを確認する。

```text
feat: 更新情報に優先度を追加
fix: 優先度の表示名を整える
docs: 更新情報の優先度定義を追記
```

`Files changed` で最終的な差分を確認する。  
問題がなければ Pull Request を merge する。  
この課題では通常の merge commit を使用する。

### 12. merge 後の branch を整理する

GitHub 上で作業 branch を削除する。  
ローカルでは `main` に戻り、GitHub 上の最新状態を取り込む。  
その後、不要になった local branch を削除し、削除済み remote branch の追跡情報を整理する。

## 作業の流れ

1. 現在の branch と作業ツリーを確認する。
2. リモートの最新情報を取得し、`main` が最新であることを確認する。
3. 作業 branch を作成する。
4. `updates.json` に優先度を追加する。
5. `app.js` に優先度表示を追加する。
6. `styles.css` に優先度表示用のスタイルを追加する。
7. 変更状態と差分を確認する。
8. 初回実装をステージングして commit する。
9. 作業 branch を GitHub へ push する。
10. GitHub 上で Pull Request を作成する。
11. Pull Request の `Commits` と `Files changed` を確認する。
12. `app.js` の優先度表示へ1つ目の review comment を追加する。
13. ローカルで日本語の優先度表示へ修正する。
14. 差分を確認して追加 commit を作成する。
15. 同じ作業 branch へ push する。
16. Pull Request に追加 commit が反映されたことを確認する。
17. 1つ目の review comment へ対応内容を返信する。
18. `updates.json` の `priority` へ2つ目の review comment を追加する。
19. `project-overview.md` に優先度の定義を追記する。
20. 差分を確認して追加 commit を作成する。
21. 同じ作業 branch へ push する。
22. Pull Request に3つの commit が含まれていることを確認する。
23. 2つ目の review comment へ対応内容を返信する。
24. 対応済みの conversation を解決する。
25. Pull Request の最終的な commit と差分を確認する。
26. Pull Request を merge する。
27. GitHub 上で作業 branch を削除する。
28. ローカルの `main` に戻る。
29. GitHub 上の最新状態をローカルへ取り込む。
30. 不要になった local branch を削除する。
31. 削除済み remote branch の追跡情報を整理する。
32. 最終的な branch、履歴、作業ツリーを確認する。

## 完了条件

次の状態になっていれば、この課題は完了とする。

- `feature/add-update-priority` で初回実装を行っている
- 6件の更新情報に `priority` が追加されている
- `app.js` に優先度表示の処理が追加されている
- `styles.css` に優先度表示用のスタイルが追加されている
- 初回実装が1つの commit にまとまっている
- 作業 branch が GitHub へ push されている
- Pull Request が作成されている
- `Files changed` 上に1つ目の review comment が追加されている
- 1つ目の review comment に対する修正が追加 commit になっている
- 同じ作業 branch への push で Pull Request が更新されている
- 1つ目の review comment へ対応内容を返信している
- `Files changed` 上に2つ目の review comment が追加されている
- `project-overview.md` に `priority` の定義が追記されている
- 2つ目の review comment に対する修正が追加 commit になっている
- 2つ目の review comment へ対応内容を返信している
- 対応済みの conversation が解決されている
- Pull Request に3つの commit が含まれている
- Pull Request が merge されている
- GitHub 上の作業 branch が削除されている
- ローカルの `main` に merge 後の変更が取り込まれている
- 不要になった local branch が削除されている
- 削除済み remote branch の追跡情報が整理されている
- 最終的な作業ツリーが clean になっている

---

## 解答例

作業開始前に現在の状態を確認する。

```bash
git status
```

表示例：

```text
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

リモートの最新情報を取得する。

```bash
git fetch origin
```

`main` と `origin/main` の位置を確認する。

```bash
git log --oneline --decorate -3
```

表示例：

```text
abc1234 (HEAD -> main, origin/main) 直前までのコミット
```

作業 branch を作成して切り替える。

```bash
git switch -c feature/add-update-priority
```

出力例：

```text
Switched to a new branch 'feature/add-update-priority'
```

課題内容に沿って、`updates.json`、`app.js`、`styles.css` を変更する。  
変更後の状態を確認する。

```bash
git status --short
```

表示例：

```text
 M practice/team-portal/data/updates.json
 M practice/team-portal/src/app.js
 M practice/team-portal/styles.css
```

差分の概要を確認する。

```bash
git diff --stat
```

表示例：

```text
 practice/team-portal/data/updates.json | ...
 practice/team-portal/src/app.js        | ...
 practice/team-portal/styles.css        | ...
 3 files changed, ... insertions(+), ... deletions(-)
```

変更をステージングする。

```bash
git add practice/team-portal/data/updates.json practice/team-portal/src/app.js practice/team-portal/styles.css
```

ステージング済みの差分を確認する。

```bash
git diff --cached
```

初回実装を commit する。

```bash
git commit -m "feat: 更新情報に優先度を追加"
```

出力例：

```text
[feature/add-update-priority def5678] feat: 更新情報に優先度を追加
 3 files changed, ... insertions(+), ... deletions(-)
```

作業 branch を GitHub へ push し、tracking branch を設定する。

```bash
git push -u origin feature/add-update-priority
```

出力例：

```text
To https://github.com/<your-account>/git-github-practice-drills.git
 * [new branch]      feature/add-update-priority -> feature/add-update-priority
branch 'feature/add-update-priority' set up to track 'origin/feature/add-update-priority'.
```

GitHub 上で Pull Request を作成する。

```text
Base:
main

Compare:
feature/add-update-priority
```

Pull Request title：

```text
feat: 更新情報に優先度を追加
```

Pull Request 作成後、`Files changed` で `app.js` の次の行へ line comment を追加する。

```javascript
priority.textContent = update.priority;
```

comment：

```text
`high` / `normal` がそのまま表示されるため、利用者向けの日本語表記へ変換してください。
```

ローカルで `app.js` を修正する。  
`categoryLabels` の後へ次の定義を追加する。

```javascript
const priorityLabels = {
  high: "高",
  normal: "通常",
};
```

優先度表示を変更する。

```javascript
priority.textContent = `優先度: ${priorityLabels[update.priority] ?? update.priority}`;
```

変更状態を確認する。

```bash
git status --short
```

表示例：

```text
 M practice/team-portal/src/app.js
```

差分を確認する。

```bash
git diff -- practice/team-portal/src/app.js
```

レビュー指摘への修正だけをステージングして commit する。

```bash
git add practice/team-portal/src/app.js
git commit -m "fix: 優先度の表示名を整える"
```

同じ作業 branch へ push する。

```bash
git push
```

出力例：

```text
To https://github.com/<your-account>/git-github-practice-drills.git
   def5678..789abcd  feature/add-update-priority -> feature/add-update-priority
```

Pull Request の `Commits` で追加 commit が反映されていることを確認する。  
1つ目の review comment へ返信する。

```text
対応しました。`high` / `normal` を日本語の表示名へ変換するよう修正しました。
```

次に `updates.json` の `priority` の行へ2つ目の line comment を追加する。

```text
`priority` で使用する値の意味が分かるように、ドキュメントへ `high` / `normal` の定義を追記してください。
```

ローカルで `practice/team-portal/docs/project-overview.md` を変更する。

```markdown
### 優先度

`priority` には次の値を使用する。

- `high`: 優先度が高い更新情報
- `normal`: 通常の更新情報
```

変更状態と差分を確認する。

```bash
git status --short
git diff -- practice/team-portal/docs/project-overview.md
```

2つ目のレビュー指摘への修正を commit する。

```bash
git add practice/team-portal/docs/project-overview.md
git commit -m "docs: 更新情報の優先度定義を追記"
```

同じ作業 branch へ push する。

```bash
git push
```

Pull Request の `Commits` で3つの commit を確認する。

```text
feat: 更新情報に優先度を追加
fix: 優先度の表示名を整える
docs: 更新情報の優先度定義を追記
```

2つ目の review comment へ返信する。

```text
対応しました。`priority` で使用する値と意味をドキュメントへ追記しました。
```

各 comment の修正内容を確認し、対応済みの conversation で `Resolve conversation` を実行する。  
すべての conversation が解決済みになったことを確認する。  
Pull Request の最終差分を確認し、GitHub 上で merge する。  
この課題では通常の merge commit を使用する。

merge 後、GitHub 上で `feature/add-update-priority` を削除する。  
ローカルの `main` に戻る。

```bash
git switch main
```

GitHub 上の最新状態を取り込む。

```bash
git pull
```

不要になった local branch を削除する。

```bash
git branch -d feature/add-update-priority
```

削除済み remote branch の追跡情報を整理する。

```bash
git fetch --prune
```

最終的な branch 一覧を確認する。

```bash
git branch -a
```

表示例：

```text
* main
  remotes/origin/main
```

最終的な履歴を確認する。

```bash
git log --oneline --graph --decorate --all -10
```

最終状態を確認する。

```bash
git status
```

表示例：

```text
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

## 学習ポイント

Pull Request は、最初に push した commit の内容だけを固定して確認するものではない。  
Pull Request の head branch に追加 commit を push すると、その Pull Request に新しい commit と差分が反映される。  
そのため、レビュー指摘への修正では新しい Pull Request を作り直すのではなく、通常は同じ作業 branch で修正を続ける。

`Files changed` では、変更されたコードの特定行に comment を付けられる。  
一般的な説明を Conversation 全体へ書くだけでなく、対象となる行へ comment を付けることで、どの変更についての指摘なのかを明確にできる。

レビュー指摘へ対応するときも、作業前後で `git status` と `git diff` を確認する。  
レビュー対応だからといって特別な Git 操作になるわけではなく、変更確認、stage、commit、push という基本的な流れを繰り返す。

追加修正は、元の commit を毎回書き換えるのではなく、レビュー指摘に対応した新しい commit として追加する方法がある。  
今回の履歴では、初回実装と2つのレビュー対応が次のように分かれる。

```text
feat: 更新情報に優先度を追加
fix: 優先度の表示名を整える
docs: 更新情報の優先度定義を追記
```

この状態なら、どの変更が初回実装で、どの変更がレビュー指摘への対応だったのかを履歴から確認しやすい。

レビュー comment へは、修正後に対応内容を返信する。  
そのうえで修正内容を確認し、対応が完了した conversation を `Resolve conversation` で解決する。  
Pull Request を merge する前に、未対応の conversation が残っていないか確認する習慣につながる。

チーム開発では、Pull Request の作成、レビュー、追加修正、再確認、merge という往復が発生する。  
この流れでも、local branch と remote branch、commit、push の関係は変わらない。  
レビュー対応のたびに同じ作業 branch へ commit・push し、Pull Request 上で変更がどう積み重なるかを確認することが重要となる。

## 補足

GitHub では、Pull Request の `Files changed` から変更行へ comment を追加できる。  
また、Pull Request を作成した本人、または対象リポジトリへの write access がある利用者は、対応済みの conversation を解決できる。  
この課題では1人で操作を完結できるよう、自分で review comment を追加し、それをレビュー指摘として扱う。

実際のチーム開発では、別の reviewer が comment を追加したり、review として `Approve` や `Request changes` を送信したりする場合がある。  
ただし、この課題では別アカウントや collaborator を前提にせず、Pull Request 上の指摘確認と追加修正の流れに学習対象を絞る。

review comment の画面上の配置やボタン名は、GitHub の UI 更新によって変わる場合がある。  
`Files changed` 上の変更行に comment を付け、対応後に conversation を解決できれば、この課題の目的を満たす。
