// ==UserScript==
// @name         WhatsApp Blast
// @description  Tools yang digunakan untuk mengirim pesan WhatsApp Secara Otomatis.
// @copyright    2018, rzlnhd (https://github.com/rzlnhd/)
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @icon         https://wab.anggunsetya.com/files/assets/icon.png
// @homepageURL  https://wab.anggunsetya.com/
// @supportURL   https://wab.anggunsetya.com/
// @version      3.6.4
// @date         2021-5-24
// @author       Rizal Nurhidayat
// @match        https://web.whatsapp.com/
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @grant        GM_deleteValue
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.getResourceText
// @grant        GM.xmlhttpRequest
// @grant        GM.deleteValue
// @grant        GM.setValue
// @grant        GM.getValue
// @connect      wab.anggunsetya.com
// @updateURL    https://wab.anggunsetya.com/files/update.meta.js
// @downloadURL  https://wab.anggunsetya.com/files/install.user.js
// @resource pnl https://wab.anggunsetya.com/files/assets/view.html
// @resource clr https://wab.anggunsetya.com/files/assets/colors.json
// @resource css https://wab.anggunsetya.com/files/assets/style.min.css
// ==/UserScript==

// ==OpenUserJS==
// @author       rzlnhd
// ==/OpenUserJS==

