var app = new Vue({
    el: '#popup',
    data: {
        pageExists: false,
        currentTabUrl: '',
        personSet: '设置',
        page: '',
        privateKey: '',
        privateValue: ''
    },
    created() {
        this.privateKey = localStorage.getItem('private_key') || 'privatepage';
        this.privateValue = localStorage.getItem('private_value') || 'ctwj';

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
            chrome.runtime.sendMessage({ operation: "addPage", page: this.page, 'key': this.privateKey, 'val': this.privateValue }, () => {})
        },
        removeCurPage() {
            this.pageExists = !this.pageExists;
            chrome.runtime.sendMessage({ operation: "removePage", page: this.page }, () => {})
        },
        github() {
            chrome.tabs.create({ url: "https://github.com/ctwj/PrivatePage" });
        }
    },
    filters: {
        ellipsis(value) {
            if (!value) return ''
            if (value.length > 25) {
                return value.slice(0, 25) + '...'
            }
            return value
        }
    }
})