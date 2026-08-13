# 013. GitHub 上で作成済みの branch をローカルへ取得する

> GitHub 上にだけ存在する作業 branch を取得し、tracking branch を作成して開発を引き継ぐ

## 想定シチュエーション

チームメンバーが、更新情報に担当チームを表示するための作業 branch を GitHub 上で先に作成した。

branch は `main` から作成されているが、まだファイル変更や commit は行われていない。  
自分がその作業を引き継ぐことになったため、GitHub 上にだけ存在する branch をローカルへ取得し、対応する local branch を作成して作業を進める。

変更内容は、`practice/team-portal/` の更新情報データに担当チームを追加し、カード上にも担当チームを表示できるようにするものとする。

作業完了後は、変更を commit・push し、GitHub 上で Pull Request を作成して `main` へ merge する。  
最後に、ローカルの `main` を最新化し、不要になった branch を整理する。

この課題では、次の流れを確認する。

```text
GitHub 上で branch を作成
↓
ローカルで remote branch を取得
↓
tracking branch を作成
↓
ファイル変更・commit・push
↓
Pull Request を作成
↓
merge
↓
ローカル main の同期と branch 整理
```

## この課題の目的

この課題では、GitHub 上で作成済みの branch をローカルへ取得して作業を引き継ぐ流れとして、次の内容を確認する。

- GitHub 上で `main` から作業 branch を作成する
- ローカルには存在しない remote branch を確認する
- `fetch` によってリモートの最新情報を取得する
- remote-tracking branch と local branch の違いを確認する
- remote branch を tracking する local branch を作成する
- tracking branch の対応関係を確認する
- 既存ファイルを複数変更する
- `status` / `diff` で変更内容を確認する
- 変更を commit・push する
- GitHub 上で Pull Request を作成する
- Pull Request を merge する
- merge 後の `main` をローカルへ取り込む
- 不要になった local branch と remote-tracking branch を整理する

## 使用する主な操作

- GitHub 上での branch 作成
- fetch
- remote branch の確認
- tracking branch の作成
- branch の切り替え
- status / diff
- add / commit / push
- Pull Request の作成
- Pull Request の merge
- pull
- local branch の削除
- prune

## 事前状態

この課題は、次の状態から開始する想定とする。

- 012 の課題が完了している
- 現在の branch は `main`
- 作業ツリーは clean
- `origin` が設定されている
- ローカルの `main` が `origin/main` を tracking している
- `practice/team-portal/` が存在する
- `practice/team-portal/data/updates.json` が存在する
- `practice/team-portal/src/app.js` が存在する
- `practice/team-portal/styles.css` が存在する
- `feature/show-update-owner` はまだローカルに存在しない

この課題で変更するファイルは次の通り。

```text
practice/
  team-portal/
    data/
      updates.json
    src/
      app.js
    styles.css
```

## 課題内容

この課題では、GitHub 上に作成した作業 branch をローカルへ取得し、更新情報に担当チームを追加する。

### 1. GitHub 上で作業 branch を作成する

GitHub のリポジトリ画面から、次の branch を作成する。

branch name：

```text
feature/show-update-owner
```

作成元：

```text
main
```

branch 作成後、この時点では次の状態になっていることを確認する。

```text
GitHub:
- main
- feature/show-update-owner

ローカル:
- main
```

ローカルでは、まだ `feature/show-update-owner` を作成しない。

### 2. GitHub 上の branch をローカルへ取得する

ローカルでリモートの最新情報を取得する。

その後、remote branch の一覧を確認し、次の remote-tracking branch が存在することを確認する。

```text
origin/feature/show-update-owner
```

次に、この remote branch を tracking する local branch を作成する。

local branch name：

```text
feature/show-update-owner
```

local branch 作成後、`origin/feature/show-update-owner` を tracking していることを確認する。

### 3. updates.json に担当チームを追加する

`practice/team-portal/data/updates.json` の各更新情報に、`owner` を追加する。

各データに追加する値は次の通り。

```text
id: 1 → Product Team
id: 2 → Platform Team
id: 3 → Development Team
id: 4 → Product Team
id: 5 → Platform Team
id: 6 → Development Team
```

変更例：

