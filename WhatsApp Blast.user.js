// ==UserScript==
// @name         WhatsApp Blast
// @description  Tools yang digunakan untuk mengirim pesan WhatsApp Secara Otomatis.
// @copyright    2018, rzlnhd (https://openuserjs.org/users/rzlnhd)
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @icon         https://i.ibb.co/9hvj6jY/WA-Blast-Icon.png
// @homepageURL  https://openuserjs.org/scripts/rzlnhd/WhatsApp_Blast
// @supportURL   https://openuserjs.org/scripts/rzlnhd/WhatsApp_Blast/issues
// @version      3.3.3
// @date         2020-1-18
// @author       Rizal Nurhidayat
// @match        https://web.whatsapp.com/
// @match        https://web.whatsapp.com/
// @grant        none
// @updateURL    https://openuserjs.org/meta/rzlnhd/WhatsApp_Blast.meta.js
// @downloadURL  https://openuserjs.org/install/rzlnhd/WhatsApp_Blast.user.js
// ==/UserScript==

// ==OpenUserJS==
// @author       rzlnhd
// ==/OpenUserJS==

/* Global Variables */
var createFromData_id = 0,prepareRawMedia_id = 0,store_id = 0,chat_id = 0,send_media,Store = {},_image,version = "v3.3.3",upDate = "18 Jan 2020",doing=false,
    classChat = "FTBzM" /*from message in chat*/, classErr = "_2eK7W _3PQ7V" /*from error message when execute link*/,
    classChRoom = "X7YrQ" /*from chatroom list*/, classAcChRoom = "_3mMX1" /*from active chatroom*/;
