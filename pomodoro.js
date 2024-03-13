let schedules = [
    { workTime: 1, shortBreakTime: 1, longBreakTime: 1 },
    { workTime: 1, shortBreakTime: 2, longBreakTime: 2 }
];
let currentScheduleIndex = -1;
let timer;
let remainingTime;
let repetitions = 0;
let timerRunning = false;

function displaySelectionPage() {
    document.getElementById("selectionPage").style.display = "block";
    document.getElementById("timerPage").style.display = "none";
}

function displayTimerPage() {
    document.getElementById("selectionPage").style.display = "none";
    document.getElementById("timerPage").style.display = "block";
}

function updateScheduleList() {
    const scheduleForm = document.getElementById("scheduleForm");
    scheduleForm.innerHTML = "";
    schedules.forEach((schedule, index) => {
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "schedule";
        input.value = index;
        input.id = `schedule${index}`;
        const label = document.createElement("label");
        label.htmlFor = `schedule${index}`;
        label.textContent = `Schedule ${index + 1}: ${schedule.workTime}m work, ${schedule.shortBreakTime}m short break, ${schedule.longBreakTime}m long break`;
        scheduleForm.appendChild(input);
        scheduleForm.appendChild(label);
        scheduleForm.appendChild(document.createElement("br"));
    });
    scheduleForm.addEventListener("change", handleScheduleChange);
}

window.addEventListener("load", updateScheduleList);
function handleScheduleChange() {
    const selectedScheduleIndex = parseInt(document.querySelector('input[name="schedule"]:checked').value);
    if (!isNaN(selectedScheduleIndex)) {
        currentScheduleIndex = selectedScheduleIndex;
        document.getElementById("startTimerBtn").disabled = false;
    }
}

document.getElementById("startTimerBtn").addEventListener("click", () => {
    if (currentScheduleIndex !== -1) {
        displayTimerPage();
        startTimer();
    } else {
        alert("Please select a schedule first.");
    }
});

function selectSchedule(index) {
    currentScheduleIndex = index;
    const selectedSchedule = schedules[currentScheduleIndex];
    document.getElementById("selectedScheduleDisplay").textContent = `Selected Schedule: ${selectedSchedule.workTime}m work, ${selectedSchedule.shortBreakTime}m short break, ${selectedSchedule.longBreakTime}m long break`;
}

function startTimer() {
    const schedule = schedules[currentScheduleIndex];
    let currentTime = remainingTime || schedule.workTime * 60;
    timerRunning = true;
    timer = setInterval(() => {
        if (currentTime <= 0) {
            clearInterval(timer);
            if (repetitions % 4 === 0) {
                currentTime = schedule.longBreakTime * 60;
            } else {
                currentTime = schedule.shortBreakTime * 60;
            }
            repetitions++;
            document.getElementById("timerDisplay").textContent = formatTime(currentTime);
            timer = setInterval(() => {
                if (currentTime <= 0) {
                    clearInterval(timer);
                    startTimer();
                } else {
                    currentTime--;
                    document.getElementById("timerDisplay").textContent = formatTime(currentTime);
                }
            }, 1000);
        } else {
            currentTime--;
            remainingTime = currentTime;
            document.getElementById("timerDisplay").textContent = formatTime(currentTime);
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timer);
    timerRunning = false;
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}

document.getElementById("newScheduleBtn").addEventListener("click", () => {
    document.getElementById("newScheduleModal").style.display = "block";
});

document.querySelector(".close").addEventListener("click", () => {
    document.getElementById("newScheduleModal").style.display = "none";
});

document.getElementById("saveScheduleBtn").addEventListener("click", () => {
    const workTime = parseInt(document.getElementById("workTime").value);
    const shortBreakTime = parseInt(document.getElementById("shortBreakTime").value);
    const longBreakTime = parseInt(document.getElementById("longBreakTime").value);
    schedules.push({ workTime, shortBreakTime, longBreakTime });
    updateScheduleList();
    document.getElementById("newScheduleModal").style.display = "none";
});

document.getElementById("startPauseBtn").addEventListener("click", () => {
    if (timerRunning) {
        pauseTimer();
        document.getElementById("startPauseBtn").textContent = "Resume";
    } else {
        startTimer();
        document.getElementById("startPauseBtn").textContent = "Pause";
    }
});


document.getElementById("quitBtn").addEventListener("click", () => {
    if (confirm("Are you sure you want to quit?")) {
        clearInterval(timer);
        remainingTime = null;
        repetitions = 0;
        currentScheduleIndex = -1;
        timerRunning = false;
        document.querySelector('input[name="schedule"]:checked').checked = false; // Deselect radio button
        displaySelectionPage();
    }
});


displaySelectionPage();
