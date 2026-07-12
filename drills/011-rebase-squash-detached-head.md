# 011. 履歴整理と detached HEAD からの救出

> rebase と squash で作業履歴を整理し、detached HEAD で作成したコミットを救出する

## 想定シチュエーション

タスクボードのリリースメモを更新する作業を、作業ブランチで進める。

作業中に小さな修正を複数回コミットしたため、作業ブランチには内容の細かいコミットが3つ作成されている。  
その間に `main` 側にも別のドキュメント変更が追加された。

Pull Request を作成する前に、作業ブランチを最新の `main` に追従させる。  
その後、細かく分かれた3つのコミットを1つにまとめ、履歴を読みやすい状態に整理する。

整理した変更を `main` に反映したあと、過去のコミットを確認するために detached HEAD へ移動する。  
その状態で誤って新しいコミットを作成してしまった想定で、コミットを失わないようにブランチとして救出し、最終的に `main` へ取り込む。

## この課題の目的

この課題では、履歴整理と detached HEAD への対応として、次の流れを確認する。

- 作業ブランチと `main` の履歴を分岐させる
- 作業ブランチを最新の `main` へ rebase する
- rebase 前後でコミットIDが変わることを確認する
- interactive rebase で複数コミットを squash する
- 整理した作業ブランチを `main` へ fast-forward で取り込む
- detached HEAD の状態を確認する
- detached HEAD 上で作成したコミットをブランチとして救出する
- 救出したコミットを `main` へ取り込む
- 最終的な履歴を確認する

## 使用する主な操作

- 作業ブランチの作成
- 複数コミットの作成
- ブランチ切り替え
- rebase
- interactive rebase
- squash
- fast-forward merge
- detached HEAD への移動
- detached HEAD 上でのコミット作成
- ブランチによるコミット救出
- cherry-pick
- 履歴グラフの確認

## 事前状態

この課題は、次の状態から開始する想定とする。

- 010の課題が完了している
- 現在のブランチは `main`
- 作業ツリーは clean
- `practice/task-board/docs/release-note.md` が存在する
- `practice/task-board/docs/remote-sync-note.md` が存在する
- interactive rebase を実行できるエディタが設定されている

この課題で編集するファイルは次の通り。

```text
practice/
  task-board/
    docs/
      release-note.md
      remote-sync-note.md
```

## 課題内容

この課題では、次の4段階の操作を行う。

### 変更1: 作業ブランチで3つのコミットを作成する

`main` から、リリースメモ更新用の作業ブランチを作成する。

作業ブランチ上で、`practice/task-board/docs/release-note.md` に次の変更を順番に加え、それぞれ別コミットとして記録する。

#### 1つ目のコミット

ファイル末尾に次の内容を追加する。

```markdown
## Next practice

- Gitの履歴を整理する
```

#### 2つ目のコミット

上記の箇条書きを次の内容に変更する。

```markdown
- rebase を使って作業ブランチを最新化する
```

#### 3つ目のコミット

同じセクションに次の項目を追加する。

```markdown
- squash を使って細かいコミットをまとめる
```

3つのコミットを作成した時点で、作業ブランチの履歴に細かい変更が3つ並んでいることを確認する。

### 変更2: main 側に別のコミットを追加する

作業ブランチの変更を残したまま `main` に切り替える。

`practice/task-board/docs/remote-sync-note.md` の末尾に次の内容を追記し、`main` 上でコミットする。

```markdown
## History note

作業ブランチを統合する前に、main の最新状態を確認します。
```

これにより、作業ブランチと `main` の履歴が分岐した状態を作る。

### 変更3: rebase と squash で作業履歴を整理する

作業ブランチに戻り、最新の `main` を基準に rebase する。

rebase 完了後、作業ブランチの3つのコミットが最新の `main` の後ろへ並び直されていることを確認する。

次に interactive rebase を使い、作業ブランチ上の3つのコミットを1つにまとめる。  
まとめたコミットのメッセージは次の内容にする。

```text
docs: 次回のGit練習項目をリリースメモに追加
```

履歴整理後、作業ブランチを `main` に fast-forward で取り込む。

### 変更4: detached HEAD 上のコミットを救出する

`main` へ取り込んだあと、1つ前のコミットを確認するために detached HEAD へ移動する。

