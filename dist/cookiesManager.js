function i(){const t=$('[x-ordo-utils="cookieManagerButton"]'),a=$('[x-ordo-utils="cookieManagerClose"]'),c=$('[x-ordo-utils="cookieManagerBannerClose"]');t.on("click",o=>{o.stopPropagation(),$(t).css({display:"block",opacity:1,bottom:"0"}).animate({opacity:0,bottom:"-100%"},800)}),a.on("click",o=>{o.stopPropagation(),$(t).css({display:"block",opacity:0,bottom:"-100%"}).animate({opacity:1,bottom:"0"},400)}),c.on("click",o=>{o.stopPropagation(),$('[fs-cc="banner"]').css({display:"block",opacity:1,bottom:"0"}).animate({opacity:0,bottom:"-100%"},800),t.css({display:"block",opacity:0,bottom:"-100%"}).animate({opacity:1,bottom:"0"},400)})}i();
