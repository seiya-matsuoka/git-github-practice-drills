# 005. コミット前後の修正と取り消し

> ステージングの取り消し、不要な変更の破棄、直前コミットの修正を行う

## 想定シチュエーション

タスクボードに、Git/GitHub 操作ドリル用の説明文と追加タスクを入れる。  
作業中に、検証用のスタイル変更まで誤ってステージングしてしまう。  
さらに、コミット後にデータファイルの文言修正漏れに気づく。

この課題では、コミット前後に発生しやすい小さなミスを想定し、状態を確認しながら修正する。  
不要な変更をコミットに含めないための取り消し、直前コミットに修正を含め直す操作を練習する。

## この課題の目的

この課題では、コミット前後の修正でよく使う次の流れを確認する。

- 複数ファイルを編集した状態を確認する
- 誤ってステージングしたファイルをステージング対象から外す
- 不要な作業ツリー上の変更を破棄する
- 意図したファイルだけをコミットする
- コミット後に修正漏れへ気づいた想定で、直前コミットを修正する
- 直前コミットの修正後、履歴と作業状態を確認する

## 使用する主な操作

- 作業状態の確認
- 差分確認
- ファイル指定のステージング
- ステージングの取り消し
- 作業ツリー上の変更破棄
- コミット作成
- 直前コミットの修正
- コミット履歴の確認

## 事前状態

この課題は、次の状態から開始する想定とする。

- 004の課題が完了している
- 現在のブランチは `main`
- 作業ツリーは clean
- `practice/task-board/` 配下に、これまでの課題で使用したファイルが存在する
- `.gitignore` が作成済みで、ローカル設定・ログ・生成物が管理対象外になっている

今回編集するファイルは次の通り。

```text
practice/
  task-board/
    index.html
    styles.css
    data/
      tasks.json
```

## 課題内容

`practice/task-board/index.html` と `practice/task-board/data/tasks.json` を変更する。

また、作業中のミスとして `practice/task-board/styles.css` に検証用スタイルを追加する。  
このスタイル変更は最終的にコミットに含めない。

### 変更1: 画面説明文の追加

`practice/task-board/index.html` を変更する。

`<h1>` の直下に、次の説明文を追加する。

```html
<p class="board-description">
  Git/GitHub操作の基本手順を確認するためのタスク一覧。
</p>
```

変更後の該当箇所は次の通り。

```html
<main class="board">
  <h1>Git/GitHub Practice Task Board</h1>
  <p class="board-description">
    Git/GitHub操作の基本手順を確認するためのタスク一覧。
  </p>
  <p id="summary">Loading tasks...</p>
  <ul id="task-list"></ul>
</main>
```

### 変更2: タスクデータの追加

`practice/task-board/data/tasks.json` を変更する。

変更内容は次の通り。

- `statusLabel` を一度 `Correction Practice` に変更する
- `id` が `4` のタスクを追加する

変更後の内容は次の通り。

```json
{
  "projectName": "Git/GitHub Practice Task Board",
  "statusLabel": "Correction Practice",
  "tasks": [
    {
      "id": 1,
      "title": "Check repository status",
      "done": true
    },
    {
      "id": 2,
      "title": "Review file differences",
      "done": false
    },
    {
      "id": 3,
      "title": "Split related changes into separate commits",
      "done": false
    },
    {
      "id": 4,
      "title": "Fix staged changes before committing",
      "done": false
    }
  ]
}
```

### 変更3: 検証用スタイルの追加

`practice/task-board/styles.css` の末尾に、次の検証用スタイルを追加する。

```css
.debug-outline {
  outline: 3px dashed red;
}
```

この変更は、作業中に試しただけの不要な変更とする。  
そのため、最終的にはコミットに含めず、作業ツリーから破棄する。

### コミット後に気づく修正漏れ

一度コミットを作成したあと、`statusLabel` の文言をより分かりやすい内容に修正する。

`practice/task-board/data/tasks.json` の `statusLabel` を、次のように変更する。

```json
"statusLabel": "Amend Practice"
```

この修正は、別コミットとして追加するのではなく、直前のコミットに含め直す。

## 作業の流れ

