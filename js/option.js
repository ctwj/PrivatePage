var app = new Vue({
    el: '#option',
    data: {
        privateKey: '',
        privateValue: '',
        pageList: [],
        isShow: false,
        isSuccess: false,
        fenxiang: '',
        fenxiang_encode: '',
        emailshow: '',
        websiteurl: '',
        tmpPage: '',
    },
    created() {
        this.privateKey = localStorage.getItem('private_key') || 'PrivateKey';
        this.privateValue = localStorage.getItem('private_value') || 'Dream';
        this.pageList = JSON.parse(localStorage.getItem('private_list')) || [];
    },
    methods: {
        removePage(page) {
            this.tmpPage = page;
            $('#removePage').modal();
        },
        removePage1() {
            let index;
            if (this.pageList.includes(this.tmpPage)) {
                this.pageList.splice(this.pageList.indexOf(this.tmpPage), 1);
                chrome.runtime.sendMessage({ operation: "removePage", page: this.tmpPage }, () => {})
            }
            $('#removePage').modal('hide');
        }
    },
    filter: {
        ellipsis(value) {
            console.log('a')
            if (!value) return ''
            if (value.length > 8) {
                return value.slice(0, 8) + '...'
            }
            return value
        }
    }
})