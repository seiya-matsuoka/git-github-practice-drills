# 006. `stash` による作業退避と復帰

> 途中作業を一時退避し、急ぎの修正を先に完了してから元の作業に戻る

## 想定シチュエーション

タスクボードに、残タスク数を表示する小さな改善を入れている。  
作業途中でまだコミットできる状態ではないが、急ぎでステータスラベルの文言を修正してほしいという依頼が入った。

途中作業を中途半端なコミットとして残すのではなく、一時的に退避する。  
その後、急ぎの修正を別ブランチで先に完了し、`main` に取り込む。  
最後に、元の作業ブランチへ戻って退避していた変更を復帰し、残タスク数表示の作業を完了する。

この課題では、作業途中の変更を安全に退避し、別作業を挟んだあとに元の作業へ戻る流れを練習する。

## この課題の目的

この課題では、`stash` を使った作業中断と復帰の流れを確認する。

- 作業途中の変更を確認する
- まだコミットしたくない変更を一時退避する
- 退避後に作業ツリーが clean になることを確認する
- 急ぎの修正を別ブランチで行う
- 急ぎの修正を `main` に取り込む
- 元の作業ブランチへ戻る
- 退避していた変更を復帰する
- 復帰した変更を確認してコミットする
- 作業完了後に `stash` が残っていないことを確認する

## 使用する主な操作

- 作業ブランチの作成
- 作業状態の確認
- 変更差分の確認
- 作業中の変更の一時退避
- 退避した作業一覧の確認
- 別ブランチでの急ぎ修正
- ブランチの切り替え
- マージ
- 退避した作業の復帰
- コミット作成
- マージ済みブランチの削除

## 事前状態

この課題は、次の状態から開始する想定とする。

- 005の課題が完了している
- 現在のブランチは `main`
- 作業ツリーは clean
- `practice/task-board/` 配下に、これまでの課題で使用したファイルが存在する
- `practice/task-board/src/app.js` にタスク一覧表示処理がある
- `practice/task-board/styles.css` にサマリー表示用のスタイルがある
- `practice/task-board/data/tasks.json` に `statusLabel` が定義されている

今回主に使用するファイルは次の通り。

```text
practice/
  task-board/
    src/
      app.js
    styles.css
    data/
      tasks.json
```

## 課題内容

この課題では、最初に残タスク数表示の改善作業を始める。  
ただし、その作業途中で急ぎの文言修正が入った想定にする。

作業は次の順番で行う。

```text
1. 残タスク数表示の改善作業を途中まで進める
2. 途中作業を一時退避する
3. 急ぎのステータスラベル修正を別ブランチで行う
4. 急ぎの修正を main に取り込む
5. 元の作業ブランチへ戻る
6. 退避していた残タスク数表示の変更を復帰する
7. 残タスク数表示の変更をコミットする
8. 残タスク数表示の作業ブランチを main に取り込む
```

### 変更1: 残タスク数表示の改善

作業ブランチを作成し、`practice/task-board/src/app.js` を変更する。

変更内容は次の通り。

- 完了済みタスク数とは別に、残タスク数を計算する
- サマリー表示に `Remaining: 2` のような残タスク数を追加する

変更箇所のイメージは次の通り。

```javascript
const doneCount = taskData.tasks.filter((task) => task.done).length;
const remainingCount = taskData.tasks.length - doneCount;
const summaryState =
  doneCount === taskData.tasks.length ? "summary-complete" : "summary-progress";

summaryElement.className = `summary ${summaryState}`;
summaryElement.textContent = `${taskData.projectName} / ${taskData.statusLabel} / Done: ${doneCount}/${taskData.tasks.length} / Remaining: ${remainingCount}`;
```

あわせて、`practice/task-board/styles.css` の `.summary` に次のプロパティを追加する。

```css
letter-spacing: 0.02em;
```

この時点では、まだコミットしない。  
作業途中で急ぎの修正依頼が入った想定にする。

### 変更2: 急ぎのステータスラベル修正

途中作業を退避したあと、別ブランチで `practice/task-board/data/tasks.json` を変更する。

変更内容は次の通り。

- `statusLabel` を `Drill In Progress` から `In Progress` に変更する

該当箇所は次のように変更する。

```json
{
  "projectName": "Git/GitHub Practice Task Board",
  "statusLabel": "In Progress"
}
```

この急ぎの修正は、残タスク数表示の改善とは別の作業としてコミットする。

## 作業の流れ