1. 作業開始前に、現在のブランチと作業状態を確認する。
2. `index.html` に画面説明文を追加する。
3. `tasks.json` に追加タスクとステータスラベル変更を入れる。
4. `styles.css` に検証用スタイルを追加する。
5. 編集後、変更されたファイル一覧と差分を確認する。
6. 誤って3ファイルすべてをステージングする。
7. ステージング済みの状態を確認する。
8. コミットに含めない `styles.css` をステージング対象から外す。
9. `styles.css` の不要な作業ツリー上の変更を破棄する。
10. コミットに含める差分だけが残っていることを確認する。
11. `index.html` と `tasks.json` の変更をコミットする。
12. コミット後、`tasks.json` の `statusLabel` を修正する。
13. 修正分をステージングする。
14. 直前のコミットに修正分を含め直す。
15. コミット後の作業状態と履歴を確認する。

## 完了条件

次の状態になっていれば、この課題は完了とする。

- `practice/task-board/index.html` に説明文が追加されている
- `practice/task-board/data/tasks.json` に `id` が `4` のタスクが追加されている
- `practice/task-board/data/tasks.json` の `statusLabel` が `Amend Practice` になっている
- `practice/task-board/styles.css` に検証用の `.debug-outline` は残っていない
- 不要なスタイル変更はコミットに含まれていない
- 直前コミットが `commit --amend` によって修正されている
- コミット後の作業ツリーが clean になっている

---

## 解答例

作業開始前に、現在の状態を確認する。

```bash
git status
```

表示例：

```text
On branch main
nothing to commit, working tree clean
```

現在のブランチも確認する。

```bash
git branch
```

表示例：

```text
* main
```

`practice/task-board/index.html` の `<h1>` 直下に説明文を追加する。

```html
<main class="board">
  <h1>Git/GitHub Practice Task Board</h1>
  <p class="board-description">
    Git/GitHub操作の基本手順を確認するためのタスク一覧。
  </p>
  <p id="summary">Loading tasks...</p>
  <ul id="task-list"></ul>
</main>
```

`practice/task-board/data/tasks.json` を編集する。  
今回の変更では、`statusLabel` を一度 `Correction Practice` にし、`id` が `4` のタスクを追加する。

```json
{
  "projectName": "Git/GitHub Practice Task Board",
  "statusLabel": "Correction Practice",
  "tasks": [
    {
      "id": 1,
      "title": "Check repository status",
      "done": true
    },
    {
      "id": 2,
      "title": "Review file differences",
      "done": false
    },
    {
      "id": 3,
      "title": "Split related changes into separate commits",
      "done": false
    },
    {
      "id": 4,
      "title": "Fix staged changes before committing",
      "done": false
    }
  ]
}
```

`practice/task-board/styles.css` の末尾に、検証用スタイルを追加する。  
この変更は後で破棄する。

```css
.debug-outline {
  outline: 3px dashed red;
}
```

編集後、変更されたファイルを確認する。

```bash
git status --short
```

表示例：

```text
 M practice/task-board/data/tasks.json
 M practice/task-board/index.html
 M practice/task-board/styles.css
```

全体の差分を確認する。

```bash
git diff --stat
```

表示例：

```text
 practice/task-board/data/tasks.json | 8 +++++++-
 practice/task-board/index.html      | 1 +
 practice/task-board/styles.css      | 4 ++++
 3 files changed, 12 insertions(+), 1 deletion(-)
```

通常の差分も確認する。

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
   "projectName": "Git/GitHub Practice Task Board",
-  "statusLabel": "Drill In Progress",
+  "statusLabel": "Correction Practice",
   "tasks": [
@@ -15,6 +15,11 @@
       "id": 3,
       "title": "Split related changes into separate commits",
       "done": false
+    },
+    {
+      "id": 4,
+      "title": "Fix staged changes before committing",
+      "done": false
     }
   ]
 }
diff --git a/practice/task-board/index.html b/practice/task-board/index.html
index 3333333..4444444 100644
--- a/practice/task-board/index.html
+++ b/practice/task-board/index.html
@@ -8,6 +8,7 @@
   <body>
     <main class="board">
       <h1>Git/GitHub Practice Task Board</h1>
