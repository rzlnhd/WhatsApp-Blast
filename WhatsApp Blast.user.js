// ==UserScript==
// @name         WhatsApp Blast
// @description  Tools yang digunakan untuk mengirim pesan WhatsApp Secara Otomatis.
// @copyright    2018, rzlnhd (https://github.com/rzlnhd/)
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @icon         https://raw.githubusercontent.com/rzlnhd/WhatsApp-Blast/master/assets/icon.png
// @homepageURL  https://github.com/rzlnhd/WhatsApp-Blast
// @supportURL   https://github.com/rzlnhd/WhatsApp-Blast/issues
// @version      3.4.2f
// @date         2020-5-11
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

/* Global Variables */
var version="v3.4.2f", upDate="11 Mei 2020", qACR="._1f1zm",
    qInp="#main div[contenteditable='true']", qSend="#main span[data-icon='send']",
    _image, user, doing=false, alrt=true,
    xmlReq = ("function" == typeof GM_xmlhttpRequest) ? GM_xmlhttpRequest : GM.xmlhttpRequest,
    getRes = ("function" == typeof GM_getResourceText) ? GM_getResourceText : GM.getResourceText,
    getVal = ("function" == typeof GM_getValue) ? GM_getValue : GM.getValue,
    setVal = ("function" == typeof GM_setValue) ? GM_setValue : GM.setValue;
/* Global Minify Function */
var getElmAll = q => {return document.querySelectorAll(q);},
    getById = q => {return document.getElementById(q);},
    getElm = q => {return document.querySelector(q);};
