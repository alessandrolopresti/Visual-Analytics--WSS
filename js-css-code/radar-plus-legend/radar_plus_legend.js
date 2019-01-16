

country_id_by_pos=[ 'Belize'
    ,'The Bahamas'
    ,'Canada'
    ,'Costa Rica'
    ,'Cuba'
    ,'Dominican Republic'
    ,'Greenland'
    ,'Guatemala'
    ,'Honduras'
    ,'Haiti'
    ,'Jamaica'
    ,'Mexico'
    ,'Nicaragua'
    ,'Panama'
    ,'Puerto Rico'
    ,'El Salvador'
    ,'Trinidad and Tobago'
    ,'United States of America'
    ,'Argentina'
    ,'Bolivia'
    ,'Chile'
    ,'Colombia'
    ,'Brazil'
    ,'Falkland Islands'
    ,'Ecuador'
    ,'Guyana'
    ,'Paraguay'
    ,'Peru'
    ,'Suriname'
    ,'Uruguay'
    ,'Venezuela'
    ,'Afghanistan'
    ,'United Arab Emirates'
    ,'Armenia'
    ,'Azerbaijan'
    ,'Bangladesh'
    ,'Brunei'
    ,'Bhutan'
    ,'China'
    ,'Northern Cyprus'
    ,'Cyprus'
    ,'Georgia'
    ,'Indonesia'
    ,'India'
    ,'Iran'
    ,'Israel'
    ,'Iraq'
    ,'Jordan'
    ,'Japan'
    ,'Kazakhstan'
    ,'Kyrgyzstan'
    ,'Cambodia'
    ,'South Korea'
    ,'Kuwait'
    ,'Laos'
    ,'Lebanon'
    ,'Sri Lanka'
    ,'Myanmar'
    ,'Mongolia'
    ,'Malaysia'
    ,'Nepal'
    ,'Oman'
    ,'Pakistan'
    ,'Philippines'
    ,'North Korea'
    ,'Palestine'
    ,'Qatar'
    ,'Saudi Arabia'
    ,'Syria'
    ,'Thailand'
    ,'Tajikistan'
    ,'Turkmenistan'
    ,'East Timor'
    ,'Turkey'
    ,'Taiwan'
    ,'Vietnam'
    ,'Uzbekistan'
    ,'Yemen'
    ,'Angola'
    ,'Burundi'
    ,'Burkina Faso'
    ,'Benin'
    ,'Botswana'
    ,'Central African Republic'
    ,'Ivory Coast'
    ,'Cameroon'
    ,'Democratic Republic of the Congo'
    ,'Republic of Congo'
    ,'Djibouti'
    ,'Algeria'
    ,'Egypt'
    ,'Eritrea'
    ,'Ethiopia'
    ,'Gabon'
    ,'Gambia'
    ,'Guinea'
    ,'Ghana'
    ,'Libya'
    ,'Kenya'
    ,'Lesotho'
    ,'Morocco'
    ,'Liberia'
    ,'Guinea Bissau'
    ,'Equatorial Guinea'
    ,'Madagascar'
    ,'Mali'
    ,'Mozambique'
    ,'Mauritania'
    ,'Malawi'
    ,'Namibia'
    ,'Niger'
    ,'Nigeria'
    ,'Rwanda'
    ,'Western Sahara'
    ,'Sudan'
    ,'South Sudan'
    ,'Senegal'
    ,'Sierra Leone'
    ,'Somaliland'
    ,'Somalia'
    ,'Swaziland'
    ,'Chad'
    ,'Togo'
    ,'Tunisia'
    ,'Uganda'
    ,'United Republic of Tanzania'
    ,'South Africa'
    ,'Zambia'
    ,'Zimbabwe'
    ,'Australia'
    ,'Fiji'
    ,'New Caledonia'
    ,'New Zealand'
    ,'Papua New Guinea'
    ,'Solomon Islands'
    ,'Vanuatu'
    ,'Albania'
    ,'Austria'
    ,'Belgium'
    ,'Bosnia and Herzegovina'
    ,'Bulgaria'
    ,'Belarus'
    ,'Switzerland'
    ,'Czech Republic'
    ,'Germany'
    ,'Denmark'
    ,'Spain'
    ,'Estonia'
    ,'Finland'
    ,'France'
    ,'United Kingdom'
    ,'Greece'
    ,'Croatia'
    ,'Hungary'
    ,'Ireland'
    ,'Italy'
    ,'Iceland'
    ,'Kosovo'
    ,'Lithuania'
    ,'Luxembourg'
    ,'Latvia'
    ,'Macedonia'
    ,'Montenegro'
    ,'Moldova'
    ,'Netherlands'
    ,'Norway'
    ,'Poland'
    ,'Portugal'
    ,'Russia'
    ,'Romania'
    ,'Republic of Serbia'
    ,'Slovakia'
    ,'Slovenia'
    ,'Sweden'
    ,'Ukraine'
]