/* First Function */
var timer = setInterval(general,1000);
function general(){
    if(document.getElementsByClassName("app")[0] != null){
        var panel = document.getElementById("side");
        var item2 = document.getElementsByTagName("header")[0];
        var e = item2.cloneNode(true);loadModule();
        initComponents(e);panel.insertBefore(e, panel.childNodes[1]);initListener();
		console.log("WhatsApp Blast "+version+" - Blast Your Follow Up NOW!");
        clearInterval(timer);
	} else{
		console.log("WhatsApp Blast "+version+" - Waiting for WhatsApp to load...");
    }
}
/* Load WAPI Module for Send Image */
function loadModule(){if (!window.Store) {
    (function () {
        function getStore(modules) {
            let foundCount = 0;
            let neededObjects = [
                { id: "Store", conditions: (module) => (module.Chat && module.Msg) ? module : null },
                { id: "MediaCollection", conditions: (module) => (module.default && module.default.prototype && module.default.prototype.processFiles !== undefined) ? module.default : null },
                { id: "ChatClass", conditions: (module) => (module.default && module.default.prototype && module.default.prototype.Collection !== undefined && module.default.prototype.Collection === "Chat") ? module : null },
                { id: "MediaProcess", conditions: (module) => (module.BLOB) ? module : null },
                { id: "Wap", conditions: (module) => (module.createGroup) ? module : null },
                { id: "ServiceWorker", conditions: (module) => (module.default && module.default.killServiceWorker) ? module : null },
                { id: "State", conditions: (module) => (module.STATE && module.STREAM) ? module : null },
                { id: "WapDelete", conditions: (module) => (module.sendConversationDelete && module.sendConversationDelete.length == 2) ? module : null },
                { id: "Conn", conditions: (module) => (module.default && module.default.ref && module.default.refTTL) ? module.default : null },
                { id: "WapQuery", conditions: (module) => (module.queryExist) ? module : ((module.default && module.default.queryExist) ? module.default : null) },
                { id: "CryptoLib", conditions: (module) => (module.decryptE2EMedia) ? module : null },
                { id: "OpenChat", conditions: (module) => (module.default && module.default.prototype && module.default.prototype.openChat) ? module.default : null },
                { id: "UserConstructor", conditions: (module) => (module.default && module.default.prototype && module.default.prototype.isServer && module.default.prototype.isUser) ? module.default : null },
                { id: "SendTextMsgToChat", conditions: (module) => (module.sendTextMsgToChat) ? module.sendTextMsgToChat : null },
                { id: "SendSeen", conditions: (module) => (module.sendSeen) ? module.sendSeen : null },
                { id: "sendDelete", conditions: (module) => (module.sendDelete) ? module.sendDelete : null }
            ];
            for (let idx in modules) {
                if ((typeof modules[idx] === "object") && (modules[idx] !== null)) {
                    let first = Object.values(modules[idx])[0];
                    if ((typeof first === "object") && (first.exports)) {
                        for (let idx2 in modules[idx]) {
                            let module = modules(idx2);
                            if (!module) {
                                continue;
                            }
                            neededObjects.forEach((needObj) => {
                                if (!needObj.conditions || needObj.foundedModule)
                                    return;
                                let neededModule = needObj.conditions(module);
                                if (neededModule !== null) {
                                    foundCount++;
                                    needObj.foundedModule = neededModule;
                                }
                            });
                            if (foundCount == neededObjects.length) {
                                break;
                            }
                        }

                        let neededStore = neededObjects.find((needObj) => needObj.id === "Store");
                        window.Store = neededStore.foundedModule ? neededStore.foundedModule : {};
                        neededObjects.splice(neededObjects.indexOf(neededStore), 1);
                        neededObjects.forEach((needObj) => {
                            if (needObj.foundedModule) {
                                window.Store[needObj.id] = needObj.foundedModule;
                            }
                        });
                        window.Store.ChatClass.default.prototype.sendMessage = function (e) {
                            return window.Store.SendTextMsgToChat(this, ...arguments);
                        }
                        return window.Store;
                    }
                }
            }
        }

        webpackJsonp([], { 'parasite': (x, y, z) => getStore(z) }, ['parasite']);
    })();
};};
/*=====================================
   Initial Function
=====================================*/
/* Load UI Component */
function initComponents(e){
	e.style.zIndex=0;e.style['background-color']='#fed859';e.style['justify-content']='flex-start';e.style.display='block';e.style.height='auto';e.style.padding='0px';
	e.innerHTML ="<style>#wbHead{padding:5px 16px;background:#ededed;border-top:1px #bbb solid}#wbBody{padding:0px 16px;height:0;border-bottom:1px #bbb solid;transition:height 0.2s ease-in-out;overflow:hidden}"
        +"img.appIco{height:32px;padding:5px;vertical-align:middle}span.active{color:rgb(0,155,76) !important;transform:rotate(-90deg)}"
        +"#wbHead>span{display:inline-block}span.rightIco{float:right;vertical-align:middle;padding:7px;border-radius:50%;color:rgba(0,155,76,.5);transition:transform 0.2s ease-in-out}"
        +"textarea{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;width:100%}textarea#message{height:145px}"
		+"textarea#capt{border-color:rgb(0,0,0,0.1);background:rgb(0,0,0,0.05);color:black}textarea#capt::-webkit-input-placeholder{font-size:90%;color:white}"
		+"textarea#capt:disabled{background:rgb(0,0,0,0.15)}textarea#capt:disabled::-webkit-input-placeholder{color:#eee}"
		+"input.checks{width:1.5em;height:1.5em;position:relative;float:left;display:block;top:1px;margin-right:2px}"
		+"#c_bc,#i_mg{margin-top:2px;background:rgb(0, 0, 0, 0.05);padding:5px}#c_bc{display:none;animation:fadeEffect .3s}"
		+"#tabs{display:block;width:100%;height:30px;margin-top:10px}.tabcontent,.immg img{padding:5px}"
		+"#tabs button{background-color:inherit;float:left;cursor:pointer;padding:6px;transition:0.3s;width:50%;font-weight:600;border-radius:10px 10px 0 0;}"
		+"#tabs button:hover,#tabs button.active,.tabcontent{background: rgb(255, 255, 255, 0.35);}.tabcontent{display:none;animation:fadeEffect .5s}"
		+".immg{border: 2px solid rgba(0,0,0,0.1);height:87px;}.immg img{height:77px;max-width:95%;width:auto;margin:auto;display:block}"
        +".credit-icon{cursor:pointer;display:inline-block;width:16px;vertical-align:-0.125em;padding:0 1px}.btn-sc{float:right}.btn-sc a{color:#000}"
        +".icon-facebook a:hover{color:#4267b0}.icon-twitter a:hover{color:#20a0ef}.icon-instagram a:hover{color:#da524b}.icon-whatsapp a:hover{color:#02c046}"
		+".wb-cred{margin:5px auto 10px;text-align:left;background:rgb(0,0,0,0.07);padding:5px}@keyframes fadeEffect{from {opacity:0} to {opacity:1}}</style>";
	e.innerHTML +="<div id='wbHead'><span id='changeLog' title='Lihat Change Log'><img class='appIco' src='https://i.ibb.co/9hvj6jY/WA-Blast-Icon.png'/>WhatsApp Blast "+version+"</span><span id='toggleApp' value='wbBody' title='Buka/Tutup Tools' class='rightIco'><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512' width='28' height='28'>"
        +"<path fill='currentColor' d='M256 504C119 504 8 393 8 256S119 8 256 8s248 111 248 248-111 248-248 248zM142.1 273l135.5 135.5c9.4 9.4 24.6 9.4 33.9 0l17-17c9.4-9.4 9.4-24.6 0-33.9L226.9 256l101.6-101.6c9.4-9.4 9.4-24.6 0-33.9l-17-17c-9.4-9.4-24.6-9.4-33.9 0L142.1 239c-9.4 9.4-9.4 24.6 0 34z'></path></svg></span></div>"
        +"<div id='wbBody'><div id='tabs'><button class='tablinks' value='_MSG'>Pesan</button><button class='tablinks' value='_IMG'>Gambar</button></div>"
		+"<div id='_MSG' class='tabcontent'><textarea rows='9' id='message' class='copyable-text selectable-text' placeholder='Message Here!'></textarea>"
		+"<div id='c_bc'><input type='checkbox' id='s_bc' class='checks trig' name='s_bc' value='t_bp' title='Super BC?'>"
		+"<span>Atur Target untuk Super BC? : </span><input type='number' id='t_bp' name='t_bp' min='150' max='250' step='5' value='150' style='width:50px;' disabled><span> BP</span></div></div>"
		+"<div id='_IMG' class='tabcontent'><div id='i_mg'><input type='checkbox' id='s_mg' class='checks trig' name='s_mg' value='getImg' capt-id='capt' title='Attach Image?'>"
		+"<input type='file' accept='image/*' id='getImg' name='images' style='width:200px;cursor:pointer;' disabled>"
        +"<div id='del' data-icon='close' class='img icon icon-del' data-value='getImg' title='Delete Image' style='float:right;cursor:pointer;display:none'>"
		+"<svg width='20' height='20' viewBox='0 0 1792 1792' xmlns='http://www.w3.org/2000/svg'>"
		+"<path opacity='.4' d='M1490 1322q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68l-294 294 294 294q28 28 28 68z'></path></svg></div></div>"
		+"<div class='content immg'><img id='o_img'/></div><textarea id='capt' rows='1' class='copyable-text selectable-text' placeholder='Caption Here!' disabled></textarea></div>"
		+"<div style='height:2px;width:100%;display:block;background:#888;margin:5px 0;'></div>"
		+"<div style='margin-top: 5px;'><input type='checkbox' name='automatic' id='auto' class='checks' value='Auto' title='Blast Automatic?'> "
		+"<input type='file' accept='.csv,.txt' id='getFile' name='files' style='width:180px;cursor:pointer;'>"
		+"<div id='blast' data-icon='send' class='img icon icon-send' title='BLAST!' style='float:right;cursor:pointer;'>"
		+"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512' width='24' height='24'><path id='blastIc' opacity='.4' d='M505.12019,19.09375c-1.18945-5.53125-6.65819-11-12.207-12.1875C460.716,0,435.507,0,410.40747,0,307.17523,0,245.26909,55.20312,199.05238,128H94.83772c-16.34763.01562-35.55658,11.875-42.88664,26.48438L2.51562,253.29688A28.4,28.4,0,0,0,0,264a24.00867,24.00867,0,0,0,24.00582,24H127.81618l-22.47457,22.46875c-11.36521,11.36133-12.99607,32.25781,0,45.25L156.24582,406.625c11.15623,11.1875,32.15619,13.15625,45.27726,0l22.47457-22.46875V488a24.00867,24.00867,0,0,0,24.00581,24,28.55934,28.55934,0,0,0,10.707-2.51562l98.72834-49.39063c14.62888-7.29687,26.50776-26.5,26.50776-42.85937V312.79688c72.59753-46.3125,128.03493-108.40626,128.03493-211.09376C512.07526,76.5,512.07526,51.29688,505.12019,19.09375ZM384.04033,168A40,40,0,1,1,424.05,128,40.02322,40.02322,0,0,1,384.04033,168Z'></path></svg></div></div>"
        +"<div class='wb-cred'>Something wrong? Let Me to know<div class='btn-sc'>"
        +"<span id='sc-facebook' data-icon='facebook' class='img icon credit-icon icon-facebook' title='Rizal Nurhidayat'><a href='https://web.facebook.com/rzlnhd' target='_blank'>"
        +"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 512' width='16' height='16'>"
        +"<path opacity='.4' fill='currentColor' d='M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z'></path></svg></a></span>"
        +"<span id='sc-twitter' data-icon='twitter' class='img icon credit-icon icon-twitter' title='Rizal Nurhidayat'><a href='https://mobile.twitter.com/rzlnhd' target='_blank'>"
        +"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512' width='16' height='16'>"
        +"<path opacity='.4' fill='currentColor' d='M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z'></path></svg></a></span>"
        +"<span id='sc-instagram' data-icon='instagram' class='img icon credit-icon icon-instagram' title='Rizal Nurhidayat'><a href='https://www.instagram.com/rzlnhd/' target='_blank'>"
        +"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512' width='16' height='16'>"
        +"<path opacity='.4' fill='currentColor' d='M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z'></path></svg></a></span>"
        +"<span id='sc-whatsapp' data-icon='whatsapp' class='img icon credit-icon icon-whatsapp' title='Rizal Nurhidayat'><a href='https://api.whatsapp.com/send?phone=6285726467611'>"
        +"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512' width='16' height='16'>"
        +"<path opacity='.4' fill='currentColor' d='M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z'></path></svg></a></span></div></div></div>";
}
/* Set All Component Listeners */
function initListener(){
	var i, tabs = document.getElementsByClassName("tablinks"), trigs = document.getElementsByClassName("trig"),
        wbHead = document.getElementById("toggleApp"),checkL = document.querySelectorAll("input[type='checkbox']");
	for(i=0 ; i < tabs.length ; i++){tabs[i].addEventListener("click", openMenu)};
	for(i=0 ; i < trigs.length ; i++){trigs[i].addEventListener("click", checking)};
    for(i=1 ; i < checkL.length ; i++){checkL[i].addEventListener("click", _10ckF)};
    wbHead.addEventListener("click",toggleApp);
	document.getElementById("blast").addEventListener("click", blast);
	document.getElementById("getImg").addEventListener("change", prevImg);
	document.getElementById("del").addEventListener("click", prevImg);
	document.getElementById("message").addEventListener("input", superBC);
    document.getElementById("changeLog").addEventListener("click", changeLog);
	tabs[0].click();wbHead.click();
}
/*=====================================
   Main Function
=====================================*/
/* Main Function */
function blast(){
    console.log("Blast! function has running");
    var files = document.getElementById("getFile").files,
        obj = document.getElementById("message").value,
        input = document.querySelector("div.copyable-text.selectable-text"),
        auto = document.getElementById("auto").checked,
        c_img = document.getElementById("s_mg").checked,
        capt = document.getElementById("capt").value,
        file = files[0],a_gagal=[],a_error=[],
        code=getCode(),index=getIndex(code),
        sukses=0, gagal=0, error=0,pinned,
        reader = new FileReader();
    if(getStatus()){if(confirm("Stop WhatsApp Blast?")){setStatus(false);}return;}
    else if(obj==''){alert('Silahkan Masukkan Text terlebih dahulu...');return;}
    else if(!files.length){alert('Silahkan Masukkan File Penerima Pesan...');return;}
    else if(input == null){alert('Silahkan Pilih Chatroom Terlebih dahulu');return;}
    else if(auto){
        if(code==null){alert('Chatroom Tidak Memiliki Foto Profil!');return;}
        else{
            pinned = getPinned(index[1]);
            if(!pinned){alert('Chatroom Belum di PIN!');return;}
        }
    }
    reader.onload = function (progressEvent) {
        var lines =this.result.split(/\r\n|\r|\n/);
        var btn = document.querySelector("span[data-icon='send']");
        var l = 0, b=lines.length;
        function execute(){
            index=getIndex(code);
            if(auto && b>101){
                alert('Blast Auto tidak boleh lebih dari 100 Nama!');
                setStatus(false);
            } else if(lines[l]!='' && break_f(lines[l]) && getStatus()){
                var column=lines[l].split(/,|;/);
                input = document.querySelector("div.copyable-text.selectable-text");
                dispatch(input, ((l+1)+"). "+mesej(column[0],column[1],column[2],column[3])));
                var ph = setPhone(column[1]);
                btn = document.querySelector("span[data-icon='send']");
                btn.click();
                if(auto){
                    console.log("Link ke-"+(l+1)+": [TULIS]");
                    setTimeout(() => {
                        var chat=document.getElementsByClassName(classChat),num=chat.length,
                            rm=chat[num-1].querySelectorAll('span[role="button"]');
                        while(rm.length!=0){rm[0].click();rm=getRM()};
                        chat[num-1].getElementsByTagName('a')[0].click();
                        console.log("Link ke-"+l+": [EKSEKUSI]");
                    }, 1000);
                    setTimeout(() => {
                        btn = document.querySelector("span[data-icon='send']");
                        var err=document.getElementsByClassName(classErr);
                        if(err[0]!=null){
                            if(err[0].innerText==="OK"){
                                a_error[error]=l;error++;
                                err[0].click();
                                console.log("Link ke-"+l+": [EKSEKUSI ERROR]");
                            } else{
                                a_gagal[gagal]=l;gagal++;
                                err[0].click();
                                console.log("Link ke-"+l+": [EKSEKUSI GAGAL]");
                            }
                        } else{
                            if(btn!=null){
                                sukses++;
                                btn.click();
                                console.log("Link ke-"+l+": [EKSEKUSI SUKSES]");
                                if(c_img && _image!=null){
                                    sendImg(ph, _image, capt);
                                    console.log("Link ke-"+l+": [GAMBAR SUKSES DIKIRIM]");
                                };
                            } else{
                                a_gagal[gagal]=l;gagal++;
                                console.log("Link ke-"+l+": [EKSEKUSI GAGAL]");
                            }
                        }
                    }, 4000);
                    setTimeout(() => {
                        back(index[1]);
                    }, 5000);
                } else {sukses=l+1;}
                l++;
                if (l < b){
                    if(!auto){
                        setTimeout(execute, 10);
                    } else if(auto && index[0]){
                        setTimeout(execute, 6000);
                    } else{
                        finish(sukses, gagal, error, a_gagal, a_error, auto);
                    }
                } else {
                    finish(sukses, gagal, error, a_gagal, a_error, auto);
                }
            } else {
                finish(sukses, gagal, error, a_gagal, a_error, auto);
            }
        }
        console.log("Blast! has starting execute function");
        setStatus(true);execute();
    };
    reader.readAsText(file);
}
/* Main Send Image Function */
function sendImg(num, file, capt){
    var reader = new FileReader();
	num+="@c.us";
    reader.readAsDataURL(file);
    reader.onload = function(){
        window.sendImage(num, reader.result, capt, undefined);
    };
    reader.onerror = function(error) {
        console.log('Error: ', error);
    };
}
/* Create Links Message */
var mesej = function (nama, phone, bp, date){
    var abs_link = 'https://api.whatsapp.com/send?phone=',
        _bp = parseInt(bp),bp_,obj = document.getElementById('message').value,
        c_bc = document.getElementById('s_bc').checked,
        s_bp = document.getElementById('t_bp').value,
        msg = obj.replace(/F_NAMA/g,setName(nama,1)).replace(/NAMA/g,setName(nama,0)),
        t_bp = 100;
    if(obj.includes("BC")){if(c_bc){t_bp=s_bp;}else{t_bp=150;}}
    if(bp!=null){
        if(bp.length<=3){bp_=t_bp-_bp;msg = msg.replace(/P_BP/g,_bp+" BP").replace(/K_BP/g,bp_+" BP");}
        else{msg = msg.replace(/L_DAY/g,getLastDay(bp));}
    }
    if(date!=null){msg = msg.replace(/L_DAY/g,getLastDay(date));}
    var en_msg = encodeURIComponent(msg).replace(/'/g,"%27").replace(/"/g,"%22");
    return abs_link+setPhone(phone)+'&text='+en_msg;
}
/* Break When Name is Empty */
var break_f = function (line){
    var column=line.split(/,|;/);
    if(column[0]!=''){
        return true;
    }
    return false;
}
/* Set Name of the Recipient */
function setName(nama,opt){
    var fname=nama.split(' '),count=fname.length;
    if(opt==0){
        if(count>1){return titleCase(fname[0]);}else{return titleCase(nama);}
    }else{
        var new_name="";
        for(var i=0;i<count;i++){
            if(i==0){new_name+=titleCase(fname[i]);}else{new_name+=" "+titleCase(fname[i]);}
        }
        return new_name;
    }
}
/* Get Read More Button */
function getRM(){
    var chat=document.getElementsByClassName(classChat),num=chat.length;
    return chat[num-1].querySelectorAll('span[role="button"]');
}
/* Title Case Text Transform */
function titleCase(str) {
    var _str = str.toLowerCase();
    return _str.charAt(0).toUpperCase()+_str.slice(1);
}
/* Set the Recipient's Phone Number */
function setPhone(phone){
    if(phone==null || phone.charAt(0)==="6"){return phone;}
    else if(phone.charAt(0)==="0"){return "62"+phone.substr(1);}
    else{return "62"+phone;}
}
/* Getting Last Day Welcome Program */
function getLastDay(dateString){
    var d = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"],
        m = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"],
        date = dateString.split('/'),i=0,j=0,
	_date;
    date.forEach(function(item,index){date[index]=parseInt(item);});
    if(date[0]>100){j=2} else{i=2}
    _date = new Date(date[i], date[1]-1, date[j]);
    _date.setDate(_date.getDate() + 30);
    return d[_date.getDay()]+", "+_date.getDate()+" "+m[_date.getMonth()]+" "+_date.getFullYear();
}
/*=====================================
   Utilities Function
=====================================*/
/* Show Change Log */
function changeLog(){
    var cLog="WhatsApp Blast "+version+" (Last Update: "+upDate+").";
    cLog+="\n▫ Menetapkan password pada fitur berbayar."
        +"\n\nVersion v.3.3.2 (16 Jan 2020)."
        +"\n▫ Memperbaiki tampilan saat ada kata 'BC'"
        +"\n\nVersion v3.3.1 (15 Jan 2020)."
        +"\n▫ Menambah fitur tracking error"
        +"\n\nVersion v3.3.0 (13 Jan 2020)."
        +"\n▫ Membatasi data Blast Auto (Max 100 nama)."
        +"\n▫ Membatasi ukuran gambar (Max 4MB)."
        +"\n▫ Menambah fitur untuk menghentikan Blast (Manual/Auto)."
        +"\n▫ Menambah fitur untuk menyematkan Tools."
        +"\n▫ Menambah fitur untuk melihat Change Log."
        +"\n▫ Mengubah selector DOM agar lebih dinamis."
        +"\n▫ Mengganti tampilan tombol Blast.";
    alert(cLog);
}
/* Setting "BLAST" Status */
function setStatus(stat){
    var path=document.getElementById("blast"),
        ico=document.getElementById("blastIc"),
        chatList=document.getElementById("pane-side"),
        stopIc="M505.16405,19.29688c-1.176-5.4629-6.98736-11.26563-12.45106-12.4336C460.61647,0,435.46433,0,410.41962,0,307.2013,0,245.30155,55.20312,199.09162,128H94.88878c-16.29733,0-35.599,11.92383-42.88913,26.49805L2.57831,253.29688A28.39645,28.39645,0,0,0,.06231,264a24.008,24.008,0,0,0,24.00353,24H128.01866a96.00682,96.00682,0,0,1,96.01414,96V488a24.008,24.008,0,0,0,24.00353,24,28.54751,28.54751,0,0,0,10.7047-2.51562l98.747-49.40626c14.56074-7.28515,26.4746-26.56445,26.4746-42.84374V312.79688c72.58882-46.3125,128.01886-108.40626,128.01886-211.09376C512.07522,76.55273,512.07522,51.40234,505.16405,19.29688ZM384.05637,168a40,40,0,1,1,40.00589-40A40.02,40.02,0,0,1,384.05637,168ZM35.68474,352.06641C9.82742,377.91992-2.94985,442.59375.57606,511.41016c69.11565,3.55859,133.61147-9.35157,159.36527-35.10547,40.28913-40.2793,42.8774-93.98633,6.31147-130.54883C129.68687,309.19727,75.97,311.78516,35.68474,352.06641Zm81.63312,84.03125c-8.58525,8.584-30.08256,12.88672-53.11915,11.69922-1.174-22.93555,3.08444-44.49219,11.70289-53.10938,13.42776-13.42578,31.33079-14.28906,43.51813-2.10352C131.60707,404.77148,130.74562,422.67188,117.31786,436.09766Z",
        blastIc="M505.12019,19.09375c-1.18945-5.53125-6.65819-11-12.207-12.1875C460.716,0,435.507,0,410.40747,0,307.17523,0,245.26909,55.20312,199.05238,128H94.83772c-16.34763.01562-35.55658,11.875-42.88664,26.48438L2.51562,253.29688A28.4,28.4,0,0,0,0,264a24.00867,24.00867,0,0,0,24.00582,24H127.81618l-22.47457,22.46875c-11.36521,11.36133-12.99607,32.25781,0,45.25L156.24582,406.625c11.15623,11.1875,32.15619,13.15625,45.27726,0l22.47457-22.46875V488a24.00867,24.00867,0,0,0,24.00581,24,28.55934,28.55934,0,0,0,10.707-2.51562l98.72834-49.39063c14.62888-7.29687,26.50776-26.5,26.50776-42.85937V312.79688c72.59753-46.3125,128.03493-108.40626,128.03493-211.09376C512.07526,76.5,512.07526,51.29688,505.12019,19.09375ZM384.04033,168A40,40,0,1,1,424.05,128,40.02322,40.02322,0,0,1,384.04033,168Z";
    if(stat){
        console.log("Blasting...");
        path.setAttribute("title","STOP!");
        ico.setAttribute("d",stopIc);
        chatList.style.overflowY="hidden";
    } else{
        console.log("Stoped.");
        path.setAttribute("title","BLAST!");
        ico.setAttribute("d",blastIc);
        chatList.style.overflowY="auto";
    }
    doing=stat;
}
/* Getting "BLAST" Status */
function getStatus(){
    return doing;
}
/* Getting code from Selected Chatroom */
function getCode(){
    var obj = document.getElementsByClassName(classChRoom);
    for (var l = 0; l < obj.length; l++){
        if(obj[l].getElementsByClassName(classAcChRoom)[0]!=null){
            var id=obj[l].getElementsByTagName("img")[0];
            if(id!=null){
                var code=id.getAttribute("src").split("&");
                if(code[3]!=null){
                    return code[3];
                } else {
                    return null;
                }
            } else {
                return null;
            }
        }
    }
}
/* Getting Selected Chatroom Element's Index */
function getIndex(code){
    var index,i=0;
    while(i <= 11){
        if(document.getElementsByClassName(classChRoom)[i].innerHTML.includes(code)){
            index=i; break;
        } else{
            i++;
        }
    }
    if(index!=null){
        return [true,index];
    } else{
        return [false,null];alert('Chatroom tidak ditemukan');
    }
}
/* Getting Pinned Status from Selected Chatroom*/
function getPinned(index){
    return document.getElementsByClassName(classChRoom)[index].innerHTML.includes("pinned");
}
/* Back to the First Chatroom */
function back(id){
    eventFire(document.getElementsByClassName(classChRoom)[id],"mousedown");
}
/* Make Report Matrix Data */
function dataA(array){
    var str=" ",size=array.length;
    if(size==1){
        str+="("+array[0]+")";
    } else if(size==2){
        str+="("+array[0]+" & "+array[1]+")";
    } else if(size!=0){
        for(var i=0; i<size ; i++){
            if(i==0){
                str+="("+array[i]+",";
            }else if(i!=size-1){
                str+=" "+array[i]+",";
            } else{
                str+=" "+array[i]+")";
            }
        }
    }
    return str;
}
/* Show the Report Data */
function finish(sukses, gagal, error, a_gagal, a_error, auto){
    var msg="";
    if(auto){
        msg+="[REPORT] Kirim Pesan Otomatis Selesai."
            +"\n    • SUKSES  = "+sukses
            +"\n    • GAGAL   = "+gagal+dataA(a_gagal)
            +"\n    • ERROR   = "+error+dataA(a_error);
    } else{
        msg+="[REPORT] Penulisan Link Selesai. "+sukses+" Link Berhasil Ditulis";
    }
    if(getStatus){setStatus(false)}
    alert(msg);
}
/* EventFire Function */
function eventFire(element, eventType) {
    var elm=element.firstChild.firstChild,
        event = document.createEvent("MouseEvents");
    event.initMouseEvent(eventType, true, true, window,0, 0, 0, 0, 0, false, false, false, false, 0, null);
    elm.dispatchEvent(event);
}
/* Dispatch Function */
function dispatch(input, message) {
    InputEvent = Event || InputEvent;
    var evt = new InputEvent('input', {bubbles: true, composer: true});
    input.innerHTML = message;
    input.dispatchEvent(evt);
}
/* Open Super BC Menu */
function superBC(e){
	var obj = this.value,
        msj = document.getElementById('message'),
		men = document.getElementById('c_bc');
	if(obj.includes("BC")){
        msj.style.height='110px';
		men.style.display='block';
	} else {
        msj.style.height=null;
		men.style.display='none';
	}
}
/* Preview the Selected Image File*/
function prevImg(evt){
	var output = document.getElementById('o_img'),
        res=null,del = document.getElementById('del'),
        btn=this.getAttributeNode('data-value'),
        MByte=Math.pow(1024, 2),
        maxSize=4*MByte;
    if(btn==null){
        res = evt.target.files[0];
        if(res.size<=maxSize){
            _image = res;
        } else{
            alert("Ukuran gambar tidak boleh lebih dari 4MB");
            this.value='';res=null;
        }
    } else{
        document.getElementById(btn.value).value=''
    }
    if(res!=null){
        output.src = URL.createObjectURL(res);
        del.style.display='block'
    } else{
        output.removeAttribute("src");
        del.style.display='none'
    }
}
/* Listeners for Checkbox */
function checking(evt){
    var form = document.getElementById(this.value),
        attr = this.getAttributeNode('capt-id');
    if(attr!=null){document.getElementById(attr.value).disabled=!this.checked}
    form.disabled=!this.checked;
}
/* Toggle Apps */
function toggleApp(evt){
    var butn = evt.currentTarget,
        id = butn.getAttribute("value"),
        acdBody = document.getElementById(id);
    if(acdBody.style.height){
        acdBody.style.height = null;
        butn.className = butn.className.replace(' active', '');
    } else{
        acdBody.style.height = acdBody.scrollHeight + 'px';
        butn.className+= ' active';
    }
}
/* Tabview Event Listeners */
function openMenu(evt){
	var i, tabcontent, tablinks,menuName=this.value;
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = 'none';
	}
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(' active', '');
	}
	document.getElementById(menuName).style.display = 'block';
	evt.currentTarget.className += ' active';
}
/* Convert Base64Image To File */
var base64ImageToFile = function (b64Data, filename) {
    var arr = b64Data.split(',');
    var mime = arr[0].match(/:(.*?);/)[1];
    var bstr = atob(arr[1]);
    var n = bstr.length;
    var u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, {type: mime});
};
/* Set Cookie Function */
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
/* Set Cookie Function */
function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
/* Core Send Media Function*/
window.sendImage = function (chatid, imgBase64, caption, done) {
    var idUser = new window.Store.UserConstructor(chatid, { intentionallyUsePrivateConstructor: true });
    var random_name = Math.random().toString(36).substr(2, 5);
    done = undefined;
    return window.Store.Chat.find(idUser).then((chat) => {
        var mediaBlob = base64ImageToFile(imgBase64, random_name);
        var mc = new window.Store.MediaCollection();
        mc.processFiles([mediaBlob], chat, 1).then(() => {
            var media = mc.models[0];
            media.sendToChat(chat, { caption: caption });
            if (done !== undefined) done(true);
        });
    });
}
/* Checking String on an Array*/
function checkS(pram,arr){
    for(let i=0;i<arr.length;i++){
        if(pram==arr[i]){return true}
    }
    return false;
}
/* Credits Purpose */
var _0x40a6=['\x0a▫\x20Simpan\x20password\x20ini,\x20password\x20akan\x20hilang\x20jika\x20halaman\x20dimuat\x20ulang.','checked','currentTarget','\x0a▫\x20Password\x20akan\x20diganti\x20secara\x20periodik.','cmhuVktHcmhTa2Jz','Maaf,\x20password\x20yang\x20Anda\x20masukkan\x20salah.','YnhYN3plOW5hTnZO','Z3pUelNMQ3ZITmY5','Masukkan\x20Password\x20untuk\x20menggunakan\x20fitur\x20ini','\x0a▫\x20Anda\x20akan\x20mendapatkan\x20password\x20baru\x20selama\x20masa\x20berlangganan.','btoa','wbpass','NFFac2FyRG1QVDhN','bkF6eHN3MmRYY0pj','RTZDeVVkRjZjTUV0','YUpTSk5uOE5WVUZq','WTZmdTNYOHRaaHE2','VXZCUGU0UjVKZUs5','UTRIakRjbVZtRWhD','Fitur\x20Terbuka!\x20Selamat\x20menikmati\x20fitur\x20berbayar\x20ini!\x20Harap\x20diperhatikan:'];(function(_0x46d6d8,_0x110543){var _0x10c094=function(_0x3c2019){while(--_0x3c2019){_0x46d6d8['push'](_0x46d6d8['shift']());}};_0x10c094(++_0x110543);}(_0x40a6,0x10d));var _0x3bc8=function(_0x46d6d8,_0x110543){_0x46d6d8=_0x46d6d8-0x0;var _0x10c094=_0x40a6[_0x46d6d8];return _0x10c094;};function _10ckF(_0x146e5e){var _0x4eabb0=getCookie(_0x3bc8('0x2')),_0x1fbf37=[_0x3bc8('0xf'),_0x3bc8('0x8'),_0x3bc8('0x5'),_0x3bc8('0x3'),_0x3bc8('0x6'),_0x3bc8('0x7'),_0x3bc8('0x12'),_0x3bc8('0x9'),_0x3bc8('0x4'),_0x3bc8('0x11')];if(!_0x4eabb0||!checkS(_0x4eabb0,_0x1fbf37)){_0x4eabb0=window[_0x3bc8('0x1')](prompt(_0x3bc8('0x13')));if(_0x4eabb0&&checkS(_0x4eabb0,_0x1fbf37)){alert(_0x3bc8('0xa')+_0x3bc8('0xe')+_0x3bc8('0x0')+_0x3bc8('0xb')+'\x0a▫\x20Dilarang\x20keras\x20menyebarkan\x20password\x20ini\x20kepada\x20siapapun!');setCookie(_0x3bc8('0x2'),_0x4eabb0,0x1e);}else{alert(_0x3bc8('0x10'));_0x146e5e[_0x3bc8('0xd')][_0x3bc8('0xc')]=![];}}}
