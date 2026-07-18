# 012. Issue 起点の基本的な開発フロー

> GitHub Issue からリモートブランチを作成し、ローカルでの開発、Pull Request、merge 後の整理まで行う

## 想定シチュエーション

新しい教材として、チーム内向けの簡単なポータル用ファイルを追加する。  
最初に、`practice/team-portal/` の初期ファイルを `main` に追加し、GitHubへpushする。

その後、更新情報をカテゴリで絞り込めるようにしてほしいという要望を、GitHub Issue として登録する。  
Issue の画面から作業ブランチをGitHub上に作成し、そのリモートブランチをローカルへ取得して作業を進める。

変更後はcommit・pushし、Issueに紐づく Pull Request を作成する。  
Pull Request をmergeするとIssueが自動でcloseされる形にし、最後にローカルの `main` とbranchを整理する。

この課題では、次のようにGitHub画面とローカル操作を往復する開発フローを練習する。

```text
初期教材をmainへ追加
↓
GitHubでIssueを作成
↓
Issueからリモートブランチを作成
↓
ローカルでfetchして作業ブランチを取得
↓
ファイル変更・commit・push
↓
Pull Requestを作成
↓
mergeとIssueのclose
↓
ローカルmainの同期とbranch整理
```

## この課題の目的

この課題では、GitHub Issue を起点とした開発フローとして、次の内容を確認する。

- 新しい教材ファイルを `main` に追加してGitHubへpushする
- GitHub上でIssueを作成する
- Issueの内容に、背景・対応内容・完了条件を記載する
- Issue画面から、そのIssueに紐づくリモートブランチを作成する
- GitHub上にだけ存在するbranchをローカルへ取得する
- remote branch と local branch のtracking関係を確認する
- Issueの要件に沿って複数ファイルを変更する
- 作業前後に `status` / `diff` / `log` を確認する
- 作業branchへcommit・pushする
- Pull RequestをIssueへ紐づける
- Pull RequestのmergeによってIssueをcloseする
- merge後の `main` をローカルへ取り込む
- 不要になったlocal branchとremote-tracking branchを整理する

## 使用する主な操作

- GitHub Issue の作成
- Issue からのbranch作成
- fetch
- remote branch の確認
- tracking branch の作成
- status / diff / log
- 複数ファイルの編集
- add / commit / push
- Pull Request の作成
- Issue と Pull Request の紐づけ
- Pull Request のmerge
- pull
- branch の削除
- prune

## 事前状態

この課題は、次の状態から開始する想定とする。

- 011の課題が完了している
- 現在のbranchは `main`
- 作業ツリーはclean
- `origin` が設定されている
- ローカルの `main` が `origin/main` をtrackingしている
- GitHubリポジトリでIssue機能を使用できる
- `practice/team-portal/` はまだGitの管理対象として追加されていない

この課題で最初に追加する教材ファイルは次の通り。

```text
practice/
  team-portal/
    data/
      updates.json
    docs/
      project-overview.md
    src/
      app.js
    index.html
    styles.css
```

課題ドキュメントは次のファイルとなる。

```text
drills/012-issue-driven-development-flow.md
```

## 課題内容

この課題では、最初に新しい教材を `main` に追加し、その後にGitHub Issueを起点とした機能追加を行う。

### 1. 初期教材をmainへ追加する

次のファイルが配置されていることを確認する。

```text
drills/012-issue-driven-development-flow.md
practice/team-portal/index.html
practice/team-portal/styles.css
practice/team-portal/src/app.js
practice/team-portal/data/updates.json
practice/team-portal/docs/project-overview.md
```

これらを初期教材として1つのcommitにまとめ、`main` をGitHubへpushする。

commit message は次を使用する。

```text
chore: team portal教材を追加
```

### 2. GitHub Issueを作成する

GitHubのリポジトリ画面から、次のIssueを作成する。

Issue title：

```text
チーム更新情報にカテゴリフィルターを追加する
```

Issue body：

