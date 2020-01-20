/*=====================================
   Initial Function
=====================================*/
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
};}
/* Set All Component Listeners */
function initListener(){
	let i, tabs = document.getElementsByClassName("tablinks"), trigs = document.getElementsByClassName("trig"),
        wbHead = document.getElementById("toggleApp"),checkL = document.querySelectorAll("input[type='checkbox']"),
        clk=[blast,prevImg,changeLog],idS=["blast","del","changeLog"];
    wbHead.addEventListener("click",toggleApp);
    for(i=1 ; i < checkL.length ; i++){checkL[i].addEventListener("click", getPremium)};
    for(i=0 ; i < tabs.length ; i++){tabs[i].addEventListener("click", openMenu)};
	for(i=0 ; i < trigs.length ; i++){trigs[i].addEventListener("click", checking)};
    for(i=0 ; i < clk.length ; i++){document.getElementById(idS[i]).addEventListener("click", clk[i])};
	document.getElementById("getImg").addEventListener("change", prevImg);
	document.getElementById("message").addEventListener("input", superBC);
	tabs[0].click();wbHead.click();
}
/*=====================================
   Core Function
=====================================*/
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
    if(obj.includes("BC")){if(c_bc){t_bp=s_bp;}else{t_bp=200;}}
    if(bp!=null){
        if(bp.length<=3){bp_=t_bp-_bp;msg = msg.replace(/P_BP/g,_bp+" BP").replace(/K_BP/g,bp_+" BP");}
        else{msg = msg.replace(/L_DAY/g,getLastDay(bp));}
    }
    if(date!=null){msg = msg.replace(/L_DAY/g,getLastDay(date));}
    var en_msg = encodeURIComponent(msg).replace(/'/g,"%27").replace(/"/g,"%22");
    return abs_link+setPhone(phone)+'&text='+en_msg;
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
/*=====================================
   Utilities Function
=====================================*/
/* Title Case Text Transform */
function titleCase(str) {
    var _str = str.toLowerCase();
    return _str.charAt(0).toUpperCase()+_str.slice(1);
}
/* Break When Name is Empty */
var break_f = function (line){
    var column=line.split(/,|;/);
    if(column[0]!=''){
        return true;
    }
    return false;
}
/* Is Premium? */
var isPremium = function(){
    var usr=JSON.parse(GM_getResourceText('usr')).users;
    for(let i=0;i<usr.length;i++){
        if(usr[i].phone==getUphone()){
            setUser(usr[i]);
            return isSubsribe(user);
        }
    }
    return false
}
/* Is Subscibed */
var isSubsribe = function(u){
    let today=new Date(),e=new Date(u.reg);
    e.setMonth(e.getMonth()+u.mon);
    if(today.getTime()<=e.getTime()){return true}
    return false
}
/* Get Premium User */
function getPremium(e){
    if(e.currentTarget.checked){
        console.log("activating: "+isPremium());
        if(!isPremium()){
            alert('Maaf, fitur hanya untuk Pengguna Premium.'
		  +'\nTampaknya Anda belum terdaftar, Atau masa berlangganan Anda sudah habis.'
		  +'\n\nInformasi lebih lanjut, hubungi saya.');
            e.currentTarget.checked=false;
        }
    }
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
/* Set Cookie Function */
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
/* Get Cookie Function */
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
/*=====================================
   Listener Function Handler
=====================================*/
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
/* Toggle Apps Listener */
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
