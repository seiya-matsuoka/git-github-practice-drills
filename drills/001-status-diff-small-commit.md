# 001. 作業前確認と小さな修正コミット

> タスクボードの表示文言を変更し、差分確認してコミットする

## 想定シチュエーション

小さなタスクボード画面の表示文言を修正する。  
作業内容は軽いが、実務と同じように、作業前の状態確認、差分確認、ステージング、コミット作成、履歴確認まで行う。

この課題では、Git操作ドリル用リポジトリの最初の題材として、`practice/task-board/` 配下のファイルを使う。  
初回のため、まだGitリポジトリとして初期化していない場合は、Git管理を開始してから作業する。

## この課題の目的

この課題では、Git作業の基本となる次の流れを確認する。

- 作業前に現在の状態を確認する
- 初回のみ、Git管理を開始して初期コミットを作成する
- ファイルを編集する
- 作業ツリーの状態を確認する
- 差分を確認する
- 変更をステージングする
- コミットを作成する
- コミット後の状態と履歴を確認する

## 使用する主な操作

- Git管理の開始
- 現在の作業状態の確認
- 変更ファイルの確認
- 差分確認
- ステージング
- コミット作成
- コミット履歴の確認

## 事前状態

この課題は、次の状態から開始する想定とする。

- `git-github-practice-drills` リポジトリの直下にいる
- `drills/001-status-diff-small-commit.md` が存在する
- `practice/task-board/` 配下に練習用ファイルが存在する
- 初回のため、Git管理が未開始の場合がある
- Git管理が開始済みの場合でも、作業前の未コミット変更はない状態から始める

今回の練習用ファイルは次の通り。

```text
practice/
  task-board/
    index.html
    styles.css
    src/
      app.js
    data/
      tasks.json
```

`practice/task-board/index.html` の初期内容は次の通り。

```html
<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <title>Practice Task Board</title>
    <link rel="stylesheet" href="./styles.css" />
  </head>
  <body>
    <main class="board">
      <h1>Practice Task Board</h1>
      <p id="summary">Loading tasks...</p>
      <ul id="task-list"></ul>
    </main>
    <script src="./src/app.js"></script>
  </body>
</html>
```

`practice/task-board/data/tasks.json` の初期内容は次の通り。

```json
{
  "projectName": "Practice Task Board",
  "statusLabel": "Draft",
  "tasks": [
    {
      "id": 1,
      "title": "Check repository status",
      "done": false
    },
    {
      "id": 2,
      "title": "Review file differences",
      "done": false
    }
  ]
}
```

## 課題内容

タスクボードの表示文言を、Git/GitHub操作ドリル用であることが分かる内容に変更する。

変更対象は次の2ファイルとする。

- `practice/task-board/index.html`
- `practice/task-board/data/tasks.json`

変更内容は次の通り。

- 画面タイトルと見出しを、Git/GitHub操作ドリル用のタスクボードであることが分かる文言に変更する
- データファイル内のプロジェクト名も同じ方向性の文言に変更する
- ステータスラベルを、ドリル開始状態であることが分かる文言に変更する

変更後は、作業状態と差分を確認する。  
問題なければ、今回の変更を1つのコミットとして記録する。

## 作業の流れ

1. リポジトリ直下にいることを確認する。
2. Git管理が未開始の場合は、Git管理を開始する。
3. 初回の場合は、配布された初期ファイル一式を初期コミットとして記録する。
4. 作業前の状態が clean であることを確認する。
5. 対象ファイルを編集する。
6. 編集後の作業状態を確認する。
7. 変更差分を確認する。
8. 変更内容に問題がなければ、対象ファイルをステージングする。
9. ステージング後の状態を確認する。
10. 変更内容を1つのコミットとして記録する。
11. コミット後の作業状態と履歴を確認する。

## 完了条件

次の状態になっていれば、この課題は完了とする。

- Gitリポジトリとして管理されている
- 初期ファイル一式のコミットが存在する
- `practice/task-board/index.html` のタイトルと見出しが変更されている
- `practice/task-board/data/tasks.json` のプロジェクト名とステータスラベルが変更されている
- 表示文言の変更を含むコミットが1つ作成されている
- コミット後の作業ツリーが clean になっている
- 直近の履歴で今回のコミットを確認できる

---

## 解答例

まず、リポジトリ直下にいることを確認する。

```bash
pwd
```

表示例：

```text
/xxx/git-github-practice-drills
```

Git管理が未開始か確認する。

```bash
git status
```

Git管理が未開始の場合の表示例：

```text
fatal: not a git repository (or any of the parent directories): .git
```

Git管理が未開始の場合は、Git管理を開始する。

```bash
git init
```

出力例：

```text
Initialized empty Git repository in /xxx/git-github-practice-drills/.git/
```

初期ブランチ名が `main` でない場合は、`main` に変更する。

```bash
git branch -M main
```

配布されたファイル一式を確認する。

```bash
git status
```

表示例：

```text
On branch main

No commits yet

Untracked files:
  drills/
  practice/

nothing added to commit but untracked files present
```

初回の場合は、配布された初期ファイル一式をステージングする。

```bash
git add drills/ practice/
```

ステージング後の状態を確認する。

```bash
git status
```

表示例：

```text
On branch main

No commits yet

Changes to be committed:
  new file:   drills/001-status-diff-small-commit.md
  new file:   practice/task-board/data/tasks.json
  new file:   practice/task-board/index.html
  new file:   practice/task-board/src/app.js
  new file:   practice/task-board/styles.css
```

