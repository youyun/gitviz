function drawParticipation() {
  var data = participationObj;
  d3.select("svg").remove();

  var margin = {top: 0, right: 200, bottom: 100, left: 100},
    width = 960 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

   var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

   var y = d3.scale.linear()
    .rangeRound([height, 0]);
	
   var color = d3.scale.category10();

   var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

   var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".2s"));

   var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

   var active_link = "0"; 
   var legendClicked; 
   var legendClassArray = []; 
   var y_orig; 
  color.domain(d3.keys(data[0]).filter(function(key) { return (key !== "week"&&key !== "total"); }));

  data.forEach(function(d) {
    var week = d.week; 
    var y0 = 0;
    d.ages = color.domain().map(function(name) { return {week:week, name: name, y0: y0, y1: y0 += +d[name]}; });
    d.total = d.ages[d.ages.length - 1].y1;

  });


  x.domain(data.map(function(d) { return d.week; }));
  y.domain([0, d3.max(data, function(d) { return d.total; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end");

  var week = svg.selectAll(".week")
      .data(data)
    .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { return "translate(" + "0" + ",0)"; });

  week.selectAll("rect")
      .data(function(d) {
        return d.ages; 
      })
    .enter().append("rect")
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.y1); })
      .attr("x",function(d) { 
          return x(d.week)
        })
      .attr("height", function(d) { return y(d.y0) - y(d.y1); })
      .attr("class", function(d) {
        classLabel = d.name.replace(/\s/g, ''); 
        return "class" + classLabel;
      })
      .style("fill", function(d) { return color(d.name); });

  week.selectAll("rect")
		 .append("title")
		 .text(function(d){
			return d.week + "-" + d.name + " : " + d.y1;
		});

  var legend = svg.selectAll(".legend")
      .data(color.domain().slice())
    .enter().append("g")
      .attr("class", function (d) {
        legendClassArray.push(d.replace(/\s/g, ''));
        return "legend";
      })
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  
  legendClassArray = legendClassArray;

  legend.append("rect")
      .attr("x", width)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color)
      .attr("id", function (d, i) {
        return "id" + d.replace(/\s/g, '');
      })
      .on("mouseover",function(){        

        if (active_link === "0") d3.select(this).style("cursor", "pointer");
        else {
          if (active_link.split("class").pop() === this.id.split("id").pop()) {
            d3.select(this).style("cursor", "pointer");
          } else d3.select(this).style("cursor", "auto");
        }
      })
      .on("click",function(d){        

        if (active_link === "0") { 
          d3.select(this)           
            .style("stroke", "black")
            .style("stroke-width", 2);

            active_link = this.id.split("id").pop();
            plotSingle(this);


            for (i = 0; i < legendClassArray.length; i++) {
              if (legendClassArray[i] != active_link) {
                d3.select("#id" + legendClassArray[i])
                  .style("opacity", 0.5);
              }
            }
           
        } else { 
          if (active_link === this.id.split("id").pop()) {
            d3.select(this)           
              .style("stroke", "none");

            active_link = "0"; 
            for (i = 0; i < legendClassArray.length; i++) {              
                d3.select("#id" + legendClassArray[i])
                  .style("opacity", 1);
            }

            restorePlot(d);

          }

        } 
                          
                                
      });

  legend.append("text")
      .attr("x", width+20)
      .attr("y", 9)
      .attr("dy", ".35em")
      .text(function(d) { return d; });

	svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -50)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Total Comments");   
	 
	svg.append("text") 	
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top+30) + ")")
      .style("text-anchor", "middle")
      .text("Week");
  function restorePlot(d) {

    week.selectAll("rect").forEach(function (d, i) {      
      d3.select(d[idx])
        .transition()
        .duration(1000)        
        .attr("y", y_orig[i]);
    })

    for (i = 0; i < legendClassArray.length; i++) {
      if (legendClassArray[i] != class_keep) {
        d3.selectAll(".class" + legendClassArray[i])
          .transition()
          .duration(1000)
          .delay(750)
          .style("opacity", 1);
      }
    }

  }

  function plotSingle(d) {
        
    class_keep = d.id.split("id").pop();
    idx = legendClassArray.indexOf(class_keep);    

    for (i = 0; i < legendClassArray.length; i++) {
      if (legendClassArray[i] != class_keep) {
        d3.selectAll(".class" + legendClassArray[i])
          .transition()
          .duration(1000)          
          .style("opacity", 0);
      }
    }

    y_orig = [];
    week.selectAll("rect").forEach(function (d, i) {        
    

      h_keep = d3.select(d[idx]).attr("height");
      y_keep = d3.select(d[idx]).attr("y");
      y_orig.push(y_keep);

      h_base = d3.select(d[0]).attr("height");
      y_base = d3.select(d[0]).attr("y");    

      h_shift = h_keep - h_base;
      y_new = y_base - h_shift;

      d3.select(d[idx])
        .transition()
        .ease("bounce")
        .duration(1000)
        .delay(750)
        .attr("y", y_new);
   
    })    
  } 
  } ;

function drawHourlyCommits() {
  var dataset = hourlyCommitsObj;
  d3.select("svg").remove();

  var colors=["#2c7bb6", "#00a6ca","#00ccbc","#90eb9d","#ffff8c","#f9d057","#f29e2e","#e76818","#d7191c","#8B0000","#330000","black"];
  var itemSize = 40,
      cellSize = itemSize - 1,
      margin = {top: 120, right: 20, bottom: 20, left: 110};
      
  var width = 1300 - margin.right - margin.left,
      height = 800 - margin.top - margin.bottom;



 
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
        .domain([40,80,120,160,200,240,280,320,360,400])
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
      .data(["40","80","120","160","200","240","280","320","360","400","554"])
      .enter().append("g")
      .attr("class", "legend");
 
  legend.append("rect")
    .attr("x", function(d, i) {return 30* i; })
    .attr("y", 220+(cellSize*2))
    .attr("width", 40)
    .attr("height", 20)
    .style("fill", function(d, i) { return colors[i]; });
 
  legend.append("text")
    .attr("class", "mono")
    .text(function(d) { return d; })
    .attr("width", 40)
    .attr("x", function(d, i) { return 30 * i+20; })
	.attr("y", 210 + (cellSize*3))
	.style("font-size", "10px");
	
	
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
      .text("Day");   
	 
	 svg.append("text")             
      .attr("y", -30)
      .attr("x",0)
      .style("text-anchor", "middle")
      .text("Time");
	  
	 svg.append("text")
      .attr("class", "mono")	 
      .attr("y", 345)
      .attr("x",200)
      .style("text-anchor", "middle")
	  .style("font-size", "10px")
      .text("Number of Commits");

}

function drawRepoLanguages() {
  var dataset = languagesObj;
  d3.select("svg").remove();
  (function(d3) {
    var width = 650;
    var height = 650;
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
	  .attr( "transform", function(d,i) { 
        xOff = -30+(i % 2) * 100
        yOff = 100+Math.floor(i  / 2) * -20
        return "translate(" + xOff + "," + yOff + ")" 
      } )
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
	  .attr( "transform", function(d,i) { 
        xOff = -30+(i % 2) * 100
        yOff = 100+Math.floor(i  / 2) * -20
        return "translate(" + xOff + "," + yOff + ")" 
      } )
      .text(function(d) { return d; });  
  })(window.d3);
}