```markdown
## 概要

Team Portal の更新情報を、カテゴリごとに絞り込めるようにする。

## 対応内容

- 「すべて」「リリース」「メンテナンス」「チーム」のフィルターボタンを追加する
- 選択したカテゴリに一致する更新情報だけを扱う処理を追加する
- 選択中のボタンを `is-active` と `aria-pressed` で判別できるようにする
- 表示件数を絞り込み結果に合わせて更新する処理を追加する

## 完了条件

- HTMLに4つのフィルターボタンが追加されている
- CSSにフィルターボタン用のスタイルが追加されている
- JavaScriptにカテゴリ選択と絞り込み処理が追加されている
- 選択状態を更新する処理が追加されている
- 変更内容がPull Requestで確認できる
```

リポジトリに `enhancement` label がある場合は、このIssueへ設定する。

### 3. IssueからGitHub上にbranchを作成する

作成したIssueの `Development` から、新しいbranchを作成する。

branch name：

```text
feature/filter-team-updates
```

作成元のbranch：

```text
main
```

この時点では、branchはGitHub上に存在し、ローカルには存在しない状態となる。

### 4. GitHub上のbranchをローカルへ取得する

リモートの最新情報を取得し、GitHub上に作成されたbranchを確認する。

その後、次のremote branchをtrackingするlocal branchを作成して切り替える。

```text
origin/feature/filter-team-updates
```

local branch name：

```text
feature/filter-team-updates
```

### 5. カテゴリフィルターを実装する

#### `practice/team-portal/index.html`

`section-heading` の終了後、`updates-list` の前に次の要素を追加する。

```html
<div class="filter-group" role="group" aria-label="更新情報のカテゴリ">
  <button
    class="filter-button is-active"
    type="button"
    data-category="all"
    aria-pressed="true"
  >
    すべて
  </button>
  <button
    class="filter-button"
    type="button"
    data-category="release"
    aria-pressed="false"
  >
    リリース
  </button>
  <button
    class="filter-button"
    type="button"
    data-category="maintenance"
    aria-pressed="false"
  >
    メンテナンス
  </button>
  <button
    class="filter-button"
    type="button"
    data-category="team"
    aria-pressed="false"
  >
    チーム
  </button>
</div>
```

追加後の該当部分は次の順番になる。

```html
<div class="section-heading">
  <!-- 既存の見出しと件数 -->
</div>

<div class="filter-group" role="group" aria-label="更新情報のカテゴリ">
  <!-- 4つのフィルターボタン -->
</div>

<div id="updates-list" class="updates-grid"></div>
```

#### `practice/team-portal/styles.css`

`updates-grid` の定義より前に、次のスタイルを追加する。

```css
.filter-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.filter-button {
  padding: 8px 14px;
  border: 1px solid #b9c2cf;
  border-radius: 999px;
  color: #334155;
  background: #ffffff;
  cursor: pointer;
}

.filter-button:hover {
  border-color: #526079;
}

.filter-button:focus-visible {
  outline: 3px solid rgb(37 99 235 / 30%);
  outline-offset: 2px;
}

.filter-button.is-active {
  border-color: #1d4ed8;
  color: #ffffff;
  background: #1d4ed8;
}
```

#### `practice/team-portal/src/app.js`

カテゴリ別の絞り込みに対応するため、ファイル全体を次の内容に変更する。

```javascript
const updatesList = document.querySelector("#updates-list");
const updatesCount = document.querySelector("#updates-count");
const emptyMessage = document.querySelector("#empty-message");
const filterButtons = document.querySelectorAll("[data-category]");

const categoryLabels = {
  release: "リリース",
  maintenance: "メンテナンス",
  team: "チーム",
};

let allUpdates = [];

async function loadUpdates() {
  try {
    const response = await fetch("./data/updates.json");

    if (!response.ok) {
      throw new Error(`更新情報の取得に失敗しました: ${response.status}`);
    }

    allUpdates = await response.json();
    renderUpdates(allUpdates);
  } catch (error) {
    console.error(error);
    updatesList.replaceChildren();
    updatesCount.textContent = "取得失敗";
    emptyMessage.hidden = false;
    emptyMessage.textContent = "更新情報を読み込めませんでした。";
  }
}

function renderUpdates(updates) {
  updatesList.replaceChildren(
    ...updates.map((update) => createUpdateCard(update)),
  );

  updatesCount.textContent = `${updates.length}件`;
  emptyMessage.hidden = updates.length > 0;
}

function createUpdateCard(update) {
  const article = document.createElement("article");
  article.className = "update-card";

  const meta = document.createElement("div");
  meta.className = "update-card__meta";

  const category = document.createElement("span");
  category.className = "update-card__category";
  category.textContent = categoryLabels[update.category] ?? update.category;

  const date = document.createElement("time");
  date.className = "update-card__date";
  date.dateTime = update.date;
  date.textContent = update.date;

  const title = document.createElement("h3");
  title.textContent = update.title;

  const summary = document.createElement("p");
  summary.textContent = update.summary;

  meta.append(category, date);
  article.append(meta, title, summary);

  return article;
}

function selectCategory(selectedCategory) {
  const filteredUpdates =
    selectedCategory === "all"
      ? allUpdates
      : allUpdates.filter((update) => update.category === selectedCategory);

  renderUpdates(filteredUpdates);

  filterButtons.forEach((button) => {
    const isSelected = button.dataset.category === selectedCategory;

    button.classList.toggle("is-active", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectCategory(button.dataset.category);
  });
});

loadUpdates();
```

