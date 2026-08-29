# 019. Pull Request をローカルへ取得してレビューする

> GitHub 上の Pull Request をローカルへ取得し、`main` との差分や commit を確認してからレビュー指摘と再確認を行う

## 想定シチュエーション

チームメンバーが、Team Portal の更新情報へ「情報元」を追加する Pull Request を作成した。  
Pull Request の変更内容は GitHub 上でも確認できるが、今回はローカルへ取得し、`main` との差分や commit をコマンドでも確認してレビューする。  
レビュー対象の Pull Request では、`updates.json` に追加された値と `project-overview.md` の説明に不一致があるため、その点を GitHub 上の line comment で指摘する。  
指摘後、Pull Request の head branch に修正 commit が追加された想定で、ローカルの review branch も最新状態へ更新する。  
修正後の差分を再確認し、問題が解消されていることを確認して conversation を解決する。  
最後に Pull Request を merge し、ローカルの review branch と作業 branch を整理する。

この課題では、Pull Request を GitHub 上だけで確認するのではなく、ローカルへ取得して branch・commit・diff を確認するレビューの流れを練習する。

```text
レビュー対象 branch を作成
↓
変更を commit・push
↓
Pull Request を作成
↓
main へ戻る
↓
Pull Request の ref をローカルへ取得
↓
review branch を作成
↓
main との差分・commit を確認
↓
GitHub 上で line comment
↓
head branch に修正 commit を追加
↓
review branch を最新化
↓
差分を再確認
↓
conversation を解決
↓
Pull Request を merge
↓
branch 整理
```

## この課題の目的

この課題では、Pull Request をローカルへ取得してレビューする流れとして、次の内容を確認する。

- レビュー対象となる Pull Request を作成する
- Pull Request の番号を確認する
- Pull Request の ref をローカルへ取得する
- Pull Request 用の local review branch を作成する
- `main` と review branch の commit 差分を確認する
- `main...review branch` の差分を確認する
- Pull Request に含まれる変更ファイルをローカルで確認する
- GitHub の `Files changed` から line comment を追加する
- レビュー指摘に対応する追加 commit を head branch へ push する
- 既存の Pull Request が追加 commit によって更新されることを確認する
- Pull Request の ref を再取得して review branch を最新化する
- 修正前後の差分を比較して指摘事項が解消されたことを確認する
- GitHub 上で conversation を解決する
- Pull Request を merge する
- merge 後に review branch と作業 branch を整理する

## 使用する主な操作

- status / diff
- branch の作成・切り替え
- add / commit / push
- Pull Request の作成
- Pull Request 番号の確認
- `git fetch origin pull/<PR番号>/head:<branch>`
- log / graph
- branch 間の commit 比較
- three-dot diff
- GitHub `Files changed`
- line comment
- conversation の解決
- Pull Request の merge
- pull
- branch の削除
- prune

## 事前状態

この課題は、次の状態から開始する想定とする。

- 018 の課題が完了している
- 現在の branch は `main`
- 作業ツリーは clean
- `origin` が設定されている
- ローカルの `main` が `origin/main` を tracking している
- ローカルの `main` と `origin/main` が同じ commit を指している
- `practice/team-portal/data/updates.json` が存在する
- `practice/team-portal/docs/project-overview.md` が存在する
- `practice/team-portal/docs/update-guidelines.md` が存在する
- `feature/add-update-source` はまだ存在しない
- `review/pr-<PR番号>` はまだ存在しない

この課題で変更するファイルは次の通り。

```text
practice/
  team-portal/
    data/
      updates.json
    docs/
      project-overview.md
      update-guidelines.md
```

## 課題内容

この課題では、最初にレビュー対象となる Pull Request を自分で用意する。  
その後は、その Pull Request を「別の開発者が作成した Pull Request」とみなして、ローカルへ取得してレビューする。

### 1. レビュー対象の作業 branch を作成する

`main` が最新状態であることを確認した後、次の branch を作成する。

```text
feature/add-update-source
```

### 2. updates.json に情報元を追加する

`practice/team-portal/data/updates.json` の各更新情報へ `source` を追加する。  
追加する値は次の通り。

```text
id: 1 → release-note
id: 2 → operation
id: 3 → meeting-note
id: 4 → release-note
id: 5 → operation
id: 6 → meeting-note
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
  "audience": "all",
  "source": "release-note"
}
```

残りのデータにも同じ位置へ `source` を追加する。

### 3. project-overview.md に情報元の説明を追加する

`practice/team-portal/docs/project-overview.md` の `## 更新情報` にある説明の直後へ、次の内容を追加する。

