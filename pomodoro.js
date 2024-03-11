let schedules = [];
let currentScheduleIndex = -1;
let timer;
let repetitions = 0;

function displaySelectionPage() {
    document.getElementById("selectionPage").style.display = "block";
    document.getElementById("timerPage").style.display = "none";
}

function displayTimerPage() {
    document.getElementById("selectionPage").style.display = "none";
    document.getElementById("timerPage").style.display = "block";
}

function updateScheduleList() {
    const scheduleList = document.getElementById("scheduleList");
    scheduleList.innerHTML = "";
    schedules.forEach((schedule, index) => {
        const li = document.createElement("li");
        li.textContent = `Schedule ${index + 1}: ${schedule.workTime}m work, ${schedule.shortBreakTime}m short break, ${schedule.longBreakTime}m long break`;
        li.addEventListener("click", () => selectSchedule(index));
        scheduleList.appendChild(li);
    });
}

function selectSchedule(index) {
    currentScheduleIndex = index;
    displayTimerPage();
    startTimer();
}

function startTimer() {
    const schedule = schedules[currentScheduleIndex];
    let currentTime = schedule.workTime * 60;
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
            document.getElementById("timerDisplay").textContent = formatTime(currentTime);
        }
    }, 1000);
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

document.getElementById("startBtn").addEventListener("click", startTimer);

document.getElementById("pauseBtn").addEventListener("click", () => {
    clearInterval(timer);
});

document.getElementById("quitBtn").addEventListener("click", () => {
    if (confirm("Are you sure you want to quit?")) {
        clearInterval(timer);
        repetitions = 0;
        currentScheduleIndex = -1;
        displaySelectionPage();
    }
});

displaySelectionPage();
