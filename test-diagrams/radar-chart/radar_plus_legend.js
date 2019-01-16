
//MAIN FUNCTION x1
function draw_radar_plus_legend()
{
    //the dataset
    var info_team= [
        [//Mexico

            {axis:"Home Victory",value:99},
            {axis:"Transfert Victory",value:20},
            {axis:"Draw",value:59},
            {axis:"Goal done",value:87},
            {axis:"Goals received",value:72},
            {axis:"Games Played",value:99+20+59}

        ],
        [//Italy

            {axis:"Home Victory",value:79},
            {axis:"Transfert Victory",value:30},
            {axis:"Draw",value:89},
            {axis:"Goal done",value:77},
            {axis:"Goals received",value:72},
            {axis:"Games Played",value:79+30+89}

        ],
        [//France

            {axis:"Home Victory",value:99},
            {axis:"Transfert Victory",value:50},
            {axis:"Draw",value:79},
            {axis:"Goal done",value:27},
            {axis:"Goals received",value:62},
            {axis:"Games Played",value:99+50+79}

        ]

    ];
    var team_name_mapping=["mexico","italy","france"];


    //////////////////////////////////////////////////////////////
    //////////////////// Draw the Chart //////////////////////////
    //////////////////////////////////////////////////////////////

    var cfg = {
        w: 680,				//Width of the circle
        h: 300,				//Height of the circle
        margin: {top: 50, right: 0, bottom: 20, left: 50}, //The margins of the SVG
        maxValue: 0, 			//What is the value that the biggest circle will represent
        levels:7,           //How many levels or inner circles should there be drawn
        roundStrokes: false,	//If true the area and stroke will follow a round path (cardinal-closed)
        color: d3.scaleOrdinal(d3.schemeCategory10),	//Color function
        labelFactor: 1.25, 	//How much farther than the radius of the outer circle should the labels be placed
        wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
        opacityArea: 0.1, 	//The opacity of the area of the blob
        dotRadius: 4, 			//The size of the colored circles of each blog
        opacityCircles: 0.1, 	//The opacity of the circles of each blob
        strokeWidth: 2 	//The width of the stroke around each blob
    };

    //Call function to draw the Radar chart
    var star_plot=RadarChart(".radarChart", info_team,cfg);

    //Call function to draw the legend
    add_team(team_name_mapping,star_plot,cfg.color);
}


