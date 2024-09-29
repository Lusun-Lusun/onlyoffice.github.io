let currentTime = localStorage.getItem('focusTime') * 60; // 当前倒计时（默认开始为专注时间）
let isFocusMode = true; // 默认是专注模式
let timerInterval; // 用于存储计时器的interval
let focusTime = localStorage.getItem('focusTime') * 60; // 专注时间（分钟）
let breakTime = localStorage.getItem('breakTime') * 60; // 休息时间（分钟）
let whiteNoise = localStorage.getItem('whiteNoise');

const timerDisplay = document.getElementById('timer');
const modeDisplay = document.getElementById('mode');
const startStopBtn = document.getElementById('start-stop');
const resetBtn = document.getElementById('reset');
const notificationDisplay = document.getElementById('notification');
const alertSound = new Audio('resources/store/sound/Notification.mp3');
const whiteNoiseAudio = new Audio();
whiteNoiseAudio.loop = true;

window.Asc.plugin.init = function () {
    localStorage.setItem('focusTime', 25);
    localStorage.setItem('breakTime', 5);
    updateWhiteNoise();
}

// 格式化时间显示为MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// 更新白噪音文件
function updateWhiteNoise() {
    const selectedNoise = whiteNoise || 'none'; // 设置默认值，如果没有白噪音选择，则默认为 rain
    if (selectedNoise === 'none') {
        whiteNoiseAudio.pause(); // 停止音频播放
    } else {
        whiteNoiseAudio.src = `resources/store/whiteNoise/${selectedNoise}.mp3`; // 更新音频源
        whiteNoiseAudio.load(); // 重新加载新音频文件
        whiteNoiseAudio.play().catch(error => {
            console.log("Audio playback failed due to browser policies:", error);
        }); // 开始播放，如果出现问题则捕获异常
    }
}

// 页面内通知显示
function updatePageNotification(message) {
    notificationDisplay.textContent = message;
    notificationDisplay.style.color = 'red'; // 可以根据需求调整样式
}

// 更新计时器显示
function updateTimerDisplay() {
    timerDisplay.textContent = formatTime(currentTime); 
}

// 开始或暂停计时器
startStopBtn.addEventListener('click', function() {
    if (timerInterval) {
        // 如果计时器正在运行，则停止
        clearInterval(timerInterval);
        timerInterval = null;
        startStopBtn.textContent = 'Start';
    } else {
        // 启动计时器
        timerInterval = setInterval(countdown, 1000);
        startStopBtn.textContent = 'Pause';
    }
});

// 计时器倒计时逻辑
function countdown() {
    if (currentTime > 0) {
        currentTime--;
        updateTimerDisplay();
    } else {
        // 倒计时结束，自动切换模式
        if (isFocusMode) {
            alertSound.play();
            updatePageNotification('Focus time is over! Time for a break.');
            currentTime = breakTime; // 切换到休息时间
            modeDisplay.textContent = 'Break Time';
            clearInterval(timerInterval);
            timerInterval = null;
            startStopBtn.textContent = 'Start';
        } else {
            alertSound.play();
            updatePageNotification('Break time is over! Time to work.');
            currentTime = focusTime; // 切换到专注时间
            modeDisplay.textContent = 'Focus Time';
        }
        isFocusMode = !isFocusMode; // 切换模式
        updateTimerDisplay();
    }
}


// 重置计时器
resetBtn.addEventListener('click', function() {
    clearInterval(timerInterval);
    timerInterval = null;
    isFocusMode = true;
    currentTime = focusTime; // 重置为专注时间
    updateTimerDisplay();
    modeDisplay.textContent = 'Focus Time';
    notificationDisplay.textContent = ''; // 清空通知内容
    startStopBtn.textContent = 'Start';
});

// 页面加载时更新默认显示
updateTimerDisplay();
