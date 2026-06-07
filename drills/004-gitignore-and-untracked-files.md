# 004. `.gitignore` と管理対象外ファイル

> ローカル設定・ログ・生成物を除外し、必要なファイルだけをコミットする

## 想定シチュエーション

タスクボードの開発中に、ローカル実行用の設定ファイル、ログファイル、ビルド結果、カバレッジ結果のようなファイルが作成された。  
これらは開発中には必要だが、Git で管理するべきではない。

一方で、ローカル設定の雛形となるサンプルファイルは、チームメンバーが環境を用意するために Git で管理したい。

この課題では、管理対象にするファイルと管理対象外にするファイルを整理し、`.gitignore` を作成して不要なファイルが `git status` に表示されない状態にする。

## この課題の目的

この課題では、`.gitignore` を使った管理対象外ファイルの整理を確認する。

- 未追跡ファイルの状態を確認する
- 管理対象にするファイルと除外するファイルを区別する
- `.gitignore` を作成する
- `.gitignore` によって `git status` の表示が変わることを確認する
- 必要なファイルだけをステージングする
- ステージング済みの内容を確認する
- `.gitignore` と管理対象にするファイルだけをコミットする

## 使用する主な操作

- 作業状態の確認
- 未追跡ファイルの確認
- `.gitignore` の作成
- 無視対象ファイルの確認
- 対象ファイルを指定したステージング
- ステージング済み差分の確認
- コミット作成
- コミット後の状態確認

## 事前状態

この課題は、次の状態から開始する想定とする。

- 003 の課題が完了している
- 現在のブランチは `main`
- 作業ツリーは clean
- `practice/task-board/` 配下に、これまでの課題で使用したファイルが存在する
- 今回の課題用となる次のファイルが追加されている
  - 追加するファイルのうち、Git で管理したくない対象となるファイルはどのような内容でもよい。

```text
drills/
  004-gitignore-and-untracked-files.md

practice/
  task-board/
    .env.local
    config/
      app.example.env
    coverage/
      summary.txt
    dist/
      bundle.js
      index.html
    logs/
      app.log
```

今回追加されるファイルのうち、Git で管理したいファイルは次の通り。

```text
drills/004-gitignore-and-untracked-files.md
practice/task-board/config/app.example.env
```

今回追加されるファイルのうち、Git で管理したくないファイルは次の通り。

```text
practice/task-board/.env.local
practice/task-board/coverage/summary.txt
practice/task-board/dist/bundle.js
practice/task-board/dist/index.html
practice/task-board/logs/app.log
```

## 課題内容

リポジトリ直下に `.gitignore` を作成する。

`.gitignore` には、次の内容を記載する。

```gitignore
# local environment files
.env
.env.*
!.env.example
!*.example.env

# generated files
dist/
coverage/

# logs
*.log
logs/
```

`.gitignore` 作成後、`practice/task-board/.env.local`、`dist/`、`coverage/`、`logs/` 配下のファイルが通常の `git status` に表示されなくなることを確認する。

そのうえで、次のファイルだけをコミット対象にする。

```text
.gitignore
drills/004-gitignore-and-untracked-files.md
practice/task-board/config/app.example.env
```

ローカル設定ファイル、ログファイル、生成物、カバレッジ結果はコミットしない。

## 作業の流れ

1. 作業開始前に、現在のブランチと作業状態を確認する。
2. 今回の課題用の追加された未追跡ファイルを確認する。
3. 管理対象にするファイルと管理対象外にするファイルを区別する。
4. リポジトリ直下に `.gitignore` を作成する。
5. `.gitignore` 作成後、通常の作業状態表示から不要なファイルが消えることを確認する。
6. 無視されているファイルも含めた状態を確認する。
7. Git で管理したいファイルだけをステージングする。
8. ステージング済みの内容を確認する。
9. `.gitignore` と必要なファイルだけをコミットする。
10. コミット後の作業状態を確認する。

## 完了条件

次の状態になっていれば、この課題は完了とする。

- リポジトリ直下に `.gitignore` が作成されている
- `.gitignore` にローカル設定、生成物、ログ、カバレッジ結果の除外設定が記載されている
- `practice/task-board/config/app.example.env` は Git で管理されている
- `practice/task-board/.env.local` は Git で管理されていない
- `practice/task-board/dist/` 配下のファイルは Git で管理されていない
- `practice/task-board/coverage/` 配下のファイルは Git で管理されていない
- `practice/task-board/logs/` 配下のファイルは Git で管理されていない
- `.gitignore` と必要なファイルを含むコミットが1つ作成されている
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

今回の課題用ファイルを追加したあと、未追跡ファイルを確認する。

```bash
git status --short --untracked-files=all
```

表示例：

```text
?? drills/004-gitignore-and-untracked-files.md
?? practice/task-board/.env.local
?? practice/task-board/config/app.example.env
?? practice/task-board/coverage/summary.txt
?? practice/task-board/dist/bundle.js
?? practice/task-board/dist/index.html
?? practice/task-board/logs/app.log
```

