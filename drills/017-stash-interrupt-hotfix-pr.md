# 017. 作業中の変更を退避して緊急修正へ切り替える

> commit 前の作業を `stash` で一時退避し、緊急修正の Issue・Pull Request を完了した後に元の作業へ戻る

## 想定シチュエーション

Team Portal の更新情報について、運用ルールを整理する作業を進めている。  
既存の `project-overview.md` を変更し、新しい `update-guidelines.md` も作成したが、まだ commit はしていない。  
その途中で、定期メンテナンス日時の記載に誤りがあることが分かり、先に緊急修正する必要が生じた。  
現在の作業を中途半端な commit として残さず、`stash` へ一時退避して作業ツリーを clean にする。  
その後、`main` から緊急修正用の branch を作成し、GitHub Issue、修正、commit、Pull Request、merge までを行う。  
緊急修正を `main` へ取り込んだ後は、元の作業 branch に戻り、最新の `main` を取り込んでから `stash` の内容を復元する。  
復元した作業を確認して commit・push し、通常の Pull Request として `main` へ merge する。

この課題では、作業途中に別の対応へ切り替える場面で、現在の変更を安全に退避し、緊急対応後に元の作業へ戻る一連の流れを確認する。

```text
通常作業を開始
↓
commit 前の変更がある状態
↓
stash へ一時退避
↓
main へ戻る
↓
緊急修正用 Issue を作成
↓
hotfix branch で修正
↓
commit・push・Pull Request
↓
main へ merge
↓
ローカル main を最新化
↓
元の作業 branch へ戻る
↓
最新の main を取り込む
↓
stash を復元
↓
通常作業を commit・push
↓
Pull Request を merge
↓
branch 整理
```

## この課題の目的

この課題では、作業中断と緊急修正の流れとして、次の内容を確認する。

- commit 前の変更状態を `status` / `diff` で確認する
- tracked file と untracked file をまとめて `stash` へ退避する
- `git stash push -u` の役割を確認する
- stash entry に分かりやすい message を付ける
- `stash list` / `stash show` で退避内容を確認する
- 作業ツリーを clean にして別 branch へ切り替える
- GitHub Issue を起点に緊急修正を行う
- hotfix branch で修正を commit・push する
- Pull Request を Issue と関連付けて merge する
- 緊急修正後の `main` をローカルへ取り込む
- 元の作業 branch へ最新の `main` を取り込む
- `stash pop` で退避した作業を復元する
- 復元後の変更状態と差分を確認する
- 元の作業を commit・push して Pull Request を作成する
- merge 後に branch と remote-tracking branch を整理する

## 使用する主な操作

- status / diff
- branch の作成・切り替え
- stash push / list / show / pop
- untracked file を含む stash
- GitHub Issue の作成
- add / commit / push
- Pull Request の作成・merge
- pull
- merge
- branch の削除
- prune

## 事前状態

この課題は、次の状態から開始する想定とする。

- 016 の課題が完了している
- 現在の branch は `main`
- 作業ツリーは clean
- `origin` が設定されている
- ローカルの `main` が `origin/main` を tracking している
- `practice/team-portal/` が存在する
- `practice/team-portal/data/updates.json` が存在する
- `practice/team-portal/docs/project-overview.md` が存在する
- `practice/team-portal/docs/update-guidelines.md` はまだ存在しない
- `project-overview.md` の更新情報には、カテゴリ、日付、タイトル、概要、担当チーム、優先度、対象読者が記載されている
- `updates.json` の `id: 2` には、定期メンテナンス日時として7月18日が記載されている

この課題で変更・作成するファイルは次の通り。

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

この課題では、通常作業を commit 前の状態まで進めた後、その変更を `stash` へ退避して緊急修正へ切り替える。  
緊急修正の完了後は元の作業 branch へ戻り、退避していた変更を復元して通常作業を完了する。

### 1. 通常作業用の branch を作成する

`main` が最新状態であることを確認した後、次の作業 branch を作成する。

```text
feature/add-update-guidelines
```

### 2. project-overview.md に運用ルールを追記する

`practice/team-portal/docs/project-overview.md` の `## 更新情報` にある説明の直後へ、次の1行を追加する。

```markdown
更新情報を追加・修正するときは、内容と対象読者を確認してから反映する。
```