//DRAW RADAR x1
function RadarChart(id, data,cfg)
{




    console.log(cfg);
    //If the supplied maxValue is smaller than the actual one, replace by the max in the data
    var maxValue = Math.max(cfg.maxValue, d3.max(data, function(i){return d3.max(i.map(function(o){return o.value;}))}));

    var allAxis = (data[0].map(function(i, j){return i.axis})),	//Names of each axis
        total = allAxis.length,					//The number of different axes
        radius = Math.min(cfg.w/2, cfg.h/2), 	//Radius of the outermost circle
        Format = d3.format('%'),			 	//Percentage formatting
        angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"

    //Scale for the radius
    var rScale = d3.scaleLinear()
        .range([0, radius])
        .domain([0, maxValue]);

    /////////////////////////////////////////////////////////
    //////////// Create the container SVG and g /////////////
    /////////////////////////////////////////////////////////

    //Remove whatever chart with the same id/class was present before
    //d3.select(id).select("svg").remove();

    //Initiate the radar chart SVG
    var svg = d3.select(id).append("svg")
        .attrs({
            "width":  cfg.w + cfg.margin.left + cfg.margin.right,
            "height":cfg.h + cfg.margin.top + cfg.margin.bottom
        });

    //Append a g element
    var g = svg.append("g")
        .attr("transform", "translate(" + (cfg.w /2+ cfg.margin.left) + "," + (cfg.h/2 + cfg.margin.top) + ")");

    /////////////////////////////////////////////////////////
    ////////// Glow filter for some extra pizzazz ///////////
    /////////////////////////////////////////////////////////

    //Filter for the outside glow
    if(1) {
        var filter = g.append('defs').append('filter').attr('id', 'glow'),
            feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'coloredBlur'),
            feMerge = filter.append('feMerge'),
            feMergeNode_1 = feMerge.append('feMergeNode').attr('in', 'coloredBlur'),
            feMergeNode_2 = feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
    }
    /////////////////////////////////////////////////////////
    /////////////// Draw the Circular grid //////////////////
    /////////////////////////////////////////////////////////

    //Wrapper for the grid & axes
    var axisGrid = g.append("g").attr("class", "axisWrapper");

    //Draw the background circles
    axisGrid.selectAll(".levels")
        .data(d3.range(1,(cfg.levels+1)).reverse())
        .enter()
        .append("circle")
        .attrs({"class": "gridCircle",
            "r": function(d, i){return radius/cfg.levels*d;}
        })
        .style("fill", "#CDCDCD")
        .style("stroke", "#CDCDCD")
        .style("fill-opacity", cfg.opacityCircles)
        .style("filter" , "url(#glow)");

    //Text indicating at what % each level is
    axisGrid.selectAll(".axisLabel")
        .data(d3.range(1,(cfg.levels+1)).reverse())
        .enter().append("text")
        .attrs({
            "class": "axisLabel",
            "x": 4,
            "y": function(d){return -d*radius/cfg.levels;},
            "dy": "0.4em"
        })
        .style("font-size", "10px")
        .attr("fill", "#737373")
        .on("mouseover",function(d,i){console.log(d);d3.select(this).attr("fill","#333333").style("font-size","20px")})
        .on("mouseout",function(d,i){console.log(d);d3.select(this).attr("fill","#737373").style("font-size","10px")})
        .text(function(d,i) { return Math.round((maxValue * d/cfg.levels)); });


    /////////////////////////////////////////////////////////
    //////////////////// Draw the axes //////////////////////
    /////////////////////////////////////////////////////////

    //Create the straight lines radiating outward from the center
    var axis = axisGrid.selectAll(".axis")
        .data(allAxis)
        .enter()
        .append("g")
        .attr("class", "axis");
    //Append the lines
    axis.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", function(d, i){ return rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2); })
        .attr("y2", function(d, i){ return rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2); })
        .attr("class", "line")
        .attrs({
            "x1": 0,
            "y1": 0,
            "x2": function(d, i){ return rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2); },
            "y2": function(d, i){ return rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2); },
            "class": "line"
        })
        .style("stroke", "white")
        .style("stroke-width", "2px");

    //Append the labels at each axis
    axis.append("text")
        .attr("class", "legend")
        .style("font-size", "11px")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("x", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice*i - Math.PI/2); })
        .attr("y", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice*i - Math.PI/2); })
        .text(function(d){return d})
        .call(wrap, cfg.wrapWidth);

    /////////////////////////////////////////////////////////
    ///////////// Draw the radar chart blobs ////////////////
    /////////////////////////////////////////////////////////

    //The radial line function

    var radarLine = d3.radialLine()
        .curve(d3.curveCardinalClosed)
        .radius(function(d) { return rScale(d.value); })
        .angle(function(d,i) {	return i*angleSlice; });

    if(cfg.roundStrokes) {
        radarLine.interpolate("cardinal-closed");
    }


    //Create a wrapper for the blobs : the star plot for each item
    var blobWrapper = g.selectAll(".radarWrapper")
        .data(data)
        .enter().append("g")
        .attr("class", "radarWrapper")
        .attr("id",function (d,i) {
            return "radarWrapper"+i;
        })
        .attr("visibility","hidden");

    //Append the backgrounds
    blobWrapper
        .append("path")
        .attr("class", "radarArea")
        .attr("id",function (d,i) {
            return "radarArea"+i

        })
        .attr("d", function(d,i) { return radarLine(d); })
        .style("fill", function(d,i) { return cfg.color(i); })
        .style("fill-opacity", cfg.opacityArea);





    //Create the outlines for the intersection with the axis : i contorni di ogni star plot
    blobWrapper.append("path")
        .attr("id",function(d,i){return "contorni"+i})
        .attr("class", "radarStroke")
        .attr("d", function (d, i) {
            return radarLine(d);
        })
        .style("stroke-width", cfg.strokeWidth + "px")
        .style("stroke", function (d, i) {
            return cfg.color(i);
        })
        .style("fill", "none")
        .style("filter", "url(#glow)")
        .attr("stroke-opacity",0.7);



    var teamid=-1;
    //Append the circles : intersection with the axis
    blobWrapper.selectAll(".radarCircle")
        .data(function (d, i) {
            return d;
        })
        .enter().append("circle")
        .attr("class", "radarCircle")
        .attr("r", cfg.dotRadius)
        .attr("cx", function (d, i) {
            return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2);
        })
        .attr("cy", function (d, i) {
            return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2);
        })
        .style("fill", function (d, i, j) {

            if (i===0){
                teamid++;
            }

            return cfg.color(teamid);
        })
        .style("fill-opacity", 1);



    /////////////////////////////////////////////////////////
    //////// Append invisible circles for tooltip ///////////
    /////////////////////////////////////////////////////////

    //Wrapper for the invisible circles on top
    var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
        .data(data)
        .enter().append("g")
        .attr("class", "radarCircleWrapper");

    //Append a set of invisible circles on top for the mouseover pop-up
    var actual_team=-1;
    blobCircleWrapper.selectAll(".radarInvisibleCircle")
        .data(function(d,i) {return d; })
        .enter().append("circle")
        .attr("class", "radarInvisibleCircle")
        .attr("r", cfg.dotRadius*1.5)
        .attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
        .attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function(d,i) {

            newX =  parseFloat(d3.select(this).attr('cx')) - 10;
            newY =  parseFloat(d3.select(this).attr('cy')) - 10;

            tooltip
                .attr('x', newX)
                .attr('y', newY)
                .text(d.axis +": "+d.value)
                .transition().duration(200)
                .style('opacity', 1);
        })
        .on("mouseout", function(){
            //console.log("ciao");
            tooltip.transition().duration(200)
                .style("opacity", 0);
        });

    //Set up the small tooltip for when you hover over a circle
    var tooltip = g.append("text")
        .attr("class", "tooltip")
        .style("opacity", 0);

    /////////////////////////////////////////////////////////
    /////////////////// Helper Function /////////////////////
    /////////////////////////////////////////////////////////

    //Taken from http://bl.ocks.org/mbostock/7555321
    //Wraps SVG text
    function wrap(text, width) {
        text.each(function() {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.4, // ems
                y = text.attr("y"),
                x = text.attr("x"),
                dy = parseFloat(text.attr("dy")),
                tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                }
            }
        });
    }//wrap





    return g




}


