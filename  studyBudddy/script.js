
const taskInput = document.getElementById("taskInput");
const searchTasks = document.getElementById("searchTasks");
const clearSearchBtn = document.getElementById("clearSearchBtn");
let tasks = JSON.parse(localStorage.getItem("studyTasks")) || [];
const addTaskBtn = document.getElementById("addTaskBtn");
const clearAllBtn = document.getElementById("clearAllBtn");
const showAllBtn = document.getElementById("showAllBtn");
const showActiveBtn = document.getElementById("showActiveBtn");
const showCompletedBtn = document.getElementById("showCompletedBtn");
let currentFilter = localStorage.getItem("taskFilter") || "all";
const progress = document.getElementById("progress");
const progressFill = document.getElementById("progressFill");
tasks = tasks.map(task =>
    typeof task === "string"
        ? { text: task, completed: false }
        : task
);

const taskList = document.createElement("ul");
taskList.id = "taskList";

const tasksSection = document.querySelector(".tasks-section");
tasksSection.appendChild(taskList);
taskList.innerHTML = "";
 
function updateProgress() {
    const completed = tasks.filter(task => task.completed).length;
    const weeklyStats = document.getElementById("weeklyStats");
 
const now = new Date();
const startOfWeek = new Date(now);
const day = (startOfWeek.getDay() + 6) % 7;

startOfWeek.setDate(startOfWeek.getDate() - day);
startOfWeek.setHours(0, 0, 0, 0);

const weeklyCompleted = tasks.filter(task =>
    task.completed &&
    task.completedAt &&
    new Date(task.completedAt) >= startOfWeek &&
    new Date(task.completedAt) <= now
).length;

weeklyStats.textContent =
    "📊 This Week: " + weeklyCompleted + " tasks completed";

    const studyStreak = document.getElementById("studyStreak");
    let streak = Number(localStorage.getItem("studyStreak")) || 0;
studyStreak.textContent = "🔥 Study Streak: " + streak + " days";

    progress.textContent =
        completed + " of " + tasks.length + " tasks completed";

    const percentage = tasks.length === 0
        ? 0
        : (completed / tasks.length) * 100;

    progressFill.style.width = percentage + "%";

    const dailyGoal = document.getElementById("dailyGoal");
    const goalProgress = document.getElementById("goalProgress");
    const goal = Number(dailyGoal.value) || 5;

    goalProgress.textContent =
        completed + " / " + goal + " tasks completed toward your goal";
}

function displayTask(task, index) {
    const taskItem = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    const taskLabel = document.createElement("span");
    taskLabel.textContent = " " + task.text;
    taskLabel.style.textDecoration =
    task.completed ? "line-through" : "none";
    taskLabel.style.color =
    task.completed ? "#9ca3af" : "#2e2545";
    taskLabel.style.opacity = task.completed ? "0.6" : "1";
taskLabel.style.transition = "opacity 0.2s ease";

    checkbox.addEventListener("change", function () {
        tasks[index].completed = checkbox.checked;

if (checkbox.checked) {
    tasks[index].completedAt = new Date().toISOString();
} else {
    delete tasks[index].completedAt;
}

         const today = new Date().toLocaleDateString("en-CA");
const lastStudyDay = localStorage.getItem("lastStudyDay");
let streak = Number(localStorage.getItem("studyStreak")) || 0;

if (checkbox.checked && lastStudyDay !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toLocaleDateString("en-CA");

    streak = lastStudyDay === yesterdayString ? streak + 1 : 1;

    localStorage.setItem("studyStreak", streak);
    localStorage.setItem("lastStudyDay", today);
}
        taskLabel.style.textDecoration = checkbox.checked ? "line-through" : "none";
        taskLabel.style.opacity = checkbox.checked ? "0.6" : "1";
        localStorage.setItem("studyTasks", JSON.stringify(tasks));
        updateProgress();
        taskLabel.style.textDecoration =
            checkbox.checked ? "line-through" : "none";

        taskLabel.style.color =
            checkbox.checked ? "#9ca3af" : "#2e2545";
    });

    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskLabel);
    const editBtn = document.createElement("button");tasks[index].completed = checkbox.checked;
editBtn.textContent = "Edit";
editBtn.className = "edit-btn";

    const deleteBtn = document.createElement("button");
deleteBtn.textContent = "Delete";
deleteBtn.className = "delete-btn";
taskItem.appendChild(editBtn);
editBtn.addEventListener("click", function () {
    const newText = prompt("Edit your task:", task.text);

    if (newText && newText.trim() !== "") {
         const currentTaskIndex = tasks.indexOf(task);

if (tasks.some(function (existingTask, taskIndex) {
    return taskIndex !== currentTaskIndex &&
        existingTask.text.trim().toLowerCase() === newText.trim().toLowerCase();
})) {
    alert("Another task already has this name!");
    return;
}
        tasks[currentTaskIndex].text = newText.trim();
        taskLabel.textContent = " " + tasks[index].text;
        taskLabel.style.textDecoration = task.completed ? "line-through" : "none";
        taskLabel.style.opacity = task.completed ? "0.6" : "1";
        taskLabel.style.transition = "opacity 0.2s ease";
        localStorage.setItem("studyTasks", JSON.stringify(tasks));
    }
});
taskItem.appendChild(deleteBtn);
    taskList.appendChild(taskItem);
    deleteBtn.addEventListener("click", function () {
            if (!confirm("Are you sure you want to delete this task?")) {
        return;
    }
     const taskIndex = tasks.indexOf(task);

if (taskIndex > -1) {
    tasks.splice(taskIndex, 1);
}

localStorage.setItem("studyTasks", JSON.stringify(tasks));

taskList.innerHTML = "";

tasks.forEach(function (updatedTask, updatedIndex) {
    displayTask(updatedTask, updatedIndex);
});
updateProgress();
filterTasks(currentFilter);
});
}

