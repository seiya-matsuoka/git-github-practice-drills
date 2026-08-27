# 018. main へ誤って commit した変更を作業 branch へ移す

> `main` へ誤って作成した未 push の commit を作業 branch へ保持し、`main` を `origin/main` の状態へ戻す

## 想定シチュエーション

Team Portal の更新情報について、表示順に関するドキュメントを修正した。  
本来は作業 branch を作成してから変更する予定だったが、`main` にいることへ気付かないまま編集と commit まで行ってしまった。  
まだ GitHub へ push はしておらず、誤った commit はローカルの `main` にだけ存在している。  
この commit 自体の内容は必要なため、削除するのではなく作業 branch へ残したい。  
そこで、現在の commit を指す新しい branch を作成して変更を保持した後、`main` だけを `origin/main` の位置へ戻す。  
その後は作業 branch を GitHub へ push し、通常どおり Pull Request から `main` へ merge する。

この課題では、誤った branch で commit してしまった場合に、commit を失わずに正しい branch へ移し、`main` を元の状態へ戻す流れを確認する。

```text
main で誤って変更
↓
main で commit
↓
main が origin/main より1 commit 先行
↓
現在の commit から作業 branch を作成
↓
commit が作業 branch に保持される
↓
main へ戻る
↓
main を origin/main へ reset
↓
main から誤 commit が外れる
↓
作業 branch へ戻る
↓
push・Pull Request
↓
main へ merge
↓
branch 整理
```

## この課題の目的

この課題では、`main` へ誤って commit した変更を作業 branch へ移す流れとして、次の内容を確認する。

- 作業開始前に現在の branch とリモートとの同期状態を確認する
- `main` 上で変更・commit してしまった状態を作る
- `main` が `origin/main` より先行していることを確認する
- 誤って作成した commit の hash を確認する
- 現在の commit を指す新しい作業 branch を作成する
- branch を作成すると commit 自体は失われないことを確認する
- `main` を `origin/main` の位置へ戻す
- `main` から誤 commit が外れ、作業 branch には残っていることを確認する
- 作業 branch を GitHub へ push する
- Pull Request を作成して通常の開発フローへ戻す
- merge 後に `main` を同期し、branch を整理する

## 使用する主な操作

- status / diff
- add / commit
- log
- branch の作成・切り替え
- `reset --hard`
- local branch と remote-tracking branch の位置確認
- push
- Pull Request の作成・merge
- pull
- branch の削除
- prune

## 事前状態

この課題は、次の状態から開始する想定とする。

- 017 の課題が完了している
- 現在の branch は `main`
- 作業ツリーは clean
- `origin` が設定されている
- ローカルの `main` が `origin/main` を tracking している
- ローカルの `main` と `origin/main` が同じ commit を指している
- `practice/team-portal/docs/project-overview.md` が存在する
- `practice/team-portal/docs/update-guidelines.md` が存在する
- `feature/document-update-order` はまだ存在しない

この課題で変更するファイルは次の通り。

```text
practice/
  team-portal/
    docs/
      project-overview.md
      update-guidelines.md
```

## 課題内容

この課題では、最初に意図的に `main` 上で変更と commit を行う。  
commit 後に branch の誤りへ気付いた想定とし、その commit を作業 branch へ保持してから `main` を元へ戻す。

### 1. main が最新であることを確認する

現在の branch が `main` であることを確認する。  
リモートの最新情報を取得し、ローカルの `main` と `origin/main` が同じ commit を指していることを確認する。

### 2. project-overview.md に表示順の説明を追加する

`practice/team-portal/docs/project-overview.md` の末尾へ、次の内容を追加する。

```markdown
## 表示順

更新情報は、日付の新しいものから確認できる順序で扱う。
```

### 3. update-guidelines.md に確認事項を追加する

`practice/team-portal/docs/update-guidelines.md` の `## 確認事項` に、次の項目を追加する。

```markdown
- 日付の新しい更新情報が先に扱われること
```

### 4. main 上で変更を commit する

2ファイルの変更状態と差分を確認する。  
ここでは branch の誤りにまだ気付いていない想定で、そのまま `main` 上で変更をステージングして commit する。

commit message：

```text
docs: 更新情報の表示順を明確にする
```

この commit は GitHub へ push しない。

### 5. branch の誤りに気付いた状態を確認する

commit 後に `git status` と履歴を確認し、次の状態になっていることを確認する。

```text
- 現在の branch は main
- 作業ツリーは clean
- main は origin/main より1 commit 先行している
- 誤って作成した commit はまだ push されていない
```

誤 commit の commit hash も確認する。

### 6. 誤 commit を保持する作業 branch を作成する

現在の `main` が指している誤 commit から、次の作業 branch を作成して切り替える。

```text
feature/document-update-order
```

この操作によって、誤 commit を指す branch が新しく作成される。  
作業 branch の先頭に `docs: 更新情報の表示順を明確にする` が存在することを確認する。

### 7. main を origin/main の位置へ戻す

作業 branch に誤 commit が保持されていることを確認した後、`main` へ戻る。  
作業ツリーが clean であることを確認し、ローカルの `main` を `origin/main` が指している commit へ戻す。

