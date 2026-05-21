# 002. 複数ファイル変更のコミット整理

> データ更新と画面表示調整を別コミットに分ける

## 想定シチュエーション

タスクボードのデータ内容と画面表示の見た目を同時に修正する。  
一度に複数ファイルを編集するが、コミットは作業内容のまとまりごとに分ける。

今回の変更は、大きく分けると次の2種類となる。

- タスクデータの更新
- 画面表示とスタイルの調整

実務では、複数ファイルをまとめて変更すること自体はよくある。  
ただし、内容の異なる変更を1つのコミットにまとめすぎると、あとから履歴を追いにくくなる。

この課題では、複数ファイルを編集したあと、差分を確認しながらコミット対象を選び、意味のある単位でコミットを分ける練習を行う。

## この課題の目的

この課題では、複数ファイル変更時の基本となる次の流れを確認する。

- 複数ファイルを編集した状態を確認する
- ファイルごとの差分を確認する
- コミットに含める変更を選ぶ
- ステージング済みの差分を確認する
- 1つ目のコミットを作成する
- 残りの変更を確認する
- 2つ目のコミットを作成する
- 履歴上でコミットが分かれていることを確認する

## 使用する主な操作

- 作業状態の確認
- 変更ファイル一覧の確認
- ファイル別の差分確認
- 対象ファイルを指定したステージング
- ステージング済み差分の確認
- 複数コミットの作成
- コミット履歴の確認

## 事前状態

この課題は、次の状態から開始する想定とする。

- 001の課題が完了している
- 現在のブランチは `main`
- 作業ツリーは clean
- `practice/task-board/` 配下に、001で使用した練習用ファイルが存在する
- 001で作成した表示文言修正コミットが存在する

作業開始前の履歴は、次のような状態を想定する。

```text
def5678 (HEAD -> main) feat: タスクボードの表示文言を更新
abc1234 chore: Git操作ドリルの初期ファイルを追加
```

対象ファイルは次の通り。

```text
practice/
  task-board/
    styles.css
    src/
      app.js
    data/
      tasks.json
```

## 課題内容

次の3ファイルを編集する。

```text
practice/task-board/data/tasks.json
practice/task-board/src/app.js
practice/task-board/styles.css
```

ただし、コミットは1つにまとめず、次の2つに分ける。

```text
1つ目のコミット:
タスクデータの更新

2つ目のコミット:
画面表示とスタイルの調整
```

### 変更1: タスクデータの更新

`practice/task-board/data/tasks.json` を変更する。

変更内容は次の通り。

- `statusLabel` を `Drill In Progress` に変更する
- `id` が `1` のタスクの `done` を `true` に変更する
- `id` が `3` のタスクを追加する

変更後の内容は次の通り。

```json
{
  "projectName": "Git/GitHub Practice Task Board",
  "statusLabel": "Drill In Progress",
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
    }
  ]
}
```

### 変更2: 画面表示ロジックの調整

`practice/task-board/src/app.js` を変更する。

変更内容は次の通り。

- サマリー表示の区切り文字を `-` から `/` に変更する
- 完了数の表示を `Done: 1/3` のような形式に変更する
- 完了状況に応じて、サマリー要素にクラス名を設定する

変更後の内容は次の通り。

```javascript
const summaryElement = document.querySelector("#summary");
const taskListElement = document.querySelector("#task-list");

async function loadTasks() {
  const response = await fetch("./data/tasks.json");
  const taskData = await response.json();

  const doneCount = taskData.tasks.filter((task) => task.done).length;
  const summaryState =
    doneCount === taskData.tasks.length
      ? "summary-complete"
      : "summary-progress";

  summaryElement.className = `summary ${summaryState}`;
  summaryElement.textContent = `${taskData.projectName} / ${taskData.statusLabel} / Done: ${doneCount}/${taskData.tasks.length}`;

  taskListElement.innerHTML = "";

  for (const task of taskData.tasks) {
    const itemElement = document.createElement("li");
    itemElement.textContent = task.title;

    if (task.done) {
      itemElement.classList.add("done");
    }

    taskListElement.appendChild(itemElement);
  }
}

loadTasks();
```

### 変更3: サマリー表示用スタイルの追加

`practice/task-board/styles.css` に、サマリー表示用のスタイルを追加する。

追加する内容は次の通り。

```css
.summary {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 999px;
  font-weight: 600;
}

.summary-progress {
  background: #fff7ed;
}

.summary-complete {
  background: #ecfdf5;
}
```

追加位置は、既存の `.board h1` の下あたりでよい。

## 作業の流れ

1. 作業開始前に、現在のブランチと作業状態を確認する。
2. 3つの対象ファイルを編集する。
3. 編集後、変更されたファイル一覧を確認する。
4. 全体の差分を確認する。
5. タスクデータ更新に関係するファイルだけをステージングする。
6. ステージング済みの差分を確認する。
7. タスクデータ更新のコミットを作成する。
8. 残りの変更ファイルを確認する。
9. 画面表示とスタイル調整に関係するファイルをステージングする。
10. ステージング済みの差分を確認する。
11. 画面表示とスタイル調整のコミットを作成する。
12. コミット後の作業状態と履歴を確認する。

