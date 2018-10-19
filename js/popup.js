var app = new Vue({
    el: '#popup',
    data: {
        pageExists: false,
        currentTabUrl: '',
        personSet: '使用说明',
        page: ''
    },
    created() {
        chrome.tabs.getSelected(null, (tab) => {
            let uri = new URL(tab.url);
            this.page = `${uri.protocol}//${uri.hostname}${uri.pathname}`;
            this.currentTabUrl = uri.pathname;

            let list = localStorage.getItem('private_list') || [];
            this.pageExists = list.includes(this.page);
        });
    },
    methods: {
        gotoConfig() {
            chrome.tabs.create({ url: 'option.html' });
        },
        addCurPage() {
            this.pageExists = !this.pageExists;
            chrome.runtime.sendMessage({ operation: "addPage", page: this.page }, () => {})
        },
        removeCurPage() {
            this.pageExists = !this.pageExists;
            chrome.runtime.sendMessage({ operation: "removePage", page: this.page }, () => {})
        }
    }
})