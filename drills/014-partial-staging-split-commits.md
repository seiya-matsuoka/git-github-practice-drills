# 014. 同一ファイル内の変更を部分的にステージングして commit を分ける

> 同じファイルに混在した別目的の変更を `git add -p` で分け、意味のある単位で commit する

## 想定シチュエーション

Team Portal の更新情報について、表示件数の文言改善と担当チーム表記の改善をまとめて作業した。  
作業後に差分を確認すると、`app.js` の中に2つの異なる目的の変更が混在している。  
そのまま1つの commit にまとめるのではなく、変更の目的ごとに commit を分けて履歴を整理する。

表示件数の改善では、`index.html` と `app.js` を変更する。  
担当チーム表記の改善では、同じ `app.js` の別の箇所と `project-overview.md` を変更する。  
`app.js` は2つの commit の両方に関係するため、ファイル単位のステージングだけでは変更を適切に分けられない。

この課題では、`git add -p` を使って `app.js` の変更を hunk 単位で確認し、必要な変更だけをステージングする。  
1つ目の commit を作成した後、残っている変更を確認し、2つ目の commit として整理する。  
最後に作業 branch を GitHub へ push し、Pull Request を作成して `main` へ merge する。

## この課題の目的

この課題では、複数の目的が混在した変更を整理して commit する流れとして、次の内容を確認する。

- 作業開始前に `main` とリモートの状態を確認する
- 作業 branch を作成する
- 複数ファイルに変更がある状態を確認する
- 同一ファイル内に複数目的の変更があることを `diff` で確認する
- `git add -p` で変更を hunk 単位に確認する
- 必要な hunk だけをステージングする
- `git diff` と `git diff --cached` の違いを確認する
- 1つ目の commit 後に未ステージングの変更が残っていることを確認する
- 残った変更を2つ目の commit として整理する
- 作業 branch を push して Pull Request を作成する
- merge 後に `main` を同期し、branch を整理する

## 使用する主な操作

- status / diff
- branch の作成・切り替え
- `git add`
- `git add -p`
- hunk 単位のステージング
- `git diff --cached`
- commit
- push
- Pull Request の作成・merge
- pull
- branch の削除
- prune

## 事前状態

この課題は、次の状態から開始する想定とする。

- 013 の課題が完了している
- 現在の branch は `main`
- 作業ツリーは clean
- `origin` が設定されている
- ローカルの `main` が `origin/main` を tracking している
- `practice/team-portal/` が存在する
- `practice/team-portal/index.html` が存在する
- `practice/team-portal/src/app.js` が存在する
- `practice/team-portal/docs/project-overview.md` が存在する
- `app.js` には更新情報の表示件数と担当チームを表示する処理が存在する

この課題で変更するファイルは次の通り。

```text
practice/
  team-portal/
    docs/
      project-overview.md
    src/
      app.js
    index.html
```

## 課題内容

この課題では、1つの作業 branch で2種類の変更を行った後、ステージング時に変更を目的ごとへ分ける。

### 1. 作業 branch を作成する

`main` が最新状態であることを確認した後、次の作業 branch を作成する。

```text
feature/refine-update-metadata
```

### 2. 表示件数の文言を改善する

1つ目の変更目的は、現在表示されている更新情報の件数であることを分かりやすくすることとする。

#### `practice/team-portal/index.html`

現在の `updates-count` は次のようになっている。

```html
<p id="updates-count" class="updates-count" aria-live="polite"></p>
```

次のように `aria-label` を追加する。

```html
<p
  id="updates-count"
  class="updates-count"
  aria-label="表示中の更新情報件数"
  aria-live="polite"
></p>
```

#### `practice/team-portal/src/app.js`

`renderUpdates` 内の表示件数を設定している処理を変更する。

変更前：

```javascript
updatesCount.textContent = `${updates.length}件`;
```

変更後：

```javascript
updatesCount.textContent = `表示中: ${updates.length}件`;
```

この2つの変更を、1つ目の commit にまとめる。

### 3. 担当チーム表記を明確にする

2つ目の変更目的は、更新カードに表示している担当情報が「担当チーム」であることを明確にすることとする。

#### `practice/team-portal/src/app.js`

`createUpdateCard` 内の担当チーム表示を変更する。

変更前：

```javascript
owner.textContent = `担当: ${update.owner}`;
```

変更後：

```javascript
owner.textContent = `担当チーム: ${update.owner}`;
```

#### `practice/team-portal/docs/project-overview.md`

`## 構成` より前に、次の内容を追加する。

```markdown
## 更新情報

更新情報には、カテゴリ、日付、タイトル、概要、担当チームを保持する。
```

この2つの変更を、2つ目の commit にまとめる。

### 4. すべての変更を先に行う

