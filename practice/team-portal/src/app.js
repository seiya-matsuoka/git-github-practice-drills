const updatesList = document.querySelector("#updates-list");
const updatesCount = document.querySelector("#updates-count");
const emptyMessage = document.querySelector("#empty-message");

const categoryLabels = {
  release: "リリース",
  maintenance: "メンテナンス",
  team: "チーム",
};

async function loadUpdates() {
  try {
    const response = await fetch("./data/updates.json");

    if (!response.ok) {
      throw new Error(`更新情報の取得に失敗しました: ${response.status}`);
    }

    const updates = await response.json();
    renderUpdates(updates);
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

loadUpdates();
