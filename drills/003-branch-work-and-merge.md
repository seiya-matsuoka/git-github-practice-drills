# 003. ブランチ作業とマージ

> 作業ブランチでヘルプページを追加し、main に取り込む

## 想定シチュエーション

タスクボードに、簡単な使い方を説明するヘルプページを追加する。  
新しいページを追加する作業のため、直接 `main` では作業せず、作業ブランチを作成して変更する。

作業ブランチ上でファイルを編集・追加し、差分確認、ステージング、コミットまで行う。  
その後、`main` に戻って作業ブランチの変更を取り込む。

この課題では、ブランチを使った基本的な作業フローを練習する。

## この課題の目的

この課題では、ブランチ作業とマージの基本となる次の流れを確認する。

- 作業前に現在の状態を確認する
- 作業ブランチを作成する
- 作業ブランチ上で既存ファイルを編集する
- 作業ブランチ上で新規ファイルを追加する
- 差分を確認してコミットする
- `main` に戻る
- 作業ブランチの変更を `main` に取り込む
- マージ後の履歴と作業状態を確認する
- 不要になった作業ブランチを削除する

## 使用する主な操作

- 作業状態の確認
- ブランチ作成
- ブランチ切り替え
- ファイル編集
- 新規ファイル追加
- 差分確認
- ステージング
- コミット作成
- マージ
- マージ済みブランチの確認
- ローカルブランチ削除
- コミット履歴の確認

## 事前状態

この課題は、次の状態から開始する想定とする。

- 002の課題が完了している
- 現在のブランチは `main`
- 作業ツリーは clean
- `practice/task-board/` 配下に、これまでの課題で使用した練習用ファイルが存在する
- `practice/task-board/index.html` が存在する
- `practice/task-board/styles.css` が存在する

今回の課題では、次のファイルを扱う。

```text
practice/
  task-board/
    index.html
    styles.css
    help.html
```

`help.html` は、この課題で新規作成するファイルである。

## 課題内容

タスクボードにヘルプページを追加する。  
作業は直接 `main` では行わず、作業ブランチで行う。

作業ブランチ名は、次の名前とする。

```text
feature/add-task-board-help
```

変更対象は次の3点とする。

```text
1. index.html にヘルプページへのリンクを追加する
2. help.html を新規作成する
3. styles.css にヘルプページとナビゲーション用のスタイルを追加する
```

### 変更1: index.html にヘルプページへのリンクを追加する

`practice/task-board/index.html` の `<h1>` の下に、ヘルプページへのリンクを追加する。

追加する内容は次の通り。

```html
<nav class="board-nav" aria-label="タスクボードの補助リンク">
  <a href="./help.html">使い方を見る</a>
</nav>
```

追加後の該当箇所は次のようになる。

```html
<main class="board">
  <h1>Git/GitHub Practice Task Board</h1>
  <nav class="board-nav" aria-label="タスクボードの補助リンク">
    <a href="./help.html">使い方を見る</a>
  </nav>
  <p id="summary">Loading tasks...</p>
  <ul id="task-list"></ul>
</main>
```

### 変更2: help.html を新規作成する

`practice/task-board/help.html` を新規作成する。  
ファイル内容は次の通り。

```html
<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <title>Task Board Help</title>
    <link rel="stylesheet" href="./styles.css" />
  </head>
  <body>
    <main class="board">
      <h1>Task Board Help</h1>
      <p class="summary summary-progress">
        Git/GitHub操作ドリル用のヘルプページ
      </p>

      <section>
        <h2>この画面で確認すること</h2>
        <ul class="help-list">
          <li>タスクの完了状態を確認する</li>
          <li>表示文言とデータの差分を確認する</li>
          <li>小さな変更をコミット単位で整理する</li>
        </ul>
      </section>

      <p><a href="./index.html">タスクボードに戻る</a></p>
    </main>
  </body>
</html>
```

### 変更3: styles.css にスタイルを追加する

`practice/task-board/styles.css` に、ナビゲーションとヘルプページ用のスタイルを追加する。

追加する内容は次の通り。

```css
.board-nav {
  margin-bottom: 16px;
}

.board-nav a {
  font-weight: 600;
}

.help-list {
  padding-left: 24px;
  line-height: 1.8;
}
```

追加位置は、既存の `.board h1` の下あたりでよい。

## 作業の流れ

1. 作業開始前に、現在のブランチと作業状態を確認する。
2. ヘルプページ追加用の作業ブランチを作成する。
3. 作業ブランチに切り替わっていることを確認する。
4. `index.html` にヘルプページへのリンクを追加する。
5. `help.html` を新規作成する。
6. `styles.css` にナビゲーションとヘルプページ用のスタイルを追加する。
7. 変更されたファイルと新規ファイルを確認する。
8. 差分を確認する。
9. 変更内容に問題がなければ、対象ファイルをステージングする。
10. ステージング済みの差分を確認する。
11. 作業ブランチ上でコミットを作成する。
12. `main` に戻る。
13. 作業ブランチの変更を `main` に取り込む。
14. マージ後の作業状態と履歴を確認する。
15. マージ済みの作業ブランチを削除する。