今回はステージングの練習を行うため、1つ目の変更を commit してから2つ目の変更を行うのではなく、上記4箇所の変更をすべて先に行う。  
変更後、`index.html`、`app.js`、`project-overview.md` の3ファイルが変更されていることを確認する。  
特に `app.js` には、表示件数の改善と担当チーム表記の改善という2つの目的の変更が含まれていることを確認する。

### 5. 1つ目の変更だけをステージングする

`index.html` はファイル全体が1つ目の変更目的に対応しているため、通常どおりステージングする。  
`app.js` は2つの変更目的が混在しているため、`git add -p` を使う。

`app.js` の変更を hunk ごとに確認し、次のように選択する。

```text
表示件数の変更
→ ステージングする

担当チーム表記の変更
→ ステージングしない
```

ステージング後、`git diff --cached` では1つ目の変更だけが確認でき、通常の `git diff` では2つ目の変更が残っている状態にする。

1つ目の commit message：

```text
feat: 更新情報の表示件数を分かりやすくする
```

### 6. 残った変更を2つ目の commit にする

1つ目の commit 後、次の変更が作業ツリーに残っていることを確認する。

```text
practice/team-portal/src/app.js
practice/team-portal/docs/project-overview.md
```

残っている変更の差分を確認し、2つ目の変更としてまとめてステージングする。

2つ目の commit message：

```text
feat: 担当チーム表記を明確にする
```

### 7. 作業 branch を push する

2つの commit が目的ごとに分かれていることを履歴で確認する。  
その後、作業 branch を GitHub へ push する。

### 8. Pull Request を作成する

GitHub 上で、次の Pull Request を作成する。

base branch：

```text
main
```

compare branch：

```text
feature/refine-update-metadata
```

Pull Request title：

```text
feat: 更新情報の表示内容を改善
```

Pull Request body：

```markdown
## Summary

- 表示中の更新情報件数であることが分かる文言に変更
- 更新件数に `aria-label` を追加
- 担当情報を「担当チーム」として明確化
- 更新情報の保持項目をドキュメントに追記

## Commits

- 表示件数の改善
- 担当チーム表記の改善
```

Pull Request 上でも、2つの commit が目的ごとに分かれていることを確認する。  
Files changed では、3ファイルの変更内容を確認する。  
問題がなければ Pull Request を merge する。  
この課題では通常の merge commit を使用する。

### 9. merge 後の branch を整理する

GitHub 上で作業 branch を削除する。  
ローカルでは `main` に戻り、GitHub 上の最新状態を取り込む。  
その後、不要になった local branch を削除し、削除済み remote branch の追跡情報を整理する。

## 作業の流れ

1. 現在の branch と作業ツリーを確認する。
2. リモートの最新情報を取得し、`main` が最新であることを確認する。
3. 作業 branch を作成する。
4. `index.html` の表示件数要素を変更する。
5. `app.js` の表示件数文言を変更する。
6. 同じ `app.js` の担当チーム表記を変更する。
7. `project-overview.md` に更新情報の保持項目を追記する。
8. 3ファイルの変更状態を確認する。
9. 各ファイルの差分を確認する。
10. `index.html` をステージングする。
11. `app.js` を部分的なステージングの対象として開く。
12. 表示件数に関する hunk だけをステージングする。
13. 担当チーム表記の hunk はステージングせず残す。
14. ステージング済みの差分を確認する。
15. 未ステージングの差分を確認する。
16. 1つ目の commit を作成する。
17. commit 後に残った変更を確認する。
18. `app.js` と `project-overview.md` の残った変更をステージングする。
19. ステージング済みの差分を確認する。
20. 2つ目の commit を作成する。
21. 履歴を確認し、2つの commit が目的ごとに分かれていることを確認する。
22. 作業 branch を GitHub へ push する。
23. GitHub 上で Pull Request を作成する。
24. Pull Request の commit と Files changed を確認する。
25. Pull Request を merge する。
26. GitHub 上で作業 branch を削除する。
27. ローカルの `main` に戻る。
28. GitHub 上の最新状態をローカルへ取り込む。
29. 不要になった local branch を削除する。
30. 削除済み remote branch の追跡情報を整理する。
31. 最終的な branch、履歴、作業ツリーを確認する。

## 完了条件

次の状態になっていれば、この課題は完了とする。

- `feature/refine-update-metadata` で作業している
- `index.html` に表示件数用の `aria-label` が追加されている
- `app.js` の表示件数が `表示中: X件` の形式になっている
- `app.js` の担当表示が `担当チーム:` になっている
- `project-overview.md` に更新情報の保持項目が追記されている
- `git add -p` で `app.js` の変更を部分的にステージングしている
- 1つ目の commit に表示件数の変更だけが含まれている
- 1つ目の commit 後に担当チーム表記の変更が作業ツリーへ残っている
- 2つ目の commit に担当チーム表記とドキュメント変更が含まれている
- 2つの commit が目的ごとに分かれている
- 作業 branch が GitHub へ push されている
- Pull Request が作成されている
- Pull Request が merge されている
- GitHub 上の作業 branch が削除されている
- ローカルの `main` に merge 後の変更が取り込まれている
- 不要になった local branch が削除されている
- 削除済み remote branch の追跡情報が整理されている
- 最終的な作業ツリーが clean になっている

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