1. 作業開始前に、現在のブランチと作業状態を確認する。
2. 残タスク数表示の改善用ブランチを作成する。
3. `app.js` と `styles.css` を編集する。
4. 編集後の作業状態と差分を確認する。
5. まだコミットせず、途中作業を一時退避する。
6. 作業ツリーが clean になったことを確認する。
7. 急ぎの修正用ブランチを作成する。
8. `tasks.json` のステータスラベルを修正する。
9. 急ぎの修正内容をコミットする。
10. 急ぎの修正用ブランチを `main` に取り込む。
11. 残タスク数表示の改善用ブランチへ戻る。
12. `main` の最新状態を改善用ブランチへ反映する。
13. 退避していた作業を復帰する。
14. 復帰した変更内容を確認する。
15. 残タスク数表示の改善内容をコミットする。
16. 残タスク数表示の改善用ブランチを `main` に取り込む。
17. 不要になった作業ブランチを削除する。
18. 最後に、作業状態と退避中の作業一覧を確認する。

## 完了条件

次の状態になっていれば、この課題は完了とする。

- 急ぎのステータスラベル修正がコミットされている
- 残タスク数表示の改善がコミットされている
- どちらの変更も `main` に取り込まれている
- `practice/task-board/data/tasks.json` の `statusLabel` が `In Progress` になっている
- `practice/task-board/src/app.js` のサマリー表示に `Remaining` が含まれている
- `practice/task-board/styles.css` の `.summary` に `letter-spacing` が追加されている
- 作業ツリーが clean になっている
- 退避中の stash が残っていない
- 作業で使用したブランチが削除されている

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

残タスク数表示の改善用ブランチを作成して切り替える。

```bash
git switch -c feature/show-remaining-task-count
```

出力例：

```text
Switched to a new branch 'feature/show-remaining-task-count'
```

`practice/task-board/src/app.js` を編集する。  
変更箇所は次のような内容になる。

```javascript
const doneCount = taskData.tasks.filter((task) => task.done).length;
const remainingCount = taskData.tasks.length - doneCount;
const summaryState =
  doneCount === taskData.tasks.length ? "summary-complete" : "summary-progress";

summaryElement.className = `summary ${summaryState}`;
summaryElement.textContent = `${taskData.projectName} / ${taskData.statusLabel} / Done: ${doneCount}/${taskData.tasks.length} / Remaining: ${remainingCount}`;
```

`practice/task-board/styles.css` の `.summary` に `letter-spacing` を追加する。

```css
.summary {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 999px;
  font-weight: 600;
  letter-spacing: 0.02em;
}
```

編集後の作業状態を確認する。

```bash
git status
```

表示例：

```text
On branch feature/show-remaining-task-count
Changes not staged for commit:
  modified:   practice/task-board/src/app.js
  modified:   practice/task-board/styles.css
```

変更差分を確認する。

```bash
git diff
```

表示例：

```diff
diff --git a/practice/task-board/src/app.js b/practice/task-board/src/app.js
index 1111111..2222222 100644
--- a/practice/task-board/src/app.js
+++ b/practice/task-board/src/app.js
@@ -5,12 +5,13 @@ async function loadTasks() {
   const taskData = await response.json();

   const doneCount = taskData.tasks.filter((task) => task.done).length;
+  const remainingCount = taskData.tasks.length - doneCount;
   const summaryState =
     doneCount === taskData.tasks.length ? "summary-complete" : "summary-progress";

   summaryElement.className = `summary ${summaryState}`;
-  summaryElement.textContent = `${taskData.projectName} / ${taskData.statusLabel} / Done: ${doneCount}/${taskData.tasks.length}`;
+  summaryElement.textContent = `${taskData.projectName} / ${taskData.statusLabel} / Done: ${doneCount}/${taskData.tasks.length} / Remaining: ${remainingCount}`;

   taskListElement.innerHTML = "";
diff --git a/practice/task-board/styles.css b/practice/task-board/styles.css
index 3333333..4444444 100644
--- a/practice/task-board/styles.css
+++ b/practice/task-board/styles.css
@@ -15,6 +15,7 @@
   padding: 6px 12px;
   border-radius: 999px;
   font-weight: 600;
+  letter-spacing: 0.02em;
 }
```

この時点では、まだコミットしない。  
途中作業を一時退避する。

```bash
git stash push -m "wip: 残タスク数表示の作業途中"
```

出力例：

```text
Saved working directory and index state On feature/show-remaining-task-count: wip: 残タスク数表示の作業途中
```

作業ツリーが clean になったことを確認する。

```bash
git status
```

表示例：

```text
On branch feature/show-remaining-task-count
nothing to commit, working tree clean
```

退避中の作業一覧を確認する。

```bash
git stash list
```

表示例：

```text
stash@{0}: On feature/show-remaining-task-count: wip: 残タスク数表示の作業途中
```

急ぎの修正を行うため、`main` に戻る。

```bash
git switch main
```

出力例：

```text
Switched to branch 'main'
```

急ぎの修正用ブランチを作成する。

```bash
git switch -c hotfix/shorten-status-label
```

出力例：

```text
Switched to a new branch 'hotfix/shorten-status-label'
```

