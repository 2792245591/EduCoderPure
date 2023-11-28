// ==UserScript==
// @name         头歌助手低调版
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Done
// @author       SunSeaLucky&&Jser
// @match        https://trustie.educoder.net/*
// @icon         none
// @grant        none
// @run-at       document-start
// @license      MIT
// @require      https://cdn.jsdelivr.net/npm/js-base64@3.7.5/base64.min.js
// ==/UserScript==

//设置随机测试时间区间上限
const max = 30000;
//设置随机测试时间区间下限
const min = 5000;
// 目前设置随机时间的方法出现严重Bug，请谨慎使用！若仍想快速刷时间，请进入微信头歌小程序，在对应的实例界面左右滑动，可快速刷到int最大值
const setRandomTime = false;

(function() {
    let oldFetch = fetch;
    function hookFetch(...args) {
        return new Promise((resolve, reject) => {
            oldFetch.apply(this, arguments).then((response) => {
                //请求匹配逻辑
                if (arguments[0].indexOf('homework_common_id') !== -1) {
                    const oldJson = response.json;
                    response.json = function () {
                        return new Promise((resolve, reject) => {
                            oldJson.apply(this, arguments).then((result) => {
                                //修改响应部分
                                if (setRandomTime) result.game.cost_time = Math.floor(Math.random() * (max - min + 1)) + min;
                                result.shixun.forbid_copy = false;
                                result.shixun.vip = true;
                                //修改响应部分
                                resolve(result);
                            });
                        });
                    };
                }
                resolve(response);
            });
        });
    }
    window.fetch = hookFetch;

    window.onload = function(){
        // 创建一个 <div> 元素
        var div = document.createElement("div");
        div.classList.add('JSer_Mian');
        // 添加窗口样式
        div.style.position = "fixed";
        div.style.top = "25%";
        div.style.left = "25%";
        div.style.transform = "translate(-50%, -50%)";
        div.style.width = "400px";
        div.style.maxHeight = "400px";
        div.style.height = "200x";
        div.style.overflowY = "scroll";
        div.style.backgroundColor = "lightgray";
        div.style.border = "1px solid gray";
        div.style.borderRadius = "5px";
        div.style.padding = "20px";
        div.style.boxShadow = "0px 2px 5px rgba(0, 0, 0, 0.3)";
        div.style.zIndex = "9999";
        div.style.transition = "transform 0.3s ease-in-out"; // 添加过渡效果
        div.style.display = "block";

        // 添加内容
        // 将 <div> 元素插入到页面中
        document.body.appendChild(div);

        // 添加按下 F2 键隐藏/显示功能
        let isview = true;
        document.addEventListener("keydown", function (event) {
            if (event.key === "F2") {
                if (isview) {
                    div.style.display = "block";
                }
                else {
                    div.style.display = "none";
                }
                isview = !isview;
            }
        });


        let con = document.createElement("div");
        con.style.width = "350px";
        con.style.height = "auto";
        con.style.display = "flex";
        con.style.flexDirection = "column";
        // con.style.justifyContent = "center";

        div.appendChild(con);
        let code = document.createElement("div");
        code.classList.add('code');
        let bt_select = document.createElement("button");
        let bt_find = document.createElement("button");
        let codenum = document.createElement("input");
        codenum.style.width = "100px";
        codenum.style.height = "30px";
        codenum.placeholder = "输入序号即可"

        bt_select.style.width = "100px";
        bt_select.style.height = "30px";
        bt_select.textContent = "select";
        bt_select.style.fontSize = "12px";
        bt_find.style.width = "100px";
        bt_find.style.height = "30px";
        bt_find.textContent = "find";
        bt_find.style.fontSize = "12px";

        // 创建一个新的 KeyboardEvent
        // const event = new KeyboardEvent('keydown', {
        //     key: 'f',
        //     ctrlKey: true
        // });

        function filterString(str) {
            const filteredStr = str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            return filteredStr;
        };

        let msg = document.createElement("span");
        msg.style.textAlign = "center";
        con.appendChild(msg).textContent = "CTRL + A 全选删除后单独写个a 然后选中拖动替换";
        con.appendChild(codenum);
        con.appendChild(bt_find);
        con.appendChild(bt_select);

        bt_find.addEventListener('click', () => {
            // console.log(`https://6k7f936939.yicp.fun/index.php?codeNumber=${codenum.value}`);
            fetch(`https://6k7f936939.yicp.fun/index.php?codeNumber=${codenum.value}`).then(Response => {
                if (Response.ok) {
                    return Response.text();
                }
                else {
                    throw new Error('请求失败');
                }
            }).then(data => {
                // console.log(typeof(data));
                data = Base64.decode(data);
                console.log(data);
                let Htstr = filterString(data);
                code.innerHTML = `<pre>${Htstr}</pre>`;
                con.appendChild(code);
            }).catch(error => {
                console.log("NONO", error);
            })

        });

        bt_select.addEventListener('click', () => {
            const codeElement = code.querySelector('pre');
            const range = document.createRange();
            range.selectNodeContents(codeElement);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            codeElement.focus();
        });
    }
})();