変更後の該当部分は次のようになる。

```markdown
## 更新情報

更新情報には、表示に必要なカテゴリ、日付、タイトル、概要、担当チーム、優先度、対象読者を保持する。
更新情報を追加・修正するときは、内容と対象読者を確認してから反映する。
```

### 3. update-guidelines.md を新規作成する

次のファイルを新規作成する。

```text
practice/team-portal/docs/update-guidelines.md
```

内容は次の通りとする。

```markdown
# Update Guidelines

更新情報を追加・修正するときの確認事項をまとめる。

## 確認事項

- タイトルと概要の内容が一致していること
- カテゴリと担当チームが適切であること
- 優先度と対象読者が設定されていること
- 日付に誤りがないこと
```

この時点では、変更をステージング・commit しない。

### 4. commit 前の変更状態を確認する

`project-overview.md` が tracked file の変更として、`update-guidelines.md` が untracked file として存在することを確認する。  
`git diff` では tracked file の変更を確認し、新規ファイルについては `status` で存在を確認する。

### 5. 作業中の変更を stash へ退避する

緊急修正へ切り替えるため、現在の変更を `stash` へ退避する。  
今回は untracked file の `update-guidelines.md` も含めて退避する。

stash message：

```text
WIP: 更新情報の運用ルール追加
```

退避後、次を確認する。

```text
- project-overview.md の変更が作業ツリーから消えている
- update-guidelines.md が作業ツリーから消えている
- 作業ツリーが clean になっている
- stash entry が1件追加されている
```

### 6. 緊急修正用の Issue を作成する

GitHub 上で、次の Issue を作成する。

Issue title：

```text
定期メンテナンス日時を修正する
```

Issue body：

```markdown
## 概要

Team Portal の定期メンテナンス日時に誤りがあるため修正する。

## 対応内容

- 7月18日と記載されているメンテナンス日を7月19日に修正する

## 完了条件

- `updates.json` の対象データが7月19日の記載になっている
- 修正が Pull Request から `main` へ取り込まれている
```

### 7. main から緊急修正用 branch を作成する

`main` に戻り、最新状態であることを確認する。  
次の緊急修正用 branch を作成する。

```text
fix/update-maintenance-date
```

### 8. 定期メンテナンス日時を修正する

`practice/team-portal/data/updates.json` の `id: 2` にある `summary` を変更する。

変更前：

```json
"summary": "7月18日の午前2時から午前3時までメンテナンスを実施します。",
```

変更後：

```json
"summary": "7月19日の午前2時から午前3時までメンテナンスを実施します。",
```

この緊急修正では、他の項目は変更しない。

### 9. 緊急修正を commit・push する

変更状態と差分を確認し、1つの commit にまとめる。

commit message：

```text
fix: 定期メンテナンス日時を修正
```

緊急修正用 branch を GitHub へ push し、tracking branch を設定する。

### 10. 緊急修正用の Pull Request を作成する

GitHub 上で、次の Pull Request を作成する。

base branch：

```text
main
```

compare branch：

```text
fix/update-maintenance-date
```

Pull Request title：

```text
fix: 定期メンテナンス日時を修正
```

Pull Request body：

```markdown
## Summary

- 定期メンテナンス日を7月18日から7月19日に修正

## Checks

- [x] 対象の更新情報だけを変更
- [x] 日時以外のデータは変更していない

Closes #<Issue番号>
```

`<Issue番号>` は、今回作成した Issue の番号へ置き換える。  
Pull Request の `Commits` と `Files changed` を確認し、問題がなければ merge する。  
この課題では通常の merge commit を使用する。  
merge 後、対象 Issue が close されていることを確認し、GitHub 上で緊急修正用 branch を削除する。

### 11. ローカルの main を最新化する

ローカルで `main` に戻り、GitHub 上で merge された緊急修正を取り込む。  
`main` にメンテナンス日時の修正が含まれていることを履歴で確認する。

### 12. 元の作業 branch へ戻る

`feature/add-update-guidelines` に切り替える。  
この branch は緊急修正が `main` へ入る前に作成しているため、最新の `main` をまだ含んでいない状態となる。  
退避した作業を戻す前に、最新の `main` を作業 branch へ merge する。