この時点では、`main` で取り込んだ `Next practice` の変更より1つ前のコミットを参照している。  
そのため、detached HEAD 上で `practice/task-board/docs/release-note.md` の末尾に次の内容を追加し、コミットする。

```markdown
## Detached HEAD note

Detached HEAD で作成したコミットをブランチとして救出します。
```

コミット後、現在のコミットを指す救出用ブランチを作成する。

その後 `main` に戻り、救出用ブランチ上のコミットを `main` へ取り込む。  
取り込み後、救出用ブランチを削除する。

## 作業の流れ

1. 作業開始前に、現在のブランチと作業状態を確認する。
2. リリースメモ更新用の作業ブランチを作成する。
3. リリースメモへ1つ目の変更を加えてコミットする。
4. 同じ箇所を修正し、2つ目のコミットを作成する。
5. 同じセクションに項目を追加し、3つ目のコミットを作成する。
6. 作業ブランチ上に3つのコミットが作成されていることを確認する。
7. `main` に切り替える。
8. 同期メモへ別の内容を追記し、`main` 上でコミットする。
9. 作業ブランチと `main` の履歴が分岐していることを確認する。
10. 作業ブランチへ戻り、最新の `main` を基準に rebase する。
11. rebase 後の履歴とコミットIDを確認する。
12. interactive rebase で3つの作業コミットを1つにまとめる。
13. squash 後の履歴を確認する。
14. `main` に戻り、作業ブランチを fast-forward で取り込む。
15. 1つ前のコミットへ detached HEAD で移動する。
16. detached HEAD の状態を確認する。
17. リリースメモへ追記し、detached HEAD 上でコミットする。
18. 作成したコミットを指す救出用ブランチを作成する。
19. `main` に戻り、救出したコミットを取り込む。
20. 救出用ブランチと作業ブランチを削除する。
21. 最終的な作業状態と履歴を確認する。

## 完了条件

次の状態になっていれば、この課題は完了とする。

- 作業ブランチ上で細かいコミットが3つ作成されている
- `main` 側にも別のコミットが作成されている
- 作業ブランチが最新の `main` を基準に rebase されている
- 作業ブランチ上の3つのコミットが1つに squash されている
- squash 後のコミットが `main` に取り込まれている
- detached HEAD の状態でコミットが作成されている
- detached HEAD 上のコミットが救出用ブランチとして保持されている
- 救出したコミットが `main` に取り込まれている
- 不要になった作業ブランチと救出用ブランチが削除されている
- 最終的な作業ツリーが clean になっている
- 履歴上で整理後のコミットと救出したコミットを確認できる

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

リリースメモ更新用の作業ブランチを作成する。

```bash
git switch -c feature/update-release-practice
```

出力例：

```text
Switched to a new branch 'feature/update-release-practice'
```

`practice/task-board/docs/release-note.md` の末尾に、1つ目の内容を追加する。

```markdown
## Next practice

- Gitの履歴を整理する
```

差分を確認する。

```bash
git diff -- practice/task-board/docs/release-note.md
```

表示例：

```diff
@@
 - Pull Request 作業用のチェックリストを追加
+
+## Next practice
+
+- Gitの履歴を整理する
```

1つ目のコミットを作成する。

```bash
git add practice/task-board/docs/release-note.md
git commit -m "docs: 次回のGit練習項目を追加"
```

出力例：

```text
[feature/update-release-practice abc1234] docs: 次回のGit練習項目を追加
 1 file changed, 4 insertions(+)
```

追加した箇条書きを、次の内容に変更する。

```markdown
- rebase を使って作業ブランチを最新化する
```

2つ目のコミットを作成する。

```bash
git add practice/task-board/docs/release-note.md
git commit -m "docs: rebase の練習内容を具体化"
```

出力例：

```text
[feature/update-release-practice def5678] docs: rebase の練習内容を具体化
 1 file changed, 1 insertion(+), 1 deletion(-)
```

同じセクションに、次の項目を追加する。

```markdown
- squash を使って細かいコミットをまとめる
```

3つ目のコミットを作成する。

```bash
git add practice/task-board/docs/release-note.md
git commit -m "docs: squash の練習項目を追加"
```

出力例：

