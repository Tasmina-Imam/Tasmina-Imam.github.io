var yearEl = document.getElementById('year');
if(yearEl){ yearEl.textContent = new Date().getFullYear(); }

(function(){
  var toggle = document.getElementById('themeToggle');
  if(!toggle) return;

  function label(theme){
    return theme === 'light' ? 'Dark mode' : 'Light mode';
  }

  var current = document.documentElement.getAttribute('data-theme') || 'dark';
  toggle.textContent = label(current);

  toggle.addEventListener('click', function(){
    var now = document.documentElement.getAttribute('data-theme') || 'dark';
    var next = now === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    try{ localStorage.setItem('theme', next); }catch(e){}
    toggle.textContent = label(next);
    window.dispatchEvent(new CustomEvent('themechange', { detail: next }));
  });
})();

(function(){
  var canvas = document.getElementById('trace');
  if(!canvas) return;
  var ctx = canvas.getContext('2d');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var strokeColor = '#4CE7D0';
  var t = 0;

  function readAccent(){
    var v = getComputedStyle(document.documentElement).getPropertyValue('--accent');
    if(v && v.trim()) strokeColor = v.trim();
  }
  readAccent();

  function resize(){
    var rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr,0,0,dpr,0,0);
    renderFrame();
  }

  function renderFrame(){
    var w = canvas.getBoundingClientRect().width;
    var h = canvas.getBoundingClientRect().height;
    ctx.clearRect(0,0,w,h);
    var midY = h/2;
    ctx.beginPath();
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = strokeColor;
    for(var x=0; x<=w; x+=2){
      var phase = (x*0.045) + t;
      var y = midY
        + Math.sin(phase) * (h*0.22)
        + Math.sin(phase*3.1 + 1.2) * (h*0.05)
        + Math.sin(phase*0.37) * (h*0.06);
      if(x===0){ ctx.moveTo(x,y); } else { ctx.lineTo(x,y); }
    }
    ctx.stroke();
  }

  window.addEventListener('resize', resize);
  window.addEventListener('themechange', function(){
    readAccent();
    renderFrame();
  });
  resize();

  function loop(){
    t += 0.045;
    renderFrame();
    requestAnimationFrame(loop);
  }
  if(!reduceMotion){
    requestAnimationFrame(loop);
  }
})();