初期コミットを作成する。

```bash
git commit -m "chore: Git操作ドリルの初期ファイルを追加"
```

出力例：

```text
[main abc1234] chore: Git操作ドリルの初期ファイルを追加
 5 files changed, 230 insertions(+)
 create mode 100 drills/001-status-diff-small-commit.md
 create mode 100 practice/task-board/data/tasks.json
 create mode 100 practice/task-board/index.html
 create mode 100 practice/task-board/src/app.js
 create mode 100 practice/task-board/styles.css
```

作業前の状態を確認する。

```bash
git status
```

表示例：

```text
On branch main
nothing to commit, working tree clean
```

`practice/task-board/index.html` を編集する。  
今回のファイルは軽いため、編集後の全文を記載する。

```html
<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <title>Git/GitHub Practice Task Board</title>
    <link rel="stylesheet" href="./styles.css" />
  </head>
  <body>
    <main class="board">
      <h1>Git/GitHub Practice Task Board</h1>
      <p id="summary">Loading tasks...</p>
      <ul id="task-list"></ul>
    </main>
    <script src="./src/app.js"></script>
  </body>
</html>
```

`practice/task-board/data/tasks.json` を編集する。  
今回のファイルは軽いため、編集後の全文を記載する。

```json
{
  "projectName": "Git/GitHub Practice Task Board",
  "statusLabel": "Drill Started",
  "tasks": [
    {
      "id": 1,
      "title": "Check repository status",
      "done": false
    },
    {
      "id": 2,
      "title": "Review file differences",
      "done": false
    }
  ]
}
```

編集後の作業状態を確認する。

```bash
git status
```

表示例：

```text
On branch main
Changes not staged for commit:
  modified:   practice/task-board/data/tasks.json
  modified:   practice/task-board/index.html
```

変更差分を確認する。

```bash
git diff
```

表示例：

```diff
diff --git a/practice/task-board/data/tasks.json b/practice/task-board/data/tasks.json
index 1111111..2222222 100644
--- a/practice/task-board/data/tasks.json
+++ b/practice/task-board/data/tasks.json
@@ -1,6 +1,6 @@
 {
-  "projectName": "Practice Task Board",
-  "statusLabel": "Draft",
+  "projectName": "Git/GitHub Practice Task Board",
+  "statusLabel": "Drill Started",
   "tasks": [
     {
       "id": 1,
diff --git a/practice/task-board/index.html b/practice/task-board/index.html
index 3333333..4444444 100644
--- a/practice/task-board/index.html
+++ b/practice/task-board/index.html
@@ -3,11 +3,11 @@
 <html lang="ja">
   <head>
     <meta charset="UTF-8">
-    <title>Practice Task Board</title>
+    <title>Git/GitHub Practice Task Board</title>
     <link rel="stylesheet" href="./styles.css">
   </head>
   <body>
     <main class="board">
-      <h1>Practice Task Board</h1>
+      <h1>Git/GitHub Practice Task Board</h1>
       <p id="summary">Loading tasks...</p>
       <ul id="task-list"></ul>
```

差分に問題がなければ、対象ファイルをステージングする。

```bash
git add practice/task-board/index.html practice/task-board/data/tasks.json
```

ステージング後の状態を確認する。

```bash
git status
```

表示例：

```text
On branch main
Changes to be committed:
  modified:   practice/task-board/data/tasks.json
  modified:   practice/task-board/index.html
```

表示文言修正のコミットを作成する。

```bash
git commit -m "feat: タスクボードの表示文言を更新"
```

出力例：

```text
[main def5678] feat: タスクボードの表示文言を更新
 2 files changed, 4 insertions(+), 4 deletions(-)
```

コミット後の作業状態を確認する。

```bash
git status
```

表示例：

```text
On branch main
nothing to commit, working tree clean
```

直近の履歴を確認する。

```bash
git log --oneline --decorate -5
```

表示例：

```text
def5678 (HEAD -> main) feat: タスクボードの表示文言を更新
abc1234 chore: Git操作ドリルの初期ファイルを追加
```

## 学習ポイント

この課題では、Git操作の基本となる `status`、`diff`、`add`、`commit`、`log` の流れを確認する。

特に重要なのは、コマンドを単体で覚えることではなく、作業状態の変化を順番に追うこととなる。

編集前は、作業ツリーが clean な状態。  
ファイルを編集すると、対象ファイルが modified になる。  
`git add` を行うと、変更がコミット対象になる。  
`git commit` を行うと、変更が履歴として記録され、作業ツリーは再び clean になる。

`git diff` では、変更した内容が意図通りかを確認する。  
実務では、差分を見ずにコミットすると、不要な変更や誤った変更を含めてしまう可能性がある。  
そのため、コミット前に差分を見る習慣をつけることが重要となる。

また、今回は初回ドリルのため、初期ファイル一式のコミットも行う。  
初期コミットと表示文言修正コミットを分けることで、「最初に追加したファイル」と「今回の作業で変更した内容」を履歴上で区別しやすくなる。

## 補足

すでにGit管理済みで、初期コミットも作成済みの場合は、`git init` や初期コミット作成の手順は不要となる。  
その場合は、作業前に `git status` で clean な状態を確認してから、表示文言の修正に進む。

今回の課題では、最初のドリルとして扱いやすくするため、直接 `main` ブランチで作業している。  
以降のドリルでは、作業ブランチを作成して変更する流れも扱う。
