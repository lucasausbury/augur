augur = {};

/*d3.json("/data/categories.json", function(e, d) {
	if( !e )
		treemap.init('treemap', d, {title:"Budget",name:"World", children:d, width:"auto"});
});*/
get_feed(['Books'], function(out) {
	google.charts.load('current', {'packages':['corechart']});
	google.charts.setOnLoadCallback(drawChart);

	function drawChart() {
		/*var prices = ['Prices'].concat(out.books.map(function(v,i) { return v[0]; }));
		var ranks = ['Sales ranks'].concat(out.books.map(function(v,i) { return v[1]; }));
		var data = [prices, ranks];
		console.log(data);
		var box_data = google.visualization.arrayToDataTable([prices, ranks]);

		augur.candlestick = {
			options:{
				legend:'none'
			}
		};
		augur.candlestick.chart = new google.visualization.CandlestickChart(document.getElementById('candlestick'));
		augur.candlestick.chart.draw(box_data, augur.candlestick.options);
*/

		//Treemap
		$.ajax({
			url:'/data/categories.json',
			type:'get', cache:true,
			success: function(out) {
				d = flatten(out, null);
				console.log(d[12680]);

				augur.tree = {};
				augur.tree.data = new google.visualization.DataTable();
				augur.tree.data.addColumn('string', 'ID');
				augur.tree.data.addColumn('string', 'Parent');
				augur.tree.data.addColumn('string', 'Number Of Books');
				augur.tree.data.addRows(d);

				augur.tree.options = {
					highlightOnMouseOver: true,
					maxDepth: 1,
					maxPostDepth: 2,
					minHighlightColor: '#8c6bb1',
					midHighlightColor: '#9ebcda',
					maxHighlightColor: '#edf8fb',
					minColor: '#009688',
					midColor: '#f7f7f7',
					maxColor: '#ee8100',
					headerHeight: 15,
					showScale: true,
					height: 500,
					useWeightedAverageForAggregation: true
				};

				augur.tree.chart = new google.visualization.TreeMap(document.getElementById('treemap'));
				augur.tree.draw(augur.tree.data, augur.tree.options);
			}
		});

		// Scatter plot
		out.books.unshift(['Price', 'Sales rank']);
		var scatter_data = google.visualization.arrayToDataTable(out.books);

		augur.scatter = {
			options: {
				title: 'Price vs. Sales rank',
				hAxis: {title: 'Price', minValue: 0, format:'currency'},
				vAxis: {title: 'Sales rank', minValue: 0, direction:-1},
				legend: 'none'
			}
		};
		augur.scatter.chart = new google.visualization.ScatterChart(document.getElementById('scatter'));
		augur.scatter.chart.draw(scatter_data, augur.scatter.options);
	}
})

function flatten( json, parent ) {
	var out = [];
	
	if( json.name.length == 0 )
		return [];
	out.push([json.name, parent, json.books])
	for( var i in json.children ) {
		var c = flatten(json.children[i], json.name)

		for( var j in c )
			out.push(c[j]);
	}

	return out;
};

function get_feed(categories, callback) {
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