/* VDMA: работа без интернета. Библия берётся из сохранённой копии, страница — свежая, если есть связь. */
var CACHE="razbor-slova-v1";
self.addEventListener("install",function(){ self.skipWaiting(); });
self.addEventListener("activate",function(e){ e.waitUntil(self.clients.claim()); });
self.addEventListener("fetch",function(e){
  var u=new URL(e.request.url);
  if(e.request.method!=="GET"||u.origin!==self.location.origin) return;
  var bible=u.pathname.indexOf("/bible/")>=0;
  e.respondWith(caches.open(CACHE).then(function(c){
    if(bible) return c.match(e.request).then(function(r){
      return r||fetch(e.request).then(function(n){ if(n.ok) c.put(e.request,n.clone()); return n; });
    });
    return fetch(e.request).then(function(n){ if(n.ok) c.put(e.request,n.clone()); return n; })
      .catch(function(){ return c.match(e.request,{ignoreSearch:true}); });
  }));
});
