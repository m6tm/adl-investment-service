const p=io(),c=document.getElementById("winwheelCanvas"),e=c.getContext("2d"),a=200,h=80,s=50,t=c.width/2,l=c.height/2;let d=0;const P=[{id:"p1",label:"Prix 1",color:"gold"},{id:"p2",label:"Prix 2",color:"orange"},{id:"p3",label:"Prix 3",color:"darkgoldenrod"},{id:"p4",label:"Prix 4",color:"purple"},{id:"p5",label:"Prix 5",color:"gold"}],C=[{id:"j1",label:"$100.000",bgPriceColor:"#e344d1",borderColor:"#fff",textColor:"#e344d1",bgTextColor:"#fff",borderSize:2},{id:"j2",label:"$250.000",bgPriceColor:"#5588c5",borderColor:"#fff",textColor:"#5588c5",bgTextColor:"#fff",borderSize:2},{id:"j3",label:"$500.000",bgPriceColor:"#7340c9",borderColor:"#fff",textColor:"#7340c9",bgTextColor:"#fff",borderSize:2},{id:"j4",label:"$1.000.000",bgPriceColor:"#e75d6b",borderColor:"#fff",textColor:"#e75d6b",bgTextColor:"#fff",borderSize:2}],v="#dddddd",x=new Image;x.src="http://place-hold.it/64";function I(){e.clearRect(0,0,c.width,c.height);const r=2*Math.PI/C.length;C.forEach((o,i)=>{const n=r/P.length;P.forEach((T,w)=>{const b=d+r*i+n*w,y=b+n;e.beginPath(),e.moveTo(t,l),e.arc(t,l,a,b,y),e.lineTo(t,l),e.fillStyle=o.bgPriceColor,e.fill(),e.strokeStyle=o.borderColor,e.lineWidth=o.borderSize,e.stroke(),e.closePath();const g=b+n/2;e.save(),e.translate(t+Math.cos(g)*(a*.5),l+Math.sin(g)*(a*.5)),e.rotate(g),e.fillStyle=o.bgTextColor,e.fillText(T.label,0,0),e.restore()})}),C.forEach((o,i)=>{e.beginPath(),e.moveTo(t,l),e.arc(t,l,h,r*i+d,r*(i+1)+d),e.fillStyle=v,e.fill(),e.strokeStyle=o.borderColor,e.lineWidth=o.borderSize,e.stroke(),e.closePath();const n=r*i+d+r/2;e.save(),e.translate(t+Math.cos(n)*(h*.7),l+Math.sin(n)*(h*.7)),e.rotate(n+Math.PI/2),e.fillStyle=o.textColor,e.font="bold 12px "+e.font.split(" ").slice(-1)[0],e.fillText(o.label,-e.measureText(o.label).width/2,0),e.restore()}),e.save(),e.beginPath(),e.arc(t,l,s,0,2*Math.PI),e.clip(),e.drawImage(x,t-s,l-s,s*2,s*2),e.restore(),e.beginPath(),e.arc(t,l,s,0,2*Math.PI),e.strokeStyle="black",e.lineWidth=2,e.stroke(),e.save(),e.translate(t,l-a-20),e.beginPath(),e.moveTo(0,0),e.lineTo(-10,-20),e.lineTo(10,-20),e.closePath(),e.fillStyle="#e75d6b",e.fill(),e.strokeStyle="white",e.lineWidth=2,e.stroke(),e.restore()}x.onload=I;const u=document.getElementById("countdown-number"),m=document.querySelector(".countdown-progress");let f=60;function S(){if(f>0){u.textContent=f;const o=283*(1-(60-f)/60);m.style.strokeDashoffset=o,f--,setTimeout(S,1e3)}else u.textContent="0",m.style.strokeDashoffset=0}p.on("connect",()=>{console.log("Connected to server"),S()});
