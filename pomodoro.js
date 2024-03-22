let schedules = [];
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
    fetch('pomodoro.php')
        .then(response => response.json())
        .then(data => {
            schedules = data;
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
                label.textContent = `${schedule.name}: ${formatTime(schedule.worktime)} work, ${formatTime(schedule.shorttime)} short break, ${formatTime(schedule.longtime)} long break, High Score: ${schedule.trackodoros}`;
                label.style.backgroundColor = schedule.color;
                scheduleForm.appendChild(input);
                scheduleForm.appendChild(label);
                scheduleForm.appendChild(document.createElement("br"));
            });
        })
        .catch(error => console.error('Error:', error));
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}



window.addEventListener("load", updateScheduleList);

scheduleForm.addEventListener("change", handleScheduleChange);

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

function startTimer() {
    const schedule = schedules[currentScheduleIndex];

    let currentTime = remainingTime || schedule.worktime;
    timerRunning = true;
    const high = document.getElementById("high");
    if (schedule.trackodoros == null) {
        schedule.trackodoros = 0;
    }
    const current = document.getElementById("current");
    const displayTimer = document.getElementById("timerDisplay");

    function updateDisplay() {
        displayTimer.textContent = formatTime(currentTime);
    }

    console.log("Start timer with currentTime:", currentTime);

    updateDisplay();

    timer = setInterval(() => {
        console.log("Interval tick - currentTime:", currentTime);
        if (currentTime <= 0) {
            clearInterval(timer);
            console.log("Interval cleared - repetitions:", repetitions);
            if (repetitions % 4 === 0 && repetitions != 0) {
                currentTime = schedule.longtime;
            } else {
                currentTime = schedule.shorttime;
            }
            repetitions++;
            current.textContent = `You've completed ${repetitions} cycles!`;
            if (repetitions > schedule.trackodoros) {
                schedule.trackodoros = repetitions;
            }
            high.textContent = `Your high score is ${schedule.trackodoros} cycles`;
            updateDisplay();
            console.log("Restart timer with new currentTime:", currentTime);
            timer = setInterval(() => {
                if (currentTime <= 0) {
                    clearInterval(timer);
                    console.log("Restart interval cleared");
                    startTimer();
                } else {
                    currentTime--;
                    updateDisplay();
                    console.log("Interval tick - currentTime:", currentTime);
                }
            }, 1000);
        } else {
            currentTime--;
            updateDisplay();
            console.log("Interval tick - currentTime:", currentTime);
        }
    }, 1000);
}








function pauseTimer() {
    clearInterval(timer);
    timerRunning = false;
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
        const selectedSchedule = schedules[currentScheduleIndex];
        if (repetitions > selectedSchedule.trackodoros) {
            selectedSchedule.trackodoros = repetitions;
            fetch('pomodoro.php', {
                method: 'POST',
                body: JSON.stringify(schedules),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.text();
                })
                .then(data => {
                    console.log(data);
                    alert('High score saved successfully!');
                    updateScheduleList(); // Update schedule list after saving
                    currentScheduleIndex = -1; // Reset current schedule index
                    timerRunning = false; // Reset timer running flag
                    displaySelectionPage(); // Display the selection page
                })
                .catch(error => {
                    console.error('There was a problem with your fetch operation:', error);
                });
        } else {
            currentScheduleIndex = -1; // Reset current schedule index
            timerRunning = false; // Reset timer running flag
            displaySelectionPage(); // Display the selection page
        }
    }
});


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

    const formData = new FormData();
    formData.append('name', scheduleName);
    formData.append('worktime', workTime);
    formData.append('shorttime', shortBreakTime);
    formData.append('longtime', longBreakTime);
    formData.append('color', subjectColor);
    formData.append('trackodoros', 0);

    fetch('pomodoro.php', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            console.log(data);
            alert('Data saved successfully!');
            updateScheduleList(); // Update schedule list after saving
            document.getElementById("newScheduleModal").style.display = "none"; // Close the modal after saving
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

document.getElementById("subjectColor").value = "#D297ED";

displaySelectionPage();
