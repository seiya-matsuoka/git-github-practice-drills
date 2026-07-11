# 010. 取り消し・部分取り込み・復旧

> revert / cherry-pick / reflog を使い、誤った変更の取り消しと必要な変更の復旧を行う

## 想定シチュエーション

タスクボードのドキュメント整備中に、いくつかのGit操作が必要になった。

まず、`main` に不要なメモをコミットしてしまったため、履歴を消さずに安全に取り消す。  
次に、別ブランチで作成した有用なリリースメモだけを `main` に取り込む。  
最後に、取り込んだコミットを誤って `reset` で戻してしまった想定で、`reflog` から復旧する。

この課題では、実務で遭遇しやすい次の3つの場面を1つの流れで練習する。

- 公開済み・共有済みの変更を安全に取り消す
- 別ブランチの一部の変更だけを取り込む
- 誤った履歴操作から直前の状態を復旧する

## この課題の目的

この課題では、取り消し・部分取り込み・復旧に関する次の流れを確認する。

- 不要なコミットを `revert` で安全に取り消す
- `revert` が新しい取り消しコミットを作成することを確認する
- 別ブランチの特定コミットだけを `cherry-pick` で取り込む
- `cherry-pick` 後の履歴を確認する
- 誤って履歴を戻した状態を作る
- `reflog` でHEADの移動履歴を確認する
- `reflog` を手がかりに、失ったように見えるコミットを復旧する

## 使用する主な操作

- 作業状態の確認
- コミット作成
- revert
- 作業ブランチの作成
- cherry-pick
- reset
- reflog
- 復旧操作
- 履歴確認

## 事前状態

この課題は、次の状態から開始する想定とする。

- 009の課題が完了している
- 現在のブランチは `main`
- 作業ツリーは clean
- `origin` が設定されている
- ローカルの `main` と `origin/main` が同期済みである
- `practice/task-board/docs/remote-sync-note.md` が存在する
- `practice/task-board/docs/pr-checklist.md` が存在する

この課題で作成・編集する主なファイルは次の通り。

```text
practice/
  task-board/
    docs/
      pr-checklist.md
      release-note.md
```

## 課題内容

この課題では、次の3つの操作を順番に行う。

### 変更1: 不要なメモをコミットし、revert で取り消す

まず、`main` 上で `practice/task-board/docs/pr-checklist.md` の末尾に、不要な一時メモを追記する。

追記する内容は次の通り。

```markdown
## Temporary note

このメモは不要な変更としてあとから取り消します。
```

この変更を一度コミットする。  
その後、この不要なコミットを `revert` で取り消す。

取り消し後、`practice/task-board/docs/pr-checklist.md` から上記の一時メモが消えていることを確認する。

### 変更2: 別ブランチで作成したリリースメモだけを cherry-pick する

次に、リリースメモ作成用の作業ブランチを作成する。

作業ブランチで、次の新規ファイルを作成する。

```text
practice/task-board/docs/release-note.md
```

作成するファイルの内容は次の通り。

```markdown
# Release Note

このファイルは、Git操作ドリルで扱った変更内容を記録するためのメモです。

## v0.1.0

- タスクボードの基本ファイルを追加
- 表示文言をGit/GitHub練習用に更新
- Pull Request 作業用のチェックリストを追加
```

この変更を作業ブランチ上でコミットする。

その後、`main` に戻り、作業ブランチ全体を merge するのではなく、リリースメモ追加コミットだけを `cherry-pick` で取り込む。

### 変更3: 誤った reset から reflog で復旧する

`cherry-pick` でリリースメモを取り込んだあと、誤って直前のコミットを取り消す操作を行った想定にする。

具体的には、`main` 上で直前のコミットを1つ戻す。  
その結果、`practice/task-board/docs/release-note.md` が消えたように見える状態になる。

その後、`reflog` でHEADの移動履歴を確認し、`cherry-pick` 直後のコミットを探す。  
見つけたコミットへ戻し、`release-note.md` が復旧していることを確認する。