```markdown
情報元は `release-note` / `operation` のいずれかを設定する。
```

ここでは、実際の `updates.json` では `meeting-note` も使用しているが、ドキュメントには意図的に記載しない。  
この不一致を後のレビュー指摘で扱う。

### 4. update-guidelines.md に確認事項を追加する

`practice/team-portal/docs/update-guidelines.md` の `## 確認事項` に、次の項目を追加する。

```markdown
- 情報元が設定されていること
```

### 5. レビュー対象の変更を commit・push する

3ファイルの変更状態と差分を確認する。  
変更を1つの commit にまとめる。

commit message：

```text
feat: 更新情報に情報元を追加
```

作業 branch を GitHub へ push し、tracking branch を設定する。

### 6. レビュー対象の Pull Request を作成する

GitHub 上で、次の Pull Request を作成する。

base branch：

```text
main
```

compare branch：

```text
feature/add-update-source
```

Pull Request title：

```text
feat: 更新情報に情報元を追加
```

Pull Request body：

```markdown
## Summary

- 更新情報データに情報元を追加
- 情報元の種類をドキュメントへ追記
- 更新時の確認事項に情報元を追加

## Checks

- [x] 6件の更新情報に `source` が追加されている
- [x] `project-overview.md` に情報元の説明が追加されている
- [x] `update-guidelines.md` に確認事項が追加されている
```

Pull Request を作成したら、PR 番号を確認する。  
以降では、その番号を `<PR番号>` として扱う。  
この時点では Pull Request を merge しない。

### 7. main に戻る

レビュー対象の branch から離れ、ローカルの `main` に戻る。  
作業ツリーが clean であることを確認する。

### 8. Pull Request の ref をローカルへ取得する

Pull Request の番号を使い、GitHub 上の Pull Request の head ref を取得する。  
取得先の local branch は次の名前とする。

```text
review/pr-<PR番号>
```

使用する形式：

```bash
git fetch origin pull/<PR番号>/head:review/pr-<PR番号>
```

`<PR番号>` は実際の Pull Request 番号へ置き換える。  
取得後、`review/pr-<PR番号>` が local branch として作成されていることを確認する。  
この review branch は、Pull Request の内容をローカルで確認するための branch として使用する。

### 9. review branch へ切り替える

`review/pr-<PR番号>` へ切り替える。  
現在の `HEAD` が Pull Request の head commit を指していることを確認する。

### 10. Pull Request の commit を確認する

`main` にはなく review branch にだけ存在する commit を確認する。  
確認対象：

```text
main..review/pr-<PR番号>
```

`feat: 更新情報に情報元を追加` の commit が1件表示されることを確認する。

### 11. Pull Request の変更ファイルを確認する

Pull Request の差分を、`main` と review branch の共通祖先を基準に確認する。  
変更ファイルの概要を確認した後、次の3ファイルを個別に確認する。

```text
practice/team-portal/data/updates.json
practice/team-portal/docs/project-overview.md
practice/team-portal/docs/update-guidelines.md
```

特に次の内容を比較する。

```text
updates.json
→ source に release-note / operation / meeting-note が存在する

project-overview.md
→ release-note / operation しか説明されていない
```

この不一致をレビュー指摘の対象とする。

### 12. GitHub 上で line comment を追加する

GitHub の Pull Request へ戻り、`Files changed` を開く。  
`project-overview.md` に追加した次の行へ line comment を追加する。

```markdown
情報元は `release-note` / `operation` のいずれかを設定する。
```

comment 内容：

```text
`updates.json` では `meeting-note` も使用しているため、ここにも `meeting-note` を含めた方がデータと説明が一致すると思います。
```

この課題は1人で完結させるため、`Approve` や `Request changes` は必須としない。  
line comment は通常の comment として追加し、conversation を残した状態にする。

### 13. レビュー指摘へ対応する

ここからは Pull Request の作成者側の作業へ戻る。  
ローカルで `feature/add-update-source` へ切り替える。  
`practice/team-portal/docs/project-overview.md` の情報元の説明を修正する。

変更前：

```markdown
情報元は `release-note` / `operation` のいずれかを設定する。
```

変更後：

```markdown
情報元は `release-note` / `operation` / `meeting-note` のいずれかを設定する。
```

変更状態と差分を確認し、追加 commit を作成する。

commit message：

```text
docs: 情報元の説明を修正
```

同じ `feature/add-update-source` へ push する。

### 14. Pull Request が更新されたことを確認する

