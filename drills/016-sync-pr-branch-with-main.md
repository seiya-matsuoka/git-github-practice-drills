# 016. Pull Request の作業 branch を最新の main へ追従させる

> Pull Request を開いている間に `main` が更新された状況を作り、作業 branch へ最新の `main` を取り込む

## 想定シチュエーション

Team Portal の更新情報に対象読者を追加する作業を進め、Pull Request を作成した。  
Pull Request の確認を待っている間に、別のドキュメント修正が先に `main` へ merge された。  
その結果、作業 branch は最新の `main` より古い状態になり、同じドキュメントの同じ行にも変更が入ったため、そのまま `main` を取り込むと conflict が発生する。  
作業 branch に最新の `main` を取り込み、conflict を解消してから同じ branch へ push し、Pull Request を更新する。  
最後に Pull Request を merge し、ローカルの `main` と branch を整理する。

この課題では、Pull Request を開いた後に base branch が更新された場合の基本的な対応として、リモートの状態確認、`main` の取り込み、conflict の解消、Pull Request の更新までを確認する。

```text
作業 branch で実装
↓
Pull Request を作成
↓
別 branch の変更を先に main へ merge
↓
作業 branch が main より古い状態になる
↓
fetch して履歴を確認
↓
origin/main を作業 branch へ merge
↓
conflict を解消
↓
merge commit を push
↓
Pull Request の更新を確認
↓
Pull Request を merge
↓
ローカル main の同期と branch 整理
```

## この課題の目的

この課題では、Pull Request の作業 branch を最新の `main` へ追従させる流れとして、次の内容を確認する。

- Pull Request を開いた状態で `main` が先に更新される状況を作る
- `fetch` で最新の remote branch の情報を取得する
- local branch、remote-tracking branch、`main` の位置関係を確認する
- `git log --graph` で branch の分岐を確認する
- 作業 branch へ `origin/main` を merge する
- merge 時に発生した conflict を確認する
- conflict marker を読み、両方の変更を残す形で解消する
- conflict 解消後の差分と状態を確認する
- merge commit を作成する
- 同じ作業 branch へ push して Pull Request を更新する
- Pull Request が最新の `main` を含む状態になったことを確認する
- Pull Request を merge する
- merge 後の `main` を同期し、branch を整理する

## 使用する主な操作

- status / diff
- branch の作成・切り替え
- add / commit / push
- fetch
- remote-tracking branch の確認
- log / graph
- merge
- conflict の確認・解消
- Pull Request の作成・merge
- pull
- branch の削除
- prune

## 事前状態

この課題は、次の状態から開始する想定とする。

- 015 の課題が完了している
- 現在の branch は `main`
- 作業ツリーは clean
- `origin` が設定されている
- ローカルの `main` が `origin/main` を tracking している
- `practice/team-portal/` が存在する
- `practice/team-portal/data/updates.json` が存在する
- `practice/team-portal/docs/project-overview.md` が存在する
- `practice/team-portal/src/app.js` が存在する
- 更新情報には `owner` と `priority` が存在する
- `project-overview.md` には更新情報の説明と優先度の定義が存在する

この課題で変更するファイルは次の通り。

```text
practice/
  team-portal/
    data/
      updates.json
    docs/
      project-overview.md
    src/
      app.js
```

## 課題内容

この課題では、最初に機能追加用の Pull Request を作成する。  
その後、別の branch からドキュメント変更を `main` へ先に merge し、作業 branch が最新の `main` より古くなる状態を作る。  
最後に作業 branch へ最新の `main` を取り込み、conflict を解消して Pull Request を更新する。

### 1. 機能追加用の作業 branch を作成する

`main` が最新状態であることを確認した後、次の作業 branch を作成する。

```text
feature/add-update-audience
```

### 2. 更新情報に対象読者を追加する

#### `practice/team-portal/data/updates.json`

各更新情報へ `audience` を追加する。  
追加する値は次の通り。

```text
id: 1 → all
id: 2 → development
id: 3 → development
id: 4 → all
id: 5 → development
id: 6 → development
```

1件目の変更例：

```json
{
  "id": 1,
  "title": "v1.4.0 をリリースしました",
  "summary": "ダッシュボードの表示速度を改善し、更新情報の表示を整理しました。",
  "category": "release",
  "date": "2026-07-08",
  "owner": "Product Team",
  "priority": "high",
  "audience": "all"
}
```

