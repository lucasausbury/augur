augur = {};

treemap = new function() {
	this.defaults = {
		margin:{top:24, right:0, bottom:0, left:0},
		rootname:"TOP",
		format:",f",
		title:"",
		width:960,
		height:500
	}

	this.init = function(id, data, opts) {
		this.root = null;
		this.id = id;
		this.$elem = $('#'+id);
		this.opts = $.extend(true, {}, this.defaults, opts);
		this.formatNumber = d3.format(this.opts.format);
		this.rname = this.opts.rootname;
		this.margin = this.opts.margin;
		this.theight = 36 + 16;
		this.opts.width = (this.opts.width=='auto' ? 
			this.$elem[0].offsetWidth - 25 : this.defaults.width);

		this.$elem.width(this.opts.width).height(this.opts.height);
		this.width = this.opts.width - this.margin.left - this.margin.right;
		this.height = this.opts.height - this.margin.top - this.margin.bottom - this.theight;
		this.transitioning = false;
		this.color = d3.scale.category20c();
		this.x = d3.scale.linear().domain([0, this.width]).range([0, this.width]);
		this.y = d3.scale.linear().domain([0, this.height]).range([0, this.height]);
		this.treemap = d3.layout.treemap().children(function(d, depth){
			return depth ? null : d._children;
		}).sort(function(a, b){
			return a.value - b.value;
		}).ratio(this.height / this.width * .5 * (1 + Math.sqrt(5))).round(false);
		this.svg = d3.select('#'+this.id).append("svg")
			.attr("width", this.width + this.margin.left + this.margin.right)
			.attr("height", this.height + this.margin.bottom + this.margin.top)
			.style("margin-left", -this.margin.left+"px")
			.style("margin-right", -this.margin.right+"px").append("g")
			.attr("transform", "translate("+this.margin.left+","+this.margin.top+")")
			.style("shape-rendering", "crispEdges");
		this.grandparent = this.svg.append("g").attr("class", "grandparent");

		this.grandparent.append("rect").attr("y", -this.margin.top)
			.attr("width", this.width).attr("height", this.margin.top);
		this.grandparent.append("text").attr("x", 6).attr("y", 6 - this.margin.top)
			.attr("dy", ".75em");

		if( this.opts.title )
			this.$elem.prepend('<p class="title">'+this.opts.title+'</p>');
		if( data instanceof Array )
			this.root = {name:this.rname, children:data};
		else this.root = data;
		
		this.root.x = 0;
		this.root.y = 0;
		this.root.dx = this.width;
		this.root.dy = this.height;
		this.depth = 0;

		this.accumulate(this.root);
		this.layout(this.root);
		this.display(this.root);
	}

	this.accumulate = function(d) {
		var _self = this;

		if( d.children && d.children.length > 0 ) {
			d._children = d.children.slice(0);
			d.value = d.children.reduce(function(p, v) {
				if( isNaN(p) ) 
					return 0;
				else
					return p + _self.accumulate(v);
			}, 0);
		}

		return d.books;
	}

	this.layout = function(d) {
		var _self = this;

		if( d._children ) {
			_self.treemap.nodes({_children: d._children});
			d._children.forEach(function(c) {
				c.x = d.x + c.x * d.dx;
				c.y = d.y + c.y * d.dy;
				c.dx *= d.dx;
				c.dy *= d.dy;
				c.parent = d;

				_self.layout(c);
			});
		}
	}

	this.display = function(d) {
		var _self = this;
		var g1, g, children, t;

		this.grandparent.datum(d.parent).on("click", drill_up)
			.select("text").text(name(d));
		g1 = this.svg.insert("g", ".grandparent").datum(d)
			.attr("class", "depth");
		g = g1.selectAll("g").data(d._children).enter().append("g");
		g.filter(function(d){
			return d._children;
		}).classed("children", true).on("click", drill_down);
		children = g.selectAll(".child").data(function(d){
			return d._children || [d];
		}).enter().append("g");
		children.append("rect").attr("class", "child").call(rect)
			.append("title").text(function(d){
				var p = d.parent;
				return p.name + " (" + _self.formatNumber(p.value) + ")";
			});
		children.append("text").attr("class", "ctext").text(function(d){
			return d.name;
		}).call(text2);
		g.append("rect").attr("class", "parent").call(rect);
		t = g.append("text").attr("class", "ptext").attr("dy", ".75em");
		t.append("tspan").text(function(d){
			return d.name;
		});
		/*t.append("tspan").attr("dy", "1.0em").text(function(d){
			return _self.formatNumber(d.value);
		}).call(text);*/
		g.selectAll("rect").style("fill", function(d){
			return _self.color(d.name);
		});

		function build_cat(c) {
			var o = '';

			if( c.parent )
				o += build_cat( c.parent )
			else if( c.name.length > 0 )
				o += "," + c.name;

			return o;
		}
		function drill_up(d) {
			var cat = build_cat(d).substr(1).split(",");

			get_feed(cat, function(out){
				print_stats(out.books.slice(0));
				out.books.unshift(['Price','Sales rank']);
				augur.data = google.visualization.arrayToDataTable(out.books);
				augur.chart.draw(augur.data, augur.options);
				transition(d);
			})
			transition(d);
		}
		function drill_down(d, e) {
			var cat = build_cat(d).substr(1) + "," + d.name;
			cat = cat.split(",");

			if( !d.children )
				get_feed(cat, function(out){
					print_stats(out.books.slice(0));
					d.children = out.categories;
					out.books.unshift(['Price','Sales rank']);
					augur.data = google.visualization.arrayToDataTable(out.books);
					augur.chart.draw(augur.data, augur.options);
					_self.accumulate(d);
					_self.layout(d);
					transition(d);
				})
			else
				transition(d);
		}
		function transition(d) {
			if( _self.transitioning || !d ) return;
			_self.transitioning = true;

			var g2 = _self.display(d);
			var t1 = g1.transition().duration(750);
			var t2 = g2.transition().duration(750);

			_self.x.domain([d.x, d.x + d.dx]);
			_self.y.domain([d.y, d.y + d.dy]);

			_self.svg.style("shape-rendering", null);
			_self.svg.selectAll(".depth").sort(function(a, b){
				return a.depth - b.depth;
			});

			g2.selectAll("text").style("fill-opacity", 0);
			t1.selectAll(".ptext").call(text).style("fill-opacity", 0);
			t1.selectAll(".ctext").call(text2).style("fill-opacity", 0);
			t2.selectAll(".ptext").call(text).style("fill-opacity", 1);
			t2.selectAll(".ctext").call(text2).style("fill-opacity", 1);
			t1.selectAll("rect").call(rect);
			t2.selectAll("rect").call(rect);

			t1.remove().each("end", function() {
				_self.svg.style("shape-rendering", "crispEdges");
				_self.transitioning = false;
			});
		}

		function text(text) {
			text.selectAll("tspan").attr("x", function(d){
				return _self.x(d.x) + 6;
			});
			text.attr("x", function(d){
				return _self.x(d.x) + 6;
			}).attr("y", function(d){
				return _self.y(d.y) + 6;
			}).style("opacity", function(d){
				return this.getComputedTextLength() < _self.x(d.x + d.dx) ? 1 : 0;
			});
		}

		function text2(text) {
			text.attr("x", function(d){
				return _self.x(d.x + d.dx) - this.getComputedTextLength() - 6;
			}).attr("y", function(d){
				return _self.y(d.y + d.dy) - 6;
			}).style("opacity", function(d){
				return this.getComputedTextLength() < _self.x(d.x + d.dx) - _self.x(d.x) ? 
					0 : 0;
			})
		}

		function rect(rect) {
			rect.attr("x", function(d){
				return _self.x(d.x);
			}).attr("y", function(d){
				return _self.y(d.y);
			}).attr("width", function(d){
				return _self.x(d.x + d.dx) - _self.x(d.x);
			}).attr("height", function(d){
				return _self.y(d.y + d.dy) - _self.y(d.y);
			})
		}

		function name(d) {
			return d.parent ? 
				name(d.parent) + " > " + d.name + " (" + _self.formatNumber(d.value) + ")"
				: d.name + " (" + _self.formatNumber(d.value) + ")";

		}

		return g;
	}
}

