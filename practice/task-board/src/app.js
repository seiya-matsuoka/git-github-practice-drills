const summaryElement = document.querySelector("#summary");
const taskListElement = document.querySelector("#task-list");

async function loadTasks() {
  const response = await fetch("./data/tasks.json");
  const taskData = await response.json();

  const doneCount = taskData.tasks.filter((task) => task.done).length;
  summaryElement.textContent = `${taskData.projectName} - ${taskData.statusLabel} (${doneCount}/${taskData.tasks.length})`;

  taskListElement.innerHTML = "";

  for (const task of taskData.tasks) {
    const itemElement = document.createElement("li");
    itemElement.textContent = task.title;

    if (task.done) {
      itemElement.classList.add("done");
    }

    taskListElement.appendChild(itemElement);
  }
}

loadTasks();
