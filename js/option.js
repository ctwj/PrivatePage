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
        showDiv: 'main',
        phpCode: "",
        version: "",
        name: ""
    },
    created() {
        this.privateKey = localStorage.getItem('private_key') || 'privatepage';
        this.privateValue = localStorage.getItem('private_value') || 'ctwj';
        this.pageList = JSON.parse(localStorage.getItem('private_list')) || [];
        this.phpCode = `<?php 
        if (! isset($_SERVER["HTTP_${this.privateKey.toUpperCase()}"]) || $_SERVER["HTTP_${this.privateKey.toUpperCase()}"] =="${this.privateValue}"  ) {
            Header("HTTP/1.1 404 Not Found"); 
            die();
        }
        phpinfo();
    ?></pre></code>`;
        let { name, version } = chrome.app.getDetails();
        this.version = version;
        this.name = name;

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
        },
        changeDiv(div) {
            this.showDiv = div;
        },
        modifyCode() {
            this.$nextTick(function() {
                let blocks = document.querySelectorAll("pre code");
                blocks.forEach(block => {
                    hljs.highlightBlock(block);
                });
            });
        },
        setKeyValue() {
            localStorage.setItem('private_key', this.privateKey);
            localStorage.setItem('private_value', this.privateValue);
            $('#setKeyValue').modal('hide');
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