+      <p class="board-description">Git/GitHub操作の基本手順を確認するためのタスク一覧。</p>
       <p id="summary">Loading tasks...</p>
       <ul id="task-list"></ul>
     </main>
diff --git a/practice/task-board/styles.css b/practice/task-board/styles.css
index 5555555..6666666 100644
--- a/practice/task-board/styles.css
+++ b/practice/task-board/styles.css
@@ -30,3 +30,7 @@
 .done {
   text-decoration: line-through;
 }
+
+.debug-outline {
+  outline: 3px dashed red;
+}
```

ここでは、作業ミスとして3ファイルすべてをステージングする。

```bash
git add practice/task-board/index.html practice/task-board/data/tasks.json practice/task-board/styles.css
```

ステージング後の状態を確認する。

```bash
git status --short
```

表示例：

```text
M  practice/task-board/data/tasks.json
M  practice/task-board/index.html
M  practice/task-board/styles.css
```

ステージング済みの差分を確認する。

```bash
git diff --cached --stat
```

表示例：

```text
 practice/task-board/data/tasks.json | 8 +++++++-
 practice/task-board/index.html      | 1 +
 practice/task-board/styles.css      | 4 ++++
 3 files changed, 12 insertions(+), 1 deletion(-)
```

`styles.css` はコミットに含めないため、ステージング対象から外す。

```bash
git reset HEAD practice/task-board/styles.css
```

出力例：

```text
Unstaged changes after reset:
M	practice/task-board/styles.css
```

ステージング状態を確認する。

```bash
git status --short
```

表示例：

```text
M  practice/task-board/data/tasks.json
M  practice/task-board/index.html
 M practice/task-board/styles.css
```

左側の `M` はステージング済み、右側の `M` は作業ツリーにだけ変更がある状態を表す。  
この時点で、`styles.css` はステージング対象から外れている。

`styles.css` の不要な作業ツリー上の変更を破棄する。

```bash
git restore practice/task-board/styles.css
```

作業状態を確認する。

```bash
git status --short
```

表示例：

```text
M  practice/task-board/data/tasks.json
M  practice/task-board/index.html
```

`styles.css` の変更が消え、コミット対象は `index.html` と `tasks.json` だけになる。

コミット直前に、ステージング済みの差分を確認する。

```bash
git diff --cached
```

表示例：

```diff
diff --git a/practice/task-board/data/tasks.json b/practice/task-board/data/tasks.json
index 1111111..2222222 100644
--- a/practice/task-board/data/tasks.json
+++ b/practice/task-board/data/tasks.json
@@ -1,6 +1,6 @@
 {
   "projectName": "Git/GitHub Practice Task Board",
-  "statusLabel": "Drill In Progress",
+  "statusLabel": "Correction Practice",
   "tasks": [
@@ -15,6 +15,11 @@
       "id": 3,
       "title": "Split related changes into separate commits",
       "done": false
+    },
+    {
+      "id": 4,
+      "title": "Fix staged changes before committing",
+      "done": false
     }
   ]
 }
diff --git a/practice/task-board/index.html b/practice/task-board/index.html
index 3333333..4444444 100644
--- a/practice/task-board/index.html
+++ b/practice/task-board/index.html
@@ -8,6 +8,7 @@
   <body>
     <main class="board">
       <h1>Git/GitHub Practice Task Board</h1>
+      <p class="board-description">Git/GitHub操作の基本手順を確認するためのタスク一覧。</p>
       <p id="summary">Loading tasks...</p>
       <ul id="task-list"></ul>
     </main>
```

コミットを作成する。

```bash
git commit -m "feat: タスクボードに操作確認用の説明を追加"
```

出力例：

```text
[main 234abcd] feat: タスクボードに操作確認用の説明を追加
 2 files changed, 9 insertions(+), 1 deletion(-)
```

コミット後、作業状態を確認する。

```bash
git status
```

表示例：

```text
On branch main
nothing to commit, working tree clean
```

ここで、`statusLabel` を `Correction Practice` のままにしていたことに気づいた想定とする。  
`practice/task-board/data/tasks.json` の `statusLabel` を次のように修正する。

```json
"statusLabel": "Amend Practice"
```

修正後、作業状態を確認する。

```bash
git status --short
```

表示例：

```text
 M practice/task-board/data/tasks.json