残りのデータにも同じ位置へ `audience` を追加する。

#### `practice/team-portal/src/app.js`

`priorityLabels` の後に、次の定義を追加する。

```javascript
const audienceLabels = {
  all: "全員",
  development: "開発チーム",
};
```

`createUpdateCard` 内で、優先度を作成している処理の後に対象読者表示を追加する。

```javascript
const audience = document.createElement("p");
audience.className = "update-card__audience";
audience.textContent = `対象: ${audienceLabels[update.audience] ?? update.audience}`;
```

カードへ要素を追加している処理を変更する。

変更前：

```javascript
meta.append(category, date);
article.append(meta, title, summary, owner, priority);
```

変更後：

```javascript
meta.append(category, date);
article.append(meta, title, summary, owner, priority, audience);
```

#### `practice/team-portal/docs/project-overview.md`

更新情報の説明を変更する。

変更前：

```markdown
更新情報には、カテゴリ、日付、タイトル、概要、担当チームを保持する。
```

変更後：

```markdown
更新情報には、カテゴリ、日付、タイトル、概要、担当チーム、優先度、対象読者を保持する。
```

### 3. 機能追加を commit・push する

3ファイルの変更状態と差分を確認し、1つの commit にまとめる。

commit message：

```text
feat: 更新情報に対象読者を追加
```

作業 branch を GitHub へ push し、tracking branch を設定する。

### 4. 機能追加用の Pull Request を作成する

GitHub 上で、次の Pull Request を作成する。

base branch：

```text
main
```

compare branch：

```text
feature/add-update-audience
```

Pull Request title：

```text
feat: 更新情報に対象読者を追加
```

Pull Request body：

```markdown
## Summary

- 更新情報データに対象読者を追加
- 更新カードに対象読者を表示
- 更新情報の保持項目をドキュメントへ反映

## Checks

- [x] 6件の更新情報に `audience` が追加されている
- [x] `app.js` に対象読者の表示処理が追加されている
- [x] `project-overview.md` に対象読者が追記されている
```

Pull Request の `Commits` と `Files changed` を確認する。  
この時点では Pull Request を merge しない。

### 5. 別の変更を main へ先に merge する

機能追加用の Pull Request を開いたまま、ローカルの `main` に戻る。  
次の branch を `main` から作成する。

```text
docs/clarify-update-description
```

`practice/team-portal/docs/project-overview.md` の更新情報の説明を変更する。

変更前：

```markdown
更新情報には、カテゴリ、日付、タイトル、概要、担当チームを保持する。
```

変更後：

```markdown
更新情報には、表示に必要なカテゴリ、日付、タイトル、概要、担当チームを保持する。
```

この変更を commit する。

commit message：

```text
docs: 更新情報の説明を明確にする
```

branch を GitHub へ push し、次の Pull Request を作成する。

Pull Request title：

```text
docs: 更新情報の説明を明確にする
```

この Pull Request は、機能追加用の Pull Request より先に `main` へ merge する。  
merge 後、GitHub 上で `docs/clarify-update-description` を削除する。

### 6. 機能追加用の作業 branch が古くなったことを確認する

ローカルで `feature/add-update-audience` に戻る。  
この時点では、ローカルの remote-tracking branch に GitHub 上の最新状態が反映されていない可能性があるため、まず `fetch` を行う。

`fetch` 後、`feature/add-update-audience`、`main`、`origin/main` の位置を履歴で確認する。  
`origin/main` には先に merge したドキュメント変更が含まれ、作業 branch にはその変更が含まれていない状態になっていることを確認する。

### 7. 最新の main を作業 branch へ取り込む

`feature/add-update-audience` にいる状態で、次の remote-tracking branch を merge する。

```text
origin/main
```

今回は `project-overview.md` の同じ行を両 branch で変更しているため、merge 時に conflict が発生する想定とする。

### 8. conflict を確認して解消する

`git status` で conflict が発生しているファイルを確認する。  
`project-overview.md` を開き、conflict marker と両方の変更内容を確認する。

最終的には、次の内容になるように conflict を解消する。

```markdown
更新情報には、表示に必要なカテゴリ、日付、タイトル、概要、担当チーム、優先度、対象読者を保持する。
```