/*box_whisker = new function() {
	this.init = function(id, data) {
		this.margin = {top:10,right:50,bottom:20,left:50};
		this.width = 120 - this.margin.left - this.margin.right;
		this.height = 500 - this.margin.top - this.margin.bottom;
		this.min = Infinity;
		this.max = -Infinity;
		this.chart = d3.box().whiskers(this.iqr(1.5)).width(this.width).height(this.height);

		//this.data[] = data.map(function(v,i) { return v[0]; });
		//this.data[] = data.map(function(v,i) { return v[1]; });

		var prices = [];
		var ranks = [];
		for( var i in data ) {
			//prices.push(data[i][0]);
			ranks.push(data[i][1]);

			//if( data[i][1] > this.max ) this.max = data[i][1];
			if( data[i][1] < this.min ) this.min = data[i][1];
		}
		this.data = ranks;
		console.log(this.data);

		this.chart.domain([this.min, this.max]);
		this.svg = d3.select("#"+id).selectAll("svg").data(data).enter().append("svg")
			.attr("class", "box")
			.attr("width", this.width + this.margin.left + this.margin.right)
			.attr("height", this.height + this.margin.bottom + this.margin.top)
			.append("g")
			.attr("transform", "translate("+this.margin.left+","+this.margin.top+")")
			.call(this.chart);
		/*d3.csv("morley.csv", function(e, csv) {
			if( e ) throw error;
			var data = [];

			csv.forEach(function(x) {
				var e = Math.floor(x.Expt - 1),
					r = Math.floor(x.Run - 1),
					s = Math.floor(x.Speed),
					d = data[e];

				if( !d ) d = data[e] = [s];
				else d.push(s);

				if( s > _self.max ) _self.max = s;
				if( s < _self.min ) _self.min = s;
			});
			console.log(data);

			_self.chart.domain([_self.min, _self.max]);
			_self.svg = d3.select("#"+id).selectAll("svg").data(data).enter().append("svg")
				.attr("class", "box")
				.attr("width", _self.width + _self.margin.left + _self.margin.right)
				.attr("height", _self.height + _self.margin.bottom + _self.margin.top)
				.append("g")
				.attr("transform", "translate("+_self.margin.left+","+_self.margin.top+")")
				.call(_self.chart);
		})*//*
	}
	this.iqr = function(k) {
		return function(d, i) {
			var q1 = d.quartiles[0],
				q3 = d.quartiles[2],
				iqr = (q3 - q1) * k,
				i = -1,
				j = d.length;

			while( d[++i] < q1 - iqr );
			while( d[--j] > q3 + iqr);
			return [i, j];
		}
	}
}

scatter = new function() {
	this.init = function(id, data) {
		var scatter = d3.select('#'+id);
		var margin = {top:50, right:50, bottom:50, left: 50};
		var width = 500 - margin.left - margin.right;
		var height = 500 - margin.top - margin.right;
		var colorScale = d3.scale.category20c();
		var xScale = d3.scale.linear().domain([
			d3.min([0, d3.min(data, function(d){
				return d[0];
			})]), d3.max[0, d3.max(data, function(d){
				return d[0];
			})]]).range([0,width]);
		var yScale = d3.scale.linear().domain([
			d3.min([0, d3.min(data, function(d){
				return d[1];
			})]), d3.max[0, d3.max(data, function(d){
				return d[1];
			})]]).range([height,0]);
		var svg = scatter.append("svg").attr("height", height + margin.top + margin.bottom)
			.attr("width", width + margin.left + margin.right).append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		var xAxis = d3.svg.axis().scale(xScale).ticks(5).orient('bottom'); // edits
		var yAxis = d3.svg.axis().scale(yScale).ticks(5).orient('left'); // edits
	}
}*/