```text
[feature/update-release-practice 789abcd] docs: squash の練習項目を追加
 1 file changed, 1 insertion(+)
```

作業ブランチ上の履歴を確認する。

```bash
git log --oneline --decorate -5
```

表示例：

```text
789abcd (HEAD -> feature/update-release-practice) docs: squash の練習項目を追加
def5678 docs: rebase の練習内容を具体化
abc1234 docs: 次回のGit練習項目を追加
0123456 (main) 直前までのコミット
```

`main` に切り替える。

```bash
git switch main
```

`practice/task-board/docs/remote-sync-note.md` の末尾に、次の内容を追加する。

```markdown
## History note

作業ブランチを統合する前に、main の最新状態を確認します。
```

`main` 側の変更をコミットする。

```bash
git add practice/task-board/docs/remote-sync-note.md
git commit -m "docs: ブランチ統合前の確認メモを追加"
```

履歴が分岐していることを確認する。

```bash
git log --oneline --graph --decorate --all -10
```

表示例：

```text
* fedcba9 (HEAD -> main) docs: ブランチ統合前の確認メモを追加
| * 789abcd (feature/update-release-practice) docs: squash の練習項目を追加
| * def5678 docs: rebase の練習内容を具体化
| * abc1234 docs: 次回のGit練習項目を追加
|/
* 0123456 直前までのコミット
```

作業ブランチへ戻る。

```bash
git switch feature/update-release-practice
```

最新の `main` を基準に rebase する。

```bash
git rebase main
```

出力例：

```text
Successfully rebased and updated refs/heads/feature/update-release-practice.
```

rebase 後の履歴を確認する。

```bash
git log --oneline --graph --decorate --all -10
```

表示例：

```text
* 3456789 (HEAD -> feature/update-release-practice) docs: squash の練習項目を追加
* 2345678 docs: rebase の練習内容を具体化
* 1234567 docs: 次回のGit練習項目を追加
* fedcba9 (main) docs: ブランチ統合前の確認メモを追加
* 0123456 直前までのコミット
```

rebase 前と比べて、作業ブランチ上の3コミットのコミットIDが変わっていることを確認する。

最新の `main` より後ろにある3つのコミットを interactive rebase で整理する。

```bash
git rebase -i main
```

エディタが開いたら、次のような一覧を確認する。

```text
pick 1234567 docs: 次回のGit練習項目を追加
pick 2345678 docs: rebase の練習内容を具体化
pick 3456789 docs: squash の練習項目を追加
```

2つ目と3つ目の `pick` を `squash` または `s` に変更する。

```text
pick 1234567 docs: 次回のGit練習項目を追加
squash 2345678 docs: rebase の練習内容を具体化
squash 3456789 docs: squash の練習項目を追加
```

保存して閉じると、コミットメッセージを編集する画面が開く。  
最終的なコミットメッセージを次の内容にする。

```text
docs: 次回のGit練習項目をリリースメモに追加
```

処理完了時の出力例：

```text
Successfully rebased and updated refs/heads/feature/update-release-practice.
```

squash 後の履歴を確認する。

```bash
git log --oneline --graph --decorate --all -10
```

表示例：

```text
* 456789a (HEAD -> feature/update-release-practice) docs: 次回のGit練習項目をリリースメモに追加
* fedcba9 (main) docs: ブランチ統合前の確認メモを追加
* 0123456 直前までのコミット
```

`main` に戻る。

```bash
git switch main
```

作業ブランチを fast-forward で取り込む。

```bash
git merge --ff-only feature/update-release-practice
```

出力例：

```text
Updating fedcba9..456789a
Fast-forward
 practice/task-board/docs/release-note.md | 5 +++++
 1 file changed, 5 insertions(+)
```

1つ前のコミットへ detached HEAD で移動する。

```bash
git switch --detach HEAD~1
```

出力例：

```text
HEAD is now at fedcba9 docs: ブランチ統合前の確認メモを追加
```

現在の状態を確認する。

```bash
git status
```

表示例：

```text
HEAD detached at fedcba9
nothing to commit, working tree clean
```

ブランチ一覧を確認する。

```bash
git branch
```

表示例：

```text
* (HEAD detached at fedcba9)
  feature/update-release-practice
  main
```