`main` と `origin/main` の位置を確認する。

```bash
git log --oneline --decorate -3
```

表示例：

```text
abc1234 (HEAD -> main, origin/main) 直前までのコミット
```

作業 branch を作成して切り替える。

```bash
git switch -c feature/refine-update-metadata
```

出力例：

```text
Switched to a new branch 'feature/refine-update-metadata'
```

課題内容に沿って、`index.html`、`app.js`、`project-overview.md` をすべて変更する。  
変更後の状態を確認する。

```bash
git status --short
```

表示例：

```text
 M practice/team-portal/docs/project-overview.md
 M practice/team-portal/index.html
 M practice/team-portal/src/app.js
```

変更の概要を確認する。

```bash
git diff --stat
```

表示例：

```text
 practice/team-portal/docs/project-overview.md | 4 ++++
 practice/team-portal/index.html               | 7 ++++++-
 practice/team-portal/src/app.js               | 4 ++--
 3 files changed, 12 insertions(+), 3 deletions(-)
```

`app.js` に2つの目的の変更が含まれていることを確認する。

```bash
git diff -- practice/team-portal/src/app.js
```

表示例：

```diff
@@
-  updatesCount.textContent = `${updates.length}件`;
+  updatesCount.textContent = `表示中: ${updates.length}件`;

@@
-  owner.textContent = `担当: ${update.owner}`;
+  owner.textContent = `担当チーム: ${update.owner}`;
```

1つ目の commit に含める `index.html` をステージングする。

```bash
git add practice/team-portal/index.html
```

`app.js` を部分的にステージングする。

```bash
git add -p practice/team-portal/src/app.js
```

表示件数の hunk が表示されたら、ステージングする。

```text
Stage this hunk [y,n,q,a,d,...]?
```

入力：

```text
y
```

担当チーム表記の hunk が表示されたら、今回はステージングしない。

```text
Stage this hunk [y,n,q,a,d,...]?
```

入力：

```text
n
```

ステージング後の状態を確認する。

```bash
git status --short
```

表示例：

```text
 M practice/team-portal/docs/project-overview.md
M  practice/team-portal/index.html
MM practice/team-portal/src/app.js
```

`MM` は、`app.js` にステージング済みの変更と未ステージングの変更の両方が存在することを表す。

1つ目の commit に入る差分を確認する。

```bash
git diff --cached
```

表示例：

```diff
diff --git a/practice/team-portal/index.html b/practice/team-portal/index.html
...
+  aria-label="表示中の更新情報件数"
...

diff --git a/practice/team-portal/src/app.js b/practice/team-portal/src/app.js
...
-  updatesCount.textContent = `${updates.length}件`;
+  updatesCount.textContent = `表示中: ${updates.length}件`;
```

まだステージングしていない差分を確認する。

```bash
git diff
```

表示例：

```diff
diff --git a/practice/team-portal/docs/project-overview.md b/practice/team-portal/docs/project-overview.md
...
+## 更新情報
+
+更新情報には、カテゴリ、日付、タイトル、概要、担当チームを保持する。

diff --git a/practice/team-portal/src/app.js b/practice/team-portal/src/app.js
...
-  owner.textContent = `担当: ${update.owner}`;
+  owner.textContent = `担当チーム: ${update.owner}`;
```

1つ目の commit を作成する。

```bash
git commit -m "feat: 更新情報の表示件数を分かりやすくする"
```

出力例：

```text
[feature/refine-update-metadata def5678] feat: 更新情報の表示件数を分かりやすくする
 2 files changed, ... insertions(+), ... deletions(-)
```

commit 後に残っている変更を確認する。

```bash
git status --short
```

表示例：

```text
 M practice/team-portal/docs/project-overview.md
 M practice/team-portal/src/app.js
```

残っている差分を確認する。

```bash
git diff
```

表示例：

```diff
diff --git a/practice/team-portal/docs/project-overview.md b/practice/team-portal/docs/project-overview.md
...
+## 更新情報
+
+更新情報には、カテゴリ、日付、タイトル、概要、担当チームを保持する。

diff --git a/practice/team-portal/src/app.js b/practice/team-portal/src/app.js
...
-  owner.textContent = `担当: ${update.owner}`;
+  owner.textContent = `担当チーム: ${update.owner}`;
```

2つ目の変更をステージングする。

