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
    lastCompleted: null
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
      ${habit.name} 🔥 Streak: ${habit.streak}
      <button onclick="completeHabit(${index})">Complete</button>
      <button onclick="deleteHabit(${index})">Delete</button>
    `;

    list.appendChild(li);
  });
}

function completeHabit(index) {
  let habit = habits[index];
  let today = new Date().toDateString();

  if (habit.lastCompleted === today) return;

  let yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (habit.lastCompleted === yesterday.toDateString()) {
    habit.streak++;
  } else {
    habit.streak = 1;
  }

  habit.lastCompleted = today;

  saveHabits();
  displayHabits();
  loadCalendar(); // 🔥 update calendar
}

function deleteHabit(index) {
  habits.splice(index, 1);
  saveHabits();
  displayHabits();
  loadCalendar();
}

// Reminder
function toggleReminder() {
  reminderOn = !reminderOn;
  localStorage.setItem("reminder", JSON.stringify(reminderOn));
  alert(reminderOn ? "Reminder ON 🔔" : "Reminder OFF ❌");
}

setInterval(() => {
  let now = new Date();

  if (reminderOn && now.getHours() === 20 && now.getMinutes() === 0) {
    alert("Complete your habits! 🔥");
  }
}, 60000);

// 🔥 Calendar function
function loadCalendar() {
  let calendarEl = document.getElementById("calendar");
  calendarEl.innerHTML = ""; // clear old calendar

  let events = [];

  habits.forEach(habit => {
    if (habit.lastCompleted) {
      events.push({
        title: habit.name,
        date: new Date(habit.lastCompleted).toISOString().split('T')[0]
      });
    }
  });

  let calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    events: events
  });

  calendar.render();
}

// Load on start
window.onload = function () {
  displayHabits();
  loadCalendar();
};