```

差分を確認する。

```bash
git diff -- practice/task-board/data/tasks.json
```

表示例：

```diff
diff --git a/practice/task-board/data/tasks.json b/practice/task-board/data/tasks.json
index 2222222..3333333 100644
--- a/practice/task-board/data/tasks.json
+++ b/practice/task-board/data/tasks.json
@@ -1,6 +1,6 @@
 {
   "projectName": "Git/GitHub Practice Task Board",
-  "statusLabel": "Correction Practice",
+  "statusLabel": "Amend Practice",
   "tasks": [
```

修正分をステージングする。

```bash
git add practice/task-board/data/tasks.json
```

ステージング済みの差分を確認する。

```bash
git diff --cached -- practice/task-board/data/tasks.json
```

表示例：

```diff
diff --git a/practice/task-board/data/tasks.json b/practice/task-board/data/tasks.json
index 2222222..3333333 100644
--- a/practice/task-board/data/tasks.json
+++ b/practice/task-board/data/tasks.json
@@ -1,6 +1,6 @@
 {
   "projectName": "Git/GitHub Practice Task Board",
-  "statusLabel": "Correction Practice",
+  "statusLabel": "Amend Practice",
   "tasks": [
```

直前コミットに修正分を含め直す。  
コミットメッセージを変えない場合は、次のように実行する。

```bash
git commit --amend --no-edit
```

出力例：

```text
[main 345bcde] feat: タスクボードに操作確認用の説明を追加
 Date: Tue Jun 9 10:00:00 2026 +0900
 2 files changed, 9 insertions(+), 1 deletion(-)
```

作業状態を確認する。

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
345bcde (HEAD -> main) feat: タスクボードに操作確認用の説明を追加
789abcd chore: 管理対象外ファイルの設定を追加
456efgh feat: タスクボードのサマリー表示を調整
123abcd feat: タスクデータを更新
def5678 feat: タスクボードの表示文言を更新
```

最後に、`styles.css` に検証用スタイルが残っていないことを確認する。

```bash
git diff HEAD -- practice/task-board/styles.css
```

表示例：

```text

```

何も表示されなければ、`styles.css` は直近のコミットとの差分がない状態となる。

## 学習ポイント

この課題では、コミット前後の小さなミスを修正する流れを確認する。

`git reset HEAD <file>` は、指定したファイルをステージング対象から外す操作として使える。  
今回の例では、誤ってステージングした `styles.css` をコミット対象から外すために使っている。  
この時点では、ファイルの編集内容自体は作業ツリーに残る。

`git restore <file>` は、作業ツリー上の変更を破棄する操作として使える。  
今回の例では、`styles.css` の検証用スタイルを不要な変更として破棄している。  
この操作を行うと、対象ファイルの未コミット変更は消えるため、実行前に差分を確認することが重要となる。

`git diff --cached` は、ステージング済みの変更だけを確認するために使う。  
コミット直前にこのコマンドを実行すると、今から作るコミットに何が含まれるかを確認できる。

`git commit --amend` は、直前のコミットを作り直す操作となる。  
今回のように、コミット直後に小さな修正漏れへ気づいた場合は、修正分をステージングしてから `git commit --amend --no-edit` を実行することで、直前コミットに修正を含め直せる。

ただし、`commit --amend` はコミットIDを書き換える操作となる。  
すでにリモートへ push して共有済みのコミットに対して行う場合は注意が必要となる。  
個人作業中で、まだ push していない直前コミットを整える用途では使いやすい。

## 補足

ステージングを取り消す操作には、次の書き方もある。

```bash
git restore --staged practice/task-board/styles.css
```

現在のGitでは、ステージングを外す用途として `git restore --staged` も使える。  
一方で、`git reset HEAD <file>` も多くの現場や既存記事で見かける書き方となる。

この課題では、`reset` の基本的な使い方に触れるため、`git reset HEAD <file>` を使用している。

`git restore` は作業ツリーの変更を破棄できるため便利だが、破棄した変更は基本的に戻せない。  
実務では、必要か不要か迷う変更を消す前に、`git diff` で内容を確認するか、一時的に別ファイルへ退避する。