```json
{
  "id": 1,
  "title": "v1.4.0 をリリースしました",
  "summary": "ダッシュボードの表示速度を改善し、更新情報の表示を整理しました。",
  "category": "release",
  "date": "2026-07-08",
  "owner": "Product Team"
}
```

残りのデータにも、同じ位置へ `owner` を追加する。

### 4. app.js に担当チーム表示を追加する

`practice/team-portal/src/app.js` の `createUpdateCard` 内で、担当チームを表示する要素を作成する。

`summary` を作成している処理の後に、次の処理を追加する。

```javascript
const owner = document.createElement("p");
owner.className = "update-card__owner";
owner.textContent = `担当: ${update.owner}`;
```

カードへ要素を追加している処理を、次のように変更する。

変更前：

```javascript
meta.append(category, date);
article.append(meta, title, summary);
```

変更後：

```javascript
meta.append(category, date);
article.append(meta, title, summary, owner);
```

### 5. styles.css に担当チーム表示のスタイルを追加する

`practice/team-portal/styles.css` の更新カード関連のスタイルに、次の定義を追加する。

```css
.update-card__owner {
  margin: 16px 0 0;
  color: #334155;
  font-size: 0.85rem;
  font-weight: 700;
}
```

### 6. 変更を確認して commit する

3 ファイルの変更状態と差分を確認する。

今回の変更は、更新情報へ担当チームを追加して表示するという1つの目的にまとまっているため、1つの commit とする。

commit message：

```text
feat: 更新情報に担当チームを追加
```

### 7. 作業 branch を push する

local branch が `origin/feature/show-update-owner` を tracking していることを確認したうえで、変更を push する。

### 8. Pull Request を作成する

GitHub 上で、次の Pull Request を作成する。

base branch：

```text
main
```

compare branch：

```text
feature/show-update-owner
```

Pull Request title：

```text
feat: 更新情報に担当チームを追加
```

Pull Request body：

```markdown
## Summary

- 更新情報データに担当チームを追加
- 更新カードに担当チームを表示
- 担当チーム表示用のスタイルを追加

## Checks

- [x] 6件の更新情報に `owner` が追加されている
- [x] `app.js` で担当チームを表示する処理が追加されている
- [x] 担当チーム表示用の CSS が追加されている
```

Pull Request の commit と Files changed を確認し、問題がなければ merge する。  
この課題では通常の merge commit を使用する。

### 9. merge 後の branch を整理する

GitHub 上で作業 branch を削除する。  
ローカルでは `main` に戻り、GitHub 上の最新状態を取り込む。  
その後、不要になった local branch を削除し、削除済み remote branch の追跡情報も整理する。

## 作業の流れ

1. 現在の branch と作業ツリーを確認する。
2. ローカルの `main` が `origin/main` と同期していることを確認する。
3. GitHub 上で `main` から作業 branch を作成する。
4. ローカルでリモートの最新情報を取得する。
5. remote branch の一覧を確認する。
6. GitHub 上に作成した branch が remote-tracking branch として取得されていることを確認する。
7. remote branch を tracking する local branch を作成して切り替える。
8. local branch と remote branch の tracking 関係を確認する。
9. `updates.json` に担当チームを追加する。
10. `app.js` に担当チーム表示を追加する。
11. `styles.css` に担当チーム表示用のスタイルを追加する。
12. 変更ファイルと差分を確認する。
13. 3 ファイルをステージングする。
14. ステージング済みの差分を確認する。
15. 変更を commit する。
16. 作業 branch を GitHub へ push する。
17. GitHub 上で Pull Request を作成する。
18. Pull Request の commit と Files changed を確認する。
19. Pull Request を merge する。
20. GitHub 上で作業 branch を削除する。
21. ローカルの `main` に戻る。
22. GitHub 上の最新状態をローカルへ取り込む。
23. 不要になった local branch を削除する。
24. 削除済み remote branch の追跡情報を整理する。
25. 最終的な branch、履歴、作業ツリーを確認する。

## 完了条件

次の状態になっていれば、この課題は完了とする。

- GitHub 上で `feature/show-update-owner` が作成されている
- `git fetch` によって remote branch を取得できている
- `origin/feature/show-update-owner` が確認できている
- 対応する local branch が作成されている
- local branch が remote branch を tracking している
- `updates.json` の 6 件すべてに `owner` が追加されている
- `app.js` に担当チーム表示の処理が追加されている
- `styles.css` に担当チーム表示用のスタイルが追加されている
- 3 ファイルの変更が1つの commit にまとめられている
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

