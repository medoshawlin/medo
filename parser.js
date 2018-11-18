var vars={};

class Node{
  constructor(value){
    this.value=value!=null?strip(value):"";
    this.nodes=[];
  }
}

class bNode{
  constructor(value){
    this.value=value;
    this.l=null;
    this.r=null;
  }
}

function exclude(index,exp){
  var quo=false;var dquo=false;
  for(var i=0;i<index;i++){
    switch(exp[i]){
      case '\'':quo=!quo;break;
      case '\"':dquo=!dquo;break;
    }
  }
  return !quo&&!dquo;
}

function runNode(node){
  runCmd(node.value);
  if(node.value==""){for(var i=0;i<node.nodes.length;i++) runNode(node.nodes[i]);return}
  if(node.value.substr(0,5)=="WHILE"){
    while(evaluate(node.value.substr(5))){
      for(var i=0;i<node.nodes.length;i++){
        runNode(node.nodes[i]);
      }
    }
    return;
  }
}

function runCmd(cmd){
  if(cmd=="") return;
  if(cmd.substr(0,5)=="PRINT"){
    var output=String(evaluate(cmd.substr(5))).split('\n');
    for(var i=0;i<output.length;i++) log(output[i],"normal");
    return;
  }
  if(cmd.substr(0,5)=="INPUT"){vars[strip(cmd.substr(5))]=input(strip(cmd.substr(5)));return}
  for(var i=0;i<cmd.length-2;i++){
    if(cmd.substr(i,2)==":="&&exclude(i,cmd)){
      vars[strip(cmd.substr(0,i))]=evaluate(cmd.substr(i+2));
    }
  }
}

function raise(err){
  alert(err);
}

function evaluate(exp){
  exp=strip(exp);
  var keys=Object.keys(vars);
  for(var i=0;i<keys.length;i++){
    for(var j=0;j<exp.length-keys[i].length+1;j++){
      if(exp.substr(j,keys[i].length)==keys[i]&&exclude(j,exp)){
        var newStr=typeof(vars[keys[i]])=="string"?'\"'+vars[keys[i]]+'\"':vars[keys[i]];
        exp=exp.substr(0,j)+newStr+exp.substr(j+String(keys[i]).length);
      }
    }
  }
  return eval(exp);
}

function parse(text){
  var tree=new Node("");
  var list=text.split('\n');
  for(var i=0;i<list.length;i++){
    list[i]=strip(list[i]);
    if(list[i].substr(0,2)=="IF"){

    }
    if(list[i].substr(0,5)=="WHILE"){
      var exp="";
      for(var j=5;j<list[i].length-1;j++){
        if(list[i].substr(j,2)=="DO"){exp=strip(list[i].substr(5,j-5));}
      }
      if(exp==""){
        raise("Invalid While: 'DO' not found");
        return
      }
      var node=new Node("WHILE"+exp);
      var sub=list[i+1];
      i+=2;
      var depth=1;
      while(depth>0){
        if(i>=list.length){raise("Invalid While: EOF Reached");return;}
        if(strip(list[i])=="ENDWHILE") depth--;
        if(strip(list[i]).substr(0,5)=="WHILE") depth++;
        sub+='\n'+list[i];
        i++;
      }
      i--;
      node.nodes.push(parse(sub));
      tree.nodes.push(node);
      continue;
    }
    tree.nodes.push(new Node(list[i]));
  }
  return tree;
}

function strip(text){
  if(text==null) return null;
  while(text.length>0&&" \n\t".includes(text[0])) text=text.substr(1);
  while(text.length>0&&" \n\t".includes(text[text.length-1])) text=text.slice(0,-1);
  return text;
}
