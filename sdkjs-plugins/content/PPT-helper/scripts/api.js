const appId = localStorage.getItem('appId');
const secret = localStorage.getItem('secret');

const apiUrl = 'https://cors-anywhere.herokuapp.com/https://zwapi.xfyun.cn/api/aippt/createOutline';

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
            displayOutlineMarkdown(data.data);
        } else {
            console.error('生成失败:', data.desc);
        }
    })
    .catch(error => {
        console.error('请求失败:', error);
    });
};