branch と tracking 状態を確認する。

```bash
git branch -vv
```

表示例：

```text
* main abc1234 [origin/main] 直前までのコミット
```

GitHub 上で `main` から次の branch を作成する。

```text
feature/show-update-owner
```

GitHub 上に branch を作成した直後は、ローカル側の branch 一覧にはまだ表示されない。

```bash
git branch
```

表示例：

```text
* main
```

リモートの最新情報を取得する。

```bash
git fetch origin
```

出力例：

```text
From https://github.com/<your-account>/git-github-practice-drills
 * [new branch]      feature/show-update-owner -> origin/feature/show-update-owner
```

remote branch を確認する。

```bash
git branch -r
```

表示例：

```text
  origin/feature/show-update-owner
  origin/main
```

local branch と remote branch をまとめて確認する。

```bash
git branch -a
```

表示例：

```text
* main
  remotes/origin/feature/show-update-owner
  remotes/origin/main
```

remote branch を tracking する local branch を作成して切り替える。

```bash
git switch -c feature/show-update-owner --track origin/feature/show-update-owner
```

出力例：

```text
branch 'feature/show-update-owner' set up to track 'origin/feature/show-update-owner'.
Switched to a new branch 'feature/show-update-owner'
```

tracking 状態を確認する。

```bash
git branch -vv
```

表示例：

```text
* feature/show-update-owner abc1234 [origin/feature/show-update-owner] 直前までのコミット
  main                      abc1234 [origin/main] 直前までのコミット
```

作業ツリーが clean であることを確認する。

```bash
git status
```

表示例：

```text
On branch feature/show-update-owner
Your branch is up to date with 'origin/feature/show-update-owner'.

nothing to commit, working tree clean
```

`practice/team-portal/data/updates.json` の各データへ `owner` を追加する。

```text
id: 1 → Product Team
id: 2 → Platform Team
id: 3 → Development Team
id: 4 → Product Team
id: 5 → Platform Team
id: 6 → Development Team
```

`practice/team-portal/src/app.js` の `createUpdateCard` 内へ、担当チーム表示を追加する。

```javascript
const owner = document.createElement("p");
owner.className = "update-card__owner";
owner.textContent = `担当: ${update.owner}`;
```

カードへの追加処理を変更する。

```javascript
meta.append(category, date);
article.append(meta, title, summary, owner);
```

`practice/team-portal/styles.css` へ次のスタイルを追加する。

```css
.update-card__owner {
  margin: 16px 0 0;
  color: #334155;
  font-size: 0.85rem;
  font-weight: 700;
}
```

変更状態を確認する。

```bash
git status --short
```

表示例：

```text
 M practice/team-portal/data/updates.json
 M practice/team-portal/src/app.js
 M practice/team-portal/styles.css
```

変更の概要を確認する。

```bash
git diff --stat
```

表示例：

```text
 practice/team-portal/data/updates.json | 6 ++++++
 practice/team-portal/src/app.js        | 5 ++++-
 practice/team-portal/styles.css        | 7 +++++++
 3 files changed, 17 insertions(+), 1 deletion(-)
```

3 ファイルをステージングする。

```bash
git add practice/team-portal/data/updates.json practice/team-portal/src/app.js practice/team-portal/styles.css
```

ステージング済みの差分を確認する。

```bash
git diff --cached --stat
```

表示例：

```text
 practice/team-portal/data/updates.json | 6 ++++++
 practice/team-portal/src/app.js        | 5 ++++-
 practice/team-portal/styles.css        | 7 +++++++
 3 files changed, 17 insertions(+), 1 deletion(-)
```

変更を commit する。

```bash
git commit -m "feat: 更新情報に担当チームを追加"
```

出力例：

```text
[feature/show-update-owner def5678] feat: 更新情報に担当チームを追加
 3 files changed, 17 insertions(+), 1 deletion(-)
```

commit 後の状態を確認する。

```bash
git status
```

表示例：

```text
On branch feature/show-update-owner
Your branch is ahead of 'origin/feature/show-update-owner' by 1 commit.

nothing to commit, working tree clean
```

