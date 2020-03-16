// ==UserScript==
// @name         WhatsApp Blast
// @description  Tools yang digunakan untuk mengirim pesan WhatsApp Secara Otomatis.
// @copyright    2018, rzlnhd (https://github.com/rzlnhd/)
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @icon         https://raw.githubusercontent.com/rzlnhd/WhatsApp-Blast/master/assets/icon.png
// @homepageURL  https://github.com/rzlnhd/WhatsApp-Blast
// @supportURL   https://github.com/rzlnhd/WhatsApp-Blast/issues
// @version      3.4.10
// @date         2020-3-16
// @author       Rizal Nurhidayat
// @match        https://web.whatsapp.com/
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.getResourceText
// @grant        GM.xmlhttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @connect      pastebin.com
// @updateURL    https://openuserjs.org/meta/rzlnhd/WhatsApp_Blast.meta.js
// @downloadURL  https://openuserjs.org/install/rzlnhd/WhatsApp_Blast.user.js
// @resource pnl https://raw.githubusercontent.com/rzlnhd/WhatsApp-Blast/master/assets/panel.html
// ==/UserScript==

// ==OpenUserJS==
// @author       rzlnhd
// ==/OpenUserJS==

/* Global Constant Variables */
const version = "v3.4.10", upDate = "16 Mar 2020", tDy = new Date(), qACR = "._3mMX1",
      qInp = "#main div[contenteditable='true']", qSend = "#main span[data-icon='send']";
/* Global Minify Function */
const xmlReq = ("function" == typeof GM_xmlhttpRequest) ? GM_xmlhttpRequest : GM.xmlhttpRequest,
      getRes = ("function" == typeof GM_getResourceText) ? GM_getResourceText : GM.getResourceText,
      getVal = ("function" == typeof GM_getValue) ? GM_getValue : GM.getValue,
      setVal = ("function" == typeof GM_setValue) ? GM_setValue : GM.setValue,
      getElmAll = q => {return document.querySelectorAll(q);},
      getById = id => {return document.getElementById(id);},
      getElm = q => {return document.querySelector(q);};
