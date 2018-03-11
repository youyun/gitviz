function drawParticipation() {
  var dataset = participationObj;
  // d3.select("svg").remove();

  var svg = d3.select('svg'),
      margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom,
      g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x = d3.scaleBand()
      .rangeRound([0, width])
      .paddingInner(0.05)
      .align(0.1);

  var y = d3.scaleLinear()
      .rangeRound([height, 0]);

  var z = d3.scaleOrdinal()
      .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    
  console.log("dataset", dataset);

  var keys = ["owner", "others"];

  dataset.sort(function(a, b) { return b.total - a.total; });
  x.domain(dataset.map(function(d) { return d.week; }));
  y.domain([0, d3.max(dataset, function(d) { return d.total; })]).nice();
  z.domain(keys);

  g.append("g")
    .selectAll("g")
    .data(d3.stack().keys(keys)(dataset))
    .enter().append("g")
      .attr("fill", function(d) { return z(d.key); })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d) { return x(d.data.week); })
      .attr("y", function(d) { return y(d[1]); })
      .attr("height", function(d) { return y(d[0]) - y(d[1]); })
      .attr("width", x.bandwidth());

  g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(null, "s"))
    .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text("Population");

  var legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys.slice().reverse())
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function(d) { return d; });
}

function drawHourlyCommits() {
  var dataset = hourlyCommitsObj;
  d3.select("svg").remove();

  var colors=["#2c7bb6", "#00a6ca","#00ccbc","#90eb9d","#ffff8c","#f9d057","#f29e2e","#e76818","#d7191c","#8B0000"];
  var itemSize = 40,
      cellSize = itemSize - 1,
      margin = {top: 120, right: 20, bottom: 20, left: 110};
      
  var width = 1300 - margin.right - margin.left,
      height = 800 - margin.top - margin.bottom;


  d3.csv('ProjectdataQ2.csv', function ( test ) {
    console.log("csv", dataset);
    var data = dataset.map(function( item ) {
        var newItem = {};
        newItem.hour = item.hour;
        newItem.days = item.days;
        newItem.commits = +item.commits;

        return newItem;
    })

    var x_elements = d3.set(data.map(function( item ) { return item.hour; } )).values(),
        y_elements = d3.set(data.map(function( item ) { return item.days; } )).values();

    var xScale = d3.scale.ordinal()
        .domain(x_elements)
        .rangeBands([0, x_elements.length * itemSize]);
         
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .tickFormat(function (d) {
            return d;
        })
        .orient("top");

    var yScale = d3.scale.ordinal()
        .domain(y_elements)
        .rangeBands([0, y_elements.length * itemSize]);

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .tickFormat(function (d) {
            return d;
        })
        .orient("left");

    var colorScale = d3.scale.threshold()
        .domain([30, 60,90,120,150,180,210,240,270])
        .range(colors);

    var svg = d3.select('#graph')
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var cells = svg.selectAll('rect')
        .data(data)
        .enter().append('g').append('rect')
         .attr("class", "rect")
         .attr('width', cellSize)
         .attr('height', cellSize)
		 .attr("class", "hour bordered")
         .attr('y', function(d) { return yScale(d.days); })
         .attr('x', function(d) { return xScale(d.hour); })
         .attr('fill', function(d) { return colorScale(d.commits); })
		 .append("title")
		 .text(function(d){
			return d.days +"-" + d.hour +"-commits" + " : " + d.commits;
		});
		 
    
  var legend = svg.selectAll(".legend")
      .data(["30","60","90","120","150","180","210","240","270","300"])
      .enter().append("g")
      .attr("class", "legend");
 
  legend.append("rect")
    .attr("x", function(d, i) { return 50* i; })
    .attr("y", 250+(cellSize*2))
    .attr("width", 50)
    .attr("height", cellSize)
    .style("fill", function(d, i) { return colors[i]; });
 
  legend.append("text")
    .attr("class", "mono")
    .text(function(d) { return d; })
    .attr("width", 50)
    .attr("x", function(d, i) { return 50 * i; })
	.attr("y", 220 + (cellSize*4));
	
	
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .selectAll('text')
        .attr('font-weight', 'normal');

    svg.append("g")
        .attr("class", "x axis")
        .call(xAxis)
        .selectAll('text')
        .attr('font-weight', 'normal')
        .style("text-anchor", "start")
        .attr("dx", ".8em")
        .attr("dy", ".5em")
        .attr("transform", function (d) {
            return "rotate(-65)";
        });
		
	svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -60)
      .attr("x",-150)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("days");   
	 
	 svg.append("text")             
      .attr("y", -80)
      .attr("x",300)
      .style("text-anchor", "middle")
      .text("hour");	
	  
	 svg.append("text")             
      .attr("y", 400)
      .attr("x",300)
      .style("text-anchor", "middle")
      .text("Number of Commits");
  });
}