この操作後、次の状態になっていることを確認する。

```text
main
→ origin/main と同じ commit

feature/document-update-order
→ 誤って main で作成した commit を保持
```

### 8. commit が失われていないことを確認する

`main` と作業 branch の履歴を確認する。  
`main` からは誤 commit が外れているが、`feature/document-update-order` には残っていることを確認する。  
作業 branch にだけ存在する commit も確認する。

### 9. 作業 branch を GitHub へ push する

`feature/document-update-order` に切り替える。  
変更内容が commit 済みで、作業ツリーが clean であることを確認する。  
作業 branch を GitHub へ push し、tracking branch を設定する。

### 10. Pull Request を作成する

GitHub 上で、次の Pull Request を作成する。

base branch：

```text
main
```

compare branch：

```text
feature/document-update-order
```

Pull Request title：

```text
docs: 更新情報の表示順を明確にする
```

Pull Request body：

```markdown
## Summary

- 更新情報の表示順に関する説明を追加
- 更新情報の確認事項に表示順の項目を追加

## Checks

- [x] `project-overview.md` に表示順の説明が追加されている
- [x] `update-guidelines.md` に確認事項が追加されている
```

Pull Request の `Commits` と `Files changed` を確認する。  
問題がなければ Pull Request を merge する。  
この課題では通常の merge commit を使用する。

### 11. merge 後の branch を整理する

GitHub 上で `feature/document-update-order` を削除する。  
ローカルでは `main` に戻り、GitHub 上の最新状態を取り込む。  
その後、不要になった local branch を削除し、削除済み remote branch の追跡情報を整理する。

## 作業の流れ

1. 現在の branch と作業ツリーを確認する。
2. リモートの最新情報を取得する。
3. `main` と `origin/main` が同じ commit を指していることを確認する。
4. `project-overview.md` に表示順の説明を追加する。
5. `update-guidelines.md` に表示順の確認事項を追加する。
6. 2ファイルの変更状態を確認する。
7. 差分を確認する。
8. 変更をステージングする。
9. `main` 上で変更を commit する。
10. commit 後の `status` を確認する。
11. `main` が `origin/main` より1 commit 先行していることを確認する。
12. 誤 commit の commit hash を確認する。
13. 現在の commit から `feature/document-update-order` を作成して切り替える。
14. 作業 branch が誤 commit を保持していることを確認する。
15. `main` に戻る。
16. 作業ツリーが clean であることを確認する。
17. `main` を `origin/main` の位置へ戻す。
18. `main` と `origin/main` が再び同じ commit を指していることを確認する。
19. 作業 branch に誤 commit が残っていることを確認する。
20. `main` と作業 branch の差分となる commit を確認する。
21. `feature/document-update-order` に切り替える。
22. 作業 branch を GitHub へ push する。
23. GitHub 上で Pull Request を作成する。
24. Pull Request の `Commits` と `Files changed` を確認する。
25. Pull Request を merge する。
26. GitHub 上で作業 branch を削除する。
27. ローカルの `main` に戻る。
28. GitHub 上の最新状態をローカルへ取り込む。
29. 不要になった local branch を削除する。
30. 削除済み remote branch の追跡情報を整理する。
31. 最終的な branch、履歴、作業ツリーを確認する。

## 完了条件

次の状態になっていれば、この課題は完了とする。

- 作業開始時に `main` と `origin/main` が同じ commit を指している
- `project-overview.md` に表示順の説明が追加されている
- `update-guidelines.md` に表示順の確認事項が追加されている
- 変更を誤って `main` 上で commit している
- 誤 commit は GitHub へ push されていない
- commit 後の `main` が `origin/main` より1 commit 先行している
- 誤 commit の commit hash を確認している
- 誤 commit から `feature/document-update-order` を作成している
- 作業 branch が誤 commit を保持している
- ローカルの `main` を `origin/main` の位置へ戻している
- `main` と `origin/main` が再び同じ commit を指している
- `main` から誤 commit が外れている
- `feature/document-update-order` には誤 commit が残っている
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

課題内容に沿って `project-overview.md` と `update-guidelines.md` を変更する。  
変更状態を確認する。

```bash
git status --short
```

表示例：

```text
 M practice/team-portal/docs/project-overview.md
 M practice/team-portal/docs/update-guidelines.md
```

差分を確認する。

```bash
git diff
```

表示例：

```diff
+## 表示順
+
+更新情報は、日付の新しいものから確認できる順序で扱う。
```

```diff
+- 日付の新しい更新情報が先に扱われること
```

変更をステージングする。

```bash
git add practice/team-portal/docs/project-overview.md practice/team-portal/docs/update-guidelines.md
```

ステージング済みの差分を確認する。

```bash
git diff --cached
```

`main` 上で誤って commit する。

```bash
git commit -m "docs: 更新情報の表示順を明確にする"
```

出力例：

```text
[main def5678] docs: 更新情報の表示順を明確にする
 2 files changed, ... insertions(+)
```

commit 後の状態を確認する。

```bash
git status
```

表示例：

