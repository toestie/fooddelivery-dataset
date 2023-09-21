// source: https://www.codehim.com/gallery/javascript-image-grid-different-sizes-and-width/
// by Asif Mughal
(function(){
  var cache = {};

  this.tmpl = function tmpl(str, data){
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    var fn = !/\W/.test(str) ?
      cache[str] = cache[str] ||
        tmpl(document.getElementById(str).innerHTML) :

      // Generate a reusable function that will serve as a template
      // generator (and which will be cached).
      new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +

        // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +

        // Convert the template into pure JavaScript
        str
          .replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'")
      + "');}return p.join('');");

    // Provide some basic currying to the user
    return data ? fn( data ) : fn;
  };
})();

// random image generator for testing
function randomImg () {
  let count = 10 + Math.ceil(Math.random() * 10)
  let imgs = []
  for (let i = count; i > 0; i--) {
    let w = 250 + 10 * Math.ceil(Math.random() * 50)
    let h = 200 + 10 * Math.ceil(Math.random() * 50)
    imgs.push({
      src: 'https://unsplash.it/' + w + '/' + h,
      w: w,
      h: h
    })
  }
  return imgs
}

// how many images can we fit in a column
function countImgsInCol (idx, imgs) {
  let gallery = document.querySelector('#gallery')
  let gw = gallery.clientWidth
  let maxEachCol = 4
  let minH = 60
  let count = 0
  for (let i = Math.min(maxEachCol, imgs.length - idx); i > 0; i--) {
    let w = 0
    for (let j = idx; j < idx + i; j++) {
      let minW = minH * imgs[j].w / imgs[j].h
      if (minW >= gw) {
        return 1
      } else {
	      w += minW
      }
    }
    if (w < gw) {
      count = i
      break
    }
  }
  return count
}

// organize image list into columns lists
function getCols (imgs) {
  let cols = []
  let rest = imgs.length
  let count = 1;
  for (let i = 0; i < imgs.length; i = i + count) {
    count = countImgsInCol(i, imgs)
    console.log(i, count)
    cols.push({start: i, end: i + count - 1, total: count})
  }
  return cols
}

// place images in html
function organizeImg (imgs) {
  let gallery = document.querySelector('#gallery')
  let galleryW = gallery.clientWidth
  let margin = 10
  let cols = getCols(imgs)
  for (let i = 0; i < cols.length; i++) {
    let col = cols[i]
    let colH = 0
    let scale = 0
    for (let j = col.start; j <= col.end; j++) {
      scale += imgs[j].w / imgs[j].h
    }
    colH = (galleryW - margin * (col.total + 1)) / scale
    console.log(colH)
    for (let k = col.start; k <= col.end; k++) {
      let img = imgs[k]
      img.hh = colH
      img.ww = colH * img.w / img.h
     }
  }
  gallery.innerHTML = tmpl('tmpl', { imgs })
}

function populateImg() {
    let imgs = randomImg()
    organizeImg(imgs)
    window.addEventListener('resize', () => {
        organizeImg(imgs)
    })
}

// copy email
function copyemail() {
    var element = document.getElementById("myToast");
    var copynotif = new bootstrap.Toast(element);

    navigator.clipboard.writeText("nathan.christopher.wong@gmail.com");
    copynotif.show();
}