`practice/task-board/docs/release-note.md` の末尾に次の内容を追加する。

```markdown
## Detached HEAD note

Detached HEAD で作成したコミットをブランチとして救出します。
```

変更をコミットする。

```bash
git add practice/task-board/docs/release-note.md
git commit -m "docs: detached HEAD の救出メモを追加"
```

出力例：

```text
[detached HEAD 56789ab] docs: detached HEAD の救出メモを追加
 1 file changed, 4 insertions(+)
```

detached HEAD 上で作成したコミットを失わないように、現在位置から救出用ブランチを作成する。

```bash
git switch -c rescue/detached-release-note
```

出力例：

```text
Switched to a new branch 'rescue/detached-release-note'
```

`main` に戻る。

```bash
git switch main
```

救出用ブランチ上のコミットを `main` へ取り込む。

```bash
git cherry-pick rescue/detached-release-note
```

出力例：

```text
[main 6789abc] docs: detached HEAD の救出メモを追加
 1 file changed, 4 insertions(+)
```

作業状態を確認する。

```bash
git status
```

表示例：

```text
On branch main
nothing to commit, working tree clean
```

不要になった救出用ブランチを削除する。

```bash
git branch -d rescue/detached-release-note
```

不要になった作業ブランチも削除する。

```bash
git branch -d feature/update-release-practice
```

最終的な履歴を確認する。

```bash
git log --oneline --graph --decorate --all -10
```

表示例：

```text
* 6789abc (HEAD -> main) docs: detached HEAD の救出メモを追加
* 456789a docs: 次回のGit練習項目をリリースメモに追加
* fedcba9 docs: ブランチ統合前の確認メモを追加
* 0123456 直前までのコミット
```

必要に応じて、最終状態をGitHubへpushする。

```bash
git push
```

## 学習ポイント

この課題では、`rebase`、`squash`、detached HEAD の役割と注意点を確認する。

`git rebase main` を実行すると、作業ブランチの分岐元を最新の `main` に付け替えられる。  
作業ブランチ上のコミットは、最新の `main` の後ろへ順番に再適用される。

rebase では、既存コミットをそのまま移動するのではなく、新しいコミットとして作り直す。  
そのため、コミット内容が同じでもコミットIDは変わる。

interactive rebase では、コミットの順序変更、削除、編集、結合などを行える。  
今回使用した `squash` は、複数のコミットを1つにまとめる操作となる。

作業途中の細かいコミットは、変更の経緯を残すためには便利だが、そのまま共有履歴へ残すと読みにくくなることがある。  
Pull Request を作成する前などに、意味のある単位へ整理することで履歴を追いやすくできる。

ただし、rebase や squash はコミット履歴を書き換える操作となる。  
すでに他の人と共有しているブランチに対して実行すると、他の作業者の履歴とずれる可能性がある。  
基本的には、自分だけが使用している作業ブランチで行う。

detached HEAD は、HEADがブランチではなく特定のコミットを直接指している状態となる。  
過去の状態を確認するだけであれば問題ないが、その状態でコミットを作成すると、通常のブランチから参照されないコミットになる。

detached HEAD 上で作成したコミットを残したい場合は、そのコミットを指すブランチを作成する。  
今回の `git switch -c rescue/detached-release-note` により、コミットが救出用ブランチから参照される状態になる。

救出用ブランチを作成したあと、必要なコミットを `main` へ `cherry-pick` することで、detached HEAD 上で行った変更を通常の履歴へ取り込める。

## 補足

interactive rebase で開くエディタや操作方法は、Gitの設定や使用環境によって異なる。  
VS Code をGitのエディタとして使用している場合は、VS Code上で rebase の一覧やコミットメッセージを編集する。

作業ブランチをすでにGitHubへpushしたあとに rebase や squash を行うと、ローカルとGitHub上で履歴が異なる状態になる。  
その場合は通常の `git push` では更新できず、履歴を書き換えるpushが必要になる。

履歴を書き換える必要がある場合は、単純な `--force` よりも、リモート側の予期しない更新を上書きしにくい `--force-with-lease` を使う方が安全となる。

```bash
git push --force-with-lease
```

ただし、今回はローカルの作業ブランチで履歴整理を行う前提としているため、強制pushは必須の手順には含めていない。
