// ==UserScript==
// @name         WhatsApp Blast
// @description  Tools yang digunakan untuk mengirim pesan WhatsApp Secara Otomatis.
// @copyright    2018, rzlnhd (https://github.com/rzlnhd/)
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @icon         https://raw.githubusercontent.com/rzlnhd/WhatsApp-Blast/master/assets/icon.png
// @homepageURL  https://github.com/rzlnhd/WhatsApp-Blast/3.5-beta
// @supportURL   https://github.com/rzlnhd/WhatsApp-Blast/3.5-beta/issues
// @version      3.5.0
// @date         2020-4-30
// @author       Rizal Nurhidayat
// @match        https://web.whatsapp.com/
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM.getResourceText
// @grant        GM.xmlhttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @connect      pastebin.com
// @updateURL    https://raw.githubusercontent.com/rzlnhd/WhatsApp-Blast/3.5-beta/WhatsApp%20Blast.user.js
// @downloadURL  https://raw.githubusercontent.com/rzlnhd/WhatsApp-Blast/3.5-beta/WhatsApp%20Blast.user.js
// @resource pnl https://raw.githubusercontent.com/rzlnhd/WhatsApp-Blast/master/assets/panel.html
// ==/UserScript==

// ==OpenUserJS==
// @author       rzlnhd
// ==/OpenUserJS==

