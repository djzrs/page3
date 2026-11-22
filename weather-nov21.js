(() => {
  const temperatures = [5.2,4.9,4.9,4.3,3.9,3.6,3.1,2.7,4.5,6.9,9,10.8,12.3,13.3,14.3,14,13.1,10.6,8.7,7.7,7.1,6.7,6.1,5.7];
  const section = document.createElement('section');
  section.innerHTML = '<div class="heading"><div><p class="eyebrow">HOURLY TEMPERATURE</p><h2>11 月 21 日天气实况</h2></div><p>阜阳 · 截至 23:00</p></div><p>整点气温最低 2.7°C，最高 14.3°C；23 时气温 5.7°C。昼夜温差大，注意傍晚保温。</p><div style="overflow-x:auto"><svg id="weather-chart-nov21" viewBox="0 0 800 260" role="img" aria-label="11月21日0时至23时整点气温变化曲线" style="width:100%;min-width:550px;height:auto"></svg></div><p class="note">根据 Open-Meteo 阜阳整点气温数据绘制。气温为整点观测值，并非全天极值。</p>';
  const anchor = document.querySelector('#archive');
  if (anchor) anchor.before(section);
  const svg=section.querySelector('svg'), ns='http://www.w3.org/2000/svg';
  function add(name, attrs, text){const node=document.createElementNS(ns,name);for(const [k,v] of Object.entries(attrs))node.setAttribute(k,v);if(text!==undefined)node.textContent=text;svg.appendChild(node)}
  for(let t=0;t<=14;t+=2){let y=205-t*14;add('line',{x1:40,y1:y,x2:770,y2:y,stroke:'#dce5dd'});add('text',{x:8,y:y+4,fill:'#64776a','font-size':12},t+'°')}
  const pts=temperatures.map((v,i)=>[45+i*31.5,205-v*14]);
  add('polyline',{points:pts.map(p=>p.join(',')).join(' '),fill:'none',stroke:'#e4874d','stroke-width':3});
  pts.forEach(([x,y],i)=>{add('circle',{cx:x,cy:y,r:3,fill:'#e4874d'});if(i%3===0||i===23){add('text',{x,y:232,'text-anchor':'middle',fill:'#64776a','font-size':12},String(i).padStart(2,'0')+':00')}});
})();