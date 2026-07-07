# 009. GitHub Flow と Pull Request

> 作業ブランチをpushし、PR作成・追加修正・merge後の同期まで行う

## 想定シチュエーション

タスクボードに、Pull Request 作業時に使うチェックリストを追加する。

作業は `main` へ直接コミットせず、作業ブランチを作成して進める。  
作業ブランチで変更をコミットしたら、GitHubへpushして Pull Request を作成する。

Pull Request 作成後、レビュー指摘があった想定でローカル側に追加修正を行い、同じ作業ブランチへ追加コミットする。  
追加コミットをpushして Pull Request に反映されたことを確認したら、GitHub上で Pull Request を merge する。

最後に、ローカルの `main` をGitHub上の最新状態に更新し、作業済みブランチを整理する。

この課題では、GitHub Flow の基本となる「ブランチ作成 → push → PR → 追加修正 → merge → ローカル同期 → ブランチ削除」の流れを練習する。

## この課題の目的

この課題では、GitHub Flow と Pull Request 作業として、次の流れを確認する。

- `main` を最新状態にしてから作業を始める
- 作業ブランチを作成する
- 作業ブランチで変更をコミットする
- 作業ブランチをGitHubへpushする
- GitHub上で Pull Request を作成する
- Pull Request 作成後に追加修正を行う
- 追加コミットをpushして Pull Request に反映する
- GitHub上で Pull Request を merge する
- ローカルの `main` を最新化する
- 不要になった作業ブランチを削除する

## 使用する主な操作

- 作業ブランチの作成
- ファイル作成
- ファイル編集
- 差分確認
- コミット作成
- 作業ブランチのpush
- Pull Request 作成
- Pull Request への追加コミット反映
- GitHub上での merge
- `main` の同期
- ローカルブランチの削除
- リモート追跡ブランチの整理

## 事前状態

この課題は、次の状態から開始する想定とする。

- 008の課題が完了している
- 現在のブランチは `main`
- 作業ツリーは clean
- `origin` が設定されている
- ローカルの `main` が `origin/main` を追跡している
- GitHub上の `main` とローカルの `main` が同期済みである
- `practice/task-board/docs/remote-sync-note.md` が存在する

この課題で作成・編集するファイルは次の通り。

```text
practice/
  task-board/
    docs/
      pr-checklist.md
      remote-sync-note.md
```

## 課題内容

Pull Request 作業用のチェックリストを追加する。

まず、作業ブランチを作成し、次の新規ファイルを追加する。

```text
practice/task-board/docs/pr-checklist.md
```

作成するファイルの内容は次の通り。

```markdown
# Pull Request Checklist

このファイルは、Pull Request 作業の確認項目をまとめるためのメモです。

## Before creating a PR

- 作業ブランチで変更している
- コミット前に差分を確認している
- 関係のない変更を含めていない
- Pull Request の目的を説明できる

## Before merging

- レビュー指摘を確認している
- 追加修正を同じ作業ブランチに反映している
- GitHub上で差分を確認している
```

あわせて、既存の `practice/task-board/docs/remote-sync-note.md` の末尾に、Pull Request 作業に関するメモを追記する。

追記する内容は次の通り。

```markdown
## Pull Request note

Pull Request を使うと、作業ブランチの変更を確認してから main に取り込めます。
```

ここまでの変更を1つのコミットとして作成し、作業ブランチをGitHubへpushする。  
その後、GitHub上で Pull Request を作成する。

Pull Request 作成後、レビュー指摘があった想定で、`practice/task-board/docs/pr-checklist.md` の `Before merging` に次の項目を追加する。

```markdown
- merge 後にローカルの main を更新している
```

追加修正を別コミットとして作成し、同じ作業ブランチへpushする。  
GitHub上で Pull Request に追加コミットが反映されたことを確認し、Pull Request を merge する。

この課題では、GitHub上の merge 方法は通常の merge commit を前提とする。

merge 後、ローカルの `main` を最新化し、作業ブランチを削除する。

## 作業の流れ