/**=====================================
   Declaring Class Object
=====================================*/
/** Users Class */
class Users {
    constructor() {
        this.user = null; this.url = "https://wab.anggunsetya.com/user/api/";
        this.setUser(); 
    }
    getUphone() {
        return getElm("header img") ? (getElm("header img").src.split("&")[2].match(/\d+/).join('')) : 0;
    }
    setUser(u = this.getUser()) {
        if (u) {
            let e = u.reg ? new Date(u.reg) : null,
                exp = u.expires ? new Date(u.expires) : null;
            if(e) {e.setMonth(e.getMonth() + Number(u.mon))};
            this.user = {
                "name": u.name || '', "phone": u.phone,
                "attempt": u.attempt ? Number(u.attempt) : 0,
                "expires": exp ? exp.getTime() : null,
                "end": e ? e.getTime() : null
            };
        } else { this.user = null; }
        this.saveUser(this.user);
    }
    getUser() {return JSON.parse(getVal('user', null))}
    saveUser(user = this.user) {
        setVal('user', JSON.stringify(user));
    }
    getingData(add = {}, loop = true){
        let url = this.url, data = Object.assign({ phone: this.getUphone(), version: version }, add);
        xmlReq({
            method: "POST", url: url,
            headers: { 'Content-Type': 'application/json' }, data: JSON.stringify(data),
            ontimeout: rto => { users.errRes(rto, "rto", loop) },
            onerror: err => { users.errRes(err, "err", loop) },
            onload: res => { users.xhrRes(res, loop) },
        });
    }
    errRes(data, type, loop){
        let msg = type == "rto" ? 'Request Time Out' : 'Request Error';
        console.log(msg, data.status);
        if(loop) setTimeout(users.getingData, 10000);
    }
    xhrRes(data, loop){
        let usr = JSON.parse(data.responseText); users.setUser(usr || null);
        if (loop && (!users.user && !(users.isPremium() || users.isTrial()))) setTimeout(users.getingData, 20000);
    }
    push(type = "add"){
        let attempt = Number(this.user.attempt), tDy = new Date(),
            arr = { attempt: attempt += 1, action: type };
        if(type == "add"){
            let expires = tDy.setDate(tDy.getDate() + 2), end = new Date(expires).toLocaleString();
            arr = { expires: end, action: type}; this.user.expires = expires; 
        } else {
            this.user.attempt = attempt;
        }
        this.saveUser(); this.getingData(arr, false);
    }
    isPremium(){
        return this.user ? (new Date()).getTime() <= this.user.end : false;
    }
    isTrial() {
        return this.user && this.user.expires ? (this.user.attempt < 5 && (new Date()).getTime() <= this.user.expires) : false;
    }
    trialPrompt(e) {
        if(!this.user.expires){
            return !e ? (confirm("Apakah Anda mau mencoba 2 hari Trial?") ? (this.push(), true) : false) : e;
        }
        return e;
    }
    getAlrt(i, on = false) {
        let user = this.user, msg = [
            "Halo kak " + setName(user.name, 1) + "!"
            + "\nSelamat menggunakan fitur Pengguna Premium."
            + "\nMasa aktif Kakak berakhir hari " + dateFormat(user.end) + " ya...",
            "Saat ini Anda sedang menggunakan versi Trial."
            + "\nAnda dapat menggunakan fitur premium sebanyak " + (5 - user.attempt) + " kali lagi,"
            + "\nAtau masa Trial Anda berakhir hari " + dateFormat(user.expires) + " ya...",
            "Saat ini Anda sedang menggunakan versi Trial."
            + "\nAnda masih dapat menggunakan fitur premium sebanyak " + (5 - user.attempt) + " kali lagi.",
            "Masa Trial Anda sudah berakhir."
            + "\nSilahkan berlanganan untuk menggunakan fitur premium kembali."
        ];
        alrt = alrt || on ? (alert(msg[i]), false) : alrt;
    }
}
/** Option Class */
class Options {
    constructor(){
        this.default = {
            'wabColor':'var(--butterbar-connection-background)', 'wabTbp':100, 'maxQueue':100,
            'wabDate':'auto', 'wabCaption':'caption', 'wabOpn':true, 'wabTab':0};
        this.options = {};
    };
    load(opt){
        let inp = getElmAll(".inp input[type='range']"), slc = getElmAll(".inp select");
        this.options = opt ? Object.assign(this.default, JSON.parse(opt)) : this.default;
        this.colorList(); this.fillList();
        inp.forEach(e => {
            let val = e.value, out = e.parentElement.querySelector('output');
            out.innerText = val; e.addEventListener("input", this.sliderVal);
        });
        slc.forEach(e => {e.addEventListener("change", this.selectVal)});
        getById('wabPanel').style.backgroundColor = this.options.wabColor;
        setVal('options', JSON.stringify(this.options));
        console.log('Options loaded Successfully');
    }
    setOpt(key, val){
        this.options[key] = val; setVal('options', JSON.stringify(this.options));
    }
    sliderVal(e) {
        let val = e.currentTarget.value, id = e.currentTarget.id,
            out = (e.currentTarget.parentElement).querySelector('output');
        out.innerText = val; options.setOpt(id, Number(val));
    }
    selectVal(e) {
        let val = e.currentTarget.value, id = e.currentTarget.id;
        switch(id){
            case 'wabColor' : getById('wabPanel').style.backgroundColor = val; break;
            case 'wabDate' : options.optDate(val); break;
            case 'wabCaption' : options.optCapt(val); break;
        }
        options.setOpt(id, val);
    }
    optDate(val){
        if(val != 'auto'){
            val = Number(val);
            isFormat = (val == 2);
            mIdx_ = val != 2 ? val : null;
        } else {
            isFormat = false;
            if(queue.size != 0 || getById('getFile').value != ''){
                getById('getFile').value = ''; queue.reset(); updateUI();
                alert(
                    "Untuk opsi Deteksi Tanggal Otomatis, Silahkan masukkan ulang file penerima pesan."
                );
            }
        }
    }
    optCapt(val){
        let e = getById('capt'), c = val != 'caption';
        e.disabled = c; e.readOnly = c;
        e.title = c ? 'Caption menggunakan pesan' : '';
    }
    fillList(){
        Object.entries(this.options).forEach(e => {
            const [key, val] = e, elm = getById(key); if(elm) elm.value = val;
        });
    }
    colorList(){
        let bg = getElm('select#wabColor'), colors = JSON.parse(getRes('clr')).colors;
        colors.forEach(e => {
            let opt = document.createElement('option');
            opt.value = e.key; opt.text = e.val;
            bg.appendChild(opt);
        });
    }
}
/** Queue Class By Kate Morley - http://code.iamkate.com/ */
class Queue {
    constructor() {
        this.queue = []; this.res = []; this.offset = 0;
    }
    set data(data) {this.queue = data; this.res = data;};
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
    reset() {this.queue = []; this.res = []; runL = 0; this.offset = 0;};
    reload() {this.queue = this.res; this.offset = 0; updateUI();};
}
/** Declaring Message Class */
class Message {
    constructor() {
        this.kons = ''; this.name = ""; this.phone = ""; this.bp = "";
        this.date = ""; this.msg = ""; this.invs = ""; this.other = [];
    }
    setMsg(msgs, args) {
        if(isNaN(args[0])) args.unshift('');
        [this.kons, this.name, this.phone, this.bp, this.date, this.invs, ...this.other] = args;
        this.msg = msgs ? this.subtitute(msgs) : '';
    }
    get encodedMsg() {
        return encodeURIComponent(this.msg).replace(/'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29");
    }
    get link() {
        let absLink = "api.whatsapp.com/send?phone=", txt;
        txt = this.msg ? "&text=" + this.encodedMsg : '';
        return absLink + setPhone(this.phone) + txt;
    }
    setMessage(msg, col, val, size) {
        let opt = options.options, i = col, rgx, kBp, tBp = opt.wabTbp;
        for(i; i < (size > 3 ? 3 : size); i++){
            if (i == 2 && val.length > 3 && !datePattern.test(val)) msg = msg.replace(/F_INVS/g, setName(val, 1)).replace(/INVS/g, setName(val));
            if (i == 1 && datePattern.test(val)) msg = msg.replace(/L_DAY/g, this.lastDay(val)).replace(/S_DAY/g, this.lastDay(val, 1));
            if (i == 0 && val.length <= 3) {
                kBp = tBp - Number(val); kBp = (kBp < 0) ? 0 : kBp;
                msg = msg.replace(/P_BP/g, val + " BP").replace(/K_BP/g, kBp + " BP");
            };
        }
        msg = col > 2 ? (rgx = new RegExp('DATA_'+ (col - 2), 'g'), msg.replace(rgx, val)) : msg;
        return msg;
    }
    subtitute(str){
        let col = [this.bp, this.date, this.invs, ...this.other];
        str = str.replace(/F_NAMA/g, setName(this.name, 1)).replace(/NAMA/g, setName(this.name));
        str = this.kons != '' ? str.replace(/NO_KONS/g, this.kons) : str;
        col.forEach((e, i) => {str = e ? this.setMessage(str, i, e, col.length) : str});
        return str;
    }
    lastDay(dateStr, i = 0) {
        let str = (!isFormat && (mIdx != mIdx_)) ?
            (arrMove(dateStr.split("/"), mIdx_, mIdx).join("/")) : dateStr, d = new Date(str);
        if(i == 0){d.setDate(d.getDate() + 30);}
        return dateFormat(d, i);
    }
    sendImg(imgFile, caption, done = undefined) {
        return window.Store.Chat.find(setPhone(this.phone) + "@c.us").then(chat => {
            let mc = new window.Store.MediaCollection(chat);
            mc.processAttachments([{ file: imgFile }, 1], chat, 1).then(() => {
                let media = mc.models[0];
                media.sendToChat(chat, { caption: this.subtitute(caption) });
                if (done !== undefined) done(true);
            });
        });
    };
}
/** Declaring Report Class */
class Report {
    constructor() {
        this.sukses = 0; this.gagal = 0; this.error = 0;
        this.a_gagal = []; this.a_error = []; this.auto = false;
    }
    reset(a) {
        this.sukses = 0; this.gagal = 0; this.error = 0;
        this.a_gagal = []; this.a_error = []; this.auto = a;
    };
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
    fail(i, err) {i--; (err == 1) ? this.a_error[this.error++] = i : this.a_gagal[this.gagal++] = i;}
    showReport() {
        runL = !queue.now ? (getById('getFile').value = '', queue.reset(), 0) : runL;
        alert(
            this.auto ? "[REPORT] Kirim Pesan Otomatis Selesai."
                + "\n    • SUKSES  = " + this.sukses
                + "\n    • GAGAL   = " + this.gagal + this.createData(this.a_gagal)
                + "\n    • ERROR   = " + this.error + this.createData(this.a_error)
            : "[REPORT] Penulisan Link Selesai. " + this.sukses + " Link Berhasil Ditulis"
        );
        if (this.auto) {users.getAlrt(!users.isTrial() ? (getById("auto").click(), 3) : 2, true);}
    }
}
/** Interval Class */
class Interval {
    constructor() {
        this.timer = false; this.time = ""; this.fn = "";
    }
    get isRunning() {return this.timer !== false;};
    loop(t, fn) {this.time = t; this.fn = fn;};
    start() {
        if (!this.isRunning) {
            this.timer = setInterval(this.fn, this.time); setStatus(true);
        }
    };
    break(){
        clearInterval(this.timer); this.timer = false; setStatus(false);
    }
    stop(report) {
        this.break(); this.time = ""; this.fn = ""; report.showReport();
    };
}
/**=====================================
    Initial Function
=====================================*/
/** Global Minify Function */
const getElmAll = q => {return document.querySelectorAll(q);},
    getById = q => {return document.getElementById(q);},
    getElm = q => {return document.querySelector(q);},
    xmlReq = ("function" == typeof GM_xmlhttpRequest) ? GM_xmlhttpRequest : GM.xmlhttpRequest,
    getRes = ("function" == typeof GM_getResourceText) ? GM_getResourceText : GM.getResourceText,
    delVal = ("function" == typeof GM_deleteValue) ? GM_deleteValue : GM.deleteValue,
    getVal = ("function" == typeof GM_getValue) ? GM_getValue : GM.getValue,
    setVal = ("function" == typeof GM_setValue) ? GM_setValue : GM.setValue;
/** Global Variables */
const version = "v3.6.4", upDate = "24 Mei 2021", qACR = "._2GVnY", qSend = "#main span[data-icon='send']",
    qInp = "#main div[contenteditable='true']", datePattern = /\d{1,4}[\/|-|:]\d{1,2}[\/|-|:]\d{2,4}/, options = new Options(),
    queue = new Queue(), mesej = new Message(), doBlast = new Interval(), report = new Report(), users = new Users();
/** Global Reuseable Variable */
var imgFile, code, pinned, user, mIdx_, runL = 0, mIdx = 0, isFormat = false, doing = false, alrt = true, spliter = /,/;
/** First Function */
console.log("WhatsApp Blast " + version + " - Waiting for WhatsApp to load...");
var timer = setInterval(general, 1000);
function general(){
    if (getElm("div.two")){
        let head = getElmAll("header"); if(head.length < 2){
            let pnl = getById("side"), itm = getElm("header"), e = itm.cloneNode(true), opt = getVal('options', null);
            loadModule(); initComponents(e); pnl.insertBefore(e, pnl.childNodes[1]); options.load(opt); initListener();
            console.log("WhatsApp Blast " + version + " - Blast Your Follow Up NOW!");
        }
        users.getingData(); clearInterval(timer);
    }
}
/** Load WAPI Module for Send Message & Image */
function loadModule(){
    function getStore(modules) {
        const storeObjects = [
            { id: "Store", conditions: (module) => (module.default && module.default.Chat && module.default.Msg) ? module.default : null},
            { id: "MediaCollection", conditions: (module) => (module.default && module.default.prototype && module.default.prototype.processAttachments) ? module.default : null }
        ];
        let foundCount = 0;
        for (let idx in modules) {
            if ((typeof modules[idx] === "object") && (modules[idx] !== null)) {
                storeObjects.forEach((needObj) => {
                    if (!needObj.conditions || needObj.foundedModule) return;
                    let neededModule = needObj.conditions(modules[idx]);
                    if (neededModule !== null) { foundCount++; needObj.foundedModule = neededModule;
                    }
                });
                if (foundCount == storeObjects.length) {break;}
            }
        }
        let neededStore = storeObjects.find((needObj) => needObj.id === "Store");
        window.Store = neededStore.foundedModule ? neededStore.foundedModule : {};
        storeObjects.splice(storeObjects.indexOf(neededStore), 1);
        storeObjects.forEach((needObj) => {
            if (needObj.foundedModule) {window.Store[needObj.id] = needObj.foundedModule;}
        });
        return window.Store;
    }
    const parasite = `parasite${Date.now()}`;
    if (typeof webpackChunkbuild !== 'function') {
        webpackChunkbuild.push([[parasite], {}, function (o, e, t) {
            let modules = [];
            for (let idx in o.m) { modules.push(o(idx)); }
            getStore(modules);
        }]);
        console.log('WAPI Module loaded Successfully');
    } else { console.log('Failed to load WAPI Module!') }
}
/** Load UI Component */
function initComponents(e){
    let pnl = getRes("pnl").replace(/VERSION/g, version), style = getRes('css');
    e.style.zIndex = 0; e.style.display = "block"; e.style["justify-content"] = "flex-start";
    e.style["background-color"] = 'var(--butterbar-connection-background)'; e.style.height = "auto";
    e.style.padding = "0px"; e.id = 'wabPanel'; e.innerHTML = pnl; addStyle(style);
    console.log('Components loaded Successfully');
}
/** Set All Component Listeners */
function initListener(){
    let clk = [{ "id": "blast", "fn": blast }, { "id": "del", "fn": prevImg }, { "id": "changeLog", "fn": changeLog }],
        tab = getElmAll("#wbBody .tablinks"), chk = getElmAll("input.premium"), opt = options.options;
    clk.forEach(e => { getById(e.id).addEventListener("click", e.fn); });
    chk.forEach(e => { e.addEventListener("click", getPremium); });
    tab.forEach(e => { e.addEventListener("click", openMenu); });
    getById("toggleApp").addEventListener("click", toggleApp);
    getById("getFile").addEventListener("change", prevDat);
    getById("getImg").addEventListener("change", prevImg);
    getById("s_mg").addEventListener("click", checking);
    tab[opt.wabTab].click(); if (opt.wabOpn) getById("toggleApp").click();
    console.log('EventListener setted Successfully');
}
/**=====================================
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
    let obj = getById("message").value, auto = getById("auto").checked, c_img = getById("s_mg").checked, opt = options.options,
        capt = getById("capt").value, l = runL, b = queue.size + l, no = l + 1, time = 10, clm = [], lg, ig, ch, psn, err, snd, btn;
    if (!obj){alert("Silahkan Masukkan Pesan terlebih dahulu..."); return;}
    if (b === 0){alert("Silahkan Masukkan File Penerima Pesan..."); return;}
    if (!getElm(qInp)){alert("Silahkan Pilih Chatroom Terlebih dahulu"); return;}
    if (auto){
        code = getCode(); pinned = getPinned(); time = 6000;
        if (!code){alert("Chatroom Tidak Memiliki Foto Profil!"); return;}
        if (!pinned){alert("Chatroom Belum di PIN!"); return;}
        if (queue.size > opt.maxQueue){alert("Blast Auto tidak boleh lebih dari "+opt.maxQueue+" Nomor!"); return;}
        if (opt.wabCaption != 'caption'){capt = obj; obj = '';}
        if (users.isTrial()) {users.push('update');}
    }
    report.reset(auto);
    console.log("Blast!: Ignite Engine");
    function execute() {
        if (!doBlast.isRunning){doBlast.start();}
        if (auto && getCode() != code) {
            doBlast.break(); back(code); setTimeout(execute, 50);
        } else if (doBlast.isRunning && !!queue.now){
            clm = queue.run().split(spliter); mesej.setMsg(obj, clm); lg = "Link ke-" + no;
            dispatch(getElm(qInp), (no + "). " + mesej.link));
            getElm(qSend).click();
            if (auto){
                console.log(lg + ": [TULIS]");
                setTimeout(() => {
                    ch = getElmAll("#main div.message-out");
                    while (getRM(ch)){getRM(ch).click();}
                    ch[ch.length-1].querySelector('a').click();
                    console.log(lg + ": [EKSEKUSI]");
                }, 500);
                setTimeout(() => {
                    err = getElm(".overlay div[role='button']");
                    snd = err ? (
                        psn = (err.innerText.includes("OK")) ? (report.fail(no, 1), "ERROR"
                        ) : (report.fail(no, 0), "GAGAL"), err.click(), false
                    ) : (
                        (btn = obj ? getElm(qSend).click() : ''), ig = (c_img && imgFile) ? (
                            mesej.sendImg(imgFile, capt), true
                        ) : false, report.success(), psn = "SUKSES", true
                    );
                    console.log(lg + ": [EKSEKUSI " + psn + "]", snd);
                    if (ig){console.log(lg + ": [GAMBAR SUKSES DIKIRIM]");}
                }, 4000);
                setTimeout(back, 5000, code);
            } else{report.success();}
            showProgress(no, b); no++; l++; runL = l;
        } else{
            doBlast.stop(report);
        }
    }
    doBlast.loop(time, execute); execute();
}
/** Create The Real Data */
function loadData(arr){
    let data = [], dt = [], i = 0, j = 0, opt = options.options, s;
    spliter = arr[0].includes(';') ? /;/ : /,/;
    arr.forEach(e => {
        if (e && break_f(e)) {
            data[i] = e; i++; s = getSgDate(e); if(s) {dt[j] = s; j++};
        }
    });
    mIdx_ = opt.wabDate != 'auto' ? opt.wabDate : dt.length > 0 ? mPos(dt) : mIdx;
    isFormat = (opt.wabDate == 2);
    return data;
}
/** Get Sign Up Date Data */
function getSgDate(d) {
    if (datePattern.exec(d)){
        return datePattern.exec(d).toString();
    }
    return null;
}
/** Break When Name is Empty */
function break_f(e){return !!e.split(spliter)[0];}
/** Set Name of the Recipient */
function setName(nama, opt = 0){
    let fname = nama.split(' '), new_name = titleCase(fname[0]), i;
    if (opt != 0){
        for (i = 1; i < fname.length; i++){
            new_name += " " + titleCase(fname[i]);
        }
    }
    return new_name;
}
/** Title Case Text Transform */
function titleCase(str){str = str.toLowerCase(); return str.charAt(0).toUpperCase() + str.slice(1);}
/** Set the Recipient's Phone Number */
function setPhone(ph){
    ph = ph.match(/\d+/g).join('');
    return (!ph || ph.charAt(0) === "6") ? ph
        : (ph.charAt(0) === "0") ? "62" + ph.substr(1)
        : "62" + ph;
}
/**=====================================
   Utilities Function
=====================================*/
/** Setting "BLAST" Status */
function addStyle(styles) {
    var css = document.createElement("style");
    css.type = "text/css";css.id = "wab-style";
    css.appendChild(document.createTextNode(styles));
    getElm("head").appendChild(css);
}
/** Setting "BLAST" Status */
function setStatus(stat){
    let path = getById("blast"), ico = getById("blastIc"), side = getById("pane-side"),
        stopIc = "M505.16405,19.29688c-1.176-5.4629-6.98736-11.26563-12.45106-12.4336C460.61647,0,435.46433,0,410.41962,0,307.2013,0,245.30155,55.20312,199.09162,128H94.88878c-16.29733,0-35.599,11.92383-42.88913,26.49805L2.57831,253.29688A28.39645,28.39645,0,0,0,.06231,264a24.008,24.008,0,0,0,24.00353,24H128.01866a96.00682,96.00682,0,0,1,96.01414,96V488a24.008,24.008,0,0,0,24.00353,24,28.54751,28.54751,0,0,0,10.7047-2.51562l98.747-49.40626c14.56074-7.28515,26.4746-26.56445,26.4746-42.84374V312.79688c72.58882-46.3125,128.01886-108.40626,128.01886-211.09376C512.07522,76.55273,512.07522,51.40234,505.16405,19.29688ZM384.05637,168a40,40,0,1,1,40.00589-40A40.02,40.02,0,0,1,384.05637,168ZM35.68474,352.06641C9.82742,377.91992-2.94985,442.59375.57606,511.41016c69.11565,3.55859,133.61147-9.35157,159.36527-35.10547,40.28913-40.2793,42.8774-93.98633,6.31147-130.54883C129.68687,309.19727,75.97,311.78516,35.68474,352.06641Zm81.63312,84.03125c-8.58525,8.584-30.08256,12.88672-53.11915,11.69922-1.174-22.93555,3.08444-44.49219,11.70289-53.10938,13.42776-13.42578,31.33079-14.28906,43.51813-2.10352C131.60707,404.77148,130.74562,422.67188,117.31786,436.09766Z",
        blastIc = "M505.12019,19.09375c-1.18945-5.53125-6.65819-11-12.207-12.1875C460.716,0,435.507,0,410.40747,0,307.17523,0,245.26909,55.20312,199.05238,128H94.83772c-16.34763.01562-35.55658,11.875-42.88664,26.48438L2.51562,253.29688A28.4,28.4,0,0,0,0,264a24.00867,24.00867,0,0,0,24.00582,24H127.81618l-22.47457,22.46875c-11.36521,11.36133-12.99607,32.25781,0,45.25L156.24582,406.625c11.15623,11.1875,32.15619,13.15625,45.27726,0l22.47457-22.46875V488a24.00867,24.00867,0,0,0,24.00581,24,28.55934,28.55934,0,0,0,10.707-2.51562l98.72834-49.39063c14.62888-7.29687,26.50776-26.5,26.50776-42.85937V312.79688c72.59753-46.3125,128.03493-108.40626,128.03493-211.09376C512.07526,76.5,512.07526,51.29688,505.12019,19.09375ZM384.04033,168A40,40,0,1,1,424.05,128,40.02322,40.02322,0,0,1,384.04033,168Z";
    side.style.overflowY = (stat ? (ico.setAttribute("d", stopIc), path.setAttribute("title", "STOP!"), console.log("Blasting..."), 'hidden')
        : (ico.setAttribute("d", blastIc), path.setAttribute("title", "BLAST!"), console.log("Stoped."), 'auto'));
    doing = stat;
}
/** Update UI */
function updateUI(){
    let ok = getById("fileOk"), eNum = getById("numbDat"), num = queue.size, t = ("Data: Loaded, " + num + " Nomor");
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
function dateFormat(e, i = 0) {
    let opt = {year: 'numeric', month: 'long', day: 'numeric' };
    opt.weekday = i == 0 ? 'long' : undefined; e = new Date(e);
    return e.toLocaleDateString('id-ID', opt);
}
/** Moving Array Elements */
function arrMove(arr, oIdx, nIdx){
    if (nIdx >= arr.length){
        let k = nIdx - arr.length + 1;
        while (k--){arr.push(undefined);}
    }
    arr.splice(nIdx, 0, arr.splice(oIdx, 1)[0]);
    return arr;
}
/** Getting Month Index */
function mPos(d){
    let i, x, y, bb = 1, cc = 1, formatted = /\d{4}[\/|-|:]\d{1,2}[\/|-|:]\d{1,2}/;
    if(formatted.test(d[0])){
        isFormat = formatted.test(d[0]); return 2;
    } else {
        for (i = 0; i < d.length; i++){
            let [a, b] = d[i].split(/\/|:|-/);
            if (i === 0){x = a; y = b;}
            if (Number(a) > 12){return 1;}
            else if (Number(b) > 12){return 0;}
            else{
                bb += (a == x) ? 1 : 0;
                cc += (b == y) ? 1 : 0;
            }
        }
        return (bb < cc) ? 1 : 0
    };
}
/** Back to the First Chatroom */
function back(a){
    let elm = getElm("#pane-side img[src='" + a + "']");
    eventFire(elm, "mousedown");
}
/** EventFire Function */
function eventFire(node, eventType){
    let clickEvent = document.createEvent("MouseEvents");
    clickEvent.initMouseEvent(eventType, true, false);
    node.dispatchEvent(clickEvent);
}
/** Dispatch Function */
function dispatch(input, message){
    let evt = new InputEvent("input", {bubbles : true, composer : true});
    input.innerHTML = message; input.dispatchEvent(evt);
}
/** Getting code from Selected Chatroom */
function getCode(){let elm = getElm("div" + qACR + " img"); return elm ? elm.src : elm;}
/** Getting Pinned Status from Selected Chatroom*/
function getPinned(){return !!getElm("div" + qACR + " span[data-icon='pinned']");}
/** Get Read More Button */
function getRM(e){return e[e.length - 1].querySelector("span[role='button']");}
/**=====================================
   Listener Function Handler
=====================================*/
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
    let form = getById(e.currentTarget.value), opt = options.options,
        attr = e.currentTarget.getAttributeNode("capt-id");
    getById(attr.value).disabled = opt.wabCaption == 'caption' ? !e.currentTarget.checked : true;
    form.disabled = !e.currentTarget.checked;
}
/** Toggle Apps Listener */
function toggleApp(e){
    let butn = e.currentTarget, id = butn.getAttribute("value"),
        acdBody = getById(id), a = butn.classList.toggle("active");
    acdBody.style.height = acdBody.style.height ? null : acdBody.scrollHeight + "px";
    options.setOpt("wabOpn", a);
}
/** Tabview Event Listeners */
function openMenu(e){
    let elm = e.currentTarget, tablinks = getElmAll("#wbBody .tablinks"),
        menuName = elm.value, no, tabcontent = getElmAll("#wbBody .tabcontent");
    tabcontent.forEach(i => {i.style.display = 'none';});
    tablinks.forEach((e, i) => {e.className = e.className.replace(" active", ""); if(elm == e) no = i;});
    getById(menuName).style.display = "block"; elm.className += " active"; options.setOpt('wabTab', no);
}
/** Show Change Log */
function changeLog(){
    let cLog = "WhatsApp Blast " + version + " (Last Update: " + upDate + ").";
    cLog += "\n▫ Pesan mendukung karakter kurung '()'."
        + "\n▫ Perubahan aturan pada Mode Trial."
        + "\n▫ Migrasi file aplikasi beserta asetnya."
        + "\n\nVersion v3.6.3 (5 Mei 2021)."
        + "\n▫ Meningkatkan algoritma pemrosesan kata kunci pesan."
        + "\n▫ Refactoring code."
        + "\n▫ Bug Fixing."
        + "\n\nVersion v3.6.2 (21 April 2021)."
        + "\n▫ Meningkatkan algoritma pembacaan data Sign Up Date."
        + "\n\nVersion v3.6.1 (27 Maret 2021)."
        + "\n▫ Meningkatkan algoritma fungsi utama."
        + "\n▫ Mengubah perlakuan pada fungsi keamanan."
        + "\n\nVersion v3.6.0 (21 Maret 2021)."
        + "\n▫ Update panel: 1.2.01 (Menambah panel pengaturan)."
        + "\n▫ Opsi ubah warna panel."
        + "\n▫ Opsi target BP dipindah ke panel pengaturan."
        + "\n▫ Opsi ubah format tanggal."
        + "\n▫ Opsi penerima pesan sampai 200 nomor."
        + "\n▫ Menghapus kata kunci BC (tidak diperlukan lagi)."
        + "\n▫ Dukungan untuk format CSV diperluas.";
    alert(cLog);
}
/**=====================================
   For Credits Purpose
=====================================*/
/** Get Premium User */
function getPremium(e){
    let at = getById("auto").checked, ig = getById("s_mg").checked, id = e.currentTarget.id;
    if (e.currentTarget.checked){
        e.currentTarget.checked = users.isPremium() ? (users.getAlrt(0), true) : (
            (users.trialPrompt(users.isTrial())) ? (users.getAlrt(1), true) : (
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