この状態では、先に `main` へ入った「表示に必要な」という説明改善と、作業 branch で追加した「優先度、対象読者」の両方を残している。

conflict marker がすべて削除されていることを確認し、解消したファイルをステージングする。

### 9. merge commit を作成する

conflict 解消後の状態とステージング済みの差分を確認する。  
その後、`origin/main` を取り込んだ merge を完了する。

merge commit message は Git が用意する内容をそのまま使用してよい。  
例：

```text
Merge remote-tracking branch 'origin/main' into feature/add-update-audience
```

### 10. 同じ作業 branch へ push する

merge 後の履歴を確認し、作業 branch に次の両方が含まれていることを確認する。

```text
- 対象読者を追加した commit
- 最新の main に入ったドキュメント変更
```

その後、同じ `feature/add-update-audience` へ push する。

GitHub 上の既存 Pull Request を確認し、追加の merge commit が反映されていることを確認する。  
Files changed では、base branch 側ですでに取り込まれた変更が不要な差分として残らず、機能追加として必要な差分が確認できることを確認する。

### 11. 機能追加用の Pull Request を merge する

Pull Request の `Commits` と `Files changed` を最終確認する。  
問題がなければ Pull Request を merge する。  
この課題では通常の merge commit を使用する。

### 12. merge 後の branch を整理する

GitHub 上で `feature/add-update-audience` を削除する。  
ローカルでは `main` に戻り、GitHub 上の最新状態を取り込む。  
不要になった `feature/add-update-audience` と `docs/clarify-update-description` の local branch を削除する。  
最後に削除済み remote branch の追跡情報を整理する。

## 作業の流れ

1. 現在の branch と作業ツリーを確認する。
2. リモートの最新情報を取得し、`main` が最新であることを確認する。
3. `feature/add-update-audience` を作成する。
4. `updates.json` に対象読者を追加する。
5. `app.js` に対象読者の表示処理を追加する。
6. `project-overview.md` の更新情報の説明へ優先度と対象読者を追加する。
7. 変更状態と差分を確認する。
8. 機能追加をステージングして commit する。
9. 作業 branch を GitHub へ push する。
10. 機能追加用の Pull Request を作成する。
11. Pull Request の `Commits` と `Files changed` を確認する。
12. Pull Request は merge せず、ローカルの `main` に戻る。
13. `docs/clarify-update-description` を作成する。
14. `project-overview.md` の同じ行へ説明改善の変更を行う。
15. ドキュメント変更を commit・push する。
16. ドキュメント変更用の Pull Request を作成する。
17. ドキュメント変更用の Pull Request を `main` へ先に merge する。
18. GitHub 上でドキュメント変更用 branch を削除する。
19. ローカルで `feature/add-update-audience` に戻る。
20. `fetch` でリモートの最新情報を取得する。
21. branch の位置関係を履歴で確認する。
22. `origin/main` が作業 branch より先に進んでいることを確認する。
23. `origin/main` を作業 branch へ merge する。
24. conflict が発生したファイルを確認する。
25. `project-overview.md` の conflict marker と両方の変更を確認する。
26. 両方の意図を残す内容へ修正し、conflict marker を削除する。
27. conflict を解消したファイルをステージングする。
28. 状態と差分を確認する。
29. merge commit を作成する。
30. merge 後の履歴を確認する。
31. 同じ作業 branch へ push する。
32. GitHub 上の既存 Pull Request が更新されたことを確認する。
33. Pull Request の `Commits` と `Files changed` を最終確認する。
34. 機能追加用の Pull Request を merge する。
35. GitHub 上で機能追加用 branch を削除する。
36. ローカルの `main` に戻る。
37. GitHub 上の最新状態をローカルへ取り込む。
38. 不要になった local branch を削除する。
39. 削除済み remote branch の追跡情報を整理する。
40. 最終的な branch、履歴、作業ツリーを確認する。

## 完了条件

次の状態になっていれば、この課題は完了とする。