変更後は、3ファイルの差分を確認する。

### 6. 変更をcommit・pushする

3ファイルの変更内容を確認し、1つのcommitにまとめる。

commit message：

```text
feat: 更新情報のカテゴリフィルターを追加
```

tracking branchが設定されていることを確認し、同じ作業branchへpushする。

### 7. Issueに紐づくPull Requestを作成する

GitHub上で、作業branchから `main` への Pull Request を作成する。

Pull Request title：

```text
feat: 更新情報のカテゴリフィルターを追加
```

Pull Request body：

```markdown
## Summary

- 更新情報のカテゴリフィルターボタンを追加
- 選択したカテゴリに応じて一覧を絞り込む処理を追加
- 選択状態と表示件数を更新する処理を追加

## Checks

- [x] HTMLに4つのフィルターボタンを追加
- [x] CSSにフィルターボタン用のスタイルを追加
- [x] JavaScriptにカテゴリ選択と絞り込み処理を追加
- [x] 差分に関係のない変更が含まれていないことを確認

Closes #<Issue番号>
```

`<Issue番号>` は、今回作成したIssueの番号へ置き換える。

Pull Request画面とIssue画面の両方で、相互に関連付けられていることを確認する。

### 8. Pull Requestをmergeして整理する

Pull Requestの変更ファイルとcommitを確認し、GitHub上でmergeする。  
この課題では通常のmerge commitを使用する。

merge後、次を確認する。

- Pull Request が `Merged` になっている
- `Closes #<Issue番号>` によりIssueがcloseされている
- GitHub上の `main` に変更が反映されている

GitHub上で作業branchを削除する。

ローカルでは `main` に戻り、GitHub上の最新状態を取り込む。  
その後、不要になったlocal branchとremote-tracking branchを整理する。

## 作業の流れ

1. 現在のbranchと作業ツリーを確認する。
2. 新しい課題ドキュメントと `team-portal` の初期教材を確認する。
3. 初期教材一式を `main` でcommitする。
4. `main` をGitHubへpushする。
5. GitHub上で機能追加用のIssueを作成する。
6. Issueに概要、対応内容、完了条件を記載する。
7. Issueの画面から、`main` を元に作業branchを作成する。
8. ローカルでリモートの最新情報を取得する。
9. GitHub上に作成されたremote branchを確認する。
10. remote branchをtrackingするlocal branchを作成して切り替える。
11. HTMLへフィルターボタンを追加する。
12. CSSへフィルターボタンのスタイルを追加する。
13. JavaScriptへカテゴリ絞り込み処理を追加する。
14. 変更ファイルと差分を確認する。
15. 変更をステージングしてcommitする。
16. 作業branchをGitHubへpushする。
17. GitHub上でIssueに紐づくPull Requestを作成する。
18. Pull RequestのFiles changedとcommitを確認する。
19. Pull Requestをmergeする。
20. Issueがcloseされたことを確認する。
21. GitHub上の作業branchを削除する。
22. ローカルの `main` を最新化する。
23. ローカルの作業branchを削除する。
24. 削除済みremote branchの追跡情報を整理する。
25. 最終的なbranch、履歴、作業ツリーを確認する。

## 完了条件

次の状態になっていれば、この課題は完了とする。

