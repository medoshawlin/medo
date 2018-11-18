var text=document.getElementById("text");
var cons=document.getElementById("console");
var tree;
function run(){
  log("===Restart===","restart");
  tree=parse(text.value);
  runNode(tree);
}

function insert(text,at,data){
  return text.substr(0,at)+data+text.substr(at);
}

function log(msg,cls){
  var temp=document.getElementById("temp");
  if(temp!=null){temp.parentNode.removeChild(temp);}
  cons.innerHTML+='<div class="consText '+cls+'"><span class="starter">>>> </span>'+msg+'</div>';
  cons.innerHTML+='<div class="consText" id="temp"><span class="starter">>>> </span></div>';
}

function clear(){
  while(cons.firstChild) cons.removeChild(cons.firstChild);
  cons.innerHTML+='<div class="consText" id="temp"><span class="starter">>>> </span></div>';
}

function input(msg){
  var ans=prompt(msg);
  log(msg+': '+ans,"input");
  return ans;
}

function start(){
  text.style.height=(window.innerHeight-95)+"px";
  cons.innerHTML+='<div class="consText" id="temp"><span class="starter">>>> </span></div>';
}

document.addEventListener("keydown",function(e){
  var cmd=(navigator.platform.match("Mac")?e.metaKey:e.ctrlKey);
  if(cmd){
    if(e.keyCode==83){e.preventDefault();}
    if(e.keyCode==69){e.preventDefault();run();}
    if(e.keyCode==66){e.preventDefault();clear();}
  }
},false);

text.onkeydown=function(e){
  if(e.keyCode==9||e.which==9){
    e.preventDefault();
    var s=this.selectionStart;
    this.value=this.value.substring(0,this.selectionStart)+"\t"+this.value.substring(this.selectionEnd);
    this.selectionEnd=s+1;
  }
  if(e.keyCode==13||e.keyCode==13){
    e.preventDefault();
    var select=text.selectionStart;
    var lines=text.value.substr(0,select).split("\n");
    var last=lines[lines.length-1];
    text.value=insert(text.value,select,'\n');
    select++;
    for(var i=0;i<last.length;i++){
      if(last[i]=='\t'){text.value=insert(text.value,select,'\t');select++;}
      else break;
    }
    text.selectionStart=select;
    text.selectionEnd=select;
  }
}

document.onload=start();
