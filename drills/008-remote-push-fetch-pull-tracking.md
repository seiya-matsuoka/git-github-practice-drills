# 008. remote と同期操作

> ローカルの変更をGitHubへpushし、GitHub上の変更をfetch/pullで取り込む

## 想定シチュエーション

ローカルで進めている Git/GitHub 操作ドリル用リポジトリを、GitHub上のリモートリポジトリと同期する。

まず、ローカルリポジトリに `origin` が設定されているか確認する。  
未設定の場合は、GitHub上に用意したリモートリポジトリを `origin` として追加する。

その後、ローカルの `main` ブランチをGitHubへpushし、tracking branch を設定する。  
さらに、ローカルで小さなドキュメントを追加してpushする。

最後に、GitHub上で同じドキュメントに追記した想定の変更を作り、ローカル側で `fetch` と `pull` を使って取り込む。

この課題では、ローカルとGitHub上のリモートリポジトリの関係を確認しながら、基本的な同期操作を練習する。

## この課題の目的

この課題では、リモートリポジトリとの同期操作として、次の流れを確認する。

- リモートリポジトリ設定を確認する
- `origin` を追加する
- ローカルブランチをGitHubへpushする
- tracking branch を設定する
- ローカルの変更をコミットしてpushする
- GitHub上の変更を `fetch` で確認する
- GitHub上の変更を `pull` でローカルに取り込む
- ローカルブランチとリモート追跡ブランチの関係を確認する

## 使用する主な操作

- リモートリポジトリ設定の確認
- リモートリポジトリの追加
- tracking branch の確認
- push
- fetch
- pull
- リモート追跡ブランチの確認
- GitHub上でのファイル編集
- 同期後の状態確認

## 事前状態

この課題は、次の状態から開始する想定とする。

- 007の課題が完了している
- 現在のブランチは `main`
- 作業ツリーは clean
- GitHub上に `git-github-practice-drills` 用のリモートリポジトリを用意できる
- すでに `origin` が設定済みの場合は、その設定を使って進める
- `origin` が未設定の場合は、自分のGitHubリポジトリURLを使って追加する

この課題で追加するファイルは次の通り。

```text
practice/
  task-board/
    docs/
      remote-sync-note.md
```

`origin` のURLは、次のように自分のGitHubアカウントに合わせて読み替える。

```text
https://github.com/<your-account>/git-github-practice-drills.git
```

GitHub上に新しくリポジトリを作成する場合は、README、`.gitignore`、license などを自動生成しない空のリポジトリとして作成すると進めやすい。

## 課題内容

ローカルの `main` ブランチをGitHub上のリモートリポジトリと同期する。

まず、`origin` が設定されているか確認する。  
未設定の場合は、自分のGitHubリポジトリURLを使って `origin` を追加する。

次に、ローカルの `main` ブランチをGitHubへpushし、tracking branch を設定する。

その後、`practice/task-board/docs/remote-sync-note.md` を追加する。  
ファイル内容は次の通り。

```markdown
# Remote Sync Note

このファイルは、GitHubとの同期操作を練習するためのメモです。

## Local note

ローカルで作成した変更をGitHubへpushします。
```

このファイルをコミットし、GitHubへpushする。

次に、GitHub上で `practice/task-board/docs/remote-sync-note.md` を編集し、末尾に次の内容を追記する。

```markdown
## GitHub note

GitHub上で追記した変更をローカルへ取り込みます。
```

GitHub上の変更を作成したあと、ローカルで `fetch` を実行し、リモート追跡ブランチが更新されることを確認する。  
最後に `pull` でGitHub上の変更をローカルの `main` に取り込む。

## 作業の流れ

1. 作業開始前に、現在のブランチと作業状態を確認する。
2. `origin` が設定されているか確認する。
3. `origin` が未設定の場合は、自分のGitHubリポジトリURLを使って追加する。
4. ローカルの `main` ブランチをGitHubへpushし、tracking branch を設定する。
5. tracking branch が設定されていることを確認する。
6. 同期練習用のメモファイルを追加する。
7. 追加したファイルをコミットする。
8. 追加したコミットをGitHubへpushする。
9. GitHub上で同じメモファイルに追記する。
10. ローカルで `fetch` を実行し、GitHub上の変更を取得する。
11. ローカルの `main` と `origin/main` の関係を確認する。
12. `pull` でGitHub上の変更をローカルへ取り込む。
13. 取り込み後の作業状態、履歴、ファイル内容を確認する。