今回は緊急修正が `updates.json`、元の作業が `docs/` 配下であるため、conflict は発生しない想定とする。

### 13. stash の内容を確認して復元する

stash entry が残っていることを確認する。  
復元前に、どのファイルが退避されているかを確認する。  
その後、最新の stash entry を `stash pop` で復元する。

復元後、次を確認する。

```text
- project-overview.md の変更が戻っている
- update-guidelines.md が untracked file として戻っている
- stash entry が削除されている
```

### 14. 元の作業を commit・push する

復元された変更状態と差分を確認する。  
`project-overview.md` と `update-guidelines.md` を1つの目的の変更としてステージングし、commit する。

commit message：

```text
docs: 更新情報の運用ルールを追加
```

作業 branch を GitHub へ push し、tracking branch を設定する。

### 15. 通常作業用の Pull Request を作成する

GitHub 上で、次の Pull Request を作成する。

base branch：

```text
main
```

compare branch：

```text
feature/add-update-guidelines
```

Pull Request title：

```text
docs: 更新情報の運用ルールを追加
```

Pull Request body：

```markdown
## Summary

- 更新情報を追加・修正するときの注意事項を追記
- 更新情報の確認事項をまとめたドキュメントを追加

## Checks

- [x] `project-overview.md` に運用ルールが追加されている
- [x] `update-guidelines.md` が追加されている
- [x] 緊急修正後の `main` を取り込んだ状態になっている
```

Pull Request の `Commits` と `Files changed` を確認し、問題がなければ merge する。  
この課題では通常の merge commit を使用する。

### 16. merge 後の branch を整理する

GitHub 上で通常作業用 branch を削除する。  
ローカルでは `main` に戻り、GitHub 上の最新状態を取り込む。  
不要になった通常作業用 branch と緊急修正用 branch を削除する。  
最後に削除済み remote branch の追跡情報を整理する。

## 作業の流れ

1. 現在の branch と作業ツリーを確認する。
2. リモートの最新情報を取得し、`main` が最新であることを確認する。
3. 通常作業用の `feature/add-update-guidelines` を作成する。
4. `project-overview.md` に運用ルールを追記する。
5. `update-guidelines.md` を新規作成する。
6. tracked file と untracked file が混在した変更状態を確認する。
7. tracked file の差分を確認する。
8. untracked file も含めて現在の作業を stash へ退避する。
9. stash entry と作業ツリーの状態を確認する。
10. GitHub 上で緊急修正用の Issue を作成する。
11. ローカルの `main` に戻る。
12. 緊急修正用の `fix/update-maintenance-date` を作成する。
13. `updates.json` の定期メンテナンス日を修正する。
14. 変更状態と差分を確認する。
15. 緊急修正をステージングして commit する。
16. 緊急修正用 branch を GitHub へ push する。
17. Issue に紐づく緊急修正用 Pull Request を作成する。
18. Pull Request の `Commits` と `Files changed` を確認する。
19. 緊急修正用 Pull Request を merge する。
20. Issue が close されたことを確認する。
21. GitHub 上で緊急修正用 branch を削除する。
22. ローカルの `main` に戻る。
23. GitHub 上の最新状態をローカルへ取り込む。
24. 通常作業用の `feature/add-update-guidelines` に戻る。
25. 最新の `main` を通常作業用 branch へ取り込む。
26. stash entry の一覧を確認する。
27. stash に退避したファイルを確認する。
28. `stash pop` で元の作業を復元する。
29. 復元後の変更状態を確認する。
30. `project-overview.md` の差分を確認する。
31. `update-guidelines.md` の内容を確認する。
32. 元の作業をステージングして commit する。
33. 通常作業用 branch を GitHub へ push する。
34. 通常作業用の Pull Request を作成する。
35. Pull Request の `Commits` と `Files changed` を確認する。
36. 通常作業用 Pull Request を merge する。
37. GitHub 上で通常作業用 branch を削除する。
38. ローカルの `main` に戻る。
39. GitHub 上の最新状態をローカルへ取り込む。
40. 不要になった local branch を削除する。
41. 削除済み remote branch の追跡情報を整理する。
42. stash が残っていないことを確認する。
43. 最終的な branch、履歴、作業ツリーを確認する。

## 完了条件

次の状態になっていれば、この課題は完了とする。