## 作業の流れ

1. 作業開始前に、現在のブランチと作業状態を確認する。
2. `main` が `origin/main` と同期していることを確認する。
3. `pr-checklist.md` に不要な一時メモを追記する。
4. 不要な一時メモの変更をコミットする。
5. 作成した不要コミットを `revert` で取り消す。
6. 一時メモが消えていることと、取り消しコミットが作成されていることを確認する。
7. リリースメモ作成用の作業ブランチを作成する。
8. 作業ブランチで `release-note.md` を作成する。
9. リリースメモ追加のコミットを作成する。
10. `main` に戻る。
11. 作業ブランチ上のリリースメモ追加コミットだけを `main` に取り込む。
12. `main` に `release-note.md` が追加されたことを確認する。
13. 誤って直前のコミットを戻した状態を作る。
14. `release-note.md` が消えたように見えることを確認する。
15. `reflog` でHEADの移動履歴を確認する。
16. `cherry-pick` 直後のコミットを探し、その状態へ戻す。
17. `release-note.md` が復旧していることを確認する。
18. 作業状態と履歴を確認する。

## 完了条件

次の状態になっていれば、この課題は完了とする。

- 不要な一時メモを追加したコミットが作成されている
- その不要コミットが `revert` によって取り消されている
- `practice/task-board/docs/pr-checklist.md` に一時メモが残っていない
- 別ブランチで `practice/task-board/docs/release-note.md` を追加するコミットが作成されている
- `main` にリリースメモ追加コミットが `cherry-pick` で取り込まれている
- 誤った reset 後に `reflog` を使って復旧できている
- 最終的に `main` 上に `practice/task-board/docs/release-note.md` が存在する
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
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

リモートの最新情報を取得する。

```bash
git fetch origin
```

出力例：

```text

```

tracking branch の状態を確認する。

```bash
git branch -vv
```

表示例：

```text
* main abc1234 [origin/main] 最新のコミットメッセージ
```

`practice/task-board/docs/pr-checklist.md` の末尾に不要な一時メモを追記する。

```markdown
## Temporary note

このメモは不要な変更としてあとから取り消します。
```

変更状態を確認する。

```bash
git status --short
```

表示例：

```text
 M practice/task-board/docs/pr-checklist.md
```

差分を確認する。

```bash
git diff -- practice/task-board/docs/pr-checklist.md
```

表示例：

```diff
diff --git a/practice/task-board/docs/pr-checklist.md b/practice/task-board/docs/pr-checklist.md
index 1111111..2222222 100644
--- a/practice/task-board/docs/pr-checklist.md
+++ b/practice/task-board/docs/pr-checklist.md
@@ -14,3 +14,7 @@
 - 追加修正を同じ作業ブランチに反映している
 - GitHub上で差分を確認している
 - merge 後にローカルの main を更新している
+
+## Temporary note
+
+このメモは不要な変更としてあとから取り消します。
```

不要な一時メモを一度コミットする。

```bash
git add practice/task-board/docs/pr-checklist.md
git commit -m "docs: 一時メモを追加"
```

出力例：

```text
[main def5678] docs: 一時メモを追加
 1 file changed, 4 insertions(+)
```

直前のコミットを確認する。

```bash
git log --oneline --decorate -3
```

表示例：

```text
def5678 (HEAD -> main) docs: 一時メモを追加
abc1234 直前までのコミット
```

不要なコミットを `revert` で取り消す。

```bash
git revert HEAD --no-edit
```

出力例：

```text
[main 234abcd] Revert "docs: 一時メモを追加"
 1 file changed, 4 deletions(-)
```

一時メモが消えていることを確認する。

```bash
grep -n "Temporary note" practice/task-board/docs/pr-checklist.md
```

表示例：

```text

```

何も表示されなければ、該当文言は残っていない。

履歴を確認する。

```bash
git log --oneline --decorate -5
```

表示例：

```text
234abcd (HEAD -> main) Revert "docs: 一時メモを追加"
def5678 docs: 一時メモを追加
abc1234 直前までのコミット
```