作業 branch を GitHub へ push する。

```bash
git push
```

出力例：

```text
To https://github.com/<your-account>/git-github-practice-drills.git
   abc1234..def5678  feature/show-update-owner -> feature/show-update-owner
```

GitHub 上で Pull Request を作成する。

```text
Base:
main

Compare:
feature/show-update-owner
```

Pull Request title：

```text
feat: 更新情報に担当チームを追加
```

Pull Request body：

```markdown
## Summary

- 更新情報データに担当チームを追加
- 更新カードに担当チームを表示
- 担当チーム表示用のスタイルを追加

## Checks

- [x] 6件の更新情報に `owner` が追加されている
- [x] `app.js` で担当チームを表示する処理が追加されている
- [x] 担当チーム表示用の CSS が追加されている
```

Pull Request の commit と Files changed を確認し、GitHub 上で merge する。

この課題では通常の merge commit を使用する。

merge 後、GitHub 上で `feature/show-update-owner` を削除する。

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
git branch -d feature/show-update-owner
```

削除済み remote branch の追跡情報を整理する。

```bash
git fetch --prune
```

branch 一覧を確認する。

```bash
git branch -a
```

表示例：

```text
* main
  remotes/origin/main
```

最終的な履歴を確認する。

```bash
git log --oneline --graph --decorate --all -8
```

表示例：

```text
*   789abcd (HEAD -> main, origin/main) Merge pull request #<PR番号> from <your-account>/feature/show-update-owner
|\
| * def5678 feat: 更新情報に担当チームを追加
|/
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

## 学習ポイント

この課題では、ローカルで作業 branch を作成するのではなく、GitHub 上ですでに作成されている branch を取得して作業を始める流れを確認する。

GitHub 上で新しい branch が作成されても、その情報はローカルへ自動的には反映されない。  
ローカルで `git fetch origin` を実行することで、リモート側の最新情報を取得する。

`fetch` は remote branch や commit などの情報を取得するが、現在の local branch へ変更を merge する操作ではない。  
そのため、リモートの状態を確認してから次の操作を判断したい場合に使用できる。

remote branch の情報は、ローカルでは remote-tracking branch として確認できる。

```text
origin/feature/show-update-owner
```

これは、ローカルで直接作業する branch ではなく、`origin` に存在する branch の状態をローカル側で参照するための名前となる。

今回の課題では、次の操作で remote-tracking branch を tracking する local branch を作成している。

```bash
git switch -c feature/show-update-owner --track origin/feature/show-update-owner
```

作成後は、次の対応関係になる。

```text
local branch:
feature/show-update-owner

upstream:
origin/feature/show-update-owner
```

この対応関係は、`git branch -vv` や `git status` で確認できる。

tracking が設定されているため、変更を commit した後は、remote branch 名を毎回指定せずに `git push` を実行できる。

チーム開発では、自分がローカルで作成した branch だけでなく、GitHub 上ですでに作成されている branch を取得して作業を引き継ぐ場面もある。  
そのため、`fetch`、remote-tracking branch、local branch、tracking branch の関係を確認しながら作業できることが重要となる。

Pull Request を merge した後は、ローカルの `main` を最新化し、不要になった local branch と remote-tracking branch を整理する。  
作業開始時だけでなく、merge 後の同期と片付けまでを一連の作業として行う。

## 補足

Git のバージョンや設定によっては、remote branch が一意に特定できる場合、次のような操作だけで local tracking branch を作成できることがある。

```bash
git switch feature/show-update-owner
```

ただし、この課題では remote branch と local branch の関係を明示的に確認するため、次の形を解答例として使用している。

```bash
git switch -c feature/show-update-owner --track origin/feature/show-update-owner
```

GitHub 上の branch 作成画面や branch selector の表示位置は、GitHub の UI によって異なる場合がある。  
この課題では、`main` を元に `feature/show-update-owner` が GitHub 上へ作成され、その後 `git fetch` でローカルから確認できればよい。

また、GitHub 上で作業 branch を削除しても、ローカルの remote-tracking branch はすぐに消えない場合がある。  
`git fetch --prune` を使うことで、リモート側で削除済みの branch に対応する不要な参照を整理できる。
