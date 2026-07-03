# 007. conflict の発生と解消

> 同じ設定値を別ブランチで変更し、merge 時の競合を解消する

## 想定シチュエーション

タスクボードのステータス表示を変更する作業を、作業ブランチで進めている。  
その途中で、`main` 側にも同じ設定値を変更する別作業が入った。

その後、作業ブランチを `main` に取り込もうとすると、同じ箇所を別々の内容に変更しているため conflict が発生する。

この課題では、意図的に conflict を発生させ、Gitがどのような状態になるかを確認する。  
そのうえで、競合箇所を手動で修正し、merge を完了させる。

## この課題の目的

この課題では、merge 時の conflict 対応として、次の流れを確認する。

- 作業ブランチで変更を行う
- `main` 側でも同じ箇所を別内容に変更する
- merge によって conflict を発生させる
- conflict 発生時の `git status` を確認する
- conflict marker が入ったファイルを確認する
- 手動で競合箇所を修正する
- 修正済みファイルをステージングする
- merge commit を作成して merge を完了する
- 履歴上で merge commit を確認する

## 使用する主な操作

- 作業ブランチの作成
- ブランチ切り替え
- ファイル編集
- コミット作成
- merge
- conflict 状態の確認
- conflict marker の確認
- 競合箇所の手動修正
- merge commit の作成
- 履歴確認

## 事前状態

この課題は、次の状態から開始する想定とする。

- 006の課題が完了している
- 現在のブランチは `main`
- 作業ツリーは clean
- `practice/task-board/data/tasks.json` が存在する
- `practice/task-board/data/tasks.json` に `statusLabel` が定義されている

この課題では、`practice/task-board/data/tasks.json` の `statusLabel` を conflict の対象にする。

対象箇所の例は次の通り。

```json
"statusLabel": "Drill In Progress"
```

実際の値が上記と異なる場合でも、`statusLabel` の行を対象にして進める。

## 課題内容

`practice/task-board/data/tasks.json` の `statusLabel` を、作業ブランチ側と `main` 側で別々の内容に変更する。

まず、作業ブランチを作成し、`statusLabel` を次の内容に変更してコミットする。

```json
"statusLabel": "Feature Review"
```

その後、`main` に戻り、同じ `statusLabel` を次の内容に変更してコミットする。

```json
"statusLabel": "Main Review"
```

その状態で、作業ブランチを `main` に merge する。  
同じ行を別々の内容に変更しているため、conflict が発生する。

conflict が発生したら、`practice/task-board/data/tasks.json` の競合箇所を確認し、最終的に次の内容に修正する。

```json
"statusLabel": "Review In Progress"
```

修正後、merge を完了する。

## 作業の流れ

1. 作業開始前に、現在のブランチと作業状態を確認する。
2. conflict 練習用の作業ブランチを作成する。
3. 作業ブランチで `statusLabel` を `Feature Review` に変更する。
4. 作業ブランチで変更内容をコミットする。
5. `main` に戻る。
6. `main` 側で同じ `statusLabel` を `Main Review` に変更する。
7. `main` 側で変更内容をコミットする。
8. 作業ブランチを `main` に merge する。
9. conflict が発生していることを確認する。
10. 競合したファイルの中身を確認する。
11. conflict marker を削除し、最終的な内容に修正する。
12. 修正済みファイルをステージングする。
13. merge commit を作成する。
14. コミット後の作業状態と履歴を確認する。

## 完了条件

次の状態になっていれば、この課題は完了とする。

- `main` ブランチ上で merge が完了している
- `practice/task-board/data/tasks.json` の `statusLabel` が `Review In Progress` になっている
- conflict marker がファイル内に残っていない
- merge commit が作成されている
- コミット後の作業ツリーが clean になっている
- 履歴上で作業ブランチのコミットと merge commit を確認できる

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

現在のブランチ一覧を確認する。

```bash
git branch
```

表示例：

```text
* main
```

conflict 練習用の作業ブランチを作成して切り替える。

```bash
git switch -c feature/update-review-status
```

出力例：

```text
Switched to a new branch 'feature/update-review-status'
```

`practice/task-board/data/tasks.json` の `statusLabel` を変更する。

変更前の例：

```json
"statusLabel": "Drill In Progress"
```

変更後：

```json
"statusLabel": "Feature Review"
```

変更後の作業状態を確認する。

```bash
git status
```

表示例：

```text
On branch feature/update-review-status
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
index 1111111..2222222 100644
--- a/practice/task-board/data/tasks.json
+++ b/practice/task-board/data/tasks.json
@@ -1,6 +1,6 @@
 {
   "projectName": "Git/GitHub Practice Task Board",
-  "statusLabel": "Drill In Progress",
+  "statusLabel": "Feature Review",
   "tasks": [
```

変更をステージングする。

```bash
git add practice/task-board/data/tasks.json
```

コミットを作成する。

```bash
git commit -m "feat: レビュー用ステータスを設定"
```

出力例：