- `practice/team-portal/` の初期教材が `main` にcommit・pushされている
- GitHub上に機能追加用のIssueが作成されている
- Issueに背景、対応内容、完了条件が記載されている
- Issueから `feature/filter-team-updates` が作成されている
- GitHub上のbranchを元にlocal tracking branchが作成されている
- HTMLに4つのフィルターボタンが追加されている
- CSSにフィルターボタンのスタイルが追加されている
- JavaScriptにカテゴリ選択と絞り込み処理が追加されている
- 変更がcommit・pushされている
- Pull RequestがIssueに紐づいている
- Pull Requestがmergeされている
- 対象Issueがcloseされている
- ローカルの `main` にmerge後の変更が取り込まれている
- 不要になったlocal branchが削除されている
- 削除済みremote branchの追跡情報が整理されている
- 最終的な作業ツリーがcleanになっている

---

## 解答例

作業開始前に現在の状態を確認する。

```bash
git status
```

表示例：

```text
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

現在のbranchとtracking状態を確認する。

```bash
git branch -vv
```

表示例：

```text
* main abc1234 [origin/main] 直前までのコミット
```

新しい課題ドキュメントと教材ファイルを配置した後、状態を確認する。

```bash
git status --short
```

表示例：

```text
?? drills/012-issue-driven-development-flow.md
?? practice/team-portal/
```

追加されるファイルを確認する。

```bash
git status
```

表示例：

```text
On branch main
Untracked files:
  (use "git add <file>..." to include in what will be committed)
        drills/012-issue-driven-development-flow.md
        practice/team-portal/

nothing added to commit but untracked files present
```

初期教材一式をステージングする。

```bash
git add drills/012-issue-driven-development-flow.md practice/team-portal
```

ステージング済みの変更を確認する。

```bash
git diff --cached --stat
```

表示例：

```text
 drills/012-issue-driven-development-flow.md   | ...
 practice/team-portal/data/updates.json        |  ...
 practice/team-portal/docs/project-overview.md |  ...
 practice/team-portal/index.html               |  ...
 practice/team-portal/src/app.js               |  ...
 practice/team-portal/styles.css               |  ...
 6 files changed, ... insertions(+)
```

初期教材をcommitする。

```bash
git commit -m "chore: team portal教材を追加"
```

出力例：

```text
[main def5678] chore: team portal教材を追加
 6 files changed, ... insertions(+)
 create mode 100644 drills/012-issue-driven-development-flow.md
 create mode 100644 practice/team-portal/data/updates.json
 create mode 100644 practice/team-portal/docs/project-overview.md
 create mode 100644 practice/team-portal/index.html
 create mode 100644 practice/team-portal/src/app.js
 create mode 100644 practice/team-portal/styles.css
```

`main` をGitHubへpushする。

```bash
git push
```

出力例：

```text
To https://github.com/<your-account>/git-github-practice-drills.git
   abc1234..def5678  main -> main
```

GitHub上でIssueを作成する。

```text
Title:
チーム更新情報にカテゴリフィルターを追加する
```

```markdown
## 概要

Team Portal の更新情報を、カテゴリごとに絞り込めるようにする。

## 対応内容

- 「すべて」「リリース」「メンテナンス」「チーム」のフィルターボタンを追加する
- 選択したカテゴリに一致する更新情報だけを扱う処理を追加する
- 選択中のボタンを `is-active` と `aria-pressed` で判別できるようにする
- 表示件数を絞り込み結果に合わせて更新する処理を追加する

## 完了条件

- HTMLに4つのフィルターボタンが追加されている
- CSSにフィルターボタン用のスタイルが追加されている
- JavaScriptにカテゴリ選択と絞り込み処理が追加されている
- 選択状態を更新する処理が追加されている
- 変更内容がPull Requestで確認できる
```

Issueの `Development` からbranchを作成する。

```text
Branch name:
feature/filter-team-updates

Branch source:
main
```

GitHubの表示言語や画面幅により、ボタン名や配置が異なる場合がある。  
Issueに紐づくbranchが作成されたことを確認できればよい。

ローカルでリモートの最新情報を取得する。

```bash
git fetch origin
```

出力例：

```text
From https://github.com/<your-account>/git-github-practice-drills
 * [new branch]      feature/filter-team-updates -> origin/feature/filter-team-updates
```

remote branchを確認する。

```bash
git branch -r
```

表示例：

```text
  origin/feature/filter-team-updates
  origin/main