```bash
git add practice/team-portal/src/app.js practice/team-portal/docs/project-overview.md
```

ステージング済みの差分を確認する。

```bash
git diff --cached
```

担当チーム表記とドキュメント変更だけが含まれていることを確認する。  
2つ目の commit を作成する。

```bash
git commit -m "feat: 担当チーム表記を明確にする"
```

出力例：

```text
[feature/refine-update-metadata 789abcd] feat: 担当チーム表記を明確にする
 2 files changed, ... insertions(+), ... deletions(-)
```

作業ツリーが clean になっていることを確認する。

```bash
git status
```

表示例：

```text
On branch feature/refine-update-metadata
nothing to commit, working tree clean
```

2つの commit が分かれていることを確認する。

```bash
git log --oneline --decorate -4
```

表示例：

```text
789abcd (HEAD -> feature/refine-update-metadata) feat: 担当チーム表記を明確にする
def5678 feat: 更新情報の表示件数を分かりやすくする
abc1234 (origin/main, main) 直前までのコミット
```

作業 branch を GitHub へ push し、tracking branch を設定する。

```bash
git push -u origin feature/refine-update-metadata
```

出力例：

```text
To https://github.com/<your-account>/git-github-practice-drills.git
 * [new branch]      feature/refine-update-metadata -> feature/refine-update-metadata
branch 'feature/refine-update-metadata' set up to track 'origin/feature/refine-update-metadata'.
```

GitHub 上で Pull Request を作成する。

```text
Base:
main

Compare:
feature/refine-update-metadata
```

Pull Request title：

```text
feat: 更新情報の表示内容を改善
```

Pull Request body：

```markdown
## Summary

- 表示中の更新情報件数であることが分かる文言に変更
- 更新件数に `aria-label` を追加
- 担当情報を「担当チーム」として明確化
- 更新情報の保持項目をドキュメントに追記

## Commits

- 表示件数の改善
- 担当チーム表記の改善
```

Pull Request では、2つの commit が別々に表示されていることを確認する。  
Files changed では、3ファイルの最終的な差分を確認する。  
問題がなければ GitHub 上で Pull Request を merge する。  
この課題では通常の merge commit を使用する。

merge 後、GitHub 上で `feature/refine-update-metadata` を削除する。  
ローカルの `main` に戻る。

```bash
git switch main
```

GitHub 上の最新状態を取り込む。

```bash
git pull
```

不要になった local branch を削除する。

```bash
git branch -d feature/refine-update-metadata
```

削除済み remote branch の追跡情報を整理する。

```bash
git fetch --prune
```

最終的な branch 一覧を確認する。

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

この課題では、ファイル単位ではなく、同一ファイル内の変更を hunk 単位でステージングする方法を確認する。  
通常の `git add <file>` では、そのファイルに含まれる変更全体がステージング対象になる。  
同じファイルに複数の目的の変更が混在している場合、そのままでは commit を意味のある単位へ分けにくい。

`git add -p` を使うと、差分を hunk 単位で確認しながら、ステージングするかどうかを選択できる。  
今回使用する基本的な選択は次の通り。

```text
y
→ 表示中の hunk をステージングする

n
→ 表示中の hunk をステージングしない
```

部分的にステージングした後は、`git diff --cached` と `git diff` の両方を確認することが重要となる。  
`git diff --cached` では、次の commit に含まれるステージング済みの差分を確認できる。  
`git diff` では、まだステージングされていない作業ツリーの差分を確認できる。

同じファイルにステージング済みと未ステージングの変更が混在している場合、`git status --short` では `MM` のように表示されることがある。  
1文字目は index 側、2文字目は working tree 側の状態を表している。

今回のように、実装を先にまとめて行った場合でも、ステージング時に変更を整理することで commit の単位を分けられる。  
commit は「作業した順番」だけでなく、「どの目的の変更を履歴として残すか」という観点でも整理できる。

実務では、1つのファイルに機能追加、文言修正、リファクタリングなどが混在することがある。  
そのような場合に `git add -p` を使えると、関係のない変更を同じ commit に含めず、履歴を追いやすい状態に整理しやすくなる。

## 補足

`git add -p` で表示される選択肢や表示形式は、Git のバージョンによって多少異なる場合がある。  
まず覚える操作としては、`y` でステージング、`n` でステージングしない、という2つを押さえておけばよい。

変更箇所が近く、Git が1つの hunk としてまとめて表示する場合は、hunk をさらに分割できる場合がある。  
ただし、この課題では表示件数の処理と担当チームの処理が離れた位置にあるため、別 hunk として確認できる想定としている。

部分的なステージングを行った後は、commit 前に必ず `git diff --cached` を確認する。  
意図していない変更がステージングされていないかを確認してから commit することで、commit の内容を目的に合わせて整理できる。
