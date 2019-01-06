(function(e,i){
  if(typeof define === 'function' && define.amd){
    define([], i)
  }else if(typeof exports === 'object'){
    module.exports = i()
  }else{
    e.slasho = i()
  }
}(this, function(){
  let s = {}
  s.download =(url, filename)=>{
    let r = new XMLHttpRequest()
    r.open('GET', url)
    r.onload = () => {
      let d = r.responseText
      let arr = d
      let datStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(arr));
      let downloadNode = document.createElement("a");
      downloadNode.setAttribute("href", datStr);
      downloadNode.setAttribute("download", filename + ".json");
      downloadNode.click();
      downloadNode.remove();
    }
    r.send()
  }
  s.reducer = (state, update)=>{
    return {...state, ...update}
  }
  s.pixels = (url, a, b, func)=>{
    let i = new Image(a,b);
    i.src = url;
    let canva = document.createElement("canvas");
    canva.height = i.height;
    canva.width = i.width;
    let ctx = canva.getContext("2d");
    let red=[];
    let green=[];
    let blue=[];
    let alpha=[];
    let all=[];
    i.onload = function(){
      ctx.drawImage(i, 0, 0, i.width, i.height);
      // console.log("url",canva.toDataURL());
      let d = ctx.getImageData(0,0,canva.width,canva.height).data;
      for(let i=0; i<d.length; i+=4){
        red.push(d[i]);
        green.push(d[i+1]);
        blue.push(d[i+2]);
        alpha.push(d[i+3]);
      }
      for(let i=0; i<d.length; i++){
        all.push(d[i])
      }
      // console.log({"red":red, "green": green, "blue": blue, "alpha": alpha});
      func({"all":all, "red":red, "green": green, "blue": blue, "alpha": alpha})
    }
    // document.body.append(canva);
  }
  s.select = (el) =>{
    return new e(el)
  }
  s.selectAll = (el) => {
    return new e(el, true)
  }
  s.ajax = async (url, options) => {
    if(!options){
      let r = await fetch(url)
      let d = await r.text()
      return d
    }else{
      let r = await fetch(url, options)
      let d = await r.text()
      return d
    }
  }

  function e(r, d){
    if(d){
      let m = document.querySelectorAll(r)
      let a = []
      m.forEach(el=>{
        a.push(new e(el))
      })
      return a
    }else{
      if(r instanceof HTMLElement){
        this.e = r
      }else{
        this.e = document.querySelector(r)
      }
    }
    this.html = (v) => {
      if(v){
        this.e.innerHTML = v
      }else{
        return this.e.innerHTML
      }
    }
    this.value = (v) => {
      if(v){
        if(this.e.type == 'text' || this.e.type == 'textarea'){
          this.e.value = v
        }else{
          this.e.innerText = v
        }
      }else{
        if(this.e.type == 'text' || this.e.type == 'textarea'){
          return this.e.value
        }else{
          return this.e.innerText
        }
      }
    }

    this.hide = () => {
      this.e.style.display = 'none'
    }
    this.show = () => {
      if(this.e.style.display == 'none'){
        this.e.style.display = ''
      }else{
        this.e.style.display = 'block'
      }
    }
    this.css = (c, b) => {
      if(b){
        this.e.style[c] = b
      }else{
        if(c instanceof Object){
          let keys = Object.keys(c)
          keys.forEach(key=>{
            let style = c[key]
            this.e.style[key] = style
          })
        }else{
          return new Error('Expects an Object of style')
        }
      }
    }


  }
  return s
}))
