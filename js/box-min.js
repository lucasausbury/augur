!function(){function t(t){return[0,t.length-1]}function r(t){return[d3.quantile(t,.25),d3.quantile(t,.5),d3.quantile(t,.75)]}d3.box=function(){function n(t){t.each(function(t,r){t=t.map(u).sort(d3.ascending);var n=d3.select(this),y=t.length,d=t[0],f=t[y-1],h=t.quartiles=l(t),x=c&&c.call(this,t,r),p=x&&x.map(function(r){return t[r]}),g=x?d3.range(0,x[0]).concat(d3.range(x[1]+1,y)):d3.range(y),m=d3.scale.linear().domain(o&&o.call(this,t,r)||[d,f]).range([e,0]),v=this.__chart__||d3.scale.linear().domain([0,1/0]).range(m.range());this.__chart__=m;var _=n.selectAll("line.center").data(p?[p]:[]);_.enter().insert("line","rect").attr("class","center").attr("x1",a/2).attr("y1",function(t){return v(t[0])}).attr("x2",a/2).attr("y2",function(t){return v(t[1])}).style("opacity",1e-6).transition().duration(i).style("opacity",1).attr("y1",function(t){return m(t[0])}).attr("y2",function(t){return m(t[1])}),_.transition().duration(i).style("opacity",1).attr("y1",function(t){return m(t[0])}).attr("y2",function(t){return m(t[1])}),_.exit().transition().duration(i).style("opacity",1e-6).attr("y1",function(t){return m(t[0])}).attr("y2",function(t){return m(t[1])}).remove();var b=n.selectAll("rect.box").data([h]);b.enter().append("rect").attr("class","box").attr("x",0).attr("y",function(t){return v(t[2])}).attr("width",a).attr("height",function(t){return v(t[0])-v(t[2])}).transition().duration(i).attr("y",function(t){return m(t[2])}).attr("height",function(t){return m(t[0])-m(t[2])}),b.transition().duration(i).attr("y",function(t){return m(t[2])}).attr("height",function(t){return m(t[0])-m(t[2])});var k=n.selectAll("line.median").data([h[1]]);k.enter().append("line").attr("class","median").attr("x1",0).attr("y1",v).attr("x2",a).attr("y2",v).transition().duration(i).attr("y1",m).attr("y2",m),k.transition().duration(i).attr("y1",m).attr("y2",m);var w=n.selectAll("line.whisker").data(p||[]);w.enter().insert("line","circle, text").attr("class","whisker").attr("x1",0).attr("y1",v).attr("x2",a).attr("y2",v).style("opacity",1e-6).transition().duration(i).attr("y1",m).attr("y2",m).style("opacity",1),w.transition().duration(i).attr("y1",m).attr("y2",m).style("opacity",1),w.exit().transition().duration(i).attr("y1",m).attr("y2",m).style("opacity",1e-6).remove();var A=n.selectAll("circle.outlier").data(g,Number);A.enter().insert("circle","text").attr("class","outlier").attr("r",5).attr("cx",a/2).attr("cy",function(r){return v(t[r])}).style("opacity",1e-6).transition().duration(i).attr("cy",function(r){return m(t[r])}).style("opacity",1),A.transition().duration(i).attr("cy",function(r){return m(t[r])}).style("opacity",1),A.exit().transition().duration(i).attr("cy",function(r){return m(t[r])}).style("opacity",1e-6).remove();var q=s||m.tickFormat(8),F=n.selectAll("text.box").data(h);F.enter().append("text").attr("class","box").attr("dy",".3em").attr("dx",function(t,r){return 1&r?6:-6}).attr("x",function(t,r){return 1&r?a:0}).attr("y",v).attr("text-anchor",function(t,r){return 1&r?"start":"end"}).text(q).transition().duration(i).attr("y",m),F.transition().duration(i).text(q).attr("y",m);var N=n.selectAll("text.whisker").data(p||[]);N.enter().append("text").attr("class","whisker").attr("dy",".3em").attr("dx",6).attr("x",a).attr("y",v).text(q).style("opacity",1e-6).transition().duration(i).attr("y",m).style("opacity",1),N.transition().duration(i).text(q).attr("y",m).style("opacity",1),N.exit().transition().duration(i).attr("y",m).style("opacity",1e-6).remove()}),d3.timer.flush()}var a=1,e=1,i=0,o=null,u=Number,c=t,l=r,s=null;return n.width=function(t){return arguments.length?(a=t,n):a},n.height=function(t){return arguments.length?(e=t,n):e},n.tickFormat=function(t){return arguments.length?(s=t,n):s},n.duration=function(t){return arguments.length?(i=t,n):i},n.domain=function(t){return arguments.length?(o=null==t?t:d3.functor(t),n):o},n.value=function(t){return arguments.length?(u=t,n):u},n.whiskers=function(t){return arguments.length?(c=t,n):c},n.quartiles=function(t){return arguments.length?(l=t,n):l},n}}();