1. 作業開始前に、現在のブランチと作業状態を確認する。
2. `main` が `origin/main` と同期していることを確認する。
3. 作業ブランチを作成する。
4. Pull Request 作業用チェックリストを新規作成する。
5. 既存の同期メモに Pull Request に関するメモを追記する。
6. 作業状態と差分を確認する。
7. 変更をコミットする。
8. 作業ブランチをGitHubへpushする。
9. GitHub上で Pull Request を作成する。
10. レビュー指摘があった想定で、チェックリストに追加項目を入れる。
11. 追加修正を別コミットとして作成する。
12. 追加コミットをGitHubへpushする。
13. GitHub上で Pull Request の差分と追加コミットを確認する。
14. GitHub上で Pull Request を merge する。
15. ローカルの `main` に戻る。
16. GitHub上で merge された内容をローカルの `main` に取り込む。
17. 不要になった作業ブランチを削除する。
18. ブランチ一覧と作業状態を確認する。

## 完了条件

次の状態になっていれば、この課題は完了とする。

- Pull Request 作業用の作業ブランチが作成されている
- `practice/task-board/docs/pr-checklist.md` が追加されている
- `practice/task-board/docs/remote-sync-note.md` に Pull Request に関するメモが追記されている
- Pull Request 作成前のコミットが作成されている
- Pull Request 作成後の追加修正コミットが作成されている
- 作業ブランチがGitHubへpushされている
- GitHub上で Pull Request が作成されている
- Pull Request に追加コミットが反映されている
- Pull Request がGitHub上で merge されている
- ローカルの `main` に merge 後の内容が取り込まれている
- ローカルの作業ブランチが削除されている
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

tracking branch の状態を確認する。

```bash
git branch -vv
```

表示例：

```text
* main abc1234 [origin/main] 最新のコミットメッセージ
```

念のため、リモートの最新情報を取得する。

```bash
git fetch origin
```

出力例：

```text

```

`main` が `origin/main` と揃っていることを確認する。

```bash
git status
```

表示例：

```text
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

作業ブランチを作成して切り替える。

```bash
git switch -c feature/add-pr-checklist
```

出力例：

```text
Switched to a new branch 'feature/add-pr-checklist'
```

新規ファイル `practice/task-board/docs/pr-checklist.md` を作成する。

```markdown
# Pull Request Checklist

このファイルは、Pull Request 作業の確認項目をまとめるためのメモです。

## Before creating a PR

- 作業ブランチで変更している
- コミット前に差分を確認している
- 関係のない変更を含めていない
- Pull Request の目的を説明できる

## Before merging

- レビュー指摘を確認している
- 追加修正を同じ作業ブランチに反映している
- GitHub上で差分を確認している
```

既存の `practice/task-board/docs/remote-sync-note.md` の末尾に、次の内容を追記する。

```markdown
## Pull Request note

Pull Request を使うと、作業ブランチの変更を確認してから main に取り込めます。
```

作業状態を確認する。

```bash
git status --short
```

表示例：

```text
 M practice/task-board/docs/remote-sync-note.md
?? practice/task-board/docs/pr-checklist.md
```

差分の概要を確認する。

```bash
git diff --stat
```

表示例：

```text
 practice/task-board/docs/remote-sync-note.md | 4 ++++
 practice/task-board/docs/pr-checklist.md     | 14 ++++++++++++++
 2 files changed, 18 insertions(+)
```

新規ファイルの内容を確認する。

```bash
git diff -- practice/task-board/docs/pr-checklist.md
```

表示例：

```diff
diff --git a/practice/task-board/docs/pr-checklist.md b/practice/task-board/docs/pr-checklist.md
new file mode 100644
index 0000000..1111111
--- /dev/null
+++ b/practice/task-board/docs/pr-checklist.md
@@ -0,0 +1,14 @@
+# Pull Request Checklist
+
+このファイルは、Pull Request 作業の確認項目をまとめるためのメモです。
+
+## Before creating a PR
+
+- 作業ブランチで変更している
+- コミット前に差分を確認している
+- 関係のない変更を含めていない
+- Pull Request の目的を説明できる
+
+## Before merging
+
+- レビュー指摘を確認している
+- 追加修正を同じ作業ブランチに反映している
+- GitHub上で差分を確認している
```

既存ファイルの追記内容を確認する。

```bash
git diff -- practice/task-board/docs/remote-sync-note.md
```

表示例：

```diff
diff --git a/practice/task-board/docs/remote-sync-note.md b/practice/task-board/docs/remote-sync-note.md
index 2222222..3333333 100644
--- a/practice/task-board/docs/remote-sync-note.md
+++ b/practice/task-board/docs/remote-sync-note.md
@@ -10,3 +10,7 @@ GitHub上で追記した変更をローカルへ取り込みます。
+
+## Pull Request note
+
+Pull Request を使うと、作業ブランチの変更を確認してから main に取り込めます。
```

変更をステージングする。

```bash
git add practice/task-board/docs/pr-checklist.md practice/task-board/docs/remote-sync-note.md
```

ステージング済みの差分を確認する。

```bash
git diff --cached --stat
```

表示例：

```text
 practice/task-board/docs/remote-sync-note.md | 4 ++++
 practice/task-board/docs/pr-checklist.md     | 14 ++++++++++++++
 2 files changed, 18 insertions(+)