`practice/task-board/data/tasks.json` の `statusLabel` を変更する。

```json
{
  "projectName": "Git/GitHub Practice Task Board",
  "statusLabel": "In Progress"
}
```

変更状態を確認する。

```bash
git status
```

表示例：

```text
On branch hotfix/shorten-status-label
Changes not staged for commit:
  modified:   practice/task-board/data/tasks.json
```

差分を確認する。

```bash
git diff -- practice/task-board/data/tasks.json
```

表示例：

```diff
diff --git a/practice/task-board/data/tasks.json b/practice/task-board/data/tasks.json
index 5555555..6666666 100644
--- a/practice/task-board/data/tasks.json
+++ b/practice/task-board/data/tasks.json
@@ -1,6 +1,6 @@
 {
   "projectName": "Git/GitHub Practice Task Board",
-  "statusLabel": "Drill In Progress",
+  "statusLabel": "In Progress",
   "tasks": [
```

急ぎの修正をステージングする。

```bash
git add practice/task-board/data/tasks.json
```

ステージング済みの差分を確認する。

```bash
git diff --cached
```

表示例：

```diff
diff --git a/practice/task-board/data/tasks.json b/practice/task-board/data/tasks.json
index 5555555..6666666 100644
--- a/practice/task-board/data/tasks.json
+++ b/practice/task-board/data/tasks.json
@@ -1,6 +1,6 @@
 {
   "projectName": "Git/GitHub Practice Task Board",
-  "statusLabel": "Drill In Progress",
+  "statusLabel": "In Progress",
   "tasks": [
```

急ぎの修正をコミットする。

```bash
git commit -m "fix: ステータスラベルの文言を短縮"
```

出力例：

```text
[hotfix/shorten-status-label 123abcd] fix: ステータスラベルの文言を短縮
 1 file changed, 1 insertion(+), 1 deletion(-)
```

`main` に戻る。

```bash
git switch main
```

出力例：

```text
Switched to branch 'main'
```

急ぎの修正を `main` に取り込む。

```bash
git merge hotfix/shorten-status-label
```

出力例：

```text
Updating abc1234..123abcd
Fast-forward
 practice/task-board/data/tasks.json | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
```

不要になった急ぎの修正用ブランチを削除する。

```bash
git branch -d hotfix/shorten-status-label
```

出力例：

```text
Deleted branch hotfix/shorten-status-label (was 123abcd).
```

残タスク数表示の改善用ブランチへ戻る。

```bash
git switch feature/show-remaining-task-count
```

出力例：

```text
Switched to branch 'feature/show-remaining-task-count'
```

`main` の最新状態を改善用ブランチへ反映する。  
このブランチでは、まだコミットを作成していないため、通常は fast-forward になる。

```bash
git merge main
```

出力例：

```text
Updating abc1234..123abcd
Fast-forward
 practice/task-board/data/tasks.json | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
```

退避していた作業を復帰する。

```bash
git stash pop
```

出力例：

```text
On branch feature/show-remaining-task-count
Changes not staged for commit:
  modified:   practice/task-board/src/app.js
  modified:   practice/task-board/styles.css

Dropped refs/stash@{0}
```

復帰した変更を確認する。

```bash
git status
```

表示例：

```text
On branch feature/show-remaining-task-count
Changes not staged for commit:
  modified:   practice/task-board/src/app.js
  modified:   practice/task-board/styles.css
```

退避中の作業が残っていないことを確認する。

```bash
git stash list
```

表示例：

```text

```

復帰した差分を確認する。

```bash
git diff
```

表示例：

```diff
diff --git a/practice/task-board/src/app.js b/practice/task-board/src/app.js
index 1111111..2222222 100644
--- a/practice/task-board/src/app.js
+++ b/practice/task-board/src/app.js
@@ -5,12 +5,13 @@ async function loadTasks() {
   const taskData = await response.json();

   const doneCount = taskData.tasks.filter((task) => task.done).length;
+  const remainingCount = taskData.tasks.length - doneCount;
   const summaryState =
     doneCount === taskData.tasks.length ? "summary-complete" : "summary-progress";

   summaryElement.className = `summary ${summaryState}`;
-  summaryElement.textContent = `${taskData.projectName} / ${taskData.statusLabel} / Done: ${doneCount}/${taskData.tasks.length}`;
+  summaryElement.textContent = `${taskData.projectName} / ${taskData.statusLabel} / Done: ${doneCount}/${taskData.tasks.length} / Remaining: ${remainingCount}`;
diff --git a/practice/task-board/styles.css b/practice/task-board/styles.css
index 3333333..4444444 100644
--- a/practice/task-board/styles.css
+++ b/practice/task-board/styles.css
@@ -15,6 +15,7 @@
   padding: 6px 12px;
   border-radius: 999px;
   font-weight: 600;
+  letter-spacing: 0.02em;
 }
```