- `feature/add-update-audience` で機能追加を行っている
- 6件の更新情報に `audience` が追加されている
- `app.js` に対象読者の表示処理が追加されている
- `project-overview.md` に優先度と対象読者が追記されている
- 機能追加用の Pull Request が作成されている
- Pull Request を開いた状態で別の branch から `main` が更新されている
- `git fetch` で最新の `origin/main` を取得している
- branch の分岐状態を履歴で確認している
- `origin/main` を作業 branch へ merge している
- `project-overview.md` の conflict を確認している
- 両方の変更意図を残す形で conflict を解消している
- conflict marker が残っていない
- conflict 解消後に merge commit が作成されている
- 同じ作業 branch へ push している
- 既存の Pull Request に merge commit が反映されている
- Pull Request が最新の `main` を含む状態になっている
- 機能追加用の Pull Request が merge されている
- GitHub 上の作業 branch が削除されている
- ローカルの `main` に merge 後の変更が取り込まれている
- 不要になった local branch が削除されている
- 削除済み remote branch の追跡情報が整理されている
- 最終的な作業ツリーが clean になっている

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

機能追加用の作業 branch を作成する。

```bash
git switch -c feature/add-update-audience
```

課題内容に沿って、`updates.json`、`app.js`、`project-overview.md` を変更する。  
変更状態を確認する。

```bash
git status --short
```

表示例：

```text
 M practice/team-portal/data/updates.json
 M practice/team-portal/docs/project-overview.md
 M practice/team-portal/src/app.js
```

差分を確認する。

```bash
git diff
```

変更をステージングして commit する。

```bash
git add practice/team-portal/data/updates.json practice/team-portal/docs/project-overview.md practice/team-portal/src/app.js
git commit -m "feat: 更新情報に対象読者を追加"
```

作業 branch を GitHub へ push し、tracking branch を設定する。

```bash
git push -u origin feature/add-update-audience
```

GitHub 上で `feature/add-update-audience` から `main` への Pull Request を作成する。  
Pull Request の `Commits` と `Files changed` を確認し、この時点では merge しない。

ローカルの `main` に戻る。

```bash
git switch main
```

ドキュメント変更用の branch を作成する。

```bash
git switch -c docs/clarify-update-description
```

`project-overview.md` の更新情報の説明を次の内容へ変更する。

```markdown
更新情報には、表示に必要なカテゴリ、日付、タイトル、概要、担当チームを保持する。
```

変更を確認して commit する。

```bash
git diff -- practice/team-portal/docs/project-overview.md
git add practice/team-portal/docs/project-overview.md
git commit -m "docs: 更新情報の説明を明確にする"
```

branch を GitHub へ push する。

```bash
git push -u origin docs/clarify-update-description
```

GitHub 上で `docs/clarify-update-description` から `main` への Pull Request を作成し、先に merge する。  
merge 後、GitHub 上で `docs/clarify-update-description` を削除する。

ローカルで機能追加用 branch に戻る。

```bash
git switch feature/add-update-audience
```

リモートの最新情報を取得する。

```bash
git fetch origin
```

出力例：

```text
From https://github.com/<your-account>/git-github-practice-drills
   abc1234..def5678  main -> origin/main
 - [deleted]         (none) -> origin/docs/clarify-update-description
```

branch の位置関係を確認する。

```bash
git log --oneline --graph --decorate --all -8
```

表示例：

```text
*   def5678 (origin/main) Merge pull request #<PR番号> from <your-account>/docs/clarify-update-description
|\
| * 234abcd docs: 更新情報の説明を明確にする
|/
| * 789abcd (HEAD -> feature/add-update-audience, origin/feature/add-update-audience) feat: 更新情報に対象読者を追加
|/
* abc1234 (main) 直前までのコミット
```

この時点では、`origin/main` と `feature/add-update-audience` が別々に進んでいる。  
作業 branch へ最新の `main` を取り込む。

```bash
git merge origin/main
```

conflict が発生した場合の出力例：

```text
Auto-merging practice/team-portal/docs/project-overview.md
CONFLICT (content): Merge conflict in practice/team-portal/docs/project-overview.md
Automatic merge failed; fix conflicts and then commit the result.
```

現在の状態を確認する。

```bash
git status
```

表示例：

```text
On branch feature/add-update-audience
Your branch is up to date with 'origin/feature/add-update-audience'.

You have unmerged paths.
  (fix conflicts and run "git commit")

Unmerged paths:
  (use "git add <file>..." to mark resolution)
        both modified:   practice/team-portal/docs/project-overview.md
```

conflict が発生したファイルを確認する。

```bash
git diff -- practice/team-portal/docs/project-overview.md
```

ファイル内では、次のような conflict marker が確認できる。