- `feature/add-update-guidelines` で通常作業を開始している
- `project-overview.md` に運用ルールの変更を行っている
- `update-guidelines.md` を untracked file として新規作成している
- commit 前の変更を `stash` へ退避している
- untracked file も stash に含まれている
- stash message が設定されている
- stash 後の作業ツリーが clean になっている
- GitHub 上で緊急修正用 Issue が作成されている
- `fix/update-maintenance-date` で緊急修正を行っている
- `updates.json` のメンテナンス日が7月19日に修正されている
- 緊急修正が commit・push されている
- 緊急修正用 Pull Request が Issue に紐づいている
- 緊急修正用 Pull Request が merge されている
- 対象 Issue が close されている
- ローカルの `main` に緊急修正が取り込まれている
- 通常作業用 branch に最新の `main` が取り込まれている
- `stash pop` で元の作業を復元している
- `project-overview.md` の変更が復元されている
- `update-guidelines.md` が復元されている
- stash entry が削除されている
- 元の作業が commit・push されている
- 通常作業用 Pull Request が作成されている
- 通常作業用 Pull Request が merge されている
- GitHub 上の作業 branch が削除されている
- ローカルの `main` にすべての変更が取り込まれている
- 不要になった local branch が削除されている
- 削除済み remote branch の追跡情報が整理されている
- 最終的に stash が残っていない
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

通常作業用 branch を作成する。

```bash
git switch -c feature/add-update-guidelines
```

課題内容に沿って `project-overview.md` を変更し、`update-guidelines.md` を新規作成する。  
変更状態を確認する。

```bash
git status --short
```

表示例：

```text
 M practice/team-portal/docs/project-overview.md
?? practice/team-portal/docs/update-guidelines.md
```

tracked file の差分を確認する。

```bash
git diff -- practice/team-portal/docs/project-overview.md
```

表示例：

```diff
 更新情報には、表示に必要なカテゴリ、日付、タイトル、概要、担当チーム、優先度、対象読者を保持する。
+更新情報を追加・修正するときは、内容と対象読者を確認してから反映する。
```

untracked file も含めて現在の作業を stash へ退避する。

```bash
git stash push -u -m "WIP: 更新情報の運用ルール追加"
```

出力例：

```text
Saved working directory and index state On feature/add-update-guidelines: WIP: 更新情報の運用ルール追加
```

作業ツリーが clean になったことを確認する。

```bash
git status
```

表示例：

```text
On branch feature/add-update-guidelines
nothing to commit, working tree clean
```

stash entry を確認する。

```bash
git stash list
```

表示例：

```text
stash@{0}: On feature/add-update-guidelines: WIP: 更新情報の運用ルール追加
```

退避内容の概要を確認する。

```bash
git stash show --stat --include-untracked stash@{0}
```

GitHub 上で課題内容に記載した緊急修正用 Issue を作成する。  
ローカルの `main` に戻る。

```bash
git switch main
```

緊急修正用 branch を作成する。

```bash
git switch -c fix/update-maintenance-date
```

`updates.json` の対象データを7月19日へ修正する。  
差分を確認する。

```bash
git diff -- practice/team-portal/data/updates.json
```

表示例：

```diff
-    "summary": "7月18日の午前2時から午前3時までメンテナンスを実施します。",
+    "summary": "7月19日の午前2時から午前3時までメンテナンスを実施します。",
```

変更をステージングして commit する。

```bash
git add practice/team-portal/data/updates.json
git commit -m "fix: 定期メンテナンス日時を修正"
```

緊急修正用 branch を GitHub へ push する。

```bash
git push -u origin fix/update-maintenance-date
```

GitHub 上で `fix/update-maintenance-date` から `main` への Pull Request を作成する。  
Pull Request body の `Closes #<Issue番号>` を実際の Issue 番号へ置き換える。  
`Commits` と `Files changed` を確認し、問題がなければ Pull Request を merge する。  
merge 後、Issue が close されたことを確認し、GitHub 上で `fix/update-maintenance-date` を削除する。

ローカルの `main` に戻る。

```bash
git switch main
```

GitHub 上の最新状態を取り込む。

```bash
git pull
```

通常作業用 branch に戻る。

```bash
git switch feature/add-update-guidelines
```

最新の `main` を取り込む。