/*=====================================
   Declaring Class Object
=====================================*/
/* Queue Class By Kate Morley - http://code.iamkate.com/ */
class Queue {
    constructor() {
        this.queue = []; this.res = []; this.offset = 0;
    }
    set data(data) {this.queue = this.res = data;};
    get now() {return (this.queue.length > 0 ? this.queue[this.offset] : undefined);};
    get size() {return (this.queue.length - this.offset);};
    run() {
        if (this.queue.length == 0) return undefined;
        let item = this.queue[this.offset];
        if (++ this.offset * 2 >= this.queue.length) {
            this.queue = this.queue.slice(this.offset); this.offset = 0;
        }
        updateUI(); return item;
    };
    reset() {this.queue = this.res = []; this.offset = 0;};
    reload() {this.queue = this.res; this.offset = 0;};
}
/* Declaring Message Class */
class Message {
    constructor() {
        this.name = this.phone = this.bp = this.date = this.msg = "";
    }
    setMsg(msgs, ...args) {[this.name, this.phone, this.bp, this.date] = args; this.msg = msgs;};
    get message(){
        let cBc = getById("s_bc").checked, sBp = getById("t_bp").value, kBp,
            bC = 200, tBp = this.msg.includes("BC") ? (cBc ? sBp : bC) : 100;
        this.msg = this.msg.replace(/F_NAMA/g, setName(this.name, 1)).replace(/NAMA/g, setName(this.name));
        this.msg = this.bp ? ((this.bp.length <= 3) ? (kBp = tBp - Number(this.bp), kBp = (kBp < 0) ? 0 : kBp,
            this.msg.replace(/P_BP/g, this.bp + " BP").replace(/K_BP/g, kBp + " BP")) : this.msg.replace(/L_DAY/g, this.lastDay)) : this.msg;
        this.msg = this.date ? this.msg.replace(/L_DAY/g, this.lastDay) : this.msg;
        return this.msg;
    };
    get lastDay() {
        let str = (!isFormat && (mIdx != mIdx_)) ?
            (arrMove(this.date.split("/"), mIdx_, mIdx).join("/")) : this.date, d = new Date(str);
        d.setDate(d.getDate() + 30);
        return dateFormat(d);
    };
    get link() {
        let absLink = "api.whatsapp.com/send?phone=", msg = this.message, enMsg;
        enMsg = encodeURIComponent(msg).replace(/'/g, "%27").replace(/"/g, "%22");
        return absLink + setPhone(this.phone) + "&text=" + enMsg;
    };
    sendMsg() {
        let chat = window.Store.Chat.get(setPhone(this.phone) + "@c.us");
        if (chat) {
            try {
                window.Store.SendTextMsgToChat(chat, this.message); return true;
            }
            catch (e) {console.log(e); return false;}
        }
        return false;
    };
    sendImg(imgFile, caption, done = undefined) {
        let idUser = new window.Store.UserConstructor(setPhone(this.phone) + "@c.us", { intentionallyUsePrivateConstructor: true });
        return window.Store.Chat.find(idUser).then(chat => {
            let mc = new window.Store.MediaCollection(chat);
            mc.processAttachments([{ file: imgFile }, 1], chat, 1).then(() => {
                let media = mc.models[0];
                media.sendToChat(chat, { caption: caption });
                if (done !== undefined) done(true);
            });
        });
    };
}
/* Declaring Report Class */
class Report {
    constructor(){
        this.sukses = this.gagal = 0; this.a_gagal = []; this.auto = false;
    }
    reset(a) {this.sukses = this.gagal = 0; this.a_gagal = []; this.auto = a;};
    createData(arr) {
        let size = arr.length, str = "", i = 0;
        for (i; i < size; i++) {
            str = (i === 0) ? (" (") : str;
            str += (i != (size - 1)) ? (arr[i] + ", ")
                : (arr[i] + ")");
        }
        return str;
    }
    success() {this.sukses++;}
    fail(i) {this.a_gagal[this.gagal++] = i;}
    showReport() {
        runL = !queue.now ? (getById('getFile').value = '', queue.reset(), 0) : runL;
        alert(
            this.auto ? "[REPORT] Kirim Pesan Otomatis Selesai."
                + "\n    • SUKSES  = " + this.sukses
                + "\n    • GAGAL   = " + this.gagal + this.createData(this.a_gagal)
            : "[REPORT] Penulisan Link Selesai. " + this.sukses + " Link Berhasil Ditulis"
        );
    }
}
/* Interval Class */
class Interval {
    constructor() {
        this.timer = false; this.time = this.fn = "";
    }
    get isRunning() {return this.timer !== false;};
    loop(t, fn) {this.time = t; this.fn = fn;};
    start() {
        if (!this.isRunning) {
            this.timer = setInterval(this.fn, this.time); setStatus(true);
        }
    };
    stop(report) {
        clearInterval(this.timer); this.timer = false; this.time = this.fn = "";
        setStatus(false); report.showReport();
    };
}
/*=====================================
   Initial Function
=====================================*/
/** Global Variables */
var version = "v3.5.0 BETA", upDate = "30 Apr 2020", tDy = new Date(), queue = new Queue(),
    mesej = new Message(), doBlast = new Interval(), report = new Report(),
    qInp = "#main div[contenteditable='true']", qSend = "#main span[data-icon='send']",
    imgFile, user, mIdx_, runL = 0, mIdx = 0, isFormat = false, doing = false, alrt = true,
    regMnu = ("function" == typeof GM_registerMenuCommand) ? GM_registerMenuCommand : undefined,
    xmlReq = ("function" == typeof GM_xmlhttpRequest) ? GM_xmlhttpRequest : GM.xmlhttpRequest,
    getRes = ("function" == typeof GM_getResourceText) ? GM_getResourceText : GM.getResourceText,
    getVal = ("function" == typeof GM_getValue) ? GM_getValue : GM.getValue,
    setVal = ("function" == typeof GM_setValue) ? GM_setValue : GM.setValue;
/** Global Minify Function */
var getElmAll = q => {return document.querySelectorAll(q);},
    getById = q => {return document.getElementById(q);},
    getElm = q => {return document.querySelector(q);};
/** First Function */
console.log("WhatsApp Blast " + version + " - Waiting for WhatsApp to load...");
var timer = setInterval(general, 1000);
function general(){
    if (getElm("div.app")){
        var pnl = getById("side"), itm = getElm("header"), e = itm.cloneNode(true);
        loadModule(); initComponents(e); pnl.insertBefore(e, pnl.childNodes[1]); initListener();
        console.log("WhatsApp Blast " + version + " - Blast Your Follow Up NOW!"); clearInterval(timer);
    }
}
/** Load WAPI Module for Send Message & Image */
function loadModule(){
    function getStore(modules) {
        const storeObjects = [
            { id: "Store", conditions: (module) => (module.Chat && module.Msg) ? module : null },
            { id: "SendTextMsgToChat", conditions: (module) => (module.sendTextMsgToChat) ? module.sendTextMsgToChat : null },
            { id: "MediaCollection", conditions: (module) => (module.default && module.default.prototype && module.default.prototype.processAttachments) ? module.default : null },
            { id: "UserConstructor", conditions: (module) => (module.default && module.default.prototype && module.default.prototype.isServer && module.default.prototype.isUser) ? module.default : null }
        ];
        let foundCount = 0;
        for (let idx in modules) {
            if ((typeof modules[idx] === "object") && (modules[idx] !== null)) {
                let first = Object.values(modules[idx])[0];
                if ((typeof first === "object") && (first.exports)) {
                    for (let idx2 in modules[idx]) {
                        let module = modules(idx2);
                        if (!module) {continue;}
                        storeObjects.forEach(needObj => {
                            if (!needObj.conditions || needObj.foundedModule) return;
                            let neededModule = needObj.conditions(module);
                            if (neededModule !== null) {foundCount++; needObj.foundedModule = neededModule;}
                        });
                        if (foundCount == storeObjects.length) {break;}
                    }
                    let neededStore = storeObjects.find(needObj => needObj.id === "Store");
                    window.Store = neededStore.foundedModule ? neededStore.foundedModule : window.Store;
                    storeObjects.splice(storeObjects.indexOf(neededStore), 1);
                    storeObjects.forEach(needObj => {if (needObj.foundedModule) window.Store[needObj.id] = needObj.foundedModule;});
                    return window.Store;
                }
            }
        }
    }
    (typeof webpackJsonp === 'function') ? webpackJsonp([], {'parasite': (x, y, z) => getStore(z)}, ['parasite'])
        : webpackJsonp.push([['parasite'], {parasite: function (o, e, t) {getStore(t);}}, [['parasite']]]);
}
/** Load UI Component */
function initComponents(e){
    let pnl = getRes("pnl").replace(/VERSION/g, version); e.style.zIndex = 0; e.style.display = "block";
    e.style["background-color"] = "var(--butterbar-background-connection)"; e.style["justify-content"] = "flex-start";
    e.style.height = "auto"; e.style.padding = "0px"; e.innerHTML = pnl;
}
/** Set All Component Listeners */
function initListener(){
    let clk = [{"id" : "blast", "fn" : blast}, {"id" : "del", "fn" : prevImg}, {"id" : "changeLog", "fn" : changeLog}],
        wbH = getById("toggleApp"), tab = getElmAll("#wbBody .tablinks"), trg = getElmAll("#wbBody .trig"),
        chk = getElmAll("#wbBody input[type='checkbox']"), opn = getVal('opn', true);
    chk.forEach((e, i) => {if(i > 0){e.addEventListener("click", getPremium);}});
    clk.forEach(e => {getById(e.id).addEventListener("click", e.fn);});
    tab.forEach(e => {e.addEventListener("click", openMenu);});
    trg.forEach(e => {e.addEventListener("click", checking);});
    wbH.addEventListener("click", toggleApp); getingData();
    getById("getFile").addEventListener("change", prevDat);
    getById("getImg").addEventListener("change", prevImg);
    getById("message").addEventListener("input", superBC);
    tab[0].click(); if(opn)wbH.click();
}
/*=====================================
   Main Function
=====================================*/
/** Main Blast! Function */
function blast(){
    if (doBlast.isRunning){if(confirm("Stop WhatsApp Blast?")){doBlast.stop(report);} return;}
    if (runL !== 0 && !!queue.now){
        if (!confirm("Lanjutkan Blast dari data ke-" + (runL + 1) + "?")){
            if (confirm("Blast ulang dari awal?")){queue.reload(); runL = 0;} else{return;}
        }
    }
    let obj = getById("message").value, auto = getById("auto").checked, c_img = getById("s_mg").checked,
        capt = getById("capt").value, l = runL, b = queue.size + l, no = l + 1, time = 10, clm = [], lg;
    if (!obj){alert("Silahkan Masukkan Pesan terlebih dahulu..."); return;}
    if (b === 0){alert("Silahkan Masukkan File Penerima Pesan..."); return;}
    if (auto){
        time = 6000; if (queue.size > 100){alert("Blast Auto tidak boleh lebih dari 100 Nama!"); return;}
    } else{
        if (!getElm(qInp)){alert("Silahkan Pilih Chatroom Terlebih dahulu"); return;}
    }
    report.reset(); report.auto = auto;
    console.log("Blast!: Ignite Engine");
    function execute(){
        if (doBlast.isRunning && !!queue.now){
            clm = queue.run().split(/,|;/); mesej.setMsg(obj, ...clm); lg = "Data ke-" + no;
            if (auto){
                if(mesej.sendMsg()){
                    console.log(lg + ": [EKSEKUSI SUKSES]"); report.success();
                    if (c_img && imgFile){
                        mesej.sendImg(imgFile, capt);
                        console.log(lg + ": [GAMBAR SUKSES DIKIRIM]");
                    }
                } else{
                    console.log(lg + ": [EKSEKUSI GAGAL]"); report.fail(no);
                };
            } else{
                dispatch(getElm(qInp), (no + "). " + mesej.link));
                getElm(qSend).click(); report.success();
            }
            showProgress(no, b); no++; l++; runL = l;
        }
        if (!queue.now) doBlast.stop(report);
    }
    doBlast.loop(time, execute);
    if (!doBlast.isRunning) doBlast.start(); execute();
}
/** Create The Real Data */
var loadData = arr => {
    let data = [], dt = [], i = 0, j = 0;
    arr.forEach(e => {
        if (e && break_f(e)){
            let d = e.split(/,|;/), size = d.length; data[i] = e; i++;
            if (size > 2 && (d[2].length > 3 || size === 4)){
                dt[j] = getSgDate(d.slice(2)); j++;
            }
        }
    });
    mIdx_ = (dt.length !== 0) ? mPos(dt) : mIdx;
    return data;
};
/** Get Sign Up Date Data */
var getSgDate = d => {
    let i = 0, l = d.length, e;
    for (i; i < l; i++){
        e = d[i];
        if ((i == 0) ? e && e.length > 3 : e){
            return e;
        }
    }
};
/** Break When Name is Empty */
var break_f = e => {return !!e.split(/,|;/)[0];};
/** Set Name of the Recipient */
var setName = (nama, opt = 0) => {
    let fname = nama.split(' '), count = fname.length, new_name = titleCase(fname[0]), i;
    if (opt == 1){
        for (i = 1; i < count; i++){
            new_name += " " + titleCase(fname[i]);
        }
    }
    return new_name;
};
/** Title Case Text Transform */
var titleCase = str => {str = str.toLowerCase(); return str.charAt(0).toUpperCase() + str.slice(1);};
/** Set the Recipient's Phone Number */
var setPhone = phn => {
    let ph = phn.match(/\d+/g).join('');
    return (!ph || ph.charAt(0) === "6") ? ph
        : (ph.charAt(0) === "0") ? "62" + ph.substr(1)
        : "62" + ph;
};
/** Getting User */
var getUser = () => {return user;};
/** Setting User */
function setUser(u){user = u;}
/*=====================================
   Utilities Function
=====================================*/
/** Setting "BLAST" Status
 * @param {Boolean} stat
 */
function setStatus(stat){
    let path = getById("blast"), ico = getById("blastIc"), chatList = getById("pane-side"),
        stopIc = "M505.16405,19.29688c-1.176-5.4629-6.98736-11.26563-12.45106-12.4336C460.61647,0,435.46433,0,410.41962,0,307.2013,0,245.30155,55.20312,199.09162,128H94.88878c-16.29733,0-35.599,11.92383-42.88913,26.49805L2.57831,253.29688A28.39645,28.39645,0,0,0,.06231,264a24.008,24.008,0,0,0,24.00353,24H128.01866a96.00682,96.00682,0,0,1,96.01414,96V488a24.008,24.008,0,0,0,24.00353,24,28.54751,28.54751,0,0,0,10.7047-2.51562l98.747-49.40626c14.56074-7.28515,26.4746-26.56445,26.4746-42.84374V312.79688c72.58882-46.3125,128.01886-108.40626,128.01886-211.09376C512.07522,76.55273,512.07522,51.40234,505.16405,19.29688ZM384.05637,168a40,40,0,1,1,40.00589-40A40.02,40.02,0,0,1,384.05637,168ZM35.68474,352.06641C9.82742,377.91992-2.94985,442.59375.57606,511.41016c69.11565,3.55859,133.61147-9.35157,159.36527-35.10547,40.28913-40.2793,42.8774-93.98633,6.31147-130.54883C129.68687,309.19727,75.97,311.78516,35.68474,352.06641Zm81.63312,84.03125c-8.58525,8.584-30.08256,12.88672-53.11915,11.69922-1.174-22.93555,3.08444-44.49219,11.70289-53.10938,13.42776-13.42578,31.33079-14.28906,43.51813-2.10352C131.60707,404.77148,130.74562,422.67188,117.31786,436.09766Z",
        blastIc = "M505.12019,19.09375c-1.18945-5.53125-6.65819-11-12.207-12.1875C460.716,0,435.507,0,410.40747,0,307.17523,0,245.26909,55.20312,199.05238,128H94.83772c-16.34763.01562-35.55658,11.875-42.88664,26.48438L2.51562,253.29688A28.4,28.4,0,0,0,0,264a24.00867,24.00867,0,0,0,24.00582,24H127.81618l-22.47457,22.46875c-11.36521,11.36133-12.99607,32.25781,0,45.25L156.24582,406.625c11.15623,11.1875,32.15619,13.15625,45.27726,0l22.47457-22.46875V488a24.00867,24.00867,0,0,0,24.00581,24,28.55934,28.55934,0,0,0,10.707-2.51562l98.72834-49.39063c14.62888-7.29687,26.50776-26.5,26.50776-42.85937V312.79688c72.59753-46.3125,128.03493-108.40626,128.03493-211.09376C512.07526,76.5,512.07526,51.29688,505.12019,19.09375ZM384.04033,168A40,40,0,1,1,424.05,128,40.02322,40.02322,0,0,1,384.04033,168Z";
    chatList.style.overflowY = stat ? (console.log("Blasting..."), ico.setAttribute("d", stopIc), path.setAttribute("title", "STOP!"), "hidden")
        : (console.log("Stoped."), ico.setAttribute("d", blastIc), path.setAttribute("title", "BLAST!"), "auto");
    doing = stat;
}
/** Update UI */
function updateUI(){
    let ok = getById("fileOk"), eNum = getById("numbDat"),
        num = queue.size, t = ("Data: Loaded, " + num + " Nama");
    ok.style.display = !num ? (queue.reset(), t = "", "none") : "inline-block";
    ok.title = t; eNum.innerText = num;
}
/** Show Progress Bar */
function showProgress(p = .5, t = 100){
    let eBar = getById("waBar"), w = (p / t) * 100;
    if(w > 1) eBar.setAttribute("title", p + '/' + t);
    eBar.style.width = w + '%';
}
/** Formating Date Data */
var dateFormat = e =>{
    let d = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
        m = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    return d[e.getDay()] + ", " + e.getDate() + " " + m[e.getMonth()] + " " + e.getFullYear();
};
/** Moving Array Elements */
var arrMove = (arr, oIdx, nIdx) => {
    if (nIdx >= arr.length){
        let k = nIdx - arr.length + 1;
        while (k--){arr.push(undefined);}
    }
    arr.splice(nIdx, 0, arr.splice(oIdx, 1)[0]);
    return arr;
};
/** Getting Month Index */
var mPos = d =>{
    let b1 = 1, c1 = 1, b, c, size = d.length, i; isFormat = false;
    for (i = 0; i < size; i++){
        let a = d[i].split("/");
        if (i === 0){
            b = a[0]; c = a[1];
            if (a[0].length > 3){
                isFormat = true; return 0;
            }
        }
        if (Number(a[0]) > 12){return 1;}
        else if (Number(a[1]) > 12){return 0;}
        else{
            b1 += (a[0] == b) ? 1 : 0;
            c1 += (a[1] == c) ? 1 : 0;
        }
    }
    return (b1 < c1) ? 1 : 0;
};
/** Dispatch Function */
function dispatch(input, message){
    let evt = new InputEvent("input", {bubbles : true, composer : true});
    input.innerHTML = message; input.dispatchEvent(evt);
}
/*=====================================
   Listener Function Handler
=====================================*/
/** Open Super BC Menu 
 * @param {HTMLElement} e
 */
function superBC(e){
    let obj = e.currentTarget.value, men = getById("c_bc");
    men.style.display = obj.includes("BC") ? (e.currentTarget.style.height = "110px", "block")
        : (e.currentTarget.style.height = null, "none");
}
/** Preview the Selected Image File */
function prevImg(e){
    let output = getById("o_img"), btn = e.currentTarget.getAttributeNode("data-value"), b,
        res = null, del = getById("del"), mByte = Math.pow(1024, 2), maxSize = 4 * mByte;
    b = btn ? (getById(btn.value).value = '', true) : (
        res = e.currentTarget.files[0],
        imgFile = (res.size <= maxSize) ? res : (
            alert("Ukuran gambar tidak boleh lebih dari 4MB"),
            e.currentTarget.value = '', res = null, null
        ), false
    );
    del.style.display = res ? (output.src = URL.createObjectURL(res), "block")
        : (output.removeAttribute("src"), "none");
}
/** Preview and Load Data */
function prevDat(e){
    let reader = new FileReader(); queue.reset(); updateUI(); showProgress();
    reader.onload = f => {
        let lines = f.currentTarget.result.split(/\r\n|\r|\n/), d = loadData(lines); queue.data = d;
        console.log("Blast!: Data Loaded,", !!queue.now, queue.size); updateUI(); showProgress();
    };
    reader.readAsText(e.currentTarget.files[0]);
}
/** Listeners for Checkbox */
function checking(e){
    let form = getById(e.currentTarget.value), attr = e.currentTarget.getAttributeNode("capt-id");
    if (attr) getById(attr.value).disabled = !e.currentTarget.checked;
    form.disabled = !e.currentTarget.checked;
}
/** Toggle Apps Listener */
function toggleApp(e){
    let butn = e.currentTarget, id = butn.getAttribute("value"),
        acdBody = getById(id), a = butn.classList.toggle("active");
    acdBody.style.height = acdBody.style.height ? null : acdBody.scrollHeight + "px";
    setVal("opn", a);
}
/** Tabview Event Listeners */
function openMenu(e){
    let menuName = e.currentTarget.value, tablinks = getElmAll("#wbBody .tablinks"),
        tabcontent = getElmAll("#wbBody .tabcontent");
    tabcontent.forEach(i => {i.style.display = 'none';});
    tablinks.forEach(i => {i.className = i.className.replace(" active", "");});
    getById(menuName).style.display = "block";
    e.currentTarget.className += " active";
}
/** Show Change Log */
function changeLog(){
    let cLog = "WhatsApp Blast " + version + " (Last Update: " + upDate + ").";
    cLog += "\n▫ Kirim pesan otomatis langsung ke penerima."
        + "\n▫ Mengganti separator bar menjadi progress bar."
        + "\n▫ Memperbarui Logic & Engine."
        + "\n▫ Menerapkan konsep Queue dan OOP."
        + "\n\nVersion v3.4.13 (9 Apr 2020)."
        + "\n▫ Menambah fitur Trial 7 Hari."
        + "\n▫ Memperbaiki bug major."
        + "\n▫ Refactoring Code."
        + "\n\nVersion v3.4.11 - v3.4.12 (27 Mar 2020)."
        + "\n▫ Memperbaiki tampilan yang tools hilang."
        + "\n▫ Memperbaiki DOM yang kacau."
        + "\n▫ Refactoring Code.";
    alert(cLog);
}
/*=====================================
   For Credits Purpose
=====================================*/
/** Get User Phone Number */
var getUphone = () => {
    return !getUser() ? (getElm("header img").src.split("&")[2].match(/\d+/).join('')) : setPhone(user.phone);
};
/** Getting User Data */
function getingData(){
    let a = {
        overrideMimeType : "application/json", method : "GET", url : "https://pastebin.com/raw/XzqwSJ6h",
        onload: res => {
            let usr = JSON.parse(res.responseText).users, u; setUser(null);
            for (u of usr){if(setPhone(u.phone) === getUphone()){setUser(u); break;}}
        },
    };
    xmlReq(a); setTimeout(getingData, 60000);
}
/** Is Premium? */
var isPremium = () => {
    let u = getUser();
    if (u){
        let e = new Date(u.reg); e.setMonth(e.getMonth() + u.mon);
        if (tDy.getTime() <= e.getTime()){getAlrt(e); return true;}
    }
    return false;
};
/** Is Trial */
var isTrial = () => {
    let d, ret = (!getVal('wabTrial')) ?
        ((confirm("Apakah Anda mau mencoba 7 hari Trial?")) ? (setVal('wabTrial', new Date()), true) : false) :
        (d = new Date(getVal('wabTrial')), d.setDate(d.getDate() + 7), ((tDy.getTime() <= d.getTime()) ? true : false));
    return ret;
};
/** Inform to the Subscriber */
function getAlrt(e){
    alrt = alrt ? (
        alert("Halo kak " + setName(getUser().name, 1) + "!"
              + "\nSelamat menggunakan fitur Pengguna Premium."
              + "\nMasa aktif Kakak berakhir hari " + dateFormat(e) + " ya..."
        ), false
    ) : alrt;
}
/* Trial Alert */
function trialAlrt(){
    let e = new Date(getVal('wabTrial'));
    alrt = alrt ? (
        e.setDate(e.getDate() + 7),
        alert("Saat ini Anda sedang menggunakan versi Trial.\n"
            +"Masa Trial Anda berakhir hari " + dateFormat(e) + " ya..."
        ), false
    ) : alrt;
}
/** Get Premium User */
function getPremium(e){
    let at = getById("auto").checked, ig = getById("s_mg").checked, id = e.currentTarget.id;
    if (e.currentTarget.checked){
        e.currentTarget.checked = isPremium() ? true : (
            isTrial() ? (trialAlrt(), true) : (
                alert("Maaf, fitur ini hanya untuk Pengguna Premium."
                  + "\nTampaknya Anda belum terdaftar sebagai Pengguna Premium,"
                  + "\nAtau masa berlangganan Anda mungkin telah habis."
                  + "\n\nInformasi lebih lanjut, silahkan hubungi saya."
                ), alrt = true, false)
        );
        if (id == "s_mg")if(!at){getById("auto").checked = e.currentTarget.checked;}
    }
    if (id == "auto"){if(ig){getById("s_mg").click();}}
}