```

local branchとremote branchをまとめて確認する。

```bash
git branch -a
```

表示例：

```text
* main
  remotes/origin/feature/filter-team-updates
  remotes/origin/main
```

remote branchをtrackingするlocal branchを作成して切り替える。

```bash
git switch -c feature/filter-team-updates --track origin/feature/filter-team-updates
```

出力例：

```text
branch 'feature/filter-team-updates' set up to track 'origin/feature/filter-team-updates'.
Switched to a new branch 'feature/filter-team-updates'
```

tracking状態を確認する。

```bash
git branch -vv
```

表示例：

```text
* feature/filter-team-updates def5678 [origin/feature/filter-team-updates] chore: team portal教材を追加
  main                        def5678 [origin/main] chore: team portal教材を追加
```

`practice/team-portal/index.html` にフィルターボタンを追加する。  
`practice/team-portal/styles.css` にフィルターボタンのスタイルを追加する。  
`practice/team-portal/src/app.js` を課題内容に記載した完成形へ変更する。

変更状態を確認する。

```bash
git status --short
```

表示例：

```text
 M practice/team-portal/index.html
 M practice/team-portal/src/app.js
 M practice/team-portal/styles.css
```

変更の概要を確認する。

```bash
git diff --stat
```

表示例：

```text
 practice/team-portal/index.html | ...
 practice/team-portal/src/app.js | ...
 practice/team-portal/styles.css | ...
 3 files changed, ... insertions(+), ... deletions(-)
```

HTMLの差分を確認する。

```bash
git diff -- practice/team-portal/index.html
```

表示例：

```diff
+        <div class="filter-group" role="group" aria-label="更新情報のカテゴリ">
+          ...
+        </div>
```

JavaScriptの差分を確認する。

```bash
git diff -- practice/team-portal/src/app.js
```

表示例：

```diff
+const filterButtons = document.querySelectorAll("[data-category]");
+
+let allUpdates = [];
...
+function selectCategory(selectedCategory) {
+  ...
+}
```

変更をステージングする。

```bash
git add practice/team-portal/index.html practice/team-portal/styles.css practice/team-portal/src/app.js
```

ステージング済みの差分を確認する。

```bash
git diff --cached --stat
```

表示例：

```text
 practice/team-portal/index.html | ...
 practice/team-portal/src/app.js | ...
 practice/team-portal/styles.css | ...
 3 files changed, ... insertions(+), ... deletions(-)
```

変更をcommitする。

```bash
git commit -m "feat: 更新情報のカテゴリフィルターを追加"
```

出力例：

```text
[feature/filter-team-updates 123abcd] feat: 更新情報のカテゴリフィルターを追加
 3 files changed, ... insertions(+), ... deletions(-)
```

作業branchをpushする。

```bash
git push
```

出力例：

```text
To https://github.com/<your-account>/git-github-practice-drills.git
   def5678..123abcd  feature/filter-team-updates -> feature/filter-team-updates
```

GitHub上で、`feature/filter-team-updates` から `main` へのPull Requestを作成する。

```text
Title:
feat: 更新情報のカテゴリフィルターを追加
```

```markdown
## Summary

- 更新情報のカテゴリフィルターボタンを追加
- 選択したカテゴリに応じて一覧を絞り込む処理を追加
- 選択状態と表示件数を更新する処理を追加

## Checks

- [x] HTMLに4つのフィルターボタンを追加
- [x] CSSにフィルターボタン用のスタイルを追加
- [x] JavaScriptにカテゴリ選択と絞り込み処理を追加
- [x] 差分に関係のない変更が含まれていないことを確認

Closes #<Issue番号>
```

Pull Request作成後、次を確認する。

```text
- base branch が main になっている
- compare branch が feature/filter-team-updates になっている
- Files changed に3ファイルの変更が表示されている
- Pull Request とIssueが相互に紐づいている
```

GitHub上でPull Requestをmergeする。  
この課題では、通常のmerge commitを使用する。

merge後、GitHub上で作業branchを削除する。

ローカルの `main` に戻る。

```bash
git switch main
```

出力例：

```text
Switched to branch 'main'
Your branch is up to date with 'origin/main'.
```

GitHub上の最新状態を取り込む。

```bash
git pull
```

出力例：

```text
From https://github.com/<your-account>/git-github-practice-drills
   def5678..456cdef  main -> origin/main
