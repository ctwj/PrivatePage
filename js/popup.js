var app = new Vue({
    el: '#popup',
    data: {
        pageExists: false,
        currentTabUrl: '',
        personSet: '设置',
        page: ''
    },
    created() {
        chrome.tabs.getSelected(null, (tab) => {
            let { protocol, hostname, pathname } = new URL(tab.url);
            this.page = `${protocol}//${hostname}${pathname}`;
            this.currentTabUrl = `${hostname}${pathname}`

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