## 完了条件

次の状態になっていれば、この課題は完了とする。

- `practice/task-board/data/tasks.json` が指定通り変更されている
- `practice/task-board/src/app.js` が指定通り変更されている
- `practice/task-board/styles.css` にサマリー表示用スタイルが追加されている
- タスクデータ更新のコミットが1つ作成されている
- 画面表示とスタイル調整のコミットが1つ作成されている
- 合計2つのコミットに分けて記録されている
- コミット後の作業ツリーが clean になっている
- 直近の履歴で2つのコミットを確認できる

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

直近の履歴も確認する。

```bash
git log --oneline --decorate -5
```

表示例：

```text
def5678 (HEAD -> main) feat: タスクボードの表示文言を更新
abc1234 chore: Git操作ドリルの初期ファイルを追加
```

3つの対象ファイルを編集する。

```text
practice/task-board/data/tasks.json
practice/task-board/src/app.js
practice/task-board/styles.css
```

編集後、変更されたファイルを確認する。

```bash
git status
```

表示例：

```text
On branch main
Changes not staged for commit:
  modified:   practice/task-board/data/tasks.json
  modified:   practice/task-board/src/app.js
  modified:   practice/task-board/styles.css
```

変更ファイルの一覧を短く確認する。

```bash
git diff --name-only
```

表示例：

```text
practice/task-board/data/tasks.json
practice/task-board/src/app.js
practice/task-board/styles.css
```

全体の差分量を確認する。

```bash
git diff --stat
```

表示例：

```text
 practice/task-board/data/tasks.json | 9 +++++++--
 practice/task-board/src/app.js      | 6 +++++-
 practice/task-board/styles.css      | 15 +++++++++++++++
 3 files changed, 27 insertions(+), 3 deletions(-)
```

タスクデータ更新の差分だけを確認する。

```bash
git diff -- practice/task-board/data/tasks.json
```

表示例：

```diff
diff --git a/practice/task-board/data/tasks.json b/practice/task-board/data/tasks.json
index 1111111..2222222 100644
--- a/practice/task-board/data/tasks.json
+++ b/practice/task-board/data/tasks.json
@@ -1,17 +1,22 @@
 {
   "projectName": "Git/GitHub Practice Task Board",
-  "statusLabel": "Drill Started",
+  "statusLabel": "Drill In Progress",
   "tasks": [
     {
       "id": 1,
       "title": "Check repository status",
-      "done": false
+      "done": true
     },
     {
       "id": 2,
       "title": "Review file differences",
       "done": false
+    },
+    {
+      "id": 3,
+      "title": "Split related changes into separate commits",
+      "done": false
     }
   ]
 }
```

1つ目のコミットに含めるファイルだけをステージングする。

```bash
git add practice/task-board/data/tasks.json
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

Changes not staged for commit:
  modified:   practice/task-board/src/app.js
  modified:   practice/task-board/styles.css
```

ステージング済みの差分を確認する。

```bash
git diff --cached
```

表示例：

```diff
diff --git a/practice/task-board/data/tasks.json b/practice/task-board/data/tasks.json
index 1111111..2222222 100644
--- a/practice/task-board/data/tasks.json
+++ b/practice/task-board/data/tasks.json
@@ -1,17 +1,22 @@
 {
   "projectName": "Git/GitHub Practice Task Board",
-  "statusLabel": "Drill Started",
+  "statusLabel": "Drill In Progress",
   "tasks": [
     {
       "id": 1,
       "title": "Check repository status",
-      "done": false
+      "done": true
     },
     {
       "id": 2,
       "title": "Review file differences",
       "done": false
+    },
+    {
+      "id": 3,
+      "title": "Split related changes into separate commits",
+      "done": false
     }
   ]
 }
```

タスクデータ更新のコミットを作成する。

```bash
git commit -m "feat: タスクデータを更新"
```

出力例：

```text
[main 123abcd] feat: タスクデータを更新
 1 file changed, 7 insertions(+), 2 deletions(-)
```

残りの変更を確認する。

```bash
git status
```

表示例：

```text
On branch main
Changes not staged for commit:
  modified:   practice/task-board/src/app.js
  modified:   practice/task-board/styles.css
```

残っている差分を確認する。

```bash
git diff
```

表示例：