## 完了条件

次の状態になっていれば、この課題は完了とする。

- `feature/add-task-board-help` ブランチ上で変更コミットが作成されている
- `practice/task-board/index.html` にヘルプページへのリンクが追加されている
- `practice/task-board/help.html` が新規作成されている
- `practice/task-board/styles.css` にナビゲーションとヘルプページ用のスタイルが追加されている
- 作業ブランチの変更が `main` に取り込まれている
- マージ後の作業ツリーが clean になっている
- 直近の履歴でヘルプページ追加のコミットを確認できる
- マージ済みの作業ブランチが削除されている

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

ヘルプページ追加用の作業ブランチを作成して切り替える。

```bash
git switch -c feature/add-task-board-help
```

出力例：

```text
Switched to a new branch 'feature/add-task-board-help'
```

作業ブランチに切り替わっていることを確認する。

```bash
git status
```

表示例：

```text
On branch feature/add-task-board-help
nothing to commit, working tree clean
```

`practice/task-board/index.html` を編集し、`<h1>` の下にヘルプページへのリンクを追加する。

```html
<main class="board">
  <h1>Git/GitHub Practice Task Board</h1>
  <nav class="board-nav" aria-label="タスクボードの補助リンク">
    <a href="./help.html">使い方を見る</a>
  </nav>
  <p id="summary">Loading tasks...</p>
  <ul id="task-list"></ul>
</main>
```

`practice/task-board/help.html` を新規作成する。

```html
<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <title>Task Board Help</title>
    <link rel="stylesheet" href="./styles.css" />
  </head>
  <body>
    <main class="board">
      <h1>Task Board Help</h1>
      <p class="summary summary-progress">
        Git/GitHub操作ドリル用のヘルプページ
      </p>

      <section>
        <h2>この画面で確認すること</h2>
        <ul class="help-list">
          <li>タスクの完了状態を確認する</li>
          <li>表示文言とデータの差分を確認する</li>
          <li>小さな変更をコミット単位で整理する</li>
        </ul>
      </section>

      <p><a href="./index.html">タスクボードに戻る</a></p>
    </main>
  </body>
</html>
```

`practice/task-board/styles.css` にスタイルを追加する。

```css
.board-nav {
  margin-bottom: 16px;
}

.board-nav a {
  font-weight: 600;
}

.help-list {
  padding-left: 24px;
  line-height: 1.8;
}
```

編集後の作業状態を確認する。

```bash
git status
```

表示例：

```text
On branch feature/add-task-board-help
Changes not staged for commit:
  modified:   practice/task-board/index.html
  modified:   practice/task-board/styles.css

Untracked files:
  practice/task-board/help.html
```

変更ファイル一覧を確認する。

```bash
git diff --name-only
```

表示例：

```text
practice/task-board/index.html
practice/task-board/styles.css
```

未追跡ファイルも含めて確認するため、再度 `git status` の表示を見る。  
`help.html` はまだGit管理対象ではないため、`git diff --name-only` には表示されない。

全体の差分量を確認する。

```bash
git diff --stat
```

表示例：

```text
 practice/task-board/index.html | 3 +++
 practice/task-board/styles.css | 12 ++++++++++++
 2 files changed, 15 insertions(+)
```

新規ファイルの内容は、ステージング前の `git diff` には表示されない。  
必要に応じてファイル内容を直接確認する。

```bash
cat practice/task-board/help.html
```

表示例：

```text
<!doctype html>
<html lang="ja">
  ...
</html>
```

変更差分を確認する。

```bash
git diff
```

表示例：

```diff
diff --git a/practice/task-board/index.html b/practice/task-board/index.html
index 1111111..2222222 100644
--- a/practice/task-board/index.html
+++ b/practice/task-board/index.html
@@ -7,6 +7,9 @@
   <body>
     <main class="board">
       <h1>Git/GitHub Practice Task Board</h1>
+      <nav class="board-nav" aria-label="タスクボードの補助リンク">
+        <a href="./help.html">使い方を見る</a>
+      </nav>
       <p id="summary">Loading tasks...</p>
       <ul id="task-list"></ul>
     </main>
diff --git a/practice/task-board/styles.css b/practice/task-board/styles.css
index 3333333..4444444 100644
--- a/practice/task-board/styles.css
+++ b/practice/task-board/styles.css
@@ -10,6 +10,18 @@
 .board h1 {
   margin-top: 0;
 }
+
+.board-nav {
+  margin-bottom: 16px;
+}
+
+.board-nav a {
+  font-weight: 600;
+}
+
+.help-list {
+  padding-left: 24px;
+  line-height: 1.8;
+}
```

対象ファイルをステージングする。

```bash
git add practice/task-board/index.html practice/task-board/styles.css practice/task-board/help.html
```