/* First Function */
console.log("WhatsApp Blast " + version + " - Waiting for WhatsApp to load...");
var timer = setInterval(general, 1000);
function general(){
    if (getElm("div.app")){
        let pnl = getById("side"), itm = getElm("header"), e = itm.cloneNode(true);
        loadModule(); initComponents(e); pnl.insertBefore(e, pnl.childNodes[1]); initListener();
        console.log("WhatsApp Blast " + version + " - Blast Your Follow Up NOW!"); clearInterval(timer);
    }
}
/* Load WAPI Module for Send Image */
function loadModule(){
    function getStore(modules) {
        const storeObjects = [
            { id: "Store", conditions: (module) => (module.Chat && module.Msg) ? module : null },
            { id: "MediaCollection", conditions: (module) => (module.default && module.default.prototype && module.default.prototype.processAttachments) ? module.default : null }
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
    (typeof webpackJsonp === 'function') ? webpackJsonp([], {'parasite': (x, y, z) => getStore(z)}, ['parasite'])
        : webpackJsonp.push([['parasite'], {parasite: function (o, e, t) {getStore(t);}}, [['parasite']]]);
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
	let opn = getVal('opn', true), tab = getElmAll(".tablinks"),trg = getElmAll(".trig"),
        wbH = getById("toggleApp"),chk = getElmAll("input[type='checkbox']"),
        clk=[{"id":"blast","fn":blast},{"id":"del","fn":prevImg},{"id":"changeLog","fn":changeLog}];
    wbH.addEventListener("click",toggleApp); getingData();
    chk.forEach((e,i)=>{if(i>0)e.addEventListener("click", getPremium)});
    tab.forEach(e=>{e.addEventListener("click", openMenu)});
    trg.forEach(e=>{e.addEventListener("click", checking)});
    clk.forEach(e=>{getById(e.id).addEventListener("click", e.fn)});
	getById("getImg").addEventListener("change", prevImg);
	getById("message").addEventListener("input", superBC);
	tab[0].click(); if(opn)wbH.click();
}
/*=====================================
   Main Function
=====================================*/
/* Main Function */
function blast(){
    console.log("Blast!: ignite engine");
    let files = getById("getFile").files, obj = getById("message").value,
        auto = getById("auto").checked, c_img = getById("s_mg").checked,
        capt = getById("capt").value, file = files[0],a_gagal=[],a_error=[],code,
        sukses=0, gagal=0, error=0, time = 10, pinned, reader = new FileReader();
    if(getStatus()){if(confirm("Stop WhatsApp Blast?")){setStatus(false)}return}
    else if(obj==''){alert('Silahkan Masukkan Text terlebih dahulu...');return}
    else if(!files.length){alert('Silahkan Masukkan File Penerima Pesan...');return}
    else if(!getElm(qInp)){alert('Silahkan Pilih Chatroom Terlebih dahulu');return}
    else if(auto){
        code=getCode();pinned=getPinned(); time = 6000;
        if(!code){alert('Chatroom Tidak Memiliki Foto Profil!');return}
        if(!pinned){alert('Chatroom Belum di PIN!');return}
    }
    console.log("Blast!: onload data");
    reader.onload = function (progressEvent) {
        let lines=this.result.split(/\r\n|\r|\n/),l=0,b=lines.length;
        function execute(){
            if(auto && b > 101){
                alert('Blast Auto tidak boleh lebih dari 100 Nama!'); setStatus(false);
            } else if(lines[l]!='' && break_f(lines[l]) && getStatus() && l < b){
                let column=lines[l].split(/,|;/), ph=setPhone(column[1]);
                dispatch(getElm(qInp), ((l+1)+"). "+mesej(obj,column[0],column[1],column[2],column[3])));
                getElm(qSend).click();
                if(auto){
                    console.log("Link ke-"+(l+1)+": [TULIS]");
                    setTimeout(() => {
                        let ch = getElmAll("#main div.message-out");
                        while (getRM(ch)){getRM(ch).click();}
                        ch[ch.length-1].querySelector('a').click();
                        console.log("Link ke-"+l+": [EKSEKUSI]")
                    }, 1000);
                    setTimeout(() => {
                        let err = getElm(".overlay div[role='button']");
                        if(err!=null){
                            if(err.innerText=="OK"){
                                a_error[error]=l;error++; err.click();
                                console.log("Link ke-"+l+": [EKSEKUSI ERROR]")
                            } else{
                                a_gagal[gagal]=l;gagal++; err.click();
                                console.log("Link ke-"+l+": [EKSEKUSI GAGAL]")
                            }
                        } else{
                            getElm(qSend).click(); sukses++;
                            console.log("Link ke-"+l+": [EKSEKUSI SUKSES]");
                            if(c_img && _image!=null){
                                window.sendImage(ph+"@c.us", _image, capt);
                                console.log("Link ke-"+l+": [GAMBAR SUKSES DIKIRIM]")
                            }
                        }
                    }, 4000);
                    setTimeout(() => {back(code)}, 5000);
                } else {sukses++;}
                l++; setTimeout(execute, time)
            } else {
                finish(sukses, gagal, error, a_gagal, a_error, auto)
            }
        }
        console.log("Blast!: execute data");
        setStatus(true);execute();
    };
    reader.readAsText(file);
}
/* Create Links Message */
var mesej = (obj, nama, phone, bp, date) => {
    let abs_link = 'https://api.whatsapp.com/send?phone=', _bp = parseInt(bp), t_bp = 100,
        bp_, en_msg, c_bc = getById('s_bc').checked, s_bp = getById('t_bp').value,
        msg = obj.replace(/F_NAMA/g,setName(nama,1)).replace(/NAMA/g,setName(nama,0));
    if(obj.includes("BC")){if(c_bc){t_bp=s_bp}else{t_bp=200}}
    if(bp!=null){
        if(bp.length<=3){bp_=t_bp-_bp;msg = msg.replace(/P_BP/g,_bp+" BP").replace(/K_BP/g,bp_+" BP")}
        else{msg = msg.replace(/L_DAY/g,getLastDay(bp))}
    }
    if(date!=null){msg = msg.replace(/L_DAY/g,getLastDay(date))}
    en_msg = encodeURIComponent(msg).replace(/'/g,"%27").replace(/"/g,"%22");
    return abs_link+setPhone(phone)+'&text='+en_msg
}
/* Break When Name is Empty */
var break_f = line => {
    let column=line.split(/,|;/);
    if(column[0]!=''){return true}
    return false
}
/* Set Name of the Recipient */
var setName = (nama,opt) => {
    let fname=nama.split(' '),count=fname.length,
        new_name=titleCase(fname[0]);
    if(opt==1){
        for(let i=1;i<count;i++){
            new_name+=" "+titleCase(fname[i])
        }
    }
    return new_name
}
/* Get Read More Button */
var getRM = e =>{return e[e.length - 1].querySelector("span[role='button']")}
/* Title Case Text Transform */
var titleCase = str => {str = str.toLowerCase(); return str.charAt(0).toUpperCase() + str.slice(1)}
/* Set the Recipient's Phone Number */
var setPhone = phone => {
    if(phone==null || phone.charAt(0)==="6"){return phone}
    else if(phone.charAt(0)==="0"){return "62"+phone.substr(1)}
    else{return "62"+phone}
}
/* Getting Last Day Welcome Program */
var getLastDay = dateString => {
    let date = dateString.split('/'),i=0,j=0,_date;
    date.forEach((item,index)=>{date[index]=parseInt(item)});
    if(date[0]>100){j=2} else{i=2}
    _date = new Date(date[i], date[1]-1, date[j]);
    _date.setDate(_date.getDate() + 30);
    return dateFormat(_date)
}
/* Setting User */
function setUser(u){user=u}
/*=====================================
   Utilities Function
=====================================*/
/* Setting "BLAST" Status */
function setStatus(stat){
    let path=getById("blast"), ico=getById("blastIc"), chatList=getById("pane-side"),
        stopIc="M505.16405,19.29688c-1.176-5.4629-6.98736-11.26563-12.45106-12.4336C460.61647,0,435.46433,0,410.41962,0,307.2013,0,245.30155,55.20312,199.09162,128H94.88878c-16.29733,0-35.599,11.92383-42.88913,26.49805L2.57831,253.29688A28.39645,28.39645,0,0,0,.06231,264a24.008,24.008,0,0,0,24.00353,24H128.01866a96.00682,96.00682,0,0,1,96.01414,96V488a24.008,24.008,0,0,0,24.00353,24,28.54751,28.54751,0,0,0,10.7047-2.51562l98.747-49.40626c14.56074-7.28515,26.4746-26.56445,26.4746-42.84374V312.79688c72.58882-46.3125,128.01886-108.40626,128.01886-211.09376C512.07522,76.55273,512.07522,51.40234,505.16405,19.29688ZM384.05637,168a40,40,0,1,1,40.00589-40A40.02,40.02,0,0,1,384.05637,168ZM35.68474,352.06641C9.82742,377.91992-2.94985,442.59375.57606,511.41016c69.11565,3.55859,133.61147-9.35157,159.36527-35.10547,40.28913-40.2793,42.8774-93.98633,6.31147-130.54883C129.68687,309.19727,75.97,311.78516,35.68474,352.06641Zm81.63312,84.03125c-8.58525,8.584-30.08256,12.88672-53.11915,11.69922-1.174-22.93555,3.08444-44.49219,11.70289-53.10938,13.42776-13.42578,31.33079-14.28906,43.51813-2.10352C131.60707,404.77148,130.74562,422.67188,117.31786,436.09766Z",
        blastIc="M505.12019,19.09375c-1.18945-5.53125-6.65819-11-12.207-12.1875C460.716,0,435.507,0,410.40747,0,307.17523,0,245.26909,55.20312,199.05238,128H94.83772c-16.34763.01562-35.55658,11.875-42.88664,26.48438L2.51562,253.29688A28.4,28.4,0,0,0,0,264a24.00867,24.00867,0,0,0,24.00582,24H127.81618l-22.47457,22.46875c-11.36521,11.36133-12.99607,32.25781,0,45.25L156.24582,406.625c11.15623,11.1875,32.15619,13.15625,45.27726,0l22.47457-22.46875V488a24.00867,24.00867,0,0,0,24.00581,24,28.55934,28.55934,0,0,0,10.707-2.51562l98.72834-49.39063c14.62888-7.29687,26.50776-26.5,26.50776-42.85937V312.79688c72.59753-46.3125,128.03493-108.40626,128.03493-211.09376C512.07526,76.5,512.07526,51.29688,505.12019,19.09375ZM384.04033,168A40,40,0,1,1,424.05,128,40.02322,40.02322,0,0,1,384.04033,168Z";
    if(stat){
        console.log("Blasting..."); path.setAttribute("title","STOP!");
        ico.setAttribute("d",stopIc); chatList.style.overflowY="hidden";
    } else{
        console.log("Stoped."); path.setAttribute("title","BLAST!");
        ico.setAttribute("d",blastIc); chatList.style.overflowY="auto";
    }
    doing=stat;
}
/* Getting "BLAST" Status */
var getStatus= () => {return doing}
/* Getting code from Selected Chatroom */
var getCode = () => {return getElm("div" + qACR + " img").src}
/* Getting Pinned Status from Selected Chatroom*/
var getPinned = () => {return !!getElm("div" + qACR + " span[data-icon='pinned']")}
/* Formating Date Data */
var dateFormat = e => {
    let d = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"],
        m = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
    return d[e.getDay()]+", "+e.getDate()+" "+m[e.getMonth()]+" "+e.getFullYear()
}
/* Back to the First Chatroom */
function back(a){
    var elm = getElm("#pane-side img[src='" + a + "']");
    eventFire(elm, "mousedown");
}
/* Make Report Matrix Data */
var dataA = array => {
    let size=array.length,str="";
    if(size==1){return " ("+array[0]+")"}
    if(size==2){return " ("+array[0]+" & "+array[1]+")"}
    for(var i=0; i<size ; i++){
        if(i==0){str+=" ("}
        if(i<size-1){str+=array[i]+", "}
        if(i==size-1){str+=array[i]+")"}
    }
    return str
}
/* Show the Report Data */
function finish(sukses, gagal, error, a_gagal, a_error, auto){
    let msg="";
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
function eventFire(node, eventType){
    let clickEvent = document.createEvent('MouseEvents');
    clickEvent.initMouseEvent(eventType, true, false);
    node.dispatchEvent(clickEvent);
}
/* Dispatch Function */
function dispatch(input, message){
    var evt = new InputEvent("input", {bubbles : true, composer : true});
    input.innerHTML = message; input.dispatchEvent(evt);
}
/*=====================================
   Listener Function Handler
=====================================*/
/* Open Super BC Menu */
function superBC(e){
	let obj = this.value, men = getById('c_bc');
	if(obj.includes("BC")){
        e.currentTarget.style.height='110px'; men.style.display='block';
	} else {
        e.currentTarget.style.height=null; men.style.display='none';
	}
}
/* Preview the Selected Image File*/
function prevImg(evt){
	let output=getById('o_img'), res=null, del=getById('del'),
        btn=this.getAttributeNode('data-value'), MByte=Math.pow(1024, 2),maxSize=4*MByte;
    if(btn==null){
        res = evt.target.files[0];
        if(res.size<=maxSize){_image = res;} else{
            alert("Ukuran gambar tidak boleh lebih dari 4MB");
            this.value='';_image=res=null;
        }
    } else{
        getById(btn.value).value='';
    }
    if(res!=null){
        output.src = URL.createObjectURL(res); del.style.display='block';
    } else{
        output.removeAttribute("src"); del.style.display='none';
    }
}
/* Listeners for Checkbox */
function checking(evt){
    let form = getById(this.value), attr = this.getAttributeNode('capt-id');
    if(attr!=null){getById(attr.value).disabled=!this.checked}
    form.disabled=!this.checked;
}
/* Toggle Apps Listener */
function toggleApp(evt){
    let butn = evt.currentTarget,id = butn.getAttribute("value"),
        acdBody = getById(id);
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
	let menuName=this.value,tabcontent = getElmAll(".tabcontent"),tablinks = getElmAll(".tablinks");
	tabcontent.forEach(item => {item.style.display = 'none'});
	tablinks.forEach(item => {item.className = item.className.replace(' active', '')});
	getById(menuName).style.display = 'block';
	evt.currentTarget.className += ' active';
}
/* Show Change Log */
function changeLog(){
    let cLog="WhatsApp Blast "+version+" (Last Update: "+upDate+").";
    cLog+="\n▫ Menambah fitur Trial 7 Hari."
        +"\n▫ Memperbaiki fitur pengiriman gambar."
        +"\n▫ Perbaikan minor."
        +"\n▫ Refactoring Code."
        +"\n\nVersion v3.4.2d - v3.4.2e (27 Mar 2020)."
        +"\n▫ Memperbaiki tampilan yang tools hilang."
        +"\n▫ Memperbaiki DOM yang error."
        + "\n\nVersion v3.4.2c (27 Mar 2020)."
        +"\n▫ Memperbaiki pengiriman link yg kacau."
        +"\n\nVersion v3.4.2b (18 Mar 2020)."
        +"\n▫ Memperbaiki Pengiriman Gambar Otomatis."
        +"\n\nVersion v3.4.2 (31 Jan 2020)."
        +"\n▫ Memperbaiki Pengiriman Gambar Otomatis."
        +"\n▫ Refactoring Script Aplikasi.";
    alert(cLog);
}
/* Core Send Media Function*/
window.sendImage = (chatid, imgFile, caption, done = undefined) => {
    return window.Store.Chat.find(chatid).then(chat => {
        var mc = new window.Store.MediaCollection(chat);
        mc.processAttachments([{file : imgFile}, 1], chat, 1).then(() => {
            var media = mc.models[0];
            media.sendToChat(chat, {caption : caption});
            if (done !== undefined) done(true);
        });
    });
};
/*=====================================
   For Credits Purpose
=====================================*/
/* Get User Phone Number */
var getUphone = () => {
    return !user ? (getElm("header img").src.split("&")[2].match(/\d+/).join('')) : setPhone(user.phone)
}
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
var isPremium = () => {return isSubsribe(user)}
/* Is Subscibed */
var isSubsribe = u => {
    if(u){
        let tDy=new Date(),e=new Date(u.reg);
        e.setMonth(e.getMonth()+u.mon);
        if(tDy.getTime()<=e.getTime()){getAlrt(e);return true}
    }
    return false
}
/* Is Trial */
var isTrial = () => {
    var d, tDy=new Date();
    if(!getVal('wabTrial')){
        if(confirm("Apakah Anda mau mencoba 7 hari Trial?")){
            setVal('wabTrial', new Date()); return true
        }
    } else{
        d = new Date(getVal('wabTrial')); d.setDate(d.getDate()+7);
        if(tDy.getTime()<=d.getTime()){return true}
    };
    return false
};
/* Inform to the Subscriber */
function getAlrt(e){
    let str=dateFormat(e);
    if(alrt){
        alert("Halo kak "+setName(user.name,1)+"!"
              +"\nSelamat menggunakan fitur Pengguna Premium."
              +"\nMasa aktif Kakak berakhir hari "+str+" ya...");
        alrt=false
    }
}
/* Trial Alert */
function trialAlrt(){
    var e=new Date(getVal('wabTrial'));
    if(alrt){
        e.setDate(e.getDate() + 7);
        alert("Saat ini Anda sedang menggunakan versi Trial.\n"
            +"Masa Trial Anda berakhir hari "+dateFormat(e)+" ya...");
        alrt=false
    }
}
/* Get Premium User */
function getPremium(e){
    if (e.currentTarget.checked){
        e.currentTarget.checked = isPremium() ? true : (
            isTrial() ? (trialAlrt(), true) : (
                alert("Maaf, fitur ini hanya untuk Pengguna Premium."
                  + "\nTampaknya Anda belum terdaftar sebagai Pengguna Premium,"
                  + "\nAtau masa berlangganan Anda mungkin telah habis."
                  + "\n\nInformasi lebih lanjut, silahkan hubungi saya."
                ), alrt = true, false)
        );
    }
}