`revert` は元のコミットを履歴から消すのではなく、打ち消すための新しいコミットを作成する。

リリースメモ作成用の作業ブランチを作成する。

```bash
git switch -c feature/add-release-note
```

出力例：

```text
Switched to a new branch 'feature/add-release-note'
```

`practice/task-board/docs/release-note.md` を作成する。

```markdown
# Release Note

このファイルは、Git操作ドリルで扱った変更内容を記録するためのメモです。

## v0.1.0

- タスクボードの基本ファイルを追加
- 表示文言をGit/GitHub練習用に更新
- Pull Request 作業用のチェックリストを追加
```

作業状態を確認する。

```bash
git status --short
```

表示例：

```text
?? practice/task-board/docs/release-note.md
```

差分を確認する。

```bash
git diff -- practice/task-board/docs/release-note.md
```

表示例：

```diff
diff --git a/practice/task-board/docs/release-note.md b/practice/task-board/docs/release-note.md
new file mode 100644
index 0000000..1111111
--- /dev/null
+++ b/practice/task-board/docs/release-note.md
@@ -0,0 +1,9 @@
+# Release Note
+
+このファイルは、Git操作ドリルで扱った変更内容を記録するためのメモです。
+
+## v0.1.0
+
+- タスクボードの基本ファイルを追加
+- 表示文言をGit/GitHub練習用に更新
+- Pull Request 作業用のチェックリストを追加
```

リリースメモ追加のコミットを作成する。

```bash
git add practice/task-board/docs/release-note.md
git commit -m "docs: リリースメモを追加"
```

出力例：

```text
[feature/add-release-note 345bcde] docs: リリースメモを追加
 1 file changed, 9 insertions(+)
 create mode 100644 practice/task-board/docs/release-note.md
```

このコミットIDをあとで `cherry-pick` に使うため、確認する。

```bash
git log --oneline --decorate -3
```

表示例：

```text
345bcde (HEAD -> feature/add-release-note) docs: リリースメモを追加
234abcd (main) Revert "docs: 一時メモを追加"
def5678 docs: 一時メモを追加
```

`main` に戻る。

```bash
git switch main
```

出力例：

```text
Switched to branch 'main'
```

作業ブランチ全体を merge するのではなく、リリースメモ追加コミットだけを取り込む。

```bash
git cherry-pick 345bcde
```

出力例：

```text
[main 456cdef] docs: リリースメモを追加
 Date: Tue Jul 7 20:00:00 2026 +0900
 1 file changed, 9 insertions(+)
 create mode 100644 practice/task-board/docs/release-note.md
```

`main` にリリースメモが追加されていることを確認する。

```bash
ls practice/task-board/docs
```

表示例：

```text
pr-checklist.md
release-note.md
remote-sync-note.md
```

ファイル内容を確認する。

```bash
cat practice/task-board/docs/release-note.md
```

表示例：

```markdown
# Release Note

このファイルは、Git操作ドリルで扱った変更内容を記録するためのメモです。

## v0.1.0

- タスクボードの基本ファイルを追加
- 表示文言をGit/GitHub練習用に更新
- Pull Request 作業用のチェックリストを追加
```

ここから、誤って直前のコミットを戻してしまった状態を作る。  
この操作は学習用の意図的な操作となる。

```bash
git reset --hard HEAD~1
```

出力例：

```text
HEAD is now at 234abcd Revert "docs: 一時メモを追加"
```

`release-note.md` が消えたように見えることを確認する。

```bash
ls practice/task-board/docs
```

表示例：

```text
pr-checklist.md
remote-sync-note.md
```

直近の履歴を確認する。

```bash
git log --oneline --decorate -5
```

表示例：

```text
234abcd (HEAD -> main) Revert "docs: 一時メモを追加"
def5678 docs: 一時メモを追加
abc1234 直前までのコミット
```

この状態では、`cherry-pick` で作成された `docs: リリースメモを追加` のコミットが、通常の `git log` からは見えなくなっている。