ステージング後の状態を確認する。

```bash
git status
```

表示例：

```text
On branch feature/add-task-board-help
Changes to be committed:
  new file:   practice/task-board/help.html
  modified:   practice/task-board/index.html
  modified:   practice/task-board/styles.css
```

ステージング済みの差分を確認する。

```bash
git diff --cached --stat
```

表示例：

```text
 practice/task-board/help.html  | 25 +++++++++++++++++++++++++
 practice/task-board/index.html |  3 +++
 practice/task-board/styles.css | 12 ++++++++++++
 3 files changed, 40 insertions(+)
```

新規ファイルを含むステージング済み差分を確認する。

```bash
git diff --cached
```

表示例：

```diff
diff --git a/practice/task-board/help.html b/practice/task-board/help.html
new file mode 100644
index 0000000..5555555
--- /dev/null
+++ b/practice/task-board/help.html
@@ -0,0 +1,25 @@
+<!doctype html>
+<html lang="ja">
+  ...
+</html>
diff --git a/practice/task-board/index.html b/practice/task-board/index.html
index 1111111..2222222 100644
--- a/practice/task-board/index.html
+++ b/practice/task-board/index.html
@@ -7,6 +7,9 @@
   <body>
     <main class="board">
       <h1>Git/GitHub Practice Task Board</h1>
+      <nav class="board-nav" aria-label="タスクボードの補助リンク">
+        <a href="./help.html">使い方を見る</a>
+      </nav>
```

作業ブランチ上でコミットを作成する。

```bash
git commit -m "feat: タスクボードのヘルプページを追加"
```

出力例：

```text
[feature/add-task-board-help 789abcd] feat: タスクボードのヘルプページを追加
 3 files changed, 40 insertions(+)
 create mode 100644 practice/task-board/help.html
```

コミット後の状態を確認する。

```bash
git status
```

表示例：

```text
On branch feature/add-task-board-help
nothing to commit, working tree clean
```

作業ブランチ上の履歴を確認する。

```bash
git log --oneline --decorate -5
```

表示例：

```text
789abcd (HEAD -> feature/add-task-board-help) feat: タスクボードのヘルプページを追加
...
```

`main` に戻る。

```bash
git switch main
```

出力例：

```text
Switched to branch 'main'
```

`main` に戻ったことを確認する。

```bash
git status
```

表示例：

```text
On branch main
nothing to commit, working tree clean
```

作業ブランチの変更を `main` に取り込む。

```bash
git merge feature/add-task-board-help
```

出力例：

```text
Updating 123abcd..789abcd
Fast-forward
 practice/task-board/help.html  | 25 +++++++++++++++++++++++++
 practice/task-board/index.html |  3 +++
 practice/task-board/styles.css | 12 ++++++++++++
 3 files changed, 40 insertions(+)
 create mode 100644 practice/task-board/help.html
```

マージ後の状態を確認する。

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
git log --oneline --decorate --graph -6
```

表示例：

```text
* 789abcd (HEAD -> main, feature/add-task-board-help) feat: タスクボードのヘルプページを追加
* ...
```

マージ済みブランチを確認する。

```bash
git branch --merged
```

表示例：

```text
  feature/add-task-board-help
* main
```

不要になった作業ブランチを削除する。

```bash
git branch -d feature/add-task-board-help
```

出力例：

```text
Deleted branch feature/add-task-board-help (was 789abcd).
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

この課題では、`main` から作業ブランチを作成し、作業ブランチ上で変更をコミットしてから、`main` に取り込む流れを確認する。

重要なのは、作業場所と取り込み先を分けて考えることとなる。  
変更作業は `feature/add-task-board-help` で行う。  
取り込みは `main` に戻ってから行う。

また、新規ファイルの扱いにも注意する。  
`help.html` は未追跡ファイルのため、ステージング前の `git diff --name-only` や `git diff --stat` には表示されない。  
一方で、`git status` では `Untracked files` として確認できる。

新規ファイルを含む変更を確認する場合は、ステージング後に `git diff --cached` を見ると、コミットに含まれる内容として確認できる。

今回のマージは、`main` 側に追加の変更が入っていない想定のため、Fast-forward になる。  
Fast-forward では、新しいマージコミットは作成されず、`main` の位置が作業ブランチの先端まで進む。

マージ後に作業ブランチを削除しても、変更内容は `main` に取り込まれているため消えない。  
ブランチはコミットへの名前のようなものであり、マージ済みであれば削除しても履歴自体は残る。

## 補足

`git merge feature/add-task-board-help` の結果が、環境や履歴によって Fast-forward ではなく通常のマージになる場合もある。  
ただし、今回の課題では、作業ブランチ作成後に `main` 側で別のコミットを作らない想定のため、基本的には Fast-forward になる。

作業ブランチ削除時に、まだマージされていないブランチを `git branch -d` で削除しようとすると警告が出る。  
その場合は、削除する前に本当にマージ済みかを確認する。