Updating def5678..456cdef
Fast-forward
 practice/team-portal/index.html | ...
 practice/team-portal/src/app.js | ...
 practice/team-portal/styles.css | ...
 3 files changed, ... insertions(+), ... deletions(-)
```

local branchを削除する。

```bash
git branch -d feature/filter-team-updates
```

出力例：

```text
Deleted branch feature/filter-team-updates (was 123abcd).
```

削除済みremote branchの追跡情報を整理する。

```bash
git fetch --prune
```

出力例：

```text
From https://github.com/<your-account>/git-github-practice-drills
 - [deleted]         (none)     -> origin/feature/filter-team-updates
```

branch一覧を確認する。

```bash
git branch -a
```

表示例：

```text
* main
  remotes/origin/main
```

履歴を確認する。

```bash
git log --oneline --graph --decorate --all -8
```

表示例：

```text
*   456cdef (HEAD -> main, origin/main) Merge pull request #<PR番号> from <your-account>/feature/filter-team-updates
|\
| * 123abcd feat: 更新情報のカテゴリフィルターを追加
|/
* def5678 chore: team portal教材を追加
* abc1234 直前までのコミット
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

GitHub上では、次の状態を確認する。

```text
- Pull Request がMerged
- 対象IssueがClosed
- GitHub上の作業branchが削除済み
- mainにカテゴリフィルターの変更が反映済み
```

## 学習ポイント

この課題では、ローカルでbranchを作成してからGitHubへpushする流れではなく、GitHub Issueを起点としてリモート側にbranchを作成する流れを確認する。

Issueから作成したbranchは、最初はGitHub上にだけ存在する。  
そのため、ローカルでは最初に `git fetch origin` を実行し、新しいremote branchの情報を取得する必要がある。

`git branch -r` はremote-tracking branchを確認するために使用する。  
`git branch -a` では、local branchとremote-tracking branchをまとめて確認できる。

```bash
git switch -c feature/filter-team-updates --track origin/feature/filter-team-updates
```

この操作では、GitHub上のbranchをtrackingするlocal branchを作成している。  
tracking関係が設定されるため、その後は引数を省略した `git push` や `git pull` を使用できる。

Issueには、単に「フィルターを追加する」とだけ書くのではなく、概要、対応内容、完了条件を記載する。  
これにより、なぜ変更するのか、何を変更するのか、どの状態になれば完了かを確認しながら作業できる。

Pull Requestのbodyに次のようなclosing keywordを記載すると、Pull RequestとIssueを関連付けられる。

```text
Closes #<Issue番号>
```

関連付けたPull Requestがdefault branchへmergeされると、対象Issueを自動的にcloseできる。

Pull Requestをmergeしても、ローカルの `main` は自動では更新されない。  
ローカルで `main` へ戻り、`git pull` を実行してmerge後の状態を取り込む必要がある。

GitHub上でbranchを削除した後も、ローカルにはremote-tracking branchの参照が残る場合がある。  
`git fetch --prune` を実行すると、リモート側で削除されたbranchに対応する不要な参照を整理できる。

この課題では、中心となるGitHub操作だけでなく、次の基本的な流れも確認する。

```text
作業前の状態確認
↓
リモートとの同期
↓
branchの確認と切り替え
↓
差分確認
↓
commit
↓
push
↓
Pull Request
↓
merge後の同期
↓
branch整理
```

## 補足

GitHubの表示言語、画面幅、UI更新などにより、IssueやPull Request画面のボタン名・配置が異なる場合がある。  
この課題では、Issueに紐づくbranchを作成し、そのbranchをローカルでtrackingできればよい。

GitHub上でbranchを作成するときに、ローカルでcheckoutするためのコマンドが表示される場合がある。  
表示されたコマンドを使用してもよいが、この課題ではremote branchとlocal branchの関係を確認するため、`fetch`、`branch -r`、`switch --track` を順番に使用する。

Issueの自動closeは、Pull Requestがdefault branchへmergeされたときに行われる。  
Pull Requestをcloseしただけの場合や、default branch以外へmergeした場合は、想定どおりにcloseされないことがある。

作業branchの削除は、Pull Requestのmergeを確認してから行う。  
merge前にbranchを削除すると、追加修正や確認が必要になった場合に作業を続けにくくなる。
