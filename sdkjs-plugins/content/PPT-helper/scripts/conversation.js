// 暂存用户输入的主题和关键点
window.Asc.plugin.storedTopic = '';
window.Asc.plugin.storedKeyPoints = '';

window.Asc.plugin.startConversation = function () {
    console.log("现在正在执行方法 startConversation...");

    const messageHistory = document.getElementById('messageHistory');
    if (!messageHistory) {
        console.error("messageHistory 元素未找到");
        return;
    }

    messageHistory.innerHTML = `
        <div class="ai-message">您好！请输入您想要创建的PPT主题。</div>
    `;

    const inputArea = document.querySelector('.message-input-area');
    inputArea.innerHTML = `
        <input type="text" id="topic" placeholder="输入主题" class="message-input">
        <button id="generateBtn" class="send-button">
            <img src="resources/send.png" alt="Send">
        </button>
    `;

    document.getElementById("generateBtn").addEventListener("click", window.Asc.plugin.onGenerateBtnClick);
};

window.Asc.plugin.onGenerateBtnClick = function () {
    const topic = document.getElementById('topic') ? document.getElementById('topic').value.trim() : '';
    const keyPoints = document.getElementById('keyPoints') ? document.getElementById('keyPoints').value.trim() : '';
    const messageHistory = document.getElementById('messageHistory');

    if (!topic && !keyPoints) {
        alert("请输入主题或关键点！");
        return;
    }

    if (topic && !keyPoints) {
        window.Asc.plugin.storedTopic = topic; // 存储主题
        messageHistory.innerHTML += `
            <div class="user-message">${topic}</div>
            <div class="ai-message">好的！接下来请输入您希望在PPT中涵盖的关键点。</div>
        `;

        document.querySelector('.message-input-area').innerHTML = `
            <input type="text" id="keyPoints" placeholder="输入关键点" class="message-input">
            <button id="generateBtn" class="send-button">
                <img src="resources/send.png" alt="Send">
            </button>
        `;

        document.getElementById("generateBtn").addEventListener("click", window.Asc.plugin.onGenerateBtnClick);
        document.getElementById('topic').value = '';  // 清空主题输入框
    } else if (keyPoints) {
        window.Asc.plugin.storedKeyPoints = keyPoints; // 存储关键点
        messageHistory.innerHTML += `
            <div class="user-message">${keyPoints}</div>
            <div class="ai-message">感谢您的信息！正在生成大纲，请稍候...</div>
        `;
        window.Asc.plugin.generatePPTOutline(window.Asc.plugin.storedTopic, window.Asc.plugin.storedKeyPoints);
        document.getElementById('keyPoints').value = '';  // 清空关键点输入框
    }
};

window.Asc.plugin.generatePPTOutline = function (topic, keyPoints) {
    const query = `生成一个关于 ${topic} 的PPT大纲, 主题包括 ${keyPoints} 等内容`;
    const payload = {
        query: query,
        create_model: 'auto',
        theme: 'auto',
        language: 'cn'
    };

    const signature = getSignature(appId, secret);
    const headers = {
        'appId': appId,
        'timestamp': Math.floor(Date.now() / 1000),
        'signature': signature,
        'Content-Type': 'application/json'
    };

    fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        if (data.flag && data.code === 0) {
            displayOutlineMarkdown(data.data, topic, keyPoints);  // 传递 topic 和 keyPoints
        } else {
            console.error('生成失败:', data.desc);
        }
    })
    .catch(error => {
        console.error('请求失败:', error);
    });
};

function displayOutlineMarkdown(data, topic, keyPoints) {
    const messageHistory = document.getElementById('messageHistory');

    // 移除现有的确认/重新生成按钮容器（如果存在）
    const existingConfirmContainer = document.querySelector('.confirm-container');
    if (existingConfirmContainer) {
        existingConfirmContainer.remove();
    }

    const aiMessage = document.createElement('div');
    aiMessage.classList.add('ai-message');

    // 构造大纲的Markdown内容
    const outlineMarkdown = `
## 主标题: ${data.title}

### 副标题: ${data.subTitle}

#### 大纲:
${data.outline.chapters.map(chapter => {
    const chapterContent = chapter.chapterContents ? 
        chapter.chapterContents.map(subChapter => {
            return `  - ${subChapter.chapterTitle}`;
        }).join('\n') 
        : '';

    return `- **${chapter.chapterTitle}**${chapterContent ? '\n' + chapterContent : ''}`;
}).join('\n')}
`;

    aiMessage.innerHTML = marked.parse(outlineMarkdown);
    messageHistory.appendChild(aiMessage);
    messageHistory.scrollTop = messageHistory.scrollHeight;

    const confirmContainer = document.createElement('div');
    confirmContainer.classList.add('confirm-container');
    confirmContainer.innerHTML = `
        <button id="confirmButton" onclick="onConfirmOutline()" style="display: none;">确认</button>
        <button id="regenerateBtn" onclick="onRejectOutline()" style="background: transparent; border: none; padding: 0;">
            <img src="resources/reload.png" alt="Regenerate" style="width: 20px; height: 20px;">
        </button>
    `;
    messageHistory.appendChild(confirmContainer);
}

function onRejectOutline() {
    const regenerateBtn = document.getElementById('regenerateBtn');
    if (regenerateBtn) {
        regenerateBtn.closest('.confirm-container').remove();
    }

    // 显示确认按钮
    const confirmButton = document.getElementById('confirmButton');
    if (confirmButton) {
        confirmButton.style.display = 'inline-block';
    }

    // 重新生成大纲，复用已存储的主题和关键点
    window.Asc.plugin.generatePPTOutline(window.Asc.plugin.storedTopic, window.Asc.plugin.storedKeyPoints);
}
