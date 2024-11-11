window.Asc.plugin.init = function () {
    window.Asc.plugin.info.isEdit = true;

    window.Asc.plugin.startConversation();

};

document.addEventListener("DOMContentLoaded", function() {
    const appId = localStorage.getItem('appId');
    const secret = localStorage.getItem('secret');
    const reminder = document.getElementById('credentialReminder');
    
    if (!appId || !secret) {
        reminder.style.display = "block";
    } else {
        reminder.style.display = "none";
    }
});

// 检查输入框变化
document.getElementById('appIdInput').addEventListener('input', function() {
    const appId = this.value;
    localStorage.setItem('appId', appId);
    checkCredentials();
});

document.getElementById('secretInput').addEventListener('input', function() {
    const secret = this.value;
    localStorage.setItem('secret', secret);
    checkCredentials();
});

function checkCredentials() {
    const appId = localStorage.getItem('appId');
    const secret = localStorage.getItem('secret');
    const reminder = document.getElementById('credentialReminder');
    
    if (appId && secret) {
        reminder.style.display = "none";
    } else {
        reminder.style.display = "block";
    }
}
