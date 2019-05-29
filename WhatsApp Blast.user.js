// ==UserScript==
// @name         WhatsApp Blast
// @description  Tools yang digunakan untuk mengirim pesan WhatsApp Secara Otomatis.
// @copyright    2018, rzlnhd (https://openuserjs.org/users/rzlnhd)
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @icon         https://i.imgur.com/H5XHdYV.png
// @homepageURL  https://openuserjs.org/scripts/rzlnhd/WhatsApp_Blast
// @supportURL   https://openuserjs.org/scripts/rzlnhd/WhatsApp_Blast/issues
// @version      3.0.3
// @date         2019-05-29
// @author       Rizal Nurhidayat
// @match        https://web.whatsapp.com/
// @grant        none
// @updateURL    https://openuserjs.org/meta/rzlnhd/WhatsApp_Blast.meta.js
// @downloadURL  https://openuserjs.org/install/rzlnhd/WhatsApp_Blast.user.js
// ==/UserScript==

// ==OpenUserJS==
// @author       rzlnhd
// ==/OpenUserJS==

/* Global Variables */
var createFromData_id = 0,prepareRawMedia_id = 0,store_id = 0,send_media,Store = {},_image,version = "v3.0.3",doing=false;
/* First Function */
var timer = setInterval(general,1000);
function general(){
    if(document.getElementsByClassName("_1uESL")[0] != null){
        var item2 = document.getElementsByClassName("_3Jvyf")[0];
        var panel = document.getElementsByClassName("_1uESL")[0];
        var e = item2.cloneNode(true);
        initComponents(e);panel.insertBefore(e, panel.childNodes[1]);
		initListener();//initMedia();
		console.log("WhatsApp Blast "+version+" - Blast Your Follow Up NOW!");
		clearInterval(timer);
	} else{
		console.log("WhatsApp Blast "+version+" - Waiting for WhatsApp to load...");
    }
}
/*=====================================
   Initial Function
=====================================*/
/* Load UI Component */
function initComponents(e){
	e.style.zIndex = 0;e.style['background-color'] = '#fed859';e.style['justify-content'] = 'flex-start';e.style.display = 'block';e.style.height = 'auto';
	e.innerHTML ="<style>textarea{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;width: 100%}"
		+"textarea#capt{border-color:rgb(0,0,0,0.1);background: rgb(0,0,0,0.05);color:black}textarea#capt::-webkit-input-placeholder{font-size:90%;color:white}"
		+"textarea#capt:disabled{background: rgb(0,0,0,0.15)}textarea#capt:disabled::-webkit-input-placeholder{color:#eee}"
		+"input.checks{width:1.5em;height:1.5em;position:relative;float:left;display:block;top:1px;margin-right:2px}"
		+"#c_bc,#i_mg{margin-top:2px;background:rgb(0, 0, 0, 0.05);padding:5px}#c_bc{display:none;animation:fadeEffect .3s}"
		+"#tabs{display:block;width:100%;height:30px}.tabcontent,.immg img{padding:5px}"
		+"#tabs button{background-color:inherit;float:left;cursor:pointer;padding:6px;transition:0.3s;width:50%;font-weight:600;border-radius:10px 10px 0 0;}"
		+"#tabs button:hover,#tabs button.active,.tabcontent{background: rgb(255, 255, 255, 0.35);}.tabcontent{display:none;animation:fadeEffect .5s}"
		+".immg{border: 2px solid rgba(0,0,0,0.1);max-height:151px;min-height:77px;}.immg img{max-height:141px;max-width:95%;width:auto;margin:auto;display:block}"
		+"@keyframes fadeEffect{from {opacity:0} to {opacity:1}}</style>";
	e.innerHTML +="<div id='tabs'><button class='tablinks' value='_MSG'>Pesan</button><button class='tablinks' value='_IMG'>Gambar</button></div>"
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
		+"<div id='spam' data-icon='send' class='img icon icon-send' title='BLAST!' style='float:right;cursor:pointer;'>"
		+"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'><path opacity='.4' d='M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z'></path></svg></div></div>";
}
/* Set All Component Listeners */
function initListener(){
	var i, tabs = document.getElementsByClassName("tablinks"), trigs = document.getElementsByClassName("trig");
	for(i=0 ; i < tabs.length ; i++){tabs[i].addEventListener("click", openMenu)};
	for(i=0 ; i < trigs.length ; i++){trigs[i].addEventListener("click", checking)};
	document.getElementById("spam").addEventListener("click", spam);
	document.getElementById("getImg").addEventListener("change", prevImg);
	document.getElementById("del").addEventListener("click", prevImg);
	document.getElementById("message").addEventListener("input", superBC);
	tabs[0].click();
}
/* Prepare to Send Media */
function initMedia(){
	function getAllModules() {
		return new Promise((resolve) => {
			const id = _.uniqueId("fakeModule_");
			window["webpackJsonp"](
				[], {
					[id]: function(module, exports, __webpack_require__) {
						resolve(__webpack_require__.c);
					}
				}, [id]
			);
		});
	}
	var modules = getAllModules()._value;
	for (var key in modules){
		if (modules[key].exports) {
			if (modules[key].exports.createFromData) {
				createFromData_id = modules[key].id.replace(/"/g, '"');
			}
			if (modules[key].exports.prepRawMedia) {
				prepareRawMedia_id = modules[key].id.replace(/"/g, '"');
			}
			if (modules[key].exports.default) {
				if (modules[key].exports.default.Wap) {
					store_id = modules[key].id.replace(/"/g, '"');
				}
			}
		}
	}
}
/*=====================================
   Main Function
=====================================*/
/* Main Function */
function spam(){
    var files = document.getElementById('getFile').files,
        obj = document.getElementById('message').value,
        input = document.getElementsByClassName("_3u328")[0],
        auto = document.getElementById("auto").checked,
        c_img = document.getElementById("s_mg").checked,
        capt = document.getElementById("capt").value,
        file = files[0],a_gagal=[],a_error=[],
        code=getCode(),index=getIndex(code),
        sukses=0, gagal=0, error=0,pinned,
        reader = new FileReader();
    if(doing){alert('Tools Sedang Berjalan, Silahkan Tunggu!');return;}
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
    document.getElementsByClassName("_1c8mz _1RYPC")[0].style.overflowY="hidden";doing=true;
    reader.onload = function (progressEvent) {
        var lines =this.result.split(/\r\n|\r|\n/);
        var btn = document.getElementsByClassName("_3M-N-");
        var l = 0, b=lines.length;
        function execute(){
            index=getIndex(code);
            if(lines[l]!=''){
                var column=lines[l].split(/,|;/);
                input = document.getElementsByClassName("_3u328")[0];
                dispatch(input, ((l+1)+"). "+mesej(column[0],column[1],column[2],column[3])));
                var ph = setPhone(column[1]);
                btn = document.getElementsByClassName("_3M-N-");
                btn[0].click();
                if(auto){
                    console.log("Link ke-"+(l+1)+": [TULIS]");
                    setTimeout(() => {
                        var chat=document.getElementsByClassName("FTBzM"),num=chat.length;
                        chat[num-1].getElementsByTagName('a')[0].click();
                        console.log("Link ke-"+l+": [EKSEKUSI]");
                    }, 1000);
                    setTimeout(() => {
                        btn = document.getElementsByClassName("_3M-N-");
                        var err=document.getElementsByClassName("_2eK7W _3PQ7V");
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
                            if(btn[0]!=null){
                                sukses++;
                                btn[0].click();
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
        execute();
    };
    reader.readAsText(file);
}
/* Main Send Image Function */
function sendImg(num, file, capt){
    window.Store = _requireById(store_id).default;
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(){
        window.send_media(num, reader.result, capt, null, null);
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
        date = dateString.split('/');
    date.forEach(function(item,index){date[index]=parseInt(item);});
    var _date = new Date(date[2], date[1]-1, date[0]);
    _date.setDate(_date.getDate() + 30);
    return d[_date.getDay()]+", "+_date.getDate()+" "+m[_date.getMonth()]+" "+_date.getFullYear();
}
/*=====================================
   Utilities Function
=====================================*/
/* Getting code from Selected Chatroom */
function getCode(){
    var obj = document.getElementsByClassName("X7YrQ");
    for (var l = 0; l < obj.length; l++){
        if(obj[l].getElementsByClassName('_3mMX1')[0]!=null){
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
        if(document.getElementsByClassName("X7YrQ")[i].innerHTML.includes(code)){
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
    return document.getElementsByClassName("X7YrQ")[index].innerHTML.includes("pinned");
}
/* Back to the First Chatroom */
function back(id){
    eventFire(document.getElementsByClassName("X7YrQ")[id],"mousedown");
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
    document.getElementsByClassName("_1c8mz _1RYPC")[0].style.overflowY="auto";doing=false;
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
		men = document.getElementById('c_bc');
	if(obj.includes("BC")){
		men.style.display='block';
	} else {
		men.style.display='none';
	}
}
/* Preview the Selected Image File*/
function prevImg(evt){
	var output = document.getElementById('o_img'),
        res=null,del = document.getElementById('del'),
        btn=this.getAttributeNode('data-value');
    if(btn==null){
        res = evt.target.files[0];
        _image = res;
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
    if(this.value=="getImg"){
        var msg="Mohon Maaf, Untuk sementara fitur Kirim Gambar TIDAK TERSEDIA."
            +"\nTerimakasih.";
        alert(msg);
        this.checked=false;
    } else{
        var form = document.getElementById(this.value),
            attr = this.getAttributeNode('capt-id');
        if(attr!=null){document.getElementById(attr.value).disabled=!this.checked}
        form.disabled=!this.checked;
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
/* Getting Require by ID */
function _requireById(id) {
	return webpackJsonp([], null, [id]);
}
/* Getting Fix Binary */
function fixBinary(bin) {
	var length = bin.length;
	var buf = new ArrayBuffer(length);
	var arr = new Uint8Array(buf);
	for (var i = 0; i < length; i++) {
		arr[i] = bin.charCodeAt(i);
	}
	return buf;
}
/* Core Send Media Function*/
window.send_media = function(num, base_64, caption, msg_id, content_type) {
	var file = "";
	var createFromDataClass = _requireById(createFromData_id)["default"];
	var prepareRawMediaClass = _requireById(prepareRawMedia_id).prepRawMedia;
	window.Store.Chat.find(num+"@c.us").then((chat) => {
		chat.markComposing();
		var img_b64 = base_64;
		var base64 = img_b64.split(',')[1];
		var type = img_b64.split(',')[0];
		type = type.split(';')[0];
		type = type.split(':')[1];
		var binary = fixBinary(atob(base64));
		var blob = new Blob([binary], {
			type: type
		});
		var random_name = Math.random().toString(36).substr(2, 5);
		file = new File([blob], random_name, {
			type: type,
			lastModified: Date.now()
		});
		var temp = createFromDataClass.createFromData(file, file.type);
		var rawMedia = prepareRawMediaClass(temp, {});
		var target = _.filter(window.Store.Msg.models, (msg) => {
			return msg.id.id === msg_id;
		})[0];
		var textPortion = {
			caption: caption,
			mentionedJidList: [],
			quotedMsg: target
		};
		rawMedia.sendToChat(chat, textPortion);
	});
}