//DRAW LEGEND x3
function add_team(teams_name,star_plot,color_scale)
{
    var i=0;
    var selected_teams=0;
    var list_teams=[];

    teams_name.forEach(function(team) {
        var node = document.createElement("a");
        var clicked=false;
        node.innerHTML = team;
        node.id = i;
        //node.setAttribute("style","color:"+color(i));
        node.clicked=false;
        node.onmouseover=(function () {

            this.setAttribute("style","background:"+color_scale(node.id) + ";opacity:"+"0.5");


            //Bring back the hovered over blob
            d3.select("#radarArea"+this.id)
                .transition().duration(200)
                .style("fill-opacity", 0.9);
        });
        node.onmouseout=(function () {
            this.setAttribute("style","background:"+"#f6f6f6");
            d3.select("#radarArea"+this.id)
                .transition().duration(200)
                .style("fill-opacity", 0.1);
        });



        node.onclick=(function () {
            if (node.clicked){
                star_plot.select("#radarWrapper"+this.id).attr("visibility","hidden");
                node.clicked=false;
                selected_teams+=-1;
                list_teams.splice( list_teams.indexOf(this.id), 1 );
                var tmp =d3.selectAll(".radar-legend-class");
                tmp.remove();

                star_plot.selectAll(".radar-legend-class")
                    .data(list_teams)
                    .enter()
                    .append("rect")
                    .attrs({
                        "id": function(d,i){return "radar-legend"+d},
                        "width":10,
                        "height":10,
                        "class":"radar-legend-class",
                        "x":245,
                        "y":function(d,i){return -190+i*30},
                        "fill":function(d,i){return color_scale(d)}
                    });



                star_plot.selectAll("void")
                    .data(list_teams).enter().append("text")
                    .attrs({
                        "x":260,
                        "y":function(d,i){return -180+i*30},
                        "class":"radar-legend-class"
                    })
                    .text(function (d,i) {
                        return teams_name[d]

                    });

                return;
            }

            star_plot.select("#radarWrapper"+this.id).attr("visibility","visible");
            node.clicked=true;

            star_plot.append("rect")
                .attrs({
                    "id":"radar-legend"+this.id,
                    "width":10,
                    "height":10,
                    "class":"radar-legend-class",
                    "x":245,
                    "y":-190+selected_teams*30,
                    "fill":color_scale(this.id)
                });

            star_plot.append("text")
                .attrs({
                    "x":260,
                    "y":function(d,i){return -180+selected_teams*30},
                    "class":"radar-legend-class"


                })
                .text(function (d,i) {
                    return teams_name[node.id]

                });

            //console.log(tmp);
            list_teams.push(this.id);
            selected_teams+=1;


        });
        document.getElementById("radar-legend-myDropdown").appendChild(node);
        i++;

    });






}

function myFunction()
{
    document.getElementById("radar-legend-myDropdown").classList.toggle("radar-legend-show");
}

function filterFunction()
{
    var input, filter, ul, li, a, i;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    div = document.getElementById("myDropdown");
    a = div.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
        if (a[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
            a[i].style.display = "";
        } else {
            a[i].style.display = "none";
        }
    }
}




