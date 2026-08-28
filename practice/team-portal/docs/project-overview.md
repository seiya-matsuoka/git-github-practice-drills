# Team Portal

Git / GitHub 操作ドリルで使用する練習用ファイル一式。

チーム内のリリース、メンテナンス、共有事項などを一覧として扱う小規模なポータルを想定している。  
ファイル自体の完成度ではなく、Issue、branch、commit、Pull Request、レビュー、mergeなどのGit / GitHub操作を行うための題材として使用する。

## 更新情報

更新情報には、表示に必要なカテゴリ、日付、タイトル、概要、担当チーム、優先度、対象読者を保持する。
更新情報を追加・修正するときは、内容と対象読者を確認してから反映する。
情報元は `release-note` / `operation` のいずれかを設定する。

### 優先度

`priority` には次の値を使用する。

- `high`: 優先度が高い更新情報
- `normal`: 通常の更新情報

## 構成

```text
team-portal/
├─ data/
│  └─ updates.json
├─ docs/
│  └─ project-overview.md
├─ src/
│  └─ app.js
├─ index.html
└─ styles.css
```

## 表示順

更新情報は、日付の新しいものから確認できる順序で扱う。