//MAIN FUNCTION x1
function draw_radar_plus_legend(year)
{
    //the dataset
    add_legend();

    //the order MUST BE coherent with the ids of team_id
    var info_team= [
        /*
        [//Canada

            {axis:"Home Victory",value:99},
            {axis:"Transfert Victory",value:20},
            {axis:"Draw",value:59},
            {axis:"Goal done",value:87},
            {axis:"Goals received",value:73}


        ]
        */

    ];

    var team_id=[];

    var radar_team;
    var radar_team_id;
    var radar_gol_done;
    var radar_gol_rec;
    var radar_win;
    var radar_lost;
    var radar_draw;
    var info;
    var line;

    var max_goals_done=0;
    var max_goals_rec=0;
    var max_win=0;
    var max_draw=0;
    var max_lost=0;


    for(var zz=0;zz<year.length;zz++) {
        console.log('database/games_by_year/games_by_year_' + year[zz] + '.csv');

        $.ajax({
            type: "GET",
            url: 'database/games_by_year/games_by_year_' + year[zz] + '.csv',
            dataType: "text",
			contentType: "text/plain", 
			mimeType: 'text/plain; charset=x-user-defined',
			cache: false,
			isLocal: true,
            async: false,
            success: function (csv) {
                info = csv;
            }
        });
        //console.log(info);
        info=info.split("\n");
        //console.log(info);


        for (var i=1;i<info.length;i++){
            //console.log(info[i]);

            line=info[i].split(",");

            if (line.length<7) continue;

            radar_team=line[0];
            radar_team_id=line[1];
            radar_gol_done=parseInt(line[2]);
            radar_gol_rec=parseInt(line[3]);
            radar_win=parseInt(line[4]);
            radar_lost=parseInt(line[5]);
            radar_draw=parseInt(line[6].replace(/[^0-9]/g, ''));
            /*
            console.log(radar_team);
            console.log(radar_team_id);
            console.log(radar_gol_done);
            console.log(radar_gol_rec);
            console.log(radar_win);
            console.log(radar_lost);
            console.log(radar_draw);
            */
            var new_entry ;
            var index_team = team_id.indexOf(radar_team_id);
            if (index_team === -1) {
                team_id.push(radar_team_id);
                new_entry=[
                    {axis: "Goal done", value: radar_gol_done},
                    {axis: "Goal received", value: radar_gol_rec},
                    {axis: "Win", value: radar_win},
                    {axis: "Lost", value: radar_lost},
                    {axis: "Draw", value: radar_draw}
                ];
                info_team.push(new_entry);
            }
            else{
                var old = info_team[index_team];
                //console.log(old);
                new_entry=[
                    {axis: "Goal done", value: old[0].value+radar_gol_done},
                    {axis: "Goal received", value: old[1].value+radar_gol_rec},
                    {axis: "Win", value: old[2].value+radar_win},
                    {axis: "Lost", value: old[3].value+radar_lost},
                    {axis: "Draw", value: old[4].value+radar_draw}
                ];
                info_team[index_team] = new_entry;
            }
            max_goals_done=Math.max(max_goals_done,new_entry[0].value);
            max_goals_rec=Math.max(max_goals_rec,new_entry[1].value);
            max_win=Math.max(max_win,new_entry[2].value);
            max_lost=Math.max(max_lost,new_entry[3].value);
            max_draw=Math.max(max_draw,new_entry[4].value);




        }
        console.log('max goal');
        console.log(max_goal_done_per_match);



    }
    var max_goal_done_per_match=-1;
    var max_goal_received_per_match=-1;
    for (var i=0;i<info_team.length;i++){
        var el = info_team[i];
        var total_games = el[2].value+el[3].value+el[4].value;

        max_goal_done_per_match = Math.max(max_goal_done_per_match,el[0].value/total_games);

        max_goal_received_per_match = Math.max(max_goal_received_per_match,el[1].value/total_games);

    }


    //Normalize data
    for (var i=0;i<info_team.length;i++){
        var el = info_team[i];


        el[0].orig_value=el[0].value;
        el[0].team_id=team_id[i];

        el[1].orig_value=el[1].value;
        el[1].team_id=team_id[i];
        el[2].orig_value=el[2].value;
        el[2].team_id=team_id[i];
        el[3].orig_value=el[3].value;
        el[3].team_id=team_id[i];
        el[4].orig_value=el[4].value;
        el[4].team_id=team_id[i];

        //el.team_id=team_id[i];

        var total_games = el[2].value+el[3].value+el[4].value;

        //el[0].value/=max_goals_done*0.01;
        //el[0].value=el[0].value/total_games;
        el[0].value=(el[0].value/total_games)/max_goal_done_per_match*100;
        el[1].value=(el[1].value/total_games)/max_goal_received_per_match*100;

        el[2].value=el[2].value/total_games*100;
        el[3].value=el[3].value/total_games*100;
        el[4].value=el[4].value/total_games*100;




    }

    //console.log(info_team);
    //console.log(team_id);



    //////////////////////////////////////////////////////////////
    //////////////////// Draw the Chart //////////////////////////
    //////////////////////////////////////////////////////////////

    var cfg = {
        w: 450,				//Width of the circle
        h: 350,				//Height of the circle
        margin: {top: 60, right: 0, bottom: 33, left: 30}, //The margins of the SVG
        maxValue: 0, 			//What is the value that the biggest circle will represent
        levels:10,           //How many levels or inner circles should there be drawn
        roundStrokes: false,	//If true the area and stroke will follow a round path (cardinal-closed)
        color: d3.scaleOrdinal(d3.schemeCategory20),	//Color function
        labelFactor: 1.15, 	//How much farther than the radius of the outer circle should the labels be placed
        wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
        opacityArea: 0.1, 	//The opacity of the area of the blob
        dotRadius: 4, 			//The size of the colored circles of each blog
        opacityCircles: 0.1, 	//The opacity of the circles of each blob
        strokeWidth: 1 	//The width of the stroke around each blob
    };

    //Call function to draw the Radar chart
    var star_plot=RadarChart(".radarChart", info_team,cfg,team_id);

    //Call function to draw the legend
    //add_team(team_name_mapping,star_plot,cfg.color);
}