```bash
git merge main
```

stash entry が残っていることを確認する。

```bash
git stash list
```

復元する前に内容を確認する。

```bash
git stash show --stat --include-untracked stash@{0}
```

退避した作業を復元する。

```bash
git stash pop
```

出力例：

```text
On branch feature/add-update-guidelines
Changes not staged for commit:
        modified:   practice/team-portal/docs/project-overview.md

Untracked files:
        practice/team-portal/docs/update-guidelines.md

Dropped refs/stash@{0} (...)
```

復元後の状態を確認する。

```bash
git status --short
```

表示例：

```text
 M practice/team-portal/docs/project-overview.md
?? practice/team-portal/docs/update-guidelines.md
```

stash entry が削除されたことを確認する。

```bash
git stash list
```

復元した差分と新規ファイルの内容を確認する。

```bash
git diff -- practice/team-portal/docs/project-overview.md
```

```bash
cat practice/team-portal/docs/update-guidelines.md
```

元の作業をステージングして commit する。

```bash
git add practice/team-portal/docs/project-overview.md practice/team-portal/docs/update-guidelines.md
git commit -m "docs: 更新情報の運用ルールを追加"
```

通常作業用 branch を GitHub へ push する。

```bash
git push -u origin feature/add-update-guidelines
```

GitHub 上で `feature/add-update-guidelines` から `main` への Pull Request を作成する。  
`Commits` と `Files changed` を確認し、問題がなければ Pull Request を merge する。  
merge 後、GitHub 上で `feature/add-update-guidelines` を削除する。

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
git branch -d feature/add-update-guidelines
git branch -d fix/update-maintenance-date
```

削除済み remote branch の追跡情報を整理する。

```bash
git fetch --prune
```

stash が残っていないことを確認する。

```bash
git stash list
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

作業中に別の対応へ切り替える必要が生じても、現在の変更を無理に commit する必要はない。  
`git stash` を使うと、working tree と index の現在の状態を一時的に退避し、clean な作業ツリーへ戻せる。  
今回のように commit として残すにはまだ途中の変更を保持したまま、別 branch へ切り替えたい場合に利用できる。

通常の `git stash push` では、untracked file は標準では退避対象に含まれない。  
今回は新規作成した `update-guidelines.md` もまとめて退避するため、`-u` を使用している。

```bash
git stash push -u -m "WIP: 更新情報の運用ルール追加"
```

`-m` で message を付けておくと、複数の stash entry が存在する場合でも何を退避したものか判断しやすくなる。  
stash entry は `git stash list` で一覧表示し、`git stash show` で内容を確認できる。

緊急修正では、退避した通常作業の branch 上でそのまま修正するのではなく、clean な状態へ戻してから `main` を基点とする専用 branch を作成している。  
これにより、通常作業の未完成な変更を緊急修正へ混在させずに済む。

緊急修正が `main` へ merge された後は、元の作業 branch へ戻してすぐ `stash pop` するのではなく、先に最新の `main` を取り込んでいる。  
この順番にすると、緊急修正後の最新状態を基準にして退避中の作業を復元できる。

`git stash pop` は stash の内容を適用し、正常に適用できた場合は対応する stash entry を削除する。  
復元後は `git status` や `git diff` を確認し、退避前の変更が意図どおり戻っていることを確認する。

stash は commit の代わりではなく、一時的な作業退避に使う。  
作業へ戻った後は、通常どおり差分を確認し、意味のある単位で commit・push・Pull Request へ進める。

## 補足

`git stash push -u` の `-u` は `--include-untracked` の短縮形で、untracked file も退避対象へ含める。  
新規ファイルがない場合は通常の `git stash push` でもよいが、この課題では tracked file と untracked file をまとめて退避する操作を確認するため `-u` を使用する。

`git stash pop` の復元時にも、現在の branch 側の変更と stash の変更が同じ箇所へ重なると conflict が発生することがある。  
この課題では stash の対象が `docs/` 配下、緊急修正が `updates.json` であるため、conflict は発生しない想定としている。

`stash pop` で conflict が発生した場合は、stash entry が自動的に削除されず残ることがある。  
その場合は `git status` と `git stash list` を確認してから対応する。  
この課題では、正常に復元されて stash entry が削除される基本的な流れを扱う。
