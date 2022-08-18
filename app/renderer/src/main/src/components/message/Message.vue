<template>
    <div class="uiPanel uiInfoPanel uiJsonPanel"
         style="width: 30%; visibility: visible; top: 138px; left: 35%; z-index: 100; display: block;text-align: left" id="panel">
        <div class="uiPanel-titleBar" v-drag>
            <div class="uiPanel-close" @click="close()">x</div>
            <span class="uiPanel-title">{{this.title}}</span></div>
        <div class="uiPanel-body" style="height: 500px;padding: 0">
            <div class="uiJsonPretty">
                <json-viewer
                        :value="showInfo"
                        :expand-depth=3
                        copyable
                        sort style="background-color: rgba(0,0,0,0)"></json-viewer>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Message",
        data() {
            return {
                positionX: 0,
                positionY: 0,
                isShow: false,
                showInfo: Object,
                operationTitle: ''
            }
        },
        props: {
            value: {
                type: Boolean,
                default: false
            },
            info: Object,
            title: String
        },
        watch: {
            value(v) {
                this.isShow = v
            },
            // info(value,oldvalue){
            //     console.log(value);
            //
            //     console.log(this.showInfo);
            // },
            info: {
                immediate: true,    // 这句重要
                handler(val) {
                    if (this.isJSON(val)) {
                        this.showInfo = val;
                    }else{
                        this.showInfo = JSON.parse(val);
                    }
                }
            },
            title: function () {
                this.operationTitle = this.title;
            },
        },
        mutated: {},
        methods: {
            close() {
                this.isShow = false;
                this.$emit('input', this.isShow)
            },
            isJSON(str) {
                if (typeof str == 'string') {
                    try {
                        let obj = JSON.parse(str);
                        if (typeof obj == 'object' && obj) {
                            return true;
                        } else {
                            return false;
                        }

                    } catch (e) {
                        console.log('error：' + str + '!!!' + e);
                        return false;
                    }
                }
                console.log('It is not a string!')
                return true;
            }
        },
        directives: {
            drag: {
                // 指令的定义
                bind: function (el) {
                    let odiv = el;   //获取当前元素
                    let that = this;
                    el.onmousedown = (e) => {
                        //算出鼠标相对元素的位置
                        let disX = e.clientX - $('#panel').position().left-300;
                        let disY = e.clientY - $('#panel').position().top;
                        let left = '';
                        let top = '';
                        document.onmousemove = (e) => {
                            //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
                            left = e.clientX - disX-300;
                            top = e.clientY - disY;
                            //绑定元素位置到positionX和positionY上面
                            //移动当前元素
                            // odiv.style.left = left + 'px';
                            // odiv.style.top = top + 'px';
                            $('#panel').css('left', left + 'px');
                            $('#panel').css('top', top + 'px');
                        };
                        document.onmouseup = (e) => {
                            document.onmousemove = null;
                            document.onmouseup = null;
                        };
                    };
                }
            }
        }
    }
</script>

<style scoped>
    .uiInfoPanel {
        background: rgba(0, 0, 0, 0.75);
        color: white;
        border-radius: 8px;
        padding: 1px;
    }

    .uiPanel {
        box-shadow: -1px 2.5px 4px -3px black, -1px -2.5px 4px -3px black, 3px 2.5px 4px -3px black, 3px -2.5px 4px -3px black;
        position: absolute;
        background: #eee;
        border: 1px solid #666;
        font-size: 73%;
    }

    .uiInfoPanel .uiPanel-titleBar {
        background: rgba(74, 74, 74, 0.75);
        background: -moz-linear-gradient(top, rgba(84, 84, 84, 0.75), rgba(54, 54, 54, 0.75), rgba(64, 64, 64, 0.75));
        background: -webkit-linear-gradient(top, rgba(84, 84, 84, 0.75), rgba(54, 54, 54, 0.75), rgba(64, 64, 64, 0.75));
        border-radius: 8px 8px 0 0;
        padding: 1px 0 2px 0;
        border-bottom: 0;
    }

    .uiInfoPanel .uiPanel-body {
        background: transparent;
        padding: 20px;
        border-radius: 0 0 8px 8px;
        border: 1px solid #222;
    }

    .uiPanel-titleBar {
        text-align: center;
        font-weight: bold;
        padding: 2px 0;
        background: rgba(223, 223, 223, 0.75);
        background: -moz-linear-gradient(top, rgba(223, 223, 223, 0.75), rgba(193, 193, 193, 0.75), rgba(223, 223, 223, 0.75));
        background: -webkit-linear-gradient(top, rgba(223, 223, 223, 0.75), rgba(193, 193, 193, 0.75), rgba(223, 223, 223, 0.75));
        border-bottom: 1px solid #bbb;
    }

    .uiInfoPanel {
        background: rgba(0, 0, 0, 0.75);
        color: white;
        border-radius: 8px;
        padding: 1px;
    }

    .uiInfoPanel .uiPanel-close {
        border-radius: 6px;
        height: 13px;
        width: 13px;
        background: #ccc;
        left: 3px;
        top: 1px;
        color: #333;
        text-shadow: #222 0 0 1px;
        line-height: 11px;
        border: 0;
        padding: 0;
    }

    .uiPanel-close {
        cursor: pointer;
        border: 1px solid #aaa;
        background: #fff;
        color: #fff;
        float: left;
        height: 10px;
        left: 3px;
        line-height: 9px;
        padding: 1px 0;
        position: relative;
        text-shadow: 0 0 1px #000;
        top: 0px;
        width: 12px;
    }

    .uiPanel-close:hover {
        background-color: #eeeeee;
    }

    div {
        display: block;
    }


    ul {
        display: block;
        list-style-type: disc;
        margin-block-start: 1em;
        margin-block-end: 1em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
        padding-inline-start: 40px;
    }

    li {
        display: list-item;
        text-align: -webkit-match-parent;
    }

    ul.uiJsonPretty-object li, ul.uiJsonPretty-array li {
        padding: 0;
        margin: 0;
    }

    ul.uiJsonPretty-object, ul.uiJsonPretty-array {
        margin: 0;
        padding: 0 0 0 2em;
        list-style: none;
    }

    ul.uiJsonPretty-object, ul.uiJsonPretty-array {
        margin: 0;
        padding: 0 0 0 2em;
        list-style: none;
    }

    .uiJsonPanel SPAN.uiJsonPretty-string {
        color: #6F6;
    }

    .uiJsonPanel SPAN.uiJsonPretty-null {
        color: #F66;
    }

    .uiJsonPanel SPAN.uiJsonPretty-boolean {
        color: #F6F;
    }

    .uiJsonPanel SPAN.uiJsonPretty-number {
        color: #66F;
    }
    .uiJsonPretty{
        height:90%;overflow-y:auto
    }

</style>
<style>
    .jv-container.jv-light .jv-key {
        color: #FFFFFF;
        margin-right: 4px;
    }
    .jv-container.jv-light .jv-item.jv-object{
        color: #FFFFFF;
    }
    .jv-node:after {
        content: ',';
        color: #FFFFFF;
    }
    .jv-code{
      padding: 0;
    }
</style>