`reflog` でHEADの移動履歴を確認する。

```bash
git reflog --oneline
```

表示例：

```text
234abcd HEAD@{0}: reset: moving to HEAD~1
456cdef HEAD@{1}: cherry-pick: docs: リリースメモを追加
234abcd HEAD@{2}: checkout: moving from feature/add-release-note to main
345bcde HEAD@{3}: commit: docs: リリースメモを追加
```

`reflog` から、`cherry-pick` 直後のコミットを探す。  
上の例では、次のコミットが復旧したい状態となる。

```text
456cdef HEAD@{1}: cherry-pick: docs: リリースメモを追加
```

`cherry-pick` 直後の状態へ戻す。

```bash
git reset --hard 456cdef
```

出力例：

```text
HEAD is now at 456cdef docs: リリースメモを追加
```

`release-note.md` が復旧していることを確認する。

```bash
ls practice/task-board/docs
```

表示例：

```text
pr-checklist.md
release-note.md
remote-sync-note.md
```

作業状態を確認する。

```bash
git status
```

表示例：

```text
On branch main
Your branch is ahead of 'origin/main' by 3 commits.

nothing to commit, working tree clean
```

履歴を確認する。

```bash
git log --oneline --decorate -8
```

表示例：

```text
456cdef (HEAD -> main) docs: リリースメモを追加
234abcd Revert "docs: 一時メモを追加"
def5678 docs: 一時メモを追加
abc1234 直前までのコミット
```

作業ブランチが不要であれば削除する。

```bash
git branch -d feature/add-release-note
```

出力例：

```text
Deleted branch feature/add-release-note (was 345bcde).
```

必要に応じて、復旧後の `main` をGitHubへpushする。

```bash
git push
```

出力例：

```text
Enumerating objects: 8, done.
Counting objects: 100% (8/8), done.
Writing objects: 100% (6/6), done.
To https://github.com/<your-account>/git-github-practice-drills.git
   abc1234..456cdef  main -> main
```

## 学習ポイント

この課題では、`revert`、`cherry-pick`、`reflog` の役割の違いを確認する。

`revert` は、既存のコミットを履歴から消すのではなく、その変更を打ち消す新しいコミットを作成する。  
そのため、すでにGitHubへpush済みの変更や、他の人と共有済みの変更を安全に取り消したい場合に使いやすい。

`reset` は、ブランチの指すコミットを移動する操作となる。  
特に `reset --hard` は、作業ツリーの内容も指定したコミットに戻すため、未コミットの変更や直近のコミットが見えなくなることがある。  
今回のように学習目的で意図的に使う場合でも、実務では慎重に扱う必要がある。

`cherry-pick` は、別ブランチにある特定のコミットだけを現在のブランチに取り込む操作となる。  
ブランチ全体を merge したくないが、一部の変更だけ必要な場合に使える。

`reflog` は、HEADやブランチが過去にどのコミットを指していたかを確認するための履歴となる。  
通常の `git log` から見えなくなったコミットでも、`reflog` に残っていれば復旧できる場合がある。

今回の復旧では、`git reflog` で `cherry-pick` 直後のコミットを見つけ、そのコミットへ `reset --hard` で戻している。  
これにより、誤って戻してしまった `release-note.md` 追加コミットを復旧している。

## 補足

`git reset --hard` は強い操作であり、作業ツリーの内容も戻す。  
未コミットの変更がある状態で実行すると、その変更が失われる可能性がある。

今回の課題では、`reflog` から復旧する流れを学ぶために、あえて `reset --hard HEAD~1` を使っている。  
実務で使う場合は、実行前に `git status` や `git log` を確認し、必要であれば `stash` や一時ブランチで退避してから行う。

また、`cherry-pick` は便利だが、同じ変更を複数の履歴に重複して取り込む可能性がある。  
なぜそのコミットだけを取り込むのか、あとで merge する予定があるのかを考えて使うことが重要となる。