GitHub 上の既存 Pull Request を確認する。  
新しい Pull Request を作成するのではなく、同じ Pull Request に追加 commit が反映されていることを確認する。

確認内容：

```text
- Commits が2件になっている
- Files changed に修正後の project-overview.md が反映されている
- review comment の conversation が残っている
```

### 15. ローカルの review branch を最新化する

ローカルの `main` へ切り替える。  
同じ Pull Request の ref を、既存の review branch へ再取得する。

使用する形式：

```bash
git fetch origin pull/<PR番号>/head:review/pr-<PR番号>
```

review branch が新しい head commit まで更新されたことを確認する。  
その後、`review/pr-<PR番号>` へ切り替える。

### 16. 修正後の Pull Request を再確認する

`main` にはなく review branch にだけ存在する commit を確認する。  
次の2件が確認できることを確認する。

```text
feat: 更新情報に情報元を追加
docs: 情報元の説明を修正
```

`project-overview.md` の差分を再確認し、次の3種類がすべて説明へ含まれていることを確認する。

```text
release-note
operation
meeting-note
```

`updates.json` とドキュメントの不一致が解消されていることを確認する。

### 17. GitHub 上で conversation を解決する

Pull Request の review comment へ戻る。  
修正内容が反映されていることを確認したうえで、必要に応じて次のような返信を追加する。

```text
修正内容を確認しました。3種類の情報元がドキュメントにも反映されています。
```

その後、対象 conversation を `Resolve conversation` で解決する。

### 18. Pull Request を merge する

Pull Request の `Commits` と `Files changed` を最終確認する。  
問題がなければ Pull Request を merge する。  
この課題では通常の merge commit を使用する。  
merge 後、GitHub 上で `feature/add-update-source` を削除する。

### 19. merge 後の branch を整理する

ローカルの `main` に戻り、GitHub 上の最新状態を取り込む。  
その後、不要になった次の local branch を削除する。

```text
feature/add-update-source
review/pr-<PR番号>
```

最後に、削除済み remote branch の追跡情報を整理する。

## 作業の流れ

1. 現在の branch と作業ツリーを確認する。
2. リモートの最新情報を取得し、`main` が最新であることを確認する。
3. `feature/add-update-source` を作成する。
4. `updates.json` に `source` を追加する。
5. `project-overview.md` に情報元の説明を追加する。
6. `update-guidelines.md` に情報元の確認事項を追加する。
7. 変更状態と差分を確認する。
8. 3ファイルをステージングして commit する。
9. 作業 branch を GitHub へ push する。
10. レビュー対象の Pull Request を作成する。
11. Pull Request 番号を確認する。
12. Pull Request は merge せず、ローカルの `main` に戻る。
13. Pull Request の ref を `review/pr-<PR番号>` として取得する。
14. review branch が作成されたことを確認する。
15. review branch へ切り替える。
16. `main` にない commit を確認する。
17. `main` と review branch の変更ファイルを確認する。
18. `updates.json` の差分を確認する。
19. `project-overview.md` の差分を確認する。
20. `update-guidelines.md` の差分を確認する。
21. `updates.json` と `project-overview.md` の不一致を確認する。
22. GitHub の `Files changed` で `project-overview.md` に line comment を追加する。
23. `feature/add-update-source` へ戻る。
24. レビュー指摘に沿って `project-overview.md` を修正する。
25. 修正差分を確認する。
26. 追加 commit を作成する。
27. 同じ作業 branch へ push する。
28. GitHub 上の既存 Pull Request が更新されたことを確認する。
29. ローカルの `main` へ切り替える。
30. Pull Request の ref を既存の review branch へ再取得する。
31. review branch が最新の head commit へ更新されたことを確認する。
32. review branch へ切り替える。
33. Pull Request の2件の commit を確認する。
34. 修正後の `project-overview.md` の差分を確認する。
35. レビュー指摘が解消されていることを確認する。
36. GitHub 上の review comment へ必要に応じて返信する。
37. conversation を解決する。
38. Pull Request の `Commits` と `Files changed` を最終確認する。
39. Pull Request を merge する。
40. GitHub 上で作業 branch を削除する。
41. ローカルの `main` に戻る。
42. GitHub 上の最新状態をローカルへ取り込む。
43. 不要になった作業 branch と review branch を削除する。
44. 削除済み remote branch の追跡情報を整理する。
45. 最終的な branch、履歴、作業ツリーを確認する。

## 完了条件

次の状態になっていれば、この課題は完了とする。

