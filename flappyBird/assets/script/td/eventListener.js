import global from "./_myG";

/**
 * 事件监听器
 * @param obj
 * @returns {*}
 * @constructor
 */
const EventListener=function(obj){
  let register={};
  obj.on=function(name,method){
      if(!register.hasOwnProperty(name)){
          register[name]=[];
      }
      register[name].push(method);
  };
  obj.fire=function(name){
      if(register.hasOwnProperty(name)){
          let handlerList=register[name];
          for(let i=0;i<handlerList.length;i++){
              let handler=handlerList[i];
              let args=[];
              for(let j=1;j<arguments.length;j++){
                  args.push(arguments[j]);
              }
              handler.apply(this,args);
          }
      }
  };
  obj.off=function(name,method){
      if(register.hasOwnProperty(name)){
          let handlerList=register[name];
          for(let i=0;i<handlerList.length;i++){
              if(handlerList[i]===method){
                  handlerList.splice(i,1);
              }
          }
      }
  };
  return obj;
};

export default  EventListener;