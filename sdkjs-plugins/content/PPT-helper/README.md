# PPT-Helper Plugin

PPT-Helper is a plugin developed using the **iFlytek Zhwen API** that allows users to automatically generate PowerPoint presentations. By simply providing a theme and key points, the plugin generates an outline for the presentation and offers various templates for users to choose from, enabling fast creation of presentations.

## Features

- **Theme and Key Points Input**: Users input the theme and key points for the presentation, and the plugin generates a PPT outline based on this information.
- **Outline Generation**: The plugin uses the **iFlytek Zhwen API** to generate the outline based on the provided theme and key points.
- **Template Selection**: Offers multiple PPT templates, and users can select the most suitable template for creating the presentation.
- **Regenerate Functionality**: If users are not satisfied with the generated outline, they can choose to regenerate the outline, which updates the content.

## Installation and Usage

### System Requirements

- **Browser**: Modern browsers like Chrome, Firefox, Safari, etc., are supported.
- **API Key**: You need to provide an **appId** and **APISecret**. These can be obtained from the iFlytek website.

### Installation Steps

1. **Download Plugin Files**:
   - Download and unzip the plugin code to your local system.
   
2. **Configure API Keys**:
   - In the `api.js` file, configure your **appId** and **APISecret**, or store them in the browser's `localStorage`.

3. **Launch the Plugin**:
   - Open the `index.html` file to launch the plugin interface.

4. **Use the Plugin**:
   - Enter the theme and key points for your PPT, then click "Generate" to call the API and display the PPT outline.
   - Choose an appropriate template, click "Confirm", and the plugin will generate the full PPT.

### Sample Code

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PPT Helper</title>
    <!-- Required JavaScript and style files -->
    <script type="text/javascript" src="https://onlyoffice.github.io/sdkjs-plugins/v1/plugins.js"></script>
    <script type="text/javascript" src="scripts/conversation.js"></script>
</head>
<body>
    <div class="chat-container">
        <!-- Plugin Interface -->
    </div>
</body>
</html>
```
### API Usage

This plugin makes use of the iFlytek Zhwen API to generate outlines for PPTs. The API call format is as follows:

```javascript
const payload = {
    query: `Generate a PPT outline about ${topic}, including key points such as ${keyPoints}`,
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

fetch("https://cors-anywhere.herokuapp.com/https://zwapi.xfyun.cn/api/aippt/createOutline", {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(payload)
})
.then(response => response.json())
.then(data => {
    if (data.flag && data.code === 0) {
        displayOutlineMarkdown(data.data);
    }
})
.catch(error => {
    console.error('Request failed:', error);
});

```

This request is routed through a proxy service (CORS Anywhere) to bypass CORS restrictions, allowing smooth interaction with the API.

### Resources
- Learn more about PPT generation: [iFlytek PPT Generation Service](https://www.xfyun.cn/services/aippt)

### Notes
- API Configuration: Make sure to configure your appId and APISecret correctly in the api.js file, and ensure that you have valid API quota for requests.
- Browser Support: The plugin uses modern JavaScript features, so it is recommended to use a browser that supports ES6+.

### Developer
- Developer: DeepPurpleApril
- Version: 1.0
- Date: November 2024