- `feature/add-update-source` でレビュー対象の変更を作成している
- `updates.json` の6件すべてに `source` が追加されている
- `project-overview.md` に情報元の説明が追加されている
- `update-guidelines.md` に情報元の確認事項が追加されている
- レビュー対象の Pull Request が作成されている
- Pull Request 番号を確認している
- Pull Request の ref をローカルへ取得している
- `review/pr-<PR番号>` が local branch として作成されている
- `main` と review branch の commit 差分を確認している
- Pull Request の変更ファイルをローカルで確認している
- `updates.json` と `project-overview.md` の不一致を確認している
- GitHub 上で line comment を追加している
- レビュー指摘に対応する追加 commit が作成されている
- 同じ head branch へ追加 commit が push されている
- 既存の Pull Request に追加 commit が反映されている
- Pull Request の ref を再取得して review branch を最新化している
- review branch で修正後の差分を再確認している
- 情報元の不一致が解消されている
- GitHub 上で conversation が解決されている
- Pull Request が merge されている
- GitHub 上の作業 branch が削除されている
- ローカルの `main` に merge 後の変更が取り込まれている
- 不要になった作業 branch と review branch が削除されている
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

レビュー対象の作業 branch を作成する。

```bash
git switch -c feature/add-update-source
```

課題内容に沿って `updates.json`、`project-overview.md`、`update-guidelines.md` を変更する。  
変更状態を確認する。

```bash
git status --short
```

表示例：

```text
 M practice/team-portal/data/updates.json
 M practice/team-portal/docs/project-overview.md
 M practice/team-portal/docs/update-guidelines.md
```

差分の概要を確認する。

```bash
git diff --stat
```

3ファイルをステージングする。

```bash
git add practice/team-portal/data/updates.json practice/team-portal/docs/project-overview.md practice/team-portal/docs/update-guidelines.md
```

ステージング済みの差分を確認する。

```bash
git diff --cached
```

変更を commit する。

```bash
git commit -m "feat: 更新情報に情報元を追加"
```

作業 branch を GitHub へ push する。

```bash
git push -u origin feature/add-update-source
```

GitHub 上で `feature/add-update-source` から `main` への Pull Request を作成する。  
Pull Request 作成後、タイトル付近に表示される PR 番号を確認する。  
ここでは例として PR 番号が `42` だったものとする。

```text
#42
```

ローカルの `main` に戻る。

```bash
git switch main
```

Pull Request の ref を local review branch として取得する。

```bash
git fetch origin pull/42/head:review/pr-42
```

出力例：

```text
From https://github.com/<your-account>/git-github-practice-drills
 * [new ref]         refs/pull/42/head -> review/pr-42
```

local branch を確認する。

```bash
git branch
```

表示例：

```text
  feature/add-update-source
* main
  review/pr-42
```

review branch へ切り替える。

```bash
git switch review/pr-42
```

`main` にない commit を確認する。

```bash
git log --oneline main..review/pr-42
```

表示例：

```text
def5678 feat: 更新情報に情報元を追加
```

Pull Request の変更ファイルを確認する。

```bash
git diff --stat main...review/pr-42
```

変更ファイル名だけを確認する。

```bash
git diff --name-status main...review/pr-42
```

`updates.json` の差分を確認する。

```bash
git diff main...review/pr-42 -- practice/team-portal/data/updates.json
```

`source` に次の3種類が存在することを確認する。

```text
release-note
operation
meeting-note
```

`project-overview.md` の差分を確認する。

```bash
git diff main...review/pr-42 -- practice/team-portal/docs/project-overview.md
```

表示例：

```diff
+情報元は `release-note` / `operation` のいずれかを設定する。
```

この時点で、`updates.json` では `meeting-note` が使用されている一方、ドキュメントでは説明されていないことを確認する。  
GitHub の Pull Request へ戻り、`Files changed` から対象行へ次の line comment を追加する。

```text
`updates.json` では `meeting-note` も使用しているため、ここにも `meeting-note` を含めた方がデータと説明が一致すると思います。
```

この課題では、自分で用意した Pull Request をレビュー対象としているため、`Approve` や `Request changes` は使用せず、comment として指摘を残す。  
ローカルで Pull Request の head branch へ戻る。

```bash
git switch feature/add-update-source
```

`project-overview.md` を次の内容へ修正する。

```markdown
情報元は `release-note` / `operation` / `meeting-note` のいずれかを設定する。
```

差分を確認する。

```bash
git diff -- practice/team-portal/docs/project-overview.md
```

修正をステージングして commit する。

```bash
git add practice/team-portal/docs/project-overview.md
git commit -m "docs: 情報元の説明を修正"
```