function drawRepoLanguages() {
  var dataset = languagesObj;
  d3.select("svg").remove();
  (function(d3) {
    var width = 600;
    var height = 600;
    var radius = Math.min(width, height) / 2;

    var color = d3.scaleOrdinal(d3.schemeCategory20b);
    var donutWidth = 75;

    var svg = d3.select('#graph')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + (width / 2) +
        ',' + (height / 2) + ')');

		var arc = d3.arc().innerRadius(radius - donutWidth).outerRadius(radius);
		
		var pie = d3.pie()
      .value(function(d) { return d.count; })
      .sort(null);
		
		var tooltip = d3.select('#graph')  
      .append('div')  
      .attr('class', 'tooltip');  
		tooltip.append('div')  
		  .attr('class', 'language');  
		tooltip.append('div')  
		  .attr('class', 'count');  
		tooltip.append('div')  
		  .attr('class', 'percent');  
		
    console.log("dataset", dataset);
    dataset.forEach(function(d) {  
      d.count = +d.count;  
      d.enabled = true;
    });  
  
    var path = svg.selectAll('path')
      .data(pie(dataset))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', function(d, i) {
        return color(d.data.language);
      })
      .each(function(d) { this._current = d; });
    
    path.on('mouseover', function(d) {  
      var total = d3.sum(dataset.map(function(d) {  
        return (d.enabled) ? d.count : 0;
      }));  
    
      var percent = Math.round(1000 * d.data.count / total) / 10;  
      tooltip.select('.language').html(d.data.language);  
      tooltip.select('.count').html(d.data.count);  
      tooltip.select('.percent').html(percent + '%');  
      tooltip.style('display', 'block');  
    });  
    path.on('mouseout', function() {  
      tooltip.style('display', 'none');  
    });  
    path.on('mousemove', function(d) {  
      tooltip.style('top', (d3.event.layerY + 10) + 'px')  
        .style('left', (d3.event.layerX + 10) + 'px');  
    });  
    
    var legendRectSize = 18;
    var legendSpacing = 4;	
    var legend = svg.selectAll('.legend')
      .data(color.domain())
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', function(d, i) {
    var height = legendRectSize + legendSpacing;
    var offset = height * color.domain().length / 2;
    var horz = -2 * legendRectSize;
    var vert = i * height - offset;
      return 'translate(' + horz + ',' + vert + ')';
    });
    legend.append('rect')
      .attr('width', legendRectSize)
      .attr('height', legendRectSize)
      .style('fill', color)
      .style('stroke', color)
      .on('click', function(language) {
        var rect = d3.select(this);  
        var enabled = true;  
        var totalEnabled = d3.sum(dataset.map(function(d) {
          return (d.enabled) ? 1 : 0;  
        }));
        if (rect.attr('class') === 'disabled') {  
          rect.attr('class', '');  
        } else {  
          if (totalEnabled < 2) return;  
          rect.attr('class', 'disabled');  
          enabled = false;  
        }  
        pie.value(function(d) {  
        if (d.language === language) d.enabled = enabled;  
          return (d.enabled) ? d.count : 0;  
        });  
        path = path.data(pie(dataset));  
        path.transition()  
        .duration(750)  
        .attrTween('d', function(d) {  
          var interpolate = d3.interpolate(this._current, d);  
          this._current = interpolate(0);  
          return function(t) {  
            return arc(interpolate(t));  
          };  
        });  
      });	

    legend.append('text')
      .attr('x', legendRectSize + legendSpacing)
      .attr('y', legendRectSize - legendSpacing)
      .text(function(d) { return d; });  
  })(window.d3);
}
