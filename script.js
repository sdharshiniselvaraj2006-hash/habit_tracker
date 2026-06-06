let habits = JSON.parse(localStorage.getItem("habits")) || [];
let reminderOn = JSON.parse(localStorage.getItem("reminder")) || false;

function saveHabits() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

function addHabit() {
  let input = document.getElementById("habitInput");
  let habitName = input.value.trim();

  if (habitName === "") return;

  let habit = {
    name: habitName,
    streak: 0,
    lastCompleted: null,
    completedDates: []
  };

  habits.push(habit);

  input.value = "";

  saveHabits();
  displayHabits();
  loadCalendar();
}

function displayHabits() {
  let list = document.getElementById("habitList");
  list.innerHTML = "";

  habits.forEach((habit, index) => {
    let li = document.createElement("li");

    li.innerHTML = `
      <strong>${habit.name}</strong>
      🔥 Streak: ${habit.streak}
      <button onclick="completeHabit(${index})">Complete</button>
      <button onclick="deleteHabit(${index})">Delete</button>
    `;

    list.appendChild(li);
  });
}

function completeHabit(index) {
  let habit = habits[index];

  let today = new Date().toDateString();
  let todayISO = new Date().toISOString().split("T")[0];

  if (habit.lastCompleted === today) {
    alert("Already completed today!");
    return;
  }

  if (!habit.lastCompleted) {
    habit.streak = 1;
  } else {
    let lastDate = new Date(habit.lastCompleted);

    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (lastDate.toDateString() === yesterday.toDateString()) {
      habit.streak++;
    } else {
      habit.streak = 1;
    }
  }

  habit.lastCompleted = today;

  if (!habit.completedDates) {
    habit.completedDates = [];
  }

  habit.completedDates.push(todayISO);

  saveHabits();
  displayHabits();
  loadCalendar();
}

function deleteHabit(index) {
  habits.splice(index, 1);

  saveHabits();
  displayHabits();
  loadCalendar();
}

function toggleReminder() {
  reminderOn = !reminderOn;

  localStorage.setItem("reminder", JSON.stringify(reminderOn));

  alert(reminderOn ? "Reminder ON 🔔" : "Reminder OFF ❌");
}

setInterval(() => {
  let now = new Date();

  if (
    reminderOn &&
    now.getHours() === 20 &&
    now.getMinutes() === 0
  ) {
    alert("Complete your habits! 🔥");
  }
}, 60000);

function loadCalendar() {
  let calendarEl = document.getElementById("calendar");

  calendarEl.innerHTML = "";

  let events = [];

  habits.forEach(habit => {
    if (habit.completedDates) {
      habit.completedDates.forEach(date => {
        events.push({
          title: habit.name,
          date: date
        });
      });
    }
  });

  let calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    events: events
  });

  calendar.render();
}

window.onload = function () {
  displayHabits();
  loadCalendar();
};