同じ head branch へ push する。

```bash
git push
```

GitHub 上の既存 Pull Request を確認する。  
`Commits` に追加 commit が反映されていることを確認する。

```text
feat: 更新情報に情報元を追加
docs: 情報元の説明を修正
```

ローカルの `main` へ切り替える。

```bash
git switch main
```

同じ Pull Request の ref を既存の review branch へ再取得する。

```bash
git fetch origin pull/42/head:review/pr-42
```

出力例：

```text
From https://github.com/<your-account>/git-github-practice-drills
   def5678..789abcd  refs/pull/42/head -> review/pr-42
```

review branch へ切り替える。

```bash
git switch review/pr-42
```

commit を再確認する。

```bash
git log --oneline main..review/pr-42
```

表示例：

```text
789abcd docs: 情報元の説明を修正
def5678 feat: 更新情報に情報元を追加
```

修正後の `project-overview.md` の差分を確認する。

```bash
git diff main...review/pr-42 -- practice/team-portal/docs/project-overview.md
```

表示例：

```diff
+情報元は `release-note` / `operation` / `meeting-note` のいずれかを設定する。
```

`updates.json` で使用している3種類と、ドキュメントの説明が一致していることを確認する。  
GitHub 上の review comment へ戻り、必要に応じて返信する。

```text
修正内容を確認しました。3種類の情報元がドキュメントにも反映されています。
```

対象 conversation を `Resolve conversation` で解決する。  
Pull Request の `Commits` と `Files changed` を最終確認し、問題がなければ merge する。  
この課題では通常の merge commit を使用する。  
merge 後、GitHub 上で `feature/add-update-source` を削除する。

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
git branch -d feature/add-update-source
git branch -d review/pr-42
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

Pull Request の内容は GitHub の `Files changed` だけでなく、ローカルへ取得して通常の Git の履歴や差分として確認できる。  
GitHub は Pull Request の head commit を ref として保持しており、Pull Request 番号を使って取得できる。

```bash
git fetch origin pull/<PR番号>/head:review/pr-<PR番号>
```

この操作では、Pull Request の head ref を取得し、その commit を指す local branch を作成している。  
今回の `review/pr-<PR番号>` はレビュー確認用に自分で付けた local branch 名であり、GitHub 上に同名の branch が作成されるわけではない。

Pull Request の変更内容を確認するときは、単に現在のファイルを見るだけでなく、base branch との差分を確認する。  
今回使用した次の形式では、`main` と review branch の共通祖先から review branch までの変更を確認できる。

```bash
git diff main...review/pr-<PR番号>
```

Pull Request の変更差分を確認する用途では、base branch との共通祖先を基準にできる three-dot の diff が分かりやすい。  
branch 間の commit 差分は次のように確認できる。

```bash
git log --oneline main..review/pr-<PR番号>
```

これは review branch に存在し、`main` には存在しない commit を確認する操作となる。  
レビューでは、コードや文章の表面的な変更だけでなく、複数ファイル間で内容が整合しているかも確認する。  
今回の課題では、`updates.json` で使用されている `meeting-note` が `project-overview.md` の説明から漏れていることを、複数ファイルの差分を比較して見つける。

Pull Request の head branch へ新しい commit が push されると、既存の Pull Request もその branch の最新状態へ更新される。  
レビュー側の local review branch は自動では更新されないため、Pull Request の ref を再取得して最新の head commit へ進める必要がある。

レビュー指摘を修正後に再確認し、問題が解消されてから conversation を解決することで、「指摘を出す」だけでなく「修正を確認して完了させる」ところまで一連のレビューとして扱える。

## 補足

GitHub CLI を使用できる環境では、Pull Request をローカルへ取得する方法として `gh pr checkout <PR番号>` も利用できる。  
この課題では、Git の ref と branch の関係を確認するため、`git fetch origin pull/<PR番号>/head:<branch>` を使用する。

`refs/pull/` は GitHub が Pull Request のために保持している ref であり、通常の作業 branch の push 先として使用するものではない。  
レビュー対象へ修正を加える場合は、Pull Request の実際の head branch へ commit・push する。  
今回の課題では `feature/add-update-source` がその branch にあたる。

実際のチーム開発では、他の開発者が作成した Pull Request に対して `Approve` や `Request changes` を使用する場合がある。  
この課題は1人で完結できるよう、自分で用意した Pull Request を他者の Pull Request とみなして確認するため、review decision 自体は必須にしていない。  
line comment、修正、再確認、conversation の解決というレビューの基本的な流れを主な対象とする。
