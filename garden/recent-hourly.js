(async () => {
  const section = document.createElement('section');
  section.className = 'journal-section';
  section.id = 'recent-hourly-weather';
  section.innerHTML = '<h2>近期逐小时天气</h2><p>阜阳 · 正在读取气温数据</p>';
  document.querySelector('#archive')?.before(section);
  try {
    const params = new URLSearchParams({latitude:'32.9',longitude:'115.817',hourly:'temperature_2m',past_days:'7',forecast_days:'1',timezone:'Asia/Shanghai'});
    const response = await fetch('https://api.open-meteo.com/v1/forecast?' + params, {signal:AbortSignal.timeout(15000)});
    if (!response.ok) throw new Error('weather unavailable');
    const data = await response.json();
    const parts = new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',hourCycle:'h23'}).formatToParts(new Date());
    const part = type => parts.find(p=>p.type===type).value;
    const today = `${part('year')}-${part('month')}-${part('day')}`;
    const cutoff = `${today}T${part('hour')}:00`;
    const days = new Map();
    data.hourly.time.forEach((time,i)=>{
      const value=data.hourly.temperature_2m[i],date=time.slice(0,10);
      if(date<'2026-11-22'||time>cutoff||!Number.isFinite(value)) return;
      if(!days.has(date))days.set(date,[]);
      days.get(date).push({time,value});
    });
    section.replaceChildren();
    const heading=document.createElement('h2');heading.textContent='近期逐小时天气';section.append(heading);
    const note=document.createElement('p');note.textContent='来源：Open-Meteo 模型气温，非气象站实测。仅显示已到时刻；当天数据尚不完整。每天打开页面自动更新。';section.append(note);
    for(const [date,rows] of [...days].sort((a,b)=>b[0].localeCompare(a[0]))) {
      const block=document.createElement('article');block.style='margin:24px 0;padding:16px;border:1px solid #dce5d9;border-radius:5px;background:#fffefa';
      const title=document.createElement('h3');title.textContent=`${date} 逐小时气温${date===today?'（今日）':''}`;block.append(title);
      const values=rows.map(r=>r.value),low=Math.min(...values),high=Math.max(...values);
      const text=document.createElement('p');text.textContent=`截至 ${rows.at(-1).time.slice(11)} · 已有整点最低 ${low}°C，最高 ${high}°C`;block.append(text);
      const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 600 220');svg.setAttribute('role','img');svg.setAttribute('aria-label',`${date}逐小时气温曲线`);svg.style='display:block;width:100%;height:auto';
      const add=(tag,attrs,text)=>{const e=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));if(text!==undefined)e.textContent=text;svg.append(e);return e;};
      const min=Math.floor(low)-1,max=Math.ceil(high)+1,x=i=>45+i*530/Math.max(rows.length-1,1),y=v=>175-(v-min)*145/(max-min);
      for(let i=0;i<=4;i++){const v=min+(max-min)*i/4;add('line',{x1:45,x2:575,y1:y(v),y2:y(v),stroke:'#dce5d9'});add('text',{x:2,y:y(v)+4,fill:'#526a5a','font-size':13},v.toFixed(1)+'°');}
      add('polyline',{points:rows.map((r,i)=>`${x(i)},${y(r.value)}`).join(' '),fill:'none',stroke:'#ce783e','stroke-width':3});
      rows.forEach((r,i)=>{const dot=add('circle',{cx:x(i),cy:y(r.value),r:3,fill:'#ce783e'});const tooltip=document.createElementNS(ns,'title');tooltip.textContent=`${r.time.slice(11)} ${r.value}°C`;dot.append(tooltip);if(i%6===0||i===rows.length-1)add('text',{x:x(i),y:204,'text-anchor':'middle','font-size':13,fill:'#526a5a'},r.time.slice(11));});
      block.append(svg);section.append(block);
    }
    if(!days.size)throw new Error('no hourly data');
  } catch {
    section.innerHTML='<h2>近期逐小时天气</h2><p>逐小时数据暂时无法加载，请稍后刷新。下方已归档的每日天气仍可查看。</p>';
  }
})();