```text
On branch main
Your branch is ahead of 'origin/main' by 1 commit.

nothing to commit, working tree clean
```

履歴を確認する。

```bash
git log --oneline --decorate -4
```

表示例：

```text
def5678 (HEAD -> main) docs: 更新情報の表示順を明確にする
abc1234 (origin/main) 直前までのコミット
```

誤 commit の hash は、この例では `def5678` となる。  
現在の commit から作業 branch を作成して切り替える。

```bash
git switch -c feature/document-update-order
```

出力例：

```text
Switched to a new branch 'feature/document-update-order'
```

作業 branch が誤 commit を保持していることを確認する。

```bash
git log --oneline --decorate -3
```

表示例：

```text
def5678 (HEAD -> feature/document-update-order, main) docs: 更新情報の表示順を明確にする
abc1234 (origin/main) 直前までのコミット
```

`main` に戻る。

```bash
git switch main
```

作業ツリーが clean であることを確認する。

```bash
git status
```

ローカルの `main` を `origin/main` が指している位置へ戻す。

```bash
git reset --hard origin/main
```

出力例：

```text
HEAD is now at abc1234 直前までのコミット
```

`main` と `origin/main` が同じ位置へ戻ったことを確認する。

```bash
git log --oneline --decorate -4
```

表示例：

```text
abc1234 (HEAD -> main, origin/main) 直前までのコミット
```

すべての local branch を含めて履歴を確認する。

```bash
git log --oneline --graph --decorate --all -6
```

表示例：

```text
* def5678 (feature/document-update-order) docs: 更新情報の表示順を明確にする
* abc1234 (HEAD -> main, origin/main) 直前までのコミット
```

作業 branch にだけ存在する commit を確認する。

```bash
git log --oneline main..feature/document-update-order
```

表示例：

```text
def5678 docs: 更新情報の表示順を明確にする
```

この時点で、誤 commit は `main` から外れているが、`feature/document-update-order` によって保持されている。  
作業 branch に切り替える。

```bash
git switch feature/document-update-order
```

作業 branch を GitHub へ push し、tracking branch を設定する。

```bash
git push -u origin feature/document-update-order
```

GitHub 上で `feature/document-update-order` から `main` への Pull Request を作成する。  
`Commits` では `docs: 更新情報の表示順を明確にする` が確認できる。  
`Files changed` では、`project-overview.md` と `update-guidelines.md` の変更だけが含まれていることを確認する。  
問題がなければ Pull Request を merge する。  
この課題では通常の merge commit を使用する。

merge 後、GitHub 上で `feature/document-update-order` を削除する。  
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
git branch -d feature/document-update-order
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
git log --oneline --graph --decorate --all -10
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

Git では、commit 自体と branch は別のものとして扱われる。  
branch は、特定の commit を指す名前として考えられる。  
そのため、誤って `main` 上で commit しても、その commit を指す別 branch を先に作成すれば、`main` の位置を戻しても commit を保持できる。

今回の誤 commit 直後は、次の状態となっている。

```text
main
↓
def5678  誤 commit
↓
abc1234  origin/main
```

ここで `feature/document-update-order` を現在の commit から作成すると、次のようになる。

```text
main
feature/document-update-order
↓
def5678  誤 commit
↓
abc1234  origin/main
```

その後、`main` だけを `origin/main` へ戻すと、次の状態になる。

```text
feature/document-update-order
↓
def5678  必要な commit

main
origin/main
↓
abc1234
```

このように、作業 branch が `def5678` を指しているため、`main` を戻しても commit は失われない。

今回使用する `git reset --hard origin/main` は、現在の branch の位置、index、working tree を `origin/main` の状態へ合わせる操作となる。  
そのため、実行前には作業ツリーが clean であることと、残したい commit が別 branch から参照されていることを確認することが重要となる。

誤 commit がまだ push されていない場合は、今回のようにローカルの branch の位置を整理することで対応できる。  
一方、すでに共有済みの `main` へ push している commit を同じ方法で戻し、そのまま force push する操作は他の利用者へ影響する可能性がある。  
この課題では、GitHub へ push する前に誤りへ気付いた状況だけを扱う。

`git log --oneline main..feature/document-update-order` のように branch 間の範囲を指定すると、作業 branch にあって `main` にはない commit を確認できる。  
branch の位置を変更した後は、commit が意図した branch に残っているかを履歴で確認する。

## 補足

この課題では、誤 commit の後に作業ツリーが clean であるため `git reset --hard origin/main` を使用する。  
未 commit の変更が残っている状態で `--hard` を実行すると、その変更も失われる可能性があるため注意する。

作業 branch を作成する前に `main` を `reset --hard` すると、誤 commit を指す分かりやすい branch がなくなる。  
その場合でも `reflog` から復旧できる可能性はあるが、この課題ではその方法を使用しない。  
まず作業 branch へ commit を保持してから `main` を戻すことを基本の手順とする。

すでに `main` へ push した commit の取り消しは、共有履歴への影響を考える必要がある。  
その場合は `revert` など別の方法が適切になることもあるため、この課題の手順をそのまま適用しない。