```text
[feature/update-review-status abc1234] feat: レビュー用ステータスを設定
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

`main` 側で、同じ `statusLabel` を別の内容に変更する。

変更後：

```json
"statusLabel": "Main Review"
```

変更後の差分を確認する。

```bash
git diff -- practice/task-board/data/tasks.json
```

表示例：

```diff
diff --git a/practice/task-board/data/tasks.json b/practice/task-board/data/tasks.json
index 1111111..3333333 100644
--- a/practice/task-board/data/tasks.json
+++ b/practice/task-board/data/tasks.json
@@ -1,6 +1,6 @@
 {
   "projectName": "Git/GitHub Practice Task Board",
-  "statusLabel": "Drill In Progress",
+  "statusLabel": "Main Review",
   "tasks": [
```

`main` 側の変更をステージングする。

```bash
git add practice/task-board/data/tasks.json
```

`main` 側の変更をコミットする。

```bash
git commit -m "feat: main側のレビュー表示を更新"
```

出力例：

```text
[main def5678] feat: main側のレビュー表示を更新
 1 file changed, 1 insertion(+), 1 deletion(-)
```

作業ブランチを `main` に merge する。

```bash
git merge feature/update-review-status
```

出力例：

```text
Auto-merging practice/task-board/data/tasks.json
CONFLICT (content): Merge conflict in practice/task-board/data/tasks.json
Automatic merge failed; fix conflicts and then commit the result.
```

conflict 発生後の状態を確認する。

```bash
git status
```

表示例：

```text
On branch main
You have unmerged paths.
  (fix conflicts and run "git commit")

Unmerged paths:
  both modified:   practice/task-board/data/tasks.json
```

短い形式でも確認する。

```bash
git status --short
```

表示例：

```text
UU practice/task-board/data/tasks.json
```

`UU` は、両方のブランチで同じファイルが変更され、まだ解消されていない状態を表す。

競合箇所を確認する。

```bash
cat practice/task-board/data/tasks.json
```

表示例：

```json
{
  "projectName": "Git/GitHub Practice Task Board",
<<<<<<< HEAD
  "statusLabel": "Main Review",
=======
  "statusLabel": "Feature Review",
>>>>>>> feature/update-review-status
  "tasks": [
    {
      "id": 1,
```

conflict marker を削除し、最終的な内容に修正する。

修正後：

```json
{
  "projectName": "Git/GitHub Practice Task Board",
  "statusLabel": "Review In Progress",
  "tasks": [
    {
      "id": 1,
      "title": "Check repository status",
      "done": true
    }
  ]
}
```

上記は該当箇所の例であり、実際には既存の `tasks` 配列全体は削除せず、`statusLabel` の競合箇所だけを修正する。  
重要なのは、次の conflict marker がファイル内に残っていない状態にすることとなる。

```text
<<<<<<< HEAD
=======
>>>>>>> feature/update-review-status
```

修正後の差分を確認する。

```bash
git diff
```

表示例：

```diff
diff --cc practice/task-board/data/tasks.json
index 3333333,2222222..0000000
--- a/practice/task-board/data/tasks.json
+++ b/practice/task-board/data/tasks.json
@@@ -1,6 -1,6 +1,6 @@@
  {
    "projectName": "Git/GitHub Practice Task Board",
-   "statusLabel": "Main Review",
 -  "statusLabel": "Feature Review",
++  "statusLabel": "Review In Progress",
    "tasks": [
```

修正済みファイルをステージングする。

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
All conflicts fixed but you are still merging.
  (use "git commit" to conclude merge)
```

merge commit を作成する。

```bash
git commit
```

エディタが開いた場合は、表示された merge commit message をそのまま利用して保存する。  
コマンドでメッセージを指定する場合は、次のようにしてもよい。

```bash
git commit -m "merge: レビュー用ステータス変更を統合"
```

出力例：

```text
[main 789abcd] merge: レビュー用ステータス変更を統合
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

履歴をグラフ形式で確認する。

```bash
git log --oneline --graph --decorate --all -10
```

表示例：

```text
*   789abcd (HEAD -> main) merge: レビュー用ステータス変更を統合
|\
| * abc1234 (feature/update-review-status) feat: レビュー用ステータスを設定
* | def5678 feat: main側のレビュー表示を更新
|/
* 123abcd feat: 途中までの既存コミット
```

merge 済みの作業ブランチが不要であれば削除する。

```bash
git branch -d feature/update-review-status
```

出力例：

```text
Deleted branch feature/update-review-status (was abc1234).
```

削除後のブランチ一覧を確認する。

```bash
git branch
```

表示例：

```text
* main
```

## 学習ポイント

この課題では、merge 時に conflict が発生したときの状態確認と解消手順を確認する。

conflict は、同じファイルの同じ箇所を複数のブランチで別々に変更した場合などに発生する。  
Gitが自動でどちらを採用すべきか判断できないため、人間がファイルを確認して最終的な内容を決める必要がある。

conflict 発生後の `git status` では、`both modified` と表示される。  
短い形式の `git status --short` では、`UU` と表示される。  
これは、両方のブランチで同じファイルが変更され、まだ解決されていないことを表す。

ファイル内には、次のような conflict marker が挿入される。

```text
<<<<<<< HEAD
=======
>>>>>>> feature/update-review-status
```

`<<<<<<< HEAD` 側は、現在いるブランチ、今回であれば `main` 側の変更を表す。  
`=======` より下は、merge しようとしているブランチ側の変更を表す。

conflict を解消するときは、単にどちらか一方を選ぶだけとは限らない。  
今回のように、両方の意図を踏まえた第三の内容に修正することもある。

修正後は、conflict marker を必ず削除する。  
その後、修正済みファイルを `git add` することで、Gitに「このファイルの conflict は解消済み」と伝える。

`git add` 後に `git status` を確認すると、`All conflicts fixed but you are still merging.` のように表示される。  
この状態で `git commit` すると、merge が完了する。

## 補足

今回の課題では、conflict を学習しやすくするために、`statusLabel` の同じ行を意図的に別々の内容へ変更している。

実務では、conflict が起きたときに焦ってファイルを上書きするのではなく、まず `git status` で状態を確認することが重要となる。  
そのうえで、競合箇所を読み、どの変更を残すべきか、またはどのように統合すべきかを判断する。

VS Code などのエディタでは、conflict marker を見やすく表示し、どちらの変更を採用するか選べる場合がある。  
ただし、ツールに任せる場合でも、最終的なファイル内容を確認してから `git add` することが重要となる。