## 完了条件

次の状態になっていれば、この課題は完了とする。

- `origin` が設定されている
- ローカルの `main` が `origin/main` を tracking branch として持っている
- ローカルの変更をGitHubへpushできている
- GitHub上で追記した変更をローカルへ取り込めている
- `practice/task-board/docs/remote-sync-note.md` にローカル作成分とGitHub追記分の両方が含まれている
- コミット後の作業ツリーが clean になっている
- `git branch -vv` で `main` と `origin/main` の対応を確認できる

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

現在のブランチを確認する。

```bash
git branch
```

表示例：

```text
* main
```

リモートリポジトリの設定を確認する。

```bash
git remote -v
```

`origin` が未設定の場合の表示例：

```text

```

すでに `origin` が設定されている場合の表示例：

```text
origin  https://github.com/<your-account>/git-github-practice-drills.git (fetch)
origin  https://github.com/<your-account>/git-github-practice-drills.git (push)
```

`origin` が未設定の場合は、自分のGitHubリポジトリURLを指定して追加する。

```bash
git remote add origin https://github.com/<your-account>/git-github-practice-drills.git
```

リモート設定を再度確認する。

```bash
git remote -v
```

表示例：

```text
origin  https://github.com/<your-account>/git-github-practice-drills.git (fetch)
origin  https://github.com/<your-account>/git-github-practice-drills.git (push)
```

ローカルの `main` ブランチをGitHubへpushし、tracking branch を設定する。

```bash
git push -u origin main
```

出力例：

```text
Enumerating objects: 80, done.
Counting objects: 100% (80/80), done.
Writing objects: 100% (80/80), done.
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

tracking branch を確認する。

```bash
git branch -vv
```

表示例：

```text
* main abc1234 [origin/main] 最新のコミットメッセージ
```

同期練習用のメモファイルを追加する。

```markdown
# Remote Sync Note

このファイルは、GitHubとの同期操作を練習するためのメモです。

## Local note

ローカルで作成した変更をGitHubへpushします。
```

作業状態を確認する。

```bash
git status --short
```

表示例：

```text
?? practice/task-board/docs/remote-sync-note.md
```

追加したファイルをステージングする。

```bash
git add practice/task-board/docs/remote-sync-note.md
```

ステージング済みの差分を確認する。

```bash
git diff --cached -- practice/task-board/docs/remote-sync-note.md
```

表示例：

```diff
diff --git a/practice/task-board/docs/remote-sync-note.md b/practice/task-board/docs/remote-sync-note.md
new file mode 100644
index 0000000..1111111
--- /dev/null
+++ b/practice/task-board/docs/remote-sync-note.md
@@ -0,0 +1,7 @@
+# Remote Sync Note
+
+このファイルは、GitHubとの同期操作を練習するためのメモです。
+
+## Local note
+
+ローカルで作成した変更をGitHubへpushします。
```

コミットを作成する。

```bash
git commit -m "docs: リモート同期メモを追加"
```

出力例：

```text
[main def5678] docs: リモート同期メモを追加
 1 file changed, 7 insertions(+)
 create mode 100644 practice/task-board/docs/remote-sync-note.md
```

作成したコミットをGitHubへpushする。

```bash
git push
```

出力例：

```text
Enumerating objects: 6, done.
Counting objects: 100% (6/6), done.
Writing objects: 100% (4/4), done.
To https://github.com/<your-account>/git-github-practice-drills.git
   abc1234..def5678  main -> main
```

GitHub上で `practice/task-board/docs/remote-sync-note.md` を編集し、末尾に次の内容を追記する。

```markdown
## GitHub note

GitHub上で追記した変更をローカルへ取り込みます。
```

GitHub上でコミットしたあと、ローカル側の作業状態を確認する。

```bash
git status
```

表示例：

```text
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

この時点では、まだローカルがGitHub上の最新状態を取得していないため、`up to date` と表示される場合がある。  
次に `fetch` を実行して、リモート追跡ブランチを更新する。

