!function(a,b,c,d,e,f,g,h,i){function j(a){var b,c=a.length,e=this,f=0,g=e.i=e.j=0,h=e.S=[];for(c||(a=[c++]);d>f;)h[f]=f++;for(f=0;d>f;f++)h[f]=h[g=r&g+a[f%c]+(b=h[f])],h[g]=b;(e.g=function(a){for(var b,c=0,f=e.i,g=e.j,h=e.S;a--;)b=h[f=r&f+1],c=c*d+h[r&(h[f]=h[g=r&g+b])+(h[g]=b)];return e.i=f,e.j=g,c})(d)}function k(a,b){var c,d=[],e=typeof a;if(b&&"object"==e)for(c in a)try{d.push(k(a[c],b-1))}catch(f){}return d.length?d:"string"==e?a:a+"\0"}function l(a,b){for(var c,d=a+"",e=0;e<d.length;)b[r&e]=r&(c^=19*b[r&e])+d.charCodeAt(e++);return n(b)}function m(c){try{return a.crypto.getRandomValues(c=new Uint8Array(d)),n(c)}catch(e){return[+new Date,a,(c=a.navigator)&&c.plugins,a.screen,n(b)]}}function n(a){return String.fromCharCode.apply(0,a)}var o=c.pow(d,e),p=c.pow(2,f),q=2*p,r=d-1,s=c["seed"+i]=function(a,f,g){var h=[];f=1==f?{entropy:!0}:f||{};var r=l(k(f.entropy?[a,n(b)]:null==a?m():a,3),h),s=new j(h);return l(n(s.S),b),(f.pass||g||function(a,b,d){return d?(c[i]=a,b):a})(function(){for(var a=s.g(e),b=o,c=0;p>a;)a=(a+c)*d,b*=d,c=s.g(1);for(;a>=q;)a/=2,b/=2,c>>>=1;return(a+c)/b},r,"global"in f?f.global:this==c)};l(c[i](),b),g&&g.exports?g.exports=s:h&&h.amd&&h(function(){return s})}(this,[],Math,256,6,52,"object"==typeof module&&module,"function"==typeof define&&define,"random");