残タスク数表示の改善をステージングする。

```bash
git add practice/task-board/src/app.js practice/task-board/styles.css
```

ステージング済みの差分を確認する。

```bash
git diff --cached
```

表示例：

```diff
diff --git a/practice/task-board/src/app.js b/practice/task-board/src/app.js
index 1111111..2222222 100644
--- a/practice/task-board/src/app.js
+++ b/practice/task-board/src/app.js
@@ -5,12 +5,13 @@ async function loadTasks() {
   const taskData = await response.json();

   const doneCount = taskData.tasks.filter((task) => task.done).length;
+  const remainingCount = taskData.tasks.length - doneCount;
   const summaryState =
     doneCount === taskData.tasks.length ? "summary-complete" : "summary-progress";

   summaryElement.className = `summary ${summaryState}`;
-  summaryElement.textContent = `${taskData.projectName} / ${taskData.statusLabel} / Done: ${doneCount}/${taskData.tasks.length}`;
+  summaryElement.textContent = `${taskData.projectName} / ${taskData.statusLabel} / Done: ${doneCount}/${taskData.tasks.length} / Remaining: ${remainingCount}`;
diff --git a/practice/task-board/styles.css b/practice/task-board/styles.css
index 3333333..4444444 100644
--- a/practice/task-board/styles.css
+++ b/practice/task-board/styles.css
@@ -15,6 +15,7 @@
   padding: 6px 12px;
   border-radius: 999px;
   font-weight: 600;
+  letter-spacing: 0.02em;
 }
```

残タスク数表示の改善をコミットする。

```bash
git commit -m "feat: 残タスク数の表示を追加"
```

出力例：

```text
[feature/show-remaining-task-count 456efgh] feat: 残タスク数の表示を追加
 2 files changed, 3 insertions(+), 1 deletion(-)
```

`main` に戻る。

```bash
git switch main
```

出力例：

```text
Switched to branch 'main'
```

残タスク数表示の改善用ブランチを `main` に取り込む。

```bash
git merge feature/show-remaining-task-count
```

出力例：

```text
Updating 123abcd..456efgh
Fast-forward
 practice/task-board/src/app.js | 2 +-
 practice/task-board/styles.css | 1 +
 2 files changed, 3 insertions(+), 1 deletion(-)
```

不要になった改善用ブランチを削除する。

```bash
git branch -d feature/show-remaining-task-count
```

出力例：

```text
Deleted branch feature/show-remaining-task-count (was 456efgh).
```

最後に、作業状態を確認する。

```bash
git status
```

表示例：

```text
On branch main
nothing to commit, working tree clean
```

退避中の作業が残っていないことも確認する。

```bash
git stash list
```

表示例：

```text

```

ブランチ一覧を確認する。

```bash
git branch
```

表示例：

```text
* main
```

## 学習ポイント

この課題では、`stash` によって作業途中の変更を一時退避し、別作業を先に進める流れを確認する。

`git stash push` は、まだコミットしたくない変更を一時的に退避するために使う。  
退避すると、作業ツリーは clean な状態に戻る。  
そのため、急ぎの修正や別ブランチでの作業に安全に切り替えやすくなる。

`git stash list` では、退避中の作業一覧を確認できる。  
作業内容が複数あると分かりにくくなるため、`git stash push -m "..."` のようにメッセージを付けると、何の作業を退避したか判断しやすくなる。

`git stash pop` は、退避していた変更を復帰し、復帰に成功すると stash から削除する。  
復帰後は、`git status` と `git diff` で、意図した変更が戻っているか確認する。

今回のように、途中作業を退避したあとに `main` が進んだ場合は、元の作業ブランチへ戻ってから `main` の変更を取り込んでおくと、最新状態の上で作業を再開できる。  
今回は変更ファイルが分かれているため、通常は conflict にならない。

また、`stash` は便利だが、長期間ため込むと何を退避したのか分かりにくくなる。  
退避した作業は、なるべく早めに復帰して、必要であればコミットとして残すことが重要となる。

## 補足

`git stash pop` ではなく、`git stash apply` を使う方法もある。  
`apply` は退避内容を復帰しても stash を削除しない。  
一方で、`pop` は復帰に成功すると stash を削除する。

今回のように、退避した作業をそのまま元に戻して作業を続ける場合は、`pop` で問題ない。  
ただし、復帰後も stash を残しておきたい場合や、慎重に扱いたい場合は、`apply` を使う選択肢もある。

今回の課題では tracked file の変更だけを退避している。  
新規作成した未追跡ファイルも含めて退避したい場合は、`git stash push -u` のように `-u` を付ける必要がある。  
ただし、課題ドキュメントなど、退避したくない未追跡ファイルまで含まれる可能性があるため、使う前に `git status` で対象を確認することが重要となる。