この時点では、ローカル設定ファイル、生成物、ログファイルもすべて未追跡ファイルとして表示されている。

リポジトリ直下に `.gitignore` を作成する。

```gitignore
# local environment files
.env
.env.*
!.env.example
!*.example.env

# generated files
dist/
coverage/

# logs
*.log
logs/
```

`.gitignore` 作成後、通常の作業状態を確認する。

```bash
git status --short --untracked-files=all
```

表示例：

```text
?? .gitignore
?? drills/004-gitignore-and-untracked-files.md
?? practice/task-board/config/app.example.env
```

`.env.local`、`dist/`、`coverage/`、`logs/` 配下のファイルが通常の `git status` に表示されなくなる。  
一方で、`practice/task-board/config/app.example.env` は管理対象にしたいため、未追跡ファイルとして表示される。

無視されているファイルも含めて確認する。

```bash
git status --ignored --short --untracked-files=all
```

表示例：

```text
?? .gitignore
?? drills/004-gitignore-and-untracked-files.md
?? practice/task-board/config/app.example.env
!! practice/task-board/.env.local
!! practice/task-board/coverage/summary.txt
!! practice/task-board/dist/bundle.js
!! practice/task-board/dist/index.html
!! practice/task-board/logs/app.log
```

`!!` が付いているファイルは、`.gitignore` によって無視されているファイルとなる。

Git で管理したいファイルだけをステージングする。

```bash
git add .gitignore drills/004-gitignore-and-untracked-files.md practice/task-board/config/app.example.env
```

ステージング後の状態を確認する。

```bash
git status --short --untracked-files=all
```

表示例：

```text
A  .gitignore
A  drills/004-gitignore-and-untracked-files.md
A  practice/task-board/config/app.example.env
```

ステージング済みの差分を確認する。

```bash
git diff --cached --stat
```

表示例：

```text
 .gitignore                                   | 11 +++++++++++
 drills/004-gitignore-and-untracked-files.md | 220 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 practice/task-board/config/app.example.env   |  3 +++
 3 files changed, 234 insertions(+)
```

`.gitignore` の内容も確認する。

```bash
git diff --cached -- .gitignore
```

表示例：

```diff
diff --git a/.gitignore b/.gitignore
new file mode 100644
index 0000000..1111111
--- /dev/null
+++ b/.gitignore
@@ -0,0 +1,11 @@
+# local environment files
+.env
+.env.*
+!.env.example
+!*.example.env
+
+# generated files
+dist/
+coverage/
+
+# logs
+*.log
+logs/
```

コミットを作成する。

```bash
git commit -m "chore: 管理対象外ファイルの設定を追加"
```

出力例：

```text
[main 789abcd] chore: 管理対象外ファイルの設定を追加
 3 files changed, 234 insertions(+)
 create mode 100644 .gitignore
 create mode 100644 drills/004-gitignore-and-untracked-files.md
 create mode 100644 practice/task-board/config/app.example.env
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

無視されているファイルが作業ディレクトリに残っていることも確認する。

```bash
git status --ignored --short --untracked-files=all
```

表示例：

```text
!! practice/task-board/.env.local
!! practice/task-board/coverage/summary.txt
!! practice/task-board/dist/bundle.js
!! practice/task-board/dist/index.html
!! practice/task-board/logs/app.log
```

## 学習ポイント

この課題では、Git で管理するファイルと管理しないファイルを分ける考え方を確認する。

`git status --short --untracked-files=all` を使うと、未追跡ファイルを短い形式で確認できる。  
`.gitignore` を作成する前は、ローカル設定、ログ、生成物、カバレッジ結果も未追跡ファイルとして表示される。

`.gitignore` を作成すると、無視対象にしたファイルは通常の `git status` に表示されなくなる。  
ただし、ファイル自体が消えるわけではない。  
作業ディレクトリには残るが、Git の管理対象からは外れる。

`git status --ignored` を使うと、無視されているファイルも確認できる。  
表示例で `!!` が付いているファイルは、`.gitignore` によって無視されているファイルとなる。

`practice/task-board/config/app.example.env` は、ローカル設定そのものではなく、設定例として管理するファイルである。  
実務でも、`.env.local` や `.env` は管理対象外にし、`.env.example` や `app.example.env` のような雛形ファイルだけを管理することが多い。

また、`.gitignore` は新しく作成される未追跡ファイルを無視するための設定である。  
すでに Git で管理されているファイルは、あとから `.gitignore` に書いても自動では管理対象外にならない。  
その場合は、別途インデックスから外す操作が必要となる。

## 補足

今回の課題では、`dist/`、`coverage/`、`logs/` を除外している。  
これらは、実行結果や生成物として作られることが多く、基本的には Git で管理しないことが多い。

一方で、チームで共有したい設定例やテンプレートは管理対象にする。  
今回の `practice/task-board/config/app.example.env` は、そのような「共有するための設定例」として扱う。

`.gitignore` の書き方はプロジェクトや使用技術によって変わる。  
今回は Git/GitHub の練習ドリルとして、ローカル設定、生成物、ログという代表的な除外対象を扱う。