tasks.forEach(function (task, index) {
    displayTask(task, index);
});
updateProgress();
filterTasks(currentFilter);

addTaskBtn.addEventListener("click", function () {
     const taskText = taskInput.value.trim();

if (taskText === "") {
    alert("Please enter a task!");
    return;
}

if (tasks.some(function (task) {
    return task.text.toLowerCase() === taskText.toLowerCase();
})) {
    alert("This task already exists!");
    return;
}

    const newTask = { text: taskText, completed: false };
    tasks.push(newTask);


    displayTask(newTask, tasks.length - 1);
    updateProgress();
    localStorage.setItem("studyTasks", JSON.stringify(tasks));

    taskInput.value = "";
});
clearAllBtn.addEventListener("click", function () {
        if (!confirm("Are you sure you want to clear all tasks?")) {
        return;
    }
    tasks = [];
    localStorage.setItem("studyTasks", JSON.stringify(tasks));
    taskList.innerHTML = "";
    updateProgress();
});
taskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addTaskBtn.click();
    }
});
function filterTasks(filter) {
    currentFilter = filter;
    localStorage.setItem("taskFilter", filter);
    showAllBtn.style.backgroundColor = filter === "all" ? "#8b5cf6" : "#ede9fe";
showActiveBtn.style.backgroundColor = filter === "active" ? "#8b5cf6" : "#ede9fe";
showCompletedBtn.style.backgroundColor = filter === "completed" ? "#8b5cf6" : "#ede9fe";
showAllBtn.style.color = filter === "all" ? "white" : "#5b21b6";
showActiveBtn.style.color = filter === "active" ? "white" : "#5b21b6";
showCompletedBtn.style.color = filter === "completed" ? "white" : "#5b21b6";

    const taskItems = taskList.querySelectorAll("li");

    taskItems.forEach(function (item) {
        const checkbox = item.querySelector("input");

    const taskLabel = item.querySelector("span");

const matchesSearch = taskLabel.textContent
    .toLowerCase()
    .includes(searchTasks.value.trim().toLowerCase());

const matchesFilter =
    filter === "all" ||
    (filter === "active" && !checkbox.checked) ||
    (filter === "completed" && checkbox.checked);

 item.style.display =
    matchesSearch && matchesFilter ? "" : "none";
    });
}

showAllBtn.addEventListener("click", function () {
    filterTasks("all");
});

showActiveBtn.addEventListener("click", function () {
    filterTasks("active");
});

showCompletedBtn.addEventListener("click", function () {
    filterTasks("completed");
});
searchTasks.addEventListener("input", function () {
    const searchText = searchTasks.value.trim().toLowerCase();
    const taskItems = taskList.querySelectorAll("li");

    taskItems.forEach(function (item) {
        const taskLabel = item.querySelector("span");
        const checkbox = item.querySelector("input");

        const matchesSearch = taskLabel.textContent
            .toLowerCase()
            .includes(searchText);

        const matchesFilter =
            currentFilter === "all" ||
            (currentFilter === "active" && !checkbox.checked) ||
            (currentFilter === "completed" && checkbox.checked);

        item.style.display =
            matchesSearch && matchesFilter ? "" : "none";
    });
});
clearSearchBtn.addEventListener("click", function () {
    searchTasks.value = "";
    searchTasks.dispatchEvent(new Event("input"));
});


themeToggle.addEventListener("click", function () {
     document.body.classList.toggle("dark-mode");

localStorage.setItem(
    "studyBuddyTheme",
    document.body.classList.contains("dark-mode") ? "dark" : "light"
);

    if (document.body.classList.contains("dark-mode")) {
        themeToggle.textContent = "☀️ Light Mode";
    } else {
        themeToggle.textContent = "🌙 Dark Mode";
    }
});

const savedTheme = localStorage.getItem("studyBuddyTheme");
document.body.classList.toggle("dark-mode", savedTheme === "dark");
themeToggle.textContent = savedTheme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";

const todayDate = document.getElementById("todayDate");

todayDate.textContent = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
});
const dailyGoal = document.getElementById("dailyGoal");

dailyGoal.value = localStorage.getItem("dailyStudyGoal") || 5;

dailyGoal.addEventListener("change", function () {
    localStorage.setItem("dailyStudyGoal", dailyGoal.value);
    updateProgress();
});