```bash
git fetch origin
```

出力例：

```text
remote: Enumerating objects: 5, done.
remote: Counting objects: 100% (5/5), done.
From https://github.com/<your-account>/git-github-practice-drills
   def5678..789abcd  main       -> origin/main
```

`fetch` 後に、ローカルブランチと tracking branch の関係を確認する。

```bash
git branch -vv
```

表示例：

```text
* main def5678 [origin/main: behind 1] docs: リモート同期メモを追加
```

`behind 1` は、ローカルの `main` が `origin/main` より1コミット遅れていることを表す。

リモート追跡ブランチを含めて履歴を確認する。

```bash
git log --oneline --decorate --all -5
```

表示例：

```text
789abcd (origin/main) docs: GitHub側の同期メモを追記
def5678 (HEAD -> main) docs: リモート同期メモを追加
abc1234 直前までのコミット
```

GitHub上の変更をローカルへ取り込む。

```bash
git pull
```

出力例：

```text
Updating def5678..789abcd
Fast-forward
 practice/task-board/docs/remote-sync-note.md | 4 ++++
 1 file changed, 4 insertions(+)
```

取り込み後の作業状態を確認する。

```bash
git status
```

表示例：

```text
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

ファイル内容を確認する。

```bash
cat practice/task-board/docs/remote-sync-note.md
```

表示例：

```markdown
# Remote Sync Note

このファイルは、GitHubとの同期操作を練習するためのメモです。

## Local note

ローカルで作成した変更をGitHubへpushします。

## GitHub note

GitHub上で追記した変更をローカルへ取り込みます。
```

最後に、tracking branch と履歴を確認する。

```bash
git branch -vv
```

表示例：

```text
* main 789abcd [origin/main] docs: GitHub側の同期メモを追記
```

```bash
git log --oneline --decorate --all -5
```

表示例：

```text
789abcd (HEAD -> main, origin/main) docs: GitHub側の同期メモを追記
def5678 docs: リモート同期メモを追加
abc1234 直前までのコミット
```

## 学習ポイント

この課題では、ローカルリポジトリとGitHub上のリモートリポジトリの関係を確認する。

`git remote -v` では、ローカルリポジトリに設定されているリモートリポジトリを確認できる。  
一般的には、GitHub上のリポジトリを `origin` という名前で登録することが多い。

`git push -u origin main` は、ローカルの `main` を `origin` の `main` へpushし、同時に tracking branch を設定する操作となる。  
tracking branch が設定されると、以降は `git push` や `git pull` のように、リモート名やブランチ名を省略して操作しやすくなる。

`git branch -vv` では、ローカルブランチがどのリモート追跡ブランチと対応しているかを確認できる。  
`[origin/main]` と表示されていれば、ローカルの `main` が `origin/main` を追跡していることを表す。

`git fetch` は、GitHub上の最新情報を取得して、リモート追跡ブランチを更新する操作となる。  
ただし、`fetch` だけではローカルの作業ブランチには変更を取り込まない。  
そのため、`fetch` 後は `origin/main` が進んでいても、ローカルの `main` はまだ古い状態のままになる。

`git pull` は、基本的に `fetch` と、その後の取り込み操作をまとめて行う。  
今回のようにローカル側に追加コミットがなく、GitHub側だけが進んでいる場合は、fast-forward で取り込まれる。

`behind 1` は、ローカルブランチがリモート追跡ブランチより1コミット遅れている状態を表す。  
逆に、ローカルだけが進んでいる場合は `ahead 1` のように表示される。

## 補足

GitHub上に新しくリポジトリを作成する場合、README や `.gitignore`、license をGitHub側で自動生成すると、ローカルの履歴とGitHub側の履歴が最初から分かれることがある。  
そのため、空のリモートリポジトリを作成してから `git push -u origin main` する方が分かりやすい。

すでに `origin` が設定されている場合は、`git remote add origin ...` は不要となる。  
その場合は、`git remote -v` でURLを確認してから次の操作へ進む。

GitHub上でファイルを編集した直後でも、ローカル側は自動では最新状態を知ることができない。  
ローカルで `fetch` や `pull` を実行して初めて、GitHub上の変更を確認・取得できる。
