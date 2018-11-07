/**
 * key
 */
let privateKey = localStorage.getItem('private_key') || 'privatepage';
/**
 * value
 */
let privateValue = localStorage.getItem('private_value') || 'ctwj';
/**
 * list
 */
let checkList = JSON.parse(localStorage.getItem('private_list')) || [];
/**
 * config list
 */
let configList = JSON.parse(localStorage.getItem('config_list')) || {};



/**
 * 网络监听
 */
chrome.webRequest.onBeforeSendHeaders.addListener((details) => {
    let request_headers = details.requestHeaders;
    let { protocol, hostname, pathname } = new URL(details.url);
    let hash = `${protocol}//${hostname}${pathname}`;
    if (checkList.includes(hash)) {
        request_headers.push({ 'name': configList[hash].key, 'value': configList[hash].value });
        return { requestHeaders: request_headers };
    }

}, { urls: ["<all_urls>"], types: ["main_frame", "sub_frame"] }, ['blocking', 'requestHeaders']);


/**
 * 命令
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    let { operation, page } = request;
    if (!operation) {
        return;
    }

    // 添加url
    if (operation === 'addPage') {
        let { key, val } = request;
        if (!checkList.includes(page)) {
            checkList.push(page);
            localStorage.setItem('private_list', JSON.stringify(checkList));

            configList[page] = { 'key': key, 'value': val };
            localStorage.setItem('config_list', JSON.stringify(configList));
        }
        sendResponse({ result: 'ok' })
        return;
    }

    // 移除url
    if (operation === 'removePage') {
        console.log(page, checkList);
        if (checkList.includes(page)) {
            checkList.splice(checkList.indexOf(page), 1);
            localStorage.setItem('private_list', JSON.stringify(checkList));

            delete configList[page];
            localStorage.setItem('config_list', JSON.stringify(configList));
        }
        sendResponse({ result: 'ok' })
        return;
    }

    // 更新密码
    if (operation === 'updatePgae') {
        let { key, val } = request;
        configList[page] = { 'key': key, 'value': val };
        localStorage.setItem('config_list', JSON.stringify(configList));
    }

    // 设置新的KeyValue
    if (operation === 'setKeyValue') {
        sendResponse({ result: 'ok' })
        return;
    }

});

/**
 * 加载页面时，设置图标
 */
chrome.tabs.onUpdated.addListener((id, info, tab) => {
    // console.log(id, info, tab);
    if (tab.status === 'loading') {
        let { protocol, hostname, pathname } = new URL(tab.url);
        if (checkList.includes(`${protocol}//${hostname}${pathname}`)) {
            chrome.browserAction.setIcon({ path: '/images/unlock.png', tabId: tab.id });
        }
        // {
        //     chrome.browserAction.setIcon({ path: '/images/lock.png', tabId: tab.id });
        // }
    }
})