d3.json("/data/categories.json", function(e, d) {
	if( !e )
		treemap.init('treemap', d, {name:"Books", children:d, width:"auto"});
});
get_feed(['Books'], function(out) {
	print_stats(out.books.slice(0));
	out.books.unshift(['Price', 'Sales rank']);
	google.charts.load('current', {'packages':['corechart']});
	google.charts.setOnLoadCallback(drawChart);

	function drawChart() {
		augur.data = google.visualization.arrayToDataTable(out.books);
		augur.options = {
			hAxis: {title: 'Price', minValue: 0, format:'currency', logScale:true},
			vAxis: {title: 'Sales rank', minValue: 0, direction:-1, format:'long', logScale:true},
			legend: 'none',
			dataOpacity:.1
		};
		augur.chart = new google.visualization.ScatterChart(document.getElementById('scatter'));
		augur.chart.draw(augur.data, augur.options);

		google.visualization.events.addListener(augur.chart, 'select', book_details); 
	}
})

function book_details() {
	var selectedItem = augur.chart.getSelection()[0];
	if (selectedItem) {
		var value = augur.data.getValue(selectedItem.row, selectedItem.column);
		
		$.ajax({
			url:'/book/', data:{categories:augur.cats,salesRank:value},
			type:'post', cache:true,
			error: function(error, e) {
				alert(error.responseText);
			}, success: function(out) {
				$('#book_modal .modal-content').html(out);
				$('#book_modal').modal('show');
			}
		});
	}
}
function print_stats(data) {
	var $e = $('#stats');
	var $p = $('<p class="lead" />');
	var prices = data.map(function(v,i) { return v[0]; });
	var p_sum = prices.reduce(function(p, c){ return p+c; });
	var ranks = data.map(function(v,i) { return v[1]; });
	var r_sum = ranks.reduce(function(p, c){ return p+c; });

	$e.html('');
	$p.append('Average price: $' + (prices.length/p_sum).toFixed(2) + '<br />');
	$p.append('Median price: $' + median(prices).toFixed(2) + '<br />');
	$p.append('Most successful price: $' + prices[array_min(ranks)].toFixed(2) + '<br />');
	$p.append('Least successful price: $' + prices[array_max(ranks)].toFixed(2) + '<br />');
	$p.append('Median sales rank: ' + median(ranks).toFixed().replace(/(\d)(?=(\d{3})+(,|$))/g, '$1,') + '<br />');
	$e.append($p);
}
function array_max(arr) {
	var max = arr[0];
	var i = 0;

	for( var j = 1; j < arr.length; j++)
		if( arr[j] > max ) {
			i = j;
			max = arr[j];
		}

	return i;
}
function array_min(arr) {
	var min = arr[0];
	var i = 0;

	for( var j = 1; j < arr.length; j++)
		if( arr[j] < min && arr[j] > 0 ) {
			i = j;
			min = arr[j];
		}

	return i;
}
function median(arr){
	arr.sort(function(a,b){
		return a-b;
	});

	if( arr.length ===0 ) return 0

	var i = Math.floor( arr.length / 2);

	if( arr.length % 2 ) return arr[i];
	else return ( arr[i - 1] + arr[i]) / 2.0;
}
function get_feed(categories, callback) {
	augur.cats = categories;
	if( typeof categories === 'undefined' ) categories = [];
	if( typeof callback === 'undefined' ) callback = function(){};
	var data = {};
	data.categories = categories;

	$.ajax({
		url:'/feed/', data:data,
		type:'post', cache:true,
		error: function(error, e) {
			alert(error.responseText);
		}, success: function(out) {
			callback(out);
		}
	});
}
function isAction( action ) {
	if( typeof window[action] === 'function' )
		return true;
	else return false;
}
$(document).ready(function() {
	$(document).trigger('hashchange');
});
$('#log').on('click', function(e) {
	if( $(this).is(':checked') ) {
		augur.options.hAxis.logScale = true;
		augur.options.vAxis.logScale = true;
		augur.options.dataOpacity = .1;
	} else {
		augur.options.hAxis.logScale = false;
		augur.options.vAxis.logScale = false;
		augur.options.dataOpacity = .05;
	}

	augur.chart.draw(augur.data, augur.options);
})
$(document).on('hashchange', function(e) {
	var a = window.location.hash.substring(1);

	if( isAction( a ) )
		window[a]( $(this), e );
});
$(document).on('click', 'a[href^="#"]', function(e) {
	var a = $(this).attr("href").substring(1);
	if( isAction( a ) ) {
		e.preventDefault();
		window[a]( $(this), e );
	}
});