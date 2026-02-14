!function(){
  // utils
  function docReady(fn){
    if(document.readyState==="complete"||document.readyState==="interactive"){setTimeout(fn,1)}else{document.addEventListener("DOMContentLoaded",fn)}
  }
  function windowLoaded(fn){
    if(document.readyState==="complete"){setTimeout(fn,1)}else{window.addEventListener("load",fn)}
  }
  function onWindowResize(fn){
    windowLoaded(function(){window.addEventListener("resize",fn);setTimeout(fn,1)})
  }

  // anchorizeHeadings
  function anchorForId(id){
    var a=document.createElement("a");
    a.className="header-link";a.title="Link to this section";a.href="#"+id;
    a.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8"><path d="M5.88.03c-.18.01-.36.03-.53.09-.27.1-.53.25-.75.47a.5.5 0 1 0 .69.69c.11-.11.24-.17.38-.22.35-.12.78-.07 1.06.22.39.39.39 1.04 0 1.44l-1.5 1.5c-.44.44-.8.48-1.06.47-.26-.01-.41-.13-.41-.13a.5.5 0 1 0-.5.88s.34.22.84.25c.5.03 1.2-.16 1.81-.78l1.5-1.5c.78-.78.78-2.04 0-2.81-.28-.28-.61-.45-.97-.53-.18-.04-.38-.04-.56-.03zm-2 2.31c-.5-.02-1.19.15-1.78.75l-1.5 1.5c-.78.78-.78 2.04 0 2.81.56.56 1.36.72 2.06.47.27-.1.53-.25.75-.47a.5.5 0 1 0-.69-.69c-.11.11-.24.17-.38.22-.35.12-.78.07-1.06-.22-.39-.39-.39-1.04 0-1.44l1.5-1.5c.4-.4.75-.45 1.03-.44.28.01.47.09.47.09a.5.5 0 1 0 .44-.88s-.34-.2-.84-.22z"/></svg>';
    return a
  }
  docReady(function(){
    var articles=document.querySelectorAll("article#main");
    if(articles.length!==1)return;
    var headers=articles[0].querySelectorAll("h2, h3, h4");
    Array.prototype.forEach.call(headers,function(el){el.appendChild(anchorForId(el.id))})
  });

  // floatingFootnotes
  var ARTICLE_SEL="article#main",FN_SEL="div.footnotes[role=doc-endnotes]",FN_MIN_W=1260;
  function computeOffset(el,target){return target.getBoundingClientRect().top-el.offsetParent.getBoundingClientRect().top}
  function setOffsets(fns){
    var bottom=0;
    Array.prototype.forEach.call(fns,function(fn){
      var link=document.querySelector("a.footnote-ref[href='#"+fn.id+"']");
      var alignTo=link.closest("p,li")||link;
      var offset=computeOffset(fn,alignTo);
      if(offset<bottom)offset=bottom;
      bottom=offset+fn.offsetHeight+parseInt(window.getComputedStyle(fn).marginBottom)+parseInt(window.getComputedStyle(fn).marginTop);
      fn.style.top=offset+"px";fn.style.position="absolute"
    })
  }
  function clearOffsets(fns){Array.prototype.forEach.call(fns,function(fn){fn.style.top=null;fn.style.position=null})}
  var resizeObs=new ResizeObserver(function(){updateFloat(true)});
  function updateFloat(shouldFloat){
    var sec=document.querySelector(FN_SEL),fns=sec.querySelectorAll("li[id^='fn:']");
    if(shouldFloat){sec.classList.add("floating-footnotes");setOffsets(fns);resizeObs.observe(document.querySelector(ARTICLE_SEL))}
    else{resizeObs.disconnect();clearOffsets(fns);sec.classList.remove("floating-footnotes")}
  }
  var bigEnough=false;
  function checkSize(){
    var now=window.innerWidth>=FN_MIN_W;
    if(now!==bigEnough){updateFloat(now);bigEnough=now}
  }
  docReady(function(){
    var sec=document.querySelector(FN_SEL),art=document.querySelector(ARTICLE_SEL);
    if(sec&&art&&!art.classList.contains("no-floating-footnotes")){onWindowResize(checkSize)}
  });

  // dropdown menu auto-close on scroll
  docReady(function(){
    var menu=document.getElementById("right-links-details");
    menu.addEventListener("toggle",function(){
      if(menu.open){document.addEventListener("scroll",function(){menu.open=false},{once:true})}
    })
  });

  // theme-color meta tag helpers
  function updateThemeColorMeta(theme){
    var metaLight=document.querySelector('meta[name="theme-color"][data-tag=light]');
    var metaDark=document.querySelector('meta[name="theme-color"][data-tag=dark]');
    if(theme==="dark"){
      metaLight.setAttribute("content","#09090B");
      metaDark.setAttribute("content","#09090B");
    }else{
      metaLight.setAttribute("content","#18181B");
      metaDark.setAttribute("content","#09090B");
    }
  }

  // theme toggle
  docReady(function(){
    var btn=document.getElementById("theme-toggle");
    btn.addEventListener("click",function(){
      var current=document.documentElement.getAttribute("data-theme");
      var next=current==="dark"?"light":"dark";
      document.documentElement.setAttribute("data-theme",next);
      document.documentElement.style.colorScheme=next==="dark"?"dark":"";
      localStorage.setItem("theme",next);
      updateThemeColorMeta(next);
    });
    // follow OS changes when user hasn't set an explicit preference
    window.matchMedia("(prefers-color-scheme:dark)").addEventListener("change",function(e){
      if(!localStorage.getItem("theme")){
        var t=e.matches?"dark":"light";
        document.documentElement.setAttribute("data-theme",t);
        document.documentElement.style.colorScheme=t==="dark"?"dark":"";
        updateThemeColorMeta(t);
      }
    });
    // set initial meta theme-color
    updateThemeColorMeta(document.documentElement.getAttribute("data-theme"));
  });
}();
