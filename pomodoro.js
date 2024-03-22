let schedules = [
    { name: "Minute Cycles", color: "#FFFFFF", workTime: 60, shortBreakTime: 60, longBreakTime: 60 },
    { name: "Demo Cycles", color: "#FFFFFF", workTime: 20, shortBreakTime: 20, longBreakTime: 20 }
];
let currentScheduleIndex = -1;
let timer;
let remainingTime;
let repetitions = 0;
let timerRunning = false;
let trackodoros = [];


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
        label.textContent = `${schedule.name}: ${formatTime(schedule.workTime)} work, ${formatTime(schedule.shortBreakTime)} short break, ${formatTime(schedule.longBreakTime)} long break, High Score: ${trackodoros[index]}`;
        label.style.backgroundColor = schedule.color;
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

    let currentTime = remainingTime || schedule.workTime;
    timerRunning = true;
    const high = document.getElementById("high");
    if (trackodoros[currentScheduleIndex] == null)
    {
        trackodoros[currentScheduleIndex] = 0;
    }
    const current = document.getElementById("current");
    timer = setInterval(() => {
        if (currentTime <= 0) {
            clearInterval(timer);
            if (repetitions % 4 === 0 && repetitions != 0) {
                currentTime = schedule.longBreakTime;
            } else {
                currentTime = schedule.shortBreakTime;
            }
            repetitions++;
            current.textContent = `You've completed ${repetitions} cycles!`;
            if (repetitions > trackodoros[currentScheduleIndex])
            {
                trackodoros[currentScheduleIndex] = repetitions;
            }
            high.textContent = `You're high score is ${trackodoros[currentScheduleIndex]} cycles`;
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

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
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
    const scheduleName = document.getElementById("scheduleName").value;
    const workTimeInput = document.getElementById("workTime").value;
    const shortBreakTimeInput = document.getElementById("shortBreakTime").value;
    const longBreakTimeInput = document.getElementById("longBreakTime").value;
    const subjectColor = document.getElementById("subjectColor").value;

    const workTime = parseTime(workTimeInput);
    const shortBreakTime = parseTime(shortBreakTimeInput);
    const longBreakTime = parseTime(longBreakTimeInput);

    if (workTime === null || shortBreakTime === null || longBreakTime === null) {
        alert("Invalid time format. Please use the format 'mm:ss'.");
        return;
    }

    schedules.push({ name: scheduleName, workTime, shortBreakTime, longBreakTime, color: subjectColor });
    updateScheduleList();
    document.getElementById("newScheduleModal").style.display = "none";

    const formData = new FormData();
    formData.append('name', scheduleName);
    formData.append('worktime', workTime);
    formData.append('shorttime', shortBreakTime);
    formData.append('longtime', longBreakTime);
    formData.append('color', subjectColor);

    fetch('pomodoro.php', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return console.log("It went through!");
    })
    .then(data => {
        console.log(data); 
        alert('Data saved successfully!');
    })
    .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
    });
    
});

function parseTime(timeString) {
    const regex = /^(\d{1,2}):(\d{2})$/;
    const match = regex.exec(timeString);
    if (match === null) {
        return null;
    }
    const minutes = parseInt(match[1]);
    const seconds = parseInt(match[2]);
    if (isNaN(minutes) || isNaN(seconds) || minutes < 0 || seconds < 0 || seconds >= 60) {
        return null;
    }
    return minutes * 60 + seconds;
}


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
        updateScheduleList();
    }
});


displaySelectionPage();