/* Global Editable Variables */
var imgFile, user, mIdx_, data = [], runL = 0, mIdx = 0, isFormat = false, doing = false, alrt = true;
/* First Function */
console.log("WhatsApp Blast " + version + " - Waiting for WhatsApp to load...");
const timer = setInterval(general, 1000);
function general() {
    if (getElm("div.app")){
        let pnl = getById("side"), itm = getElm("header"), e = itm.cloneNode(true);
        loadModule(); initComponents(e); pnl.insertBefore(e, pnl.childNodes[1]); initListener();
        console.log("WhatsApp Blast " + version + " - Blast Your Follow Up NOW!"); clearInterval(timer);
    }
}
/* Load WAPI Module for Send Image */
function loadModule() {
    function getStore(modules) {
        const storeObjects = [
            { id: "Store", conditions: (module) => (module.Chat && module.Msg) ? module : null },
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
                    window.Store.sendMessage = e => {return window.Store.SendTextMsgToChat(this, ...arguments)}
                    return window.Store;
                }
            }
        }
    }
    webpackJsonp([], { parasite: (x, y, z) => getStore(z) }, ['parasite']);
}
/* Getting User */
const getUser = () => {return user;};
/* Setting User */
function setUser(u) {user = u;}
/* Getting User */
const getData = () => {return data;};
/* Setting User */
function setData(d) {
    let ok = getById("fileOk"), eNum = getById("numbDat"), num = "", t = "";
    if (ok && eNum){
        ok.style.display = d ? (num = d.length, t = ("Data: Loaded, " + num + " Nama"), "inline-block") : "none";
        ok.title = t; eNum.innerText = num;
    }
    runL = 0; data = d;
}
/*=====================================
   Initial Function
=====================================*/
/* Load UI Component */
function initComponents(e){
    let pnl = getRes("pnl").replace(/VERSION/g, version); e.style.zIndex = 0; e.style.display = "block";
    e.style["background-color"] = "#fed859"; e.style["justify-content"] = "flex-start";
    e.style.height = "auto"; e.style.padding = "0px"; e.innerHTML = pnl;
}
/* Set All Component Listeners */
function initListener(){
    let clk = [{"id" : "blast", "fn" : blast}, {"id" : "del", "fn" : prevImg}, {"id" : "changeLog", "fn" : changeLog}],
        wbH = getById("toggleApp"), tab = getElmAll("#wbBody .tablinks"), trg = getElmAll("#wbBody .trig"),
        chk = getElmAll("#wbBody input[type='checkbox']"), opn = getVal('opn', true);
    chk.forEach((e, i) => {if(i>0){e.addEventListener("click", getPremium);}});
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
/* Main Blast! Function */
function blast(){
    if (doing){if(confirm("Stop WhatsApp Blast?")){setStatus(false);} return;}
    let obj = getById("message").value, auto = getById("auto").checked, c_img = getById("s_mg").checked,
        capt = getById("capt").value, data = getData(), b = data.length, l = runL, error = 0, sukses = 0, gagal = 0,
        code, pinned, a_error = [], a_gagal = [], time = 10;
    if (!obj){alert("Silahkan Masukkan Text terlebih dahulu..."); return;}
    else if (b === 0){alert("Silahkan Masukkan File Penerima Pesan..."); return;}
    else if (!getElm(qInp)){alert("Silahkan Pilih Chatroom Terlebih dahulu"); return;}
    else if (auto){
        code = getCode(); pinned = getPinned(); time = 6000;
        if (!code){alert("Chatroom Tidak Memiliki Foto Profil!"); return;}
        if (!pinned){alert("Chatroom Belum di PIN!"); return;}
    }
    if (l !== 0 && l < b){
        if(!confirm("Lanjutkan Blast dari data ke-" + (l + 1) + "?")){
            if(confirm("Blast ulang dari awal?")){l = 0;} else{return;}
        }
    }
    console.log("Blast!: Ignite Engine");
    function execute(){
        if (auto && b > 100){
            alert("Blast Auto tidak boleh lebih dari 100 Nama!"); setStatus(false);
        } else if (auto && getCode() != code){
            alert("Chatroom terdeteksi berbeda, Blast dihentikan!");
            finish(sukses, gagal, error, a_gagal, a_error, auto);
        } else if (doing && l < b){
            let clm = data[l].split(/,|;/), no = l+1, lg = "Link ke-" + no;
            dispatch(getElm(qInp), (no + "). " + mesej(obj, ...clm)));
            getElm(qSend).click();
            if (auto){
                console.log(lg + ": [TULIS]");
                setTimeout(() => {
                    let ch = getElmAll("#main div.message-out");
                    while (getRM(ch)){getRM(ch).click();}
                    ch[ch.length-1].querySelector('a').click();
                    console.log(lg + ": [EKSEKUSI]");
                }, 1000);
                setTimeout(() => {
                    let err = getElm(".aymnx div[role='button']"), psn, ig, snd;
                    snd = err ? (
                        psn = (err.innerText === "OK") ? (
                            a_error[error] = no, error++, "ERROR"
                        ) : (a_gagal[gagal] = no, gagal++, "GAGAL"), err.click(), false
                    ) : (
                        getElm(qSend).click(), ig = (c_img && imgFile) ? (
                            window.sendImage(setPhone(clm[1]) + "@c.us", imgFile, capt), true
                        ) : false, sukses++, psn = "SUKSES", true
                    );
                    console.log(lg + ": [EKSEKUSI " + psn + "]");
                    if (ig){console.log(lg + ": [GAMBAR SUKSES DIKIRIM]");}
                }, 4000);
                setTimeout(() => {back(code);}, 5000);
            } else{sukses++;}
            setTimeout(() => {l++; runL = l; execute();}, time);
        } else{
            finish(sukses, gagal, error, a_gagal, a_error, auto);
        }
    }
    setStatus(true); execute();
}
/* Create The Real Data */
const loadData = arr => {
    let data = [], dt = [], i = 0, j = 0;
    arr.forEach(e => {
        if (e && break_f(e)){
            let d = e.split(/,|;/), size = d.length; data[i] = e; i++;
            if (size > 2 && (d[2].length > 3 || size === 4)){
                dt[j] = getSgDate(d); j++;
            }
        }
    });
    mIdx_ = (dt.length !== 0) ? mPos(dt) : mIdx;
    return data;
};
/* Get Sign Up Date Data */
const getSgDate = d => {
    let i = 2, l = d.length;
    for (i; i < l; i++){
        let e = d[i];
        if ((i == 2) ? e && e.length > 3 : e){
            return e;
        }
    }
};
/* Create Links Message */
const mesej = (obj, nama, phone, bp, date) => {
    let absLink = "api.whatsapp.com/send?phone=", bC = 200, msg = obj,
        cBc = getById("s_bc").checked, sBp = getById("t_bp").value,
        tBp = msg.includes("BC") ? (cBc ? sBp : bC) : 100, kBp, enMsg;
    msg = msg.replace(/F_NAMA/g, setName(nama, 1)).replace(/NAMA/g, setName(nama, 0));
    msg = bp ? (
        (bp.length <= 3) ? (
            kBp = tBp - Number(bp), kBp = (kBp < 0) ? 0 : kBp,
            msg.replace(/P_BP/g, bp + " BP").replace(/K_BP/g, kBp + " BP")
        ) : msg.replace(/L_DAY/g, getLastDay(bp))
    ) : msg;
    msg = date ? msg.replace(/L_DAY/g, getLastDay(date)) : msg;
    enMsg = encodeURIComponent(msg).replace(/'/g, "%27").replace(/"/g, "%22");
    return absLink + setPhone(phone) + "&text=" + enMsg;
};
/* Break When Name is Empty */
const break_f = e => {return !!e.split(/,|;/)[0];};
/* Set Name of the Recipient */
const setName = (nama, opt) => {
    let fname = nama.split(' '), count = fname.length, new_name = titleCase(fname[0]), i;
    if (opt == 1){
        for (i = 1; i < count; i++){
            new_name += " " + titleCase(fname[i]);
        }
    }
    return new_name;
};
/* Title Case Text Transform */
const titleCase = str => {str = str.toLowerCase(); return str.charAt(0).toUpperCase() + str.slice(1);};
/* Set the Recipient's Phone Number */
const setPhone = phn => {
    let ph = phn.match(/\d+/g).join();
    return (!ph || ph.charAt(0) === "6") ? ph
        : (ph.charAt(0) === "0") ? "62" + ph.substr(1)
        : "62" + ph;
};
/* Getting Last Day Welcome Program */
const getLastDay = dateStr => {
    let str = (!isFormat && (mIdx != mIdx_)) ? (arrMove(dateStr.split("/"), mIdx_, mIdx).join("/")) : dateStr,
        date = new Date(str); date.setDate(date.getDate() + 30);
    return dateFormat(date);
};
/* Get Read More Button */
const getRM = e => {return e[e.length - 1].querySelector("span[role='button']");};
/*=====================================
   Utilities Function
=====================================*/
/* Setting "BLAST" Status */
function setStatus(stat){
    let path = getById("blast"), ico = getById("blastIc"), chatList = getById("pane-side"),
        stopIc = "M505.16405,19.29688c-1.176-5.4629-6.98736-11.26563-12.45106-12.4336C460.61647,0,435.46433,0,410.41962,0,307.2013,0,245.30155,55.20312,199.09162,128H94.88878c-16.29733,0-35.599,11.92383-42.88913,26.49805L2.57831,253.29688A28.39645,28.39645,0,0,0,.06231,264a24.008,24.008,0,0,0,24.00353,24H128.01866a96.00682,96.00682,0,0,1,96.01414,96V488a24.008,24.008,0,0,0,24.00353,24,28.54751,28.54751,0,0,0,10.7047-2.51562l98.747-49.40626c14.56074-7.28515,26.4746-26.56445,26.4746-42.84374V312.79688c72.58882-46.3125,128.01886-108.40626,128.01886-211.09376C512.07522,76.55273,512.07522,51.40234,505.16405,19.29688ZM384.05637,168a40,40,0,1,1,40.00589-40A40.02,40.02,0,0,1,384.05637,168ZM35.68474,352.06641C9.82742,377.91992-2.94985,442.59375.57606,511.41016c69.11565,3.55859,133.61147-9.35157,159.36527-35.10547,40.28913-40.2793,42.8774-93.98633,6.31147-130.54883C129.68687,309.19727,75.97,311.78516,35.68474,352.06641Zm81.63312,84.03125c-8.58525,8.584-30.08256,12.88672-53.11915,11.69922-1.174-22.93555,3.08444-44.49219,11.70289-53.10938,13.42776-13.42578,31.33079-14.28906,43.51813-2.10352C131.60707,404.77148,130.74562,422.67188,117.31786,436.09766Z",
        blastIc = "M505.12019,19.09375c-1.18945-5.53125-6.65819-11-12.207-12.1875C460.716,0,435.507,0,410.40747,0,307.17523,0,245.26909,55.20312,199.05238,128H94.83772c-16.34763.01562-35.55658,11.875-42.88664,26.48438L2.51562,253.29688A28.4,28.4,0,0,0,0,264a24.00867,24.00867,0,0,0,24.00582,24H127.81618l-22.47457,22.46875c-11.36521,11.36133-12.99607,32.25781,0,45.25L156.24582,406.625c11.15623,11.1875,32.15619,13.15625,45.27726,0l22.47457-22.46875V488a24.00867,24.00867,0,0,0,24.00581,24,28.55934,28.55934,0,0,0,10.707-2.51562l98.72834-49.39063c14.62888-7.29687,26.50776-26.5,26.50776-42.85937V312.79688c72.59753-46.3125,128.03493-108.40626,128.03493-211.09376C512.07526,76.5,512.07526,51.29688,505.12019,19.09375ZM384.04033,168A40,40,0,1,1,424.05,128,40.02322,40.02322,0,0,1,384.04033,168Z";
    chatList.style.overflowY = stat ? (console.log("Blasting..."), ico.setAttribute("d", stopIc), path.setAttribute("title", "STOP!"), "hidden")
        : (console.log("Stoped."), ico.setAttribute("d", blastIc), path.setAttribute("title", "BLAST!"), "auto");
    doing = stat;
}
/* Getting code from Selected Chatroom */
const getCode = () => {return getElm("div" + qACR + " img").src;};
/* Getting Pinned Status from Selected Chatroom*/
const getPinned = () => {return getElm("div" + qACR + " span[data-icon='pinned']");};
/* Formating Date Data */
const dateFormat = e => {
    let d = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
        m = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    return d[e.getDay()] + ", " + e.getDate() + " " + m[e.getMonth()] + " " + e.getFullYear();
};
/* Moving Array Elements */
const arrMove = (arr, oIdx, nIdx) => {
    if (nIdx >= arr.length){
        let k = nIdx - arr.length + 1;
        while (k--){arr.push(undefined);}
    }
    arr.splice(nIdx, 0, arr.splice(oIdx, 1)[0]);
    return arr;
};
/* Make Report Matrix Data */
const dataA = arr => {
    let size = arr.length, str = "", i = 0;
    for (i; i < size; i++) {
        str = (i === 0) ? (" (") : str;
        str += (i != (size - 1)) ? (arr[i] + ", ")
            : (arr[i] + ")");
    }
    return str;
};
/* Getting Month Index */
const mPos = d => {
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
/* Back to the First Chatroom */
function back(a){
    let elm = getElm("#pane-side img[src='" + a + "']");
    eventFire(elm, "mousedown");
}
/* Show the Report Data */
function finish(sukses, gagal, error, a_gagal, a_error, auto){
    if (doing) setStatus(false);
    runL = (data.length == runL) ? 0 : runL;
    alert(
        auto ? "[REPORT] Kirim Pesan Otomatis Selesai."
            + "\n    • SUKSES  = " + sukses
            + "\n    • GAGAL   = " + gagal + dataA(a_gagal)
            + "\n    • ERROR   = " + error + dataA(a_error)
        : "[REPORT] Penulisan Link Selesai. " + sukses + " Link Berhasil Ditulis"
    );
}
/* EventFire Function */
function eventFire(node, eventType){
    let clickEvent = document.createEvent("MouseEvents");
    clickEvent.initEvent(eventType, true, false);
    node.dispatchEvent(clickEvent);
}
/* Dispatch Function */
function dispatch(input, message){
    let evt = new InputEvent("input", {bubbles : true, composer : true});
    input.innerHTML = message; input.dispatchEvent(evt);
}
/*=====================================
   Listener Function Handler
=====================================*/
/* Open Super BC Menu */
function superBC(e){
    let obj = e.currentTarget.value, men = getById("c_bc");
    men.style.display = obj.includes("BC") ? (e.currentTarget.style.height = "110px", "block")
        : (e.currentTarget.style.height = null, "none");
}
/* Preview the Selected Image File*/
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
/* Preview and Load Data*/
function prevDat(e){
    let reader = new FileReader(); setData(null);
    reader.onload = f => {
        let lines = f.currentTarget.result.split(/\r\n|\r|\n/), data = loadData(lines);
        console.log("Blast!: Data Loaded,", !!data, data.length); setData(data);
    };
    reader.readAsText(e.currentTarget.files[0]);
}
/* Listeners for Checkbox */
function checking(e){
    let form = getById(e.currentTarget.value), attr = e.currentTarget.getAttributeNode("capt-id");
    if (attr) getById(attr.value).disabled = !e.currentTarget.checked;
    form.disabled = !e.currentTarget.checked;
}
/* Toggle Apps Listener */
function toggleApp(e){
    let butn = e.currentTarget, id = butn.getAttribute("value"),
        acdBody = getById(id), a = butn.classList.toggle("active");
    acdBody.style.height = acdBody.style.height ? null : acdBody.scrollHeight + "px";
    setVal("opn", a);
}
/* Tabview Event Listeners */
function openMenu(e){
    let menuName = e.currentTarget.value, tablinks = getElmAll("#wbBody .tablinks"),
        tabcontent = getElmAll("#wbBody .tabcontent");
    tabcontent.forEach(i => {i.style.display = 'none';});
    tablinks.forEach(i => {i.className = i.className.replace(" active", "");});
    getById(menuName).style.display = "block";
    e.currentTarget.className += " active";
}
/* Show Change Log */
function changeLog(){
    let cLog = "WhatsApp Blast " + version + " (Last Update: " + upDate + ").";
    cLog += "\n▫ Menambah fitur melanjutkan Blast."
        + "\n▫ Menambah fitur melihat jumlah data."
        + "\n▫ Memperbaiki bug minor."
        + "\n▫ Refactoring Code."
        + "\n\nVersion v.3.4.9 (6 Mar 2020)."
        + "\n▫ Memperbaiki bug major."
        + "\n▫ Better Performance."
        + "\n▫ Refactoring Code."
        + "\n\nVersion v.3.4.8 (4 Mar 2020)."
        + "\n▫ Memperbaiki penempatan link untuk Chrome 32bit."
        + "\n\nVersion v.3.4.7 (3 Mar 2020)."
        + "\n▫ Memperbarui Logic & Engine."
        + "\n▫ Memperbaiki bug minor.";
    alert(cLog);
}
/* Core Send Media Function*/
window.sendImage = (chatid, imgFile, caption, done=undefined) => {
    let idUser = new window.Store.UserConstructor(chatid, {intentionallyUsePrivateConstructor : true});
    return window.Store.Chat.find(idUser).then(chat => {
        let mc = new window.Store.MediaCollection(chat);
        mc.processAttachments([{file : imgFile}, 1], chat, 1).then(() => {
            let media = mc.models[0];
            media.sendToChat(chat, {caption : caption});
            if (done !== undefined) done(true);
        });
    });
};
/*=====================================
   For Credits Purpose
=====================================*/
/* Get User Phone Number */
const getUphone = () => {
    return !getUser() ? (getElm("header img").src.split("&")[2].match(/\d+/).join()) : setPhone(user.phone);
};
/* Getting User Data */
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
/* Is Premium? */
const isPremium = () => {return isSubsribe(getUser());};
/* Is Subscibed */
const isSubsribe = u => {
    if (u){
        let e = new Date(u.reg); e.setMonth(e.getMonth() + u.mon);
        if (tDy.getTime() <= e.getTime()){getAlrt(e); return true;}
    }
    return false;
};
/* Inform to the Subscriber */
function getAlrt(e){
    alrt = alrt ? (
        alert("Halo kak " + setName(getUser().name, 1) + "!"
              + "\nSelamat menggunakan fitur Pengguna Premium."
              + "\nMasa aktif Kakak berakhir hari " + dateFormat(e) + " ya..."
        ), false
    ) : alrt;
}
/* Get Premium User */
function getPremium(e){
    let at = getById("auto").checked, ig = getById("s_mg").checked, id = e.currentTarget.id;
    if (e.currentTarget.checked){
        e.currentTarget.checked = !isPremium() ? (
            alert("Maaf, fitur ini hanya untuk Pengguna Premium."
                  + "\nTampaknya Anda belum terdaftar sebagai Pengguna Premium,"
                  + "\nAtau masa berlangganan Anda mungkin telah habis."
                  + "\n\nInformasi lebih lanjut, silahkan hubungi saya."
            ), false) : true;
        getById("auto").checked = ((id == "s_mg") && !at) ? e.currentTarget.checked : at;
    }
    getById("s_mg").checked = ((id == "auto") && ig) ? e.currentTarget.checked : ig;
}