```diff
diff --git a/practice/task-board/src/app.js b/practice/task-board/src/app.js
index 3333333..4444444 100644
--- a/practice/task-board/src/app.js
+++ b/practice/task-board/src/app.js
@@ -5,7 +5,11 @@ async function loadTasks() {
   const taskData = await response.json();

   const doneCount = taskData.tasks.filter((task) => task.done).length;
-  summaryElement.textContent = `${taskData.projectName} - ${taskData.statusLabel} (${doneCount}/${taskData.tasks.length})`;
+  const summaryState =
+    doneCount === taskData.tasks.length ? "summary-complete" : "summary-progress";
+
+  summaryElement.className = `summary ${summaryState}`;
+  summaryElement.textContent = `${taskData.projectName} / ${taskData.statusLabel} / Done: ${doneCount}/${taskData.tasks.length}`;

   taskListElement.innerHTML = "";
diff --git a/practice/task-board/styles.css b/practice/task-board/styles.css
index 5555555..6666666 100644
--- a/practice/task-board/styles.css
+++ b/practice/task-board/styles.css
@@ -10,6 +10,21 @@
 .board h1 {
   margin-top: 0;
 }
+
+.summary {
+  display: inline-block;
+  padding: 6px 12px;
+  border-radius: 999px;
+  font-weight: 600;
+}
+
+.summary-progress {
+  background: #fff7ed;
+}
+
+.summary-complete {
+  background: #ecfdf5;
+}

 #task-list {
   padding-left: 24px;
```

画面表示とスタイル調整に関係するファイルをステージングする。

```bash
git add practice/task-board/src/app.js practice/task-board/styles.css
```

ステージング後の状態を確認する。

```bash
git status
```

表示例：

```text
On branch main
Changes to be committed:
  modified:   practice/task-board/src/app.js
  modified:   practice/task-board/styles.css
```

ステージング済みの差分を確認する。

```bash
git diff --cached
```

表示例：

```diff
diff --git a/practice/task-board/src/app.js b/practice/task-board/src/app.js
index 3333333..4444444 100644
--- a/practice/task-board/src/app.js
+++ b/practice/task-board/src/app.js
@@ -5,7 +5,11 @@ async function loadTasks() {
   const taskData = await response.json();

   const doneCount = taskData.tasks.filter((task) => task.done).length;
-  summaryElement.textContent = `${taskData.projectName} - ${taskData.statusLabel} (${doneCount}/${taskData.tasks.length})`;
+  const summaryState =
+    doneCount === taskData.tasks.length ? "summary-complete" : "summary-progress";
+
+  summaryElement.className = `summary ${summaryState}`;
+  summaryElement.textContent = `${taskData.projectName} / ${taskData.statusLabel} / Done: ${doneCount}/${taskData.tasks.length}`;

   taskListElement.innerHTML = "";

diff --git a/practice/task-board/styles.css b/practice/task-board/styles.css
index 5555555..6666666 100644
--- a/practice/task-board/styles.css
+++ b/practice/task-board/styles.css
@@ -10,6 +10,21 @@
 .board h1 {
   margin-top: 0;
 }
+
+.summary {
+  display: inline-block;
+  padding: 6px 12px;
+  border-radius: 999px;
+  font-weight: 600;
+}
+
+.summary-progress {
+  background: #fff7ed;
+}
+
+.summary-complete {
+  background: #ecfdf5;
+}

 #task-list {
   padding-left: 24px;
```

画面表示とスタイル調整のコミットを作成する。

```bash
git commit -m "feat: タスクボードのサマリー表示を調整"
```

出力例：

```text
[main 456efgh] feat: タスクボードのサマリー表示を調整
 2 files changed, 19 insertions(+), 1 deletion(-)
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
456efgh (HEAD -> main) feat: タスクボードのサマリー表示を調整
123abcd feat: タスクデータを更新
def5678 feat: タスクボードの表示文言を更新
abc1234 chore: Git操作ドリルの初期ファイルを追加
```

## 学習ポイント

この課題では、複数ファイルを編集したあとに、変更内容を意味のある単位でコミットに分ける流れを確認する。

重要なのは、変更ファイルの数ではなく、変更の意味でコミットを分けることとなる。  
今回は、`tasks.json` の変更は「データ更新」、`app.js` と `styles.css` の変更は「画面表示とスタイル調整」として扱う。

`git status` では、現在どのファイルが変更されているかを確認する。  
`git diff --name-only` では、変更されたファイル一覧だけを確認できる。  
`git diff --stat` では、ファイルごとの変更量をざっくり確認できる。  
`git diff -- <file>` では、特定ファイルだけの差分を確認できる。

また、`git diff --cached` は、ステージング済みの変更だけを確認するために使う。  
これは、コミット直前に「今から作るコミットに何が入るか」を確認する操作となる。

1つ目のコミット後に `git status` を確認すると、まだコミットしていない変更だけが残る。  
この状態を見ることで、「一部の変更だけを先にコミットした」ことを確認できる。

## 補足

今回はファイル単位でコミットを分けられるように変更内容を用意している。  
実務では、同じファイル内に複数の意味の変更が混ざることもある。

その場合は、ファイル単位ではなく、変更の一部だけをステージングする方法もある。  
ただし、今回はまずファイル単位でコミットを分ける練習を優先する。

コミットを分けると、あとから履歴を読んだときに、何のための変更だったかを追いやすくなる。  
また、問題が起きたときに、どの変更が原因だったかを調べやすくなる。