```

コミットを作成する。

```bash
git commit -m "docs: PR作業用チェックリストを追加"
```

出力例：

```text
[feature/add-pr-checklist def5678] docs: PR作業用チェックリストを追加
 2 files changed, 18 insertions(+)
 create mode 100644 practice/task-board/docs/pr-checklist.md
```

作業ブランチをGitHubへpushし、tracking branch を設定する。

```bash
git push -u origin feature/add-pr-checklist
```

出力例：

```text
Enumerating objects: 7, done.
Counting objects: 100% (7/7), done.
Writing objects: 100% (5/5), done.
remote:
remote: Create a pull request for 'feature/add-pr-checklist' on GitHub by visiting:
remote:      https://github.com/<your-account>/git-github-practice-drills/pull/new/feature/add-pr-checklist
remote:
To https://github.com/<your-account>/git-github-practice-drills.git
 * [new branch]      feature/add-pr-checklist -> feature/add-pr-checklist
Branch 'feature/add-pr-checklist' set up to track remote branch 'feature/add-pr-checklist' from 'origin'.
```

GitHub上で Pull Request を作成する。

Pull Request の内容例：

```text
Title:
docs: PR作業用チェックリストを追加

Description:
## Summary

- Pull Request 作業用のチェックリストを追加
- remote-sync-note.md に Pull Request に関するメモを追記

## Notes

GitHub Flow の練習として、PR作成後に追加修正も行う。
```

Pull Request 作成後、レビュー指摘があった想定で、`practice/task-board/docs/pr-checklist.md` の `Before merging` に次の項目を追加する。

```markdown
- merge 後にローカルの main を更新している
```

追加後の該当箇所は次のようになる。

```markdown
## Before merging

- レビュー指摘を確認している
- 追加修正を同じ作業ブランチに反映している
- GitHub上で差分を確認している
- merge 後にローカルの main を更新している
```

追加修正後の状態を確認する。

```bash
git status --short
```

表示例：

```text
 M practice/task-board/docs/pr-checklist.md
```

追加修正の差分を確認する。

```bash
git diff -- practice/task-board/docs/pr-checklist.md
```

表示例：

```diff
diff --git a/practice/task-board/docs/pr-checklist.md b/practice/task-board/docs/pr-checklist.md
index 1111111..2222222 100644
--- a/practice/task-board/docs/pr-checklist.md
+++ b/practice/task-board/docs/pr-checklist.md
@@ -12,3 +12,4 @@
 - レビュー指摘を確認している
 - 追加修正を同じ作業ブランチに反映している
 - GitHub上で差分を確認している
+- merge 後にローカルの main を更新している
```

追加修正をステージングする。

```bash
git add practice/task-board/docs/pr-checklist.md
```

追加修正のコミットを作成する。

```bash
git commit -m "docs: PR後の同期確認項目を追加"
```

出力例：

```text
[feature/add-pr-checklist 789abcd] docs: PR後の同期確認項目を追加
 1 file changed, 1 insertion(+)
```

追加コミットをGitHubへpushする。

```bash
git push
```

出力例：

```text
Enumerating objects: 5, done.
Counting objects: 100% (5/5), done.
Writing objects: 100% (3/3), done.
To https://github.com/<your-account>/git-github-practice-drills.git
   def5678..789abcd  feature/add-pr-checklist -> feature/add-pr-checklist