```text
<<<<<<< HEAD
更新情報には、カテゴリ、日付、タイトル、概要、担当チーム、優先度、対象読者を保持する。
=======
更新情報には、表示に必要なカテゴリ、日付、タイトル、概要、担当チームを保持する。
>>>>>>> origin/main
```

両方の変更意図を確認し、最終的に次の内容へ修正する。

```markdown
更新情報には、表示に必要なカテゴリ、日付、タイトル、概要、担当チーム、優先度、対象読者を保持する。
```

conflict marker が削除されていることを確認する。  
解消したファイルをステージングする。

```bash
git add practice/team-portal/docs/project-overview.md
```

状態を確認する。

```bash
git status
```

表示例：

```text
On branch feature/add-update-audience
All conflicts fixed but you are still merging.
  (use "git commit" to conclude merge)
```

ステージング済みの差分を確認する。

```bash
git diff --cached
```

merge を完了する。

```bash
git commit
```

editor が開いた場合は、Git が用意した merge commit message をそのまま使用して保存する。

```text
Merge remote-tracking branch 'origin/main' into feature/add-update-audience
```

merge 後の履歴を確認する。

```bash
git log --oneline --graph --decorate --all -10
```

作業 branch を GitHub へ push する。

```bash
git push
```

GitHub 上の機能追加用 Pull Request を確認する。  
`Commits` に merge commit が追加され、作業 branch が最新の `main` を取り込んだ状態になっていることを確認する。  
`Files changed` では、対象読者追加として必要な最終差分を確認する。

問題がなければ機能追加用 Pull Request を merge する。  
この課題では通常の merge commit を使用する。

merge 後、GitHub 上で `feature/add-update-audience` を削除する。  
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
git branch -d feature/add-update-audience
git branch -d docs/clarify-update-description
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

最終的な履歴を確認する。

```bash
git log --oneline --graph --decorate --all -12
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

Pull Request を作成した後も、base branch である `main` の開発は進む。  
他の Pull Request が先に merge されると、自分の作業 branch は最新の `main` を含まない状態になる。  
その場合は、まず `git fetch origin` でリモートの最新情報を取得し、現在の branch の位置関係を確認することが重要となる。

`git fetch` はリモートの branch や commit の情報を取得する操作であり、現在の作業 branch へ変更を自動的に取り込むものではない。  
今回の課題では、取得した最新の `origin/main` を、作業 branch 上で次のように merge している。

```bash
git merge origin/main
```

`main` と作業 branch が異なる箇所だけを変更していれば、自動的に merge できる場合がある。  
同じ行や近い箇所を双方で変更している場合は、Git がどちらを採用するか判断できず、conflict が発生することがある。

conflict が発生した場合は、単に `HEAD` 側または `origin/main` 側のどちらかを機械的に残すのではなく、それぞれの変更意図を確認する。  
今回の課題では、「表示に必要な」という `main` 側の説明改善と、「優先度、対象読者」という作業 branch 側の機能追加を両方残す形で解消している。

conflict を解消した後、対象ファイルを `git add` すると、そのファイルについて conflict を解決したことを Git に伝えられる。  
すべての conflict を解消した後に commit することで、`main` を取り込んだ merge commit が作成される。

作業 branch を push すると、同じ branch を head branch としている既存の Pull Request も更新される。  
新しい Pull Request を作り直す必要はない。

GitHub の Pull Request 画面では、条件を満たす場合に base branch の変更を head branch へ取り込むための branch 更新操作が表示されることもある。  
ただし、この課題では branch の分岐、merge、conflict の状態をローカルで確認することを目的として、コマンドラインから `origin/main` を取り込む流れを使用する。

## 補足

`git merge origin/main` を実行する前には、現在の branch が機能追加用の作業 branch であることを確認する。  
`main` にいる状態で実行すると、この課題で意図している「最新の `main` を作業 branch へ取り込む」操作にはならない。

merge 中に状態が分からなくなった場合は、まず `git status` を確認する。  
Git は conflict が残っているファイルや、merge を完了するために必要な操作を表示する。

conflict 解消後は、conflict marker がファイル内に残っていないことも確認する。

```text
<<<<<<<
=======
>>>>>>>
```

作業 branch へ `main` を取り込む方法として rebase を使用する場合もある。  
ただし、この課題では merge による追従と conflict 解消を主題としているため、rebase は使用しない。