//DRAW RADAR x1
function RadarChart(id, data,cfg,team_id)
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
        .attr("transform", "translate(" + (cfg.w /2+ cfg.margin.left-20) + "," + (cfg.h/2 + cfg.margin.top-10) + ")");

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
        .curve(d3.curveLinearClosed)
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
            return "radarWrapper"+team_id[i];
        })
        .attr("visibility","hidden");


    //Append the backgrounds

    blobWrapper
        .append("path")
        .attr("class", "radarArea")
        .attr("id",function (d,i) {

            return "radarArea"+team_id[i]
        })
        .attr("d", function(d,i) { return radarLine(d); })
        .style('fill','none');







    //Create the outlines for the intersection with the axis : i contorni di ogni star plot
    blobWrapper.append("path")
        .attr("id",function(d,i){return "contorni"+team_id[i]})
        .attr("class", "radarStroke")
        .attr("d", function (d, i) {
            return radarLine(d);
        })
        .style("stroke-width", cfg.strokeWidth + "px")
        .style("stroke", function (d, i) {
            return cfg.color(i);
        })
        .style("filter", "url(#glow)")
        .attr("stroke-opacity",0.7);



    var teamid=-1;
    //Append the circles : intersection with the axis
    blobWrapper.selectAll(".radarCircle")
        .data(function (d, i) {
            return d;
        })
        .enter().append("circle")
        .attr("id", function (d, i) {return "radarCircleID"+team_id[i];})
        .attr("r", cfg.dotRadius)
        .attr("cx", function (d, i) {
            return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2);
        })
        .attr("cy", function (d, i) {
            return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2);
        })
        .attr("class",function(d,i){
            if (i===0){
            teamid++;
        }
        return "radarCircle"+team_id[teamid]})


        .style("fill-opacity", 1)
        .on('mouseover', function (d,i){
            console.log(d);
            //var xpos=d3.select(this).attr('cx');
            //var ypos=d3.select(this).attr('cy');

            var xpos =  parseFloat(d3.select(this).attr('cx')) - 10;
            var ypos =  parseFloat(d3.select(this).attr('cy')) - 10;

            console.log(xpos);
            console.log(ypos);
            var col = d3.select(this).style("fill");
            d3.select("#radarArea"+d.team_id).style("fill",col).style("fill-opacity",1);
            console.log(d.axis);


            if (d.axis === "Draw" || d.axis === "Lost"){
                d3.select("#tooltip3")
                    .style("left", (xpos+910) + "px")
                    .style("top", (ypos+380) + "px")
                    .select("#value3")
                    .text(country_id_by_pos[d.team_id]+": "+d.orig_value);

            }
            else {
                d3.select("#tooltip3")
                    .style("left", (xpos + 1200) + "px")
                    .style("top", (ypos + 380) + "px")
                    .select("#value3")
                    .text(country_id_by_pos[d.team_id] + ": " + d.orig_value);
            }

            d3.select("#tooltip3").select("#value4").text(d.axis);
            d3.select("#tooltip3").classed("hidden", false);

        })
        .on('mouseout', function (d,i){
            d3.select("#tooltip3").classed("hidden", true);
            d3.select("#radarArea"+d.team_id).style("fill",'none');
        });




    /////////////////////////////////////////////////////////
    //////// Append invisible circles for tooltip ///////////
    /////////////////////////////////////////////////////////

    //Wrapper for the invisible circles on top
    /*
    var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
        .data(data)
        .enter().append("g")
        .attr("class", "radarCircleWrapper");

    //Append a set of invisible circles on top for the mouseover pop-up
    var actual_team=-1;
    //Set up the small tooltip for when you hover over a circle

    var tooltip = g.append("text")
        .attr("class", "tooltip")
        .style("opacity", 0);
    blobCircleWrapper.selectAll(".radarInvisibleCircle")
        .data(function(d,i) {return d; })
        .enter().append("circle")
        .attr("class", "radarInvisibleCircle")
        .attr("r", cfg.dotRadius*1.5)
        .attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
        .attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
        .style("fill", "none")
        .style("pointer-events", "all");
        .on("mouseover", function(d,i) {

            console.log(d);
            console.log(this);

            newX =  parseFloat(d3.select(this).attr('cx')) - 10;
            newY =  parseFloat(d3.select(this).attr('cy')) - 10;

            tooltip
                .attr('x', newX)
                .attr('y', newY)
                .text("ciaoo"+Math.round(d.orig_value)+"bello")
                .transition().duration(200)
                .style('opacity', 1);

        })
        .on("mouseout", function(){
            //console.log("ciao");
            tooltip.transition().duration(200)
                .style("opacity", 0);
        });
        */



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