```

GitHub上で Pull Request を確認する。

確認する内容：

```text
- Pull Request に2つのコミットが表示されている
- Files changed に pr-checklist.md の追加が表示されている
- Files changed に remote-sync-note.md の追記が表示されている
- 追加修正したチェック項目が反映されている
```

GitHub上で Pull Request を merge する。

この課題では、通常の merge commit を前提とする。  
GitHub上では、`Merge pull request` を選択して merge する。

merge 後、ローカルの `main` に戻る。

```bash
git switch main
```

出力例：

```text
Switched to branch 'main'
Your branch is up to date with 'origin/main'.
```

GitHub上で merge された最新状態を取得する。

```bash
git pull
```

出力例：

```text
remote: Enumerating objects: 10, done.
remote: Counting objects: 100% (10/10), done.
From https://github.com/<your-account>/git-github-practice-drills
   abc1234..fedcba9  main       -> origin/main
Updating abc1234..fedcba9
Fast-forward
 practice/task-board/docs/remote-sync-note.md | 4 ++++
 practice/task-board/docs/pr-checklist.md     | 15 +++++++++++++++
 2 files changed, 19 insertions(+)
 create mode 100644 practice/task-board/docs/pr-checklist.md
```

作業状態を確認する。

```bash
git status
```

表示例：

```text
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

履歴を確認する。

```bash
git log --oneline --graph --decorate --all -10
```

表示例：

```text
*   fedcba9 (HEAD -> main, origin/main) Merge pull request #1 from <your-account>/feature/add-pr-checklist
|\
| * 789abcd (origin/feature/add-pr-checklist, feature/add-pr-checklist) docs: PR後の同期確認項目を追加
| * def5678 docs: PR作業用チェックリストを追加
|/
* abc1234 直前までのコミット
```

作業済みのローカルブランチを削除する。

```bash
git branch -d feature/add-pr-checklist
```

出力例：

```text
Deleted branch feature/add-pr-checklist (was 789abcd).
```

GitHub上の作業ブランチを削除済みの場合は、リモート追跡ブランチを整理する。

```bash
git fetch --prune
```

出力例：

```text
From https://github.com/<your-account>/git-github-practice-drills
 - [deleted]         (none)     -> origin/feature/add-pr-checklist
```

ブランチ一覧を確認する。

```bash
git branch -a
```

表示例：

```text
* main
  remotes/origin/main
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

この課題では、GitHub Flow の基本的な流れを確認する。

GitHub Flow では、`main` に直接変更を入れるのではなく、作業ブランチを作成して変更する。  
作業ブランチをGitHubへpushし、Pull Request を作成することで、変更内容を確認してから `main` に取り込める。

Pull Request 作成後も、同じ作業ブランチに追加コミットをpushすれば、Pull Request に自動で反映される。  
そのため、レビュー指摘に対する修正は、基本的に同じ作業ブランチで行う。

`git push -u origin feature/add-pr-checklist` を実行すると、作業ブランチがGitHubへ作成され、同時に tracking branch も設定される。  
tracking branch が設定されると、以降は同じブランチ上で `git push` とするだけで、対応するGitHub上のブランチへpushできる。

Pull Request をGitHub上で merge しても、ローカルの `main` は自動では更新されない。  
ローカル側では `git switch main` で `main` に戻り、`git pull` でGitHub上の最新状態を取り込む必要がある。

PR merge 後は、作業済みブランチを削除することで、不要なブランチが残り続けることを防げる。  
GitHub上で作業ブランチを削除した場合、ローカルでは `git fetch --prune` によって削除済みのリモート追跡ブランチを整理できる。

## 補足

この課題では、Pull Request の merge 方法として通常の merge commit を前提としている。  
通常の merge commit で merge した場合、作業ブランチ上のコミットが履歴に残り、merge commit によって `main` に統合される。

GitHubには、他にも `Squash and merge` や `Rebase and merge` がある。  
それぞれ履歴の残り方が異なるため、後続のドリルで別途扱う。

Pull Request の説明文は、実務ではチームのテンプレートに従うことが多い。  
今回は練習用として、変更内容と確認ポイントが分かる程度の簡単な説明でよい。
