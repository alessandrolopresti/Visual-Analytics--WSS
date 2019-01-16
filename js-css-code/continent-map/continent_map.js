
team_in_legend_global=[];
function add_time_bar()
{
    var width = 1500, height=50;

    // v3 = var x = d3.scale.linear()
    var mindate = new Date(1872,0,1);
    var maxdate = new Date(2018,0,1);

    var x_scale = d3.scaleTime()
        .domain([mindate,maxdate])
        .rangeRound([20,width - 20]);
    var x_axis = d3.axisBottom(x_scale).tickFormat(d3.timeFormat("%Y"));


    var brush = d3.brushX()
        .extent([[0,0], [width,height]])
        .on("end", brushed);

    var svg = d3.select("body").select('#range-slider').append("svg")
		.attr("class", "wss")
        .attr("width", width )
        .attr("height", height )
        .append("g")
        .attr("transform", "translate(" + 5 + "," + 15 + ")")
        .call(x_axis.ticks(d3.timeYear,4));

    var brushg = svg.append("g")
        .attr("class", "brush")
        .call(brush);

    var prev_x=0,prev_y=0;

    function brushed() {
        //console.log("ciao");
        var range = d3.brushSelection(this)
            .map(x_scale.invert);
        var xr = 1900+range[0].getYear();
        var yr = 1900+range[1].getYear();
        console.log('brush')
        console.log(team_in_legend_global);

        if (prev_x!==xr || prev_y!==yr) {
            for(var zz=0;zz<team_in_legend_global.length;zz++){
                removeCountryFromLineChart(team_in_legend_global[zz].properties.admin);
				
            }
            team_in_legend_global=[];
            d3.select("#continent-map").selectAll("svg").remove();
            d3.select("#continent-map-legend").selectAll("svg").remove();
            d3.select(".radarChart").selectAll("svg").remove();
            d3.select(".chordDiagram").selectAll("svg").remove();
            d3.select("#continent-map-legend-play").selectAll("svg").remove();
            prev_x = xr;
            prev_y = yr;
            var range_years=[];
            var range_years_for_chord=[];
            for (var y=xr;y<=yr;y++){
                if (y<1872 || y>2018) continue;
                range_years.push(y);
                if (y>=1882) range_years_for_chord.push(y)
            }
            draw_radar_plus_legend(range_years);
            draw_continent_map(range_years);
            var node1 ={'team_color':'#7fc97f','properties':{'admin':'team1'}};
            var node2 ={'team_color':'#beaed4','properties':{'admin':'team2'}};
            plot_chord_diagram([[0,0],[0,0]],[node1,node2]);
        }


        d3.selectAll("span")
            .text(function(d, i) {
                //console.log(xr);
                //console.log(yr);
                return "   Interval: [ "+(xr) +", "+ (yr)+"]";
            })
    }

}

//DRAW LEGEND x1
function add_legend()
{

    //Create SVG element
    w_legend=237;
    h_legend=350;

    var svg = d3.select("body").select("#continent-map-legend")
        .append("svg")
        .attrs({"width": w_legend ,
                "height": h_legend,
                "class": "continent-map-legend-svg"
        });



}

function get_directed_match_matrix(year,selected_teams)
{
    var x;
    //console.log(year);
    //
    //
    // console.log(selected_teams)



    x = new Array(selected_teams.length);

    for (var i = 0; i < selected_teams.length; i++) {
        x[i] = new Array(selected_teams.length).fill(0);
    }


    for(var zz=0;zz<year.length;zz++) {
        //console.log(i);
        console.log('database/played_by_year/played_by_year_' + year[zz] + '.csv');
        var info;
        $.ajax({
            type: "GET",
            url: 'database/directed_match_by_year/matrix_by_year_' + year[zz] + '.txt',
            dataType: "text",
			mimeType: 'text/plain; charset=x-user-defined',
			cache: false,
			isLocal: true,
            async: false,
            success: function(csv) {info=csv; }
        });
        info=info.split("\n");
        //console.log(info);
        var all_teams = info[0].split(",").filter(function (t) { return t.length>1 });
        var big_mat=new Array(all_teams.length);
        for (var i = 0; i < all_teams.length; i++) {
            big_mat[i] = new Array(all_teams.length).fill(0);
            var row=info[i+1].split(" ").map(function (t) { return parseInt(t) });
            for (var j=0;j<all_teams.length;j++){
                big_mat[i][j]=row[j];

            }
        }






        var selected_row=[];
        for (var i=0;i<selected_teams.length;i++)
            selected_row.push(all_teams.indexOf(selected_teams[i]));
        //console.log(selected_row)
        for (var i = 0; i < selected_teams.length; i++) {
            for (var j=0;j<selected_teams.length;j++){
                if (selected_row[i]===-1 || selected_row[j]===-1){
                    continue;
                }
                x[i][j]+=big_mat[selected_row[i]][selected_row[j]]
            }

        }



    }
    //console.log("final ris:")
    //console.log(x)
    return x;

}

function draw_continent_map(year)
{
    //var levels=['#f1eef6', '#bdc9e1', '#74a9cf', '#0570b0','#fef0d9', '#fdcc8a', '#fc8d59', '#d7301f'];

    var levels=['#0570b0', '#74a9cf', '#bdc9e1', '#f1eef6','#fef0d9', '#fdcc8a', '#fc8d59', '#d7301f'];


    d3.select("#continent-map-legend-play").append('svg')
        .attr("width", 100)
        .attr("height", 350)
        .selectAll("rect").data(levels).enter()
        .append("rect").attrs({
        "x":30,
        "y":function(d,i) { return 10*i;},
        "width":10,
        "height":10,
        "fill":function(d) {return d;}
    });

    d3.select("#continent-map-legend-play").select('svg').selectAll("text").data(levels).enter()
        .append("text").attrs({
        "x":40,
        "y":function(d,i) {return 10*i+10;},
        "font-size":"10px"
    }).text(function (d,i) {
        if (i === 0) return "-100%";
        if (i === 1) return "-80%";
        if (i === 2) return "-40%";
        if (i===4) return "+0%";
        if (i===3) return "-0%";
        if (i===5) return "+100%";
        if (i===6) return "+200%";
        if (i===7) return "+400%";

    });





    //Width and height

    var w = 500;
    var h = 350;


    //Define map projection
    var projection = d3.geoMercator();
        //.translate([300,200]);

    //Define map projection
   //projection.scale(100);

    //Define path generator
    var path = d3.geoPath()
        .projection(projection);



    //Number formatting for population values
    var formatAsThousands = d3.format(",");  //e.g. converts 123456 to "123,456"

    //Number formatting for ag productivity values
    var formatDecimals = d3.format(".3");  //e.g. converts 1.23456 to "1.23"

    //Create SVG element
    var svg = d3.select("body").select("#continent-map")
        .append("svg")
        .attr("width", w)
        .attr("height", h);



    //Define what to do when panning or zooming
    var zooming = function(d) {

        //Log out d3.event.transform, so you can see all the goodies inside
        //console.log(d3.event.transform);

        //New offset array
        var offset = [d3.event.transform.x, d3.event.transform.y];

        //Calculate new scale
        var newScale = d3.event.transform.k *100;

        //Update projection with new offset and scale
        projection.translate(offset)
            .scale(newScale);

        //Update all paths and circles
        svg.selectAll("path")
            .attr("d", path);

        svg.selectAll(".text-country")
            .attr("x", function(d) {
                return path.centroid(d)[0];
            })
            .attr("y", function(d) {
                return path.centroid(d)[1];
            });



    };

    //Then define the zoom behavior
    var zoom = d3.zoom()
        .scaleExtent([ 0.02, 20.0 ])
        .translateExtent([[ -12000, -7000 ], [ 12000, 7000 ]])
        .on("zoom", zooming);

    //The center of the country, roughly
    //var center = projection([-97.0, 39.0]);

    //Create a container in which all zoom-able elements will live
    var map = svg.append("g")
        .attr("id", "map")
        .call(zoom)///Bind the zoom behavior
        .call(zoom.transform, d3.zoomIdentity  //Then apply the initial transform
            .translate(300, 200)
            .scale(1));


    //Create a new, invisible background rect to catch zoom events
    map.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", w)
        .attr("height", h)
        .attr("opacity", 0);
    var choose_level=function (val,average,name) {
        //console.log(name,val,average);

        if (val<=-average){
            return 0;
        }
        if (val<-0.8*average){
            return 1;
        }
        if (val<-0.4*average){
            return 2;
        }
        if (val<0){
            return 3;
        }

        if (val>4*average){
            return 7;
        }
        if (val>2*average){
            return 6;
        }
        if (val>1*average){
            return 5;
        }

        return 4;



    };

    var played_by_year={};
    var tot_sum=0;
    var max_p=0;
    var average;

    //console.log(year);

     for(var zz=0;zz<year.length;zz++) {
        //console.log(i);
        //console.log('database/played_by_year/played_by_year_' + year[zz] + '.csv');
        var info;
        $.ajax({
            type: "GET",
            url: 'database/played_by_year/played_by_year_' + year[zz] + '.csv',
            dataType: "text",
			mimeType: 'text/plain; charset=x-user-defined',
			cache: false,
			isLocal: true,
            async: false,
            success: function(csv) {info=csv; }
        });
        info=info.split("\n");
        for (var i=0;i<info.length;i++){
            if(i===0  ) continue;
            var cg=info[i].split(",");
            if (cg.length<2) continue;
            var country = cg[0];

            var played =  parseInt(cg[1].replace(/[^0-9]/g, ''));
            if (played_by_year[country]) played_by_year[country]+=played;
            else played_by_year[country]=played;
            tot_sum+= played;
            max_p=Math.max(max_p,played_by_year[country])

        }
        average=tot_sum/info.length;
        //console.log(played_by_year);
        //console.log(average);
        //console.log(tot_sum);

    }



        d3.json("js-css-code/continent-map/world.geo.json", function(json) {



            //Bind data and create one path per GeoJSON feature
            var tmp=json.features;
            //console.log(tmp[0].properties.admin);

            var color_scale_legend=d3.scaleOrdinal(d3.schemeCategory10);
            var color_scale_quantity= d3.scaleOrdinal()
                .domain([0,1,2,3,4,5,6,7])
                .range(['#0570b0', '#74a9cf', '#bdc9e1', '#f1eef6', '#fef0d9', '#fdcc8a', '#fc8d59', '#d7301f']);


            var legend_teams=[];
            var test=0;
            map.selectAll("path")
                .data(json.features)
                .enter()
                .append("path")
                .attr("d", path)
                .style('stroke', 'white')
                .style('stroke-width', 1.5)
                .style("opacity",0.8)
                .style("fill", function(d,i) {
                    if (played_by_year[d.properties.admin]){
                        d.played=played_by_year[d.properties.admin]
                        //d.norm_played=d.played/tot_sum;
                        d.norm_played=d.played-average;
                        test+=d.played
                        //console.log(d.norm_played)
                        //console.log("tot sum "+tot_sum)
                        //console.log("test "+test)
                        d.chosen_level =choose_level(d.norm_played,average,d.properties.admin)
                    }
                    else{

                        d.played=0;
                        d.norm_played=0-average;
                        d.chosen_level =choose_level(d.norm_played,average,d.properties.admin)
                    }

                    return color_scale_quantity(choose_level(d.norm_played,average,d.properties.admin));
                })
                .on('mouseover',function(d){
                    d3.select(this)
                        .style("opacity", 1)
                        .style("stroke","white")
                        .style("stroke-width",3);
                    //console.log(d3.select("#text-country-"+d.properties.admin.replace(/ /g,"_")));
                    //d3.select("#text-country-"+d.properties.admin.replace(/ /g,"_")).attr("visibility","visible");

                    var xPosition=path.centroid(d)[0];
                    var yPosition=path.centroid(d)[1];

                    d3.select("#tooltip")
                        .style("left", xPosition +20+ "px")
                        .style("top", yPosition +130+ "px")
                        .select("#value")
                        .text(d.properties.admin+': '+d.played);

                    d3.select("#tooltip").classed("hidden", false);

                })
                .on('mouseout', function(d){
                    d3.select("#tooltip").classed("hidden", true);
                    //d3.select("#text-country-"+d.properties.admin.replace(/ /g,"_")).attr("visibility","hidden");
                    d3.select(this)
                        .style("opacity", 0.8)
                        .style("stroke","white")
                        .style("stroke-width",0.3);
                })
                .attrs({"class":"country",
                    "id":function(d){return d.properties.admin}})
                .on("click",function (d,i) {

                    d.team_id=i;

                    if (d.clicked){
                        d.clicked=false;
                        d3.select("#radarWrapper"+ d.team_id).attr("visibility","hidden");
                        legend_teams.splice( legend_teams.indexOf(d), 1 );

                        team_in_legend_global.splice( team_in_legend_global.indexOf(d), 1 );

                        /*
                        for (var ff=0;ff<legend_teams.length;ff++){
                            legend_teams[ff].team_color=color_scale_legend(ff);
                        }
                        */
						
						removeCountryFromLineChart(d.properties.admin); // FONDAMENTALE PER LA COMUNICAZIONE CON IL LINE-CHART
						
                        d3.select(".continent-map-legend-svg").selectAll("rect").remove();
                        d3.select(".continent-map-legend-svg").selectAll("text").remove();
                        d3.select(".continent-map-legend-svg").selectAll("rect").data(legend_teams).enter()

                            .append("rect").attrs({
                            "x":0,
                            "y":function(d,i) {if (i===0) return 5;return i*20;},
                            "width":10,
                            "height":10,
                            "fill":function(d,i) {return d.team_color;}
                        });
                        d3.select(".continent-map-legend-svg").selectAll("text").data(legend_teams).enter()
                            .append("text").attrs({
                            "x":10,
                            "y":function(d,i) {if (i===0) return 15;return i*20+10;}
                        }).text(function (d,i) {
							//console.log(d.properties.admin);
                            return d.properties.admin;
                        });

                        d3.select("body").select(".chordDiagram").select("svg").remove();

                        //console.log(stat);
                        //console.log(legend_teams);

                        var ris=get_directed_match_matrix(year.filter(function (t) { return parseInt(t)>=1882 }),legend_teams.map(function (t) { return t.properties.admin }));
                        plot_chord_diagram(ris,legend_teams);
                        return;

                    }
                    d.team_color=color_scale_legend(legend_teams.length);
                    //console.log(d.properties.admin+" "+ d.team_color);

                    d3.select("#radarWrapper"+ d.team_id).attr("visibility","visible").style('fill','none');;

                    d3.select("#contorni"+ d.team_id).style("stroke",d.team_color).style("fill",d.team_color).style("fill-opacity",0.1)
                        .style('fill','none');
                    d3.selectAll(".radarCircle"+ d.team_id).style("fill",d.team_color);




                    showCountry(d.properties.admin, d.team_color); // QUESTA FUNZIONE E' FONDAMENTALE PER COMUNICARE CON IL LINE-CHART! CONTROLLARE ATTENTAMENTE!
					
					legend_teams.push(d);
					team_in_legend_global.push(d);

                    d.clicked=true;
                    //console.log(legend_teams.length);
                    //console.log(legend_teams);

                    d3.select(".continent-map-legend-svg").selectAll("rect").data(legend_teams).enter()
                        .append("rect").attrs({
                        "x":0,
                        "y":function(d,i) { if (i===0) return 5;return i*20;},
                        "width":10,
                        "height":10,
                        "fill":d.team_color
                    });
                    d3.select(".continent-map-legend-svg").selectAll("text").data(legend_teams).enter()
                        .append("text").attrs({
                        "x":10,
                        "y":function(d,i) {if (i===0) return 15;return i*20+10;}
                    }).text(function (d,i) {
                        return d.properties.admin;
                    });
                    d3.select("body").select(".chordDiagram").select("svg").remove();
                    var stat=[];
                    for (var i=0;i<legend_teams.length;i++){
                        var el=[];
                        for (var j=0;j<legend_teams.length;j++) {
                            if (i === j){
                                el.push(0);
                            }
                            else{
                                el.push(i+j*2+1)
                            }

                        }
                        stat.push(el);
                    }
                    //console.log(stat);
                    //console.log(legend_teams);
                    var ris =get_directed_match_matrix(year.filter(function (t) { return parseInt(t)>=1882 }),legend_teams.map(function (t) { return t.properties.admin }));
                    plot_chord_diagram(ris,legend_teams);


                });





           /*
            map.selectAll(".text-country").data(json.features).enter().append("text")
                .text(function(d) {

                    if (played_by_year[d.properties.admin]){
                        d.played=played_by_year[d.properties.admin]
                        d.norm_played=d.played/max_p;
                    }
                    else{
                        d.played=0;
                        d.norm_played=0;
                    }

                    return "In "+d.properties.admin +' '+d.played+' games were played';
                })
                .attrs({"visibility":"hidden",
                    "class":"text-country",
                    "id":function(d){return "text-country-"+d.properties.admin.replace(/ /g,"_")},
                    "x":function(d) {return  path.centroid(d)[0]; },
                    "y":function(d) {return  path.centroid(d)[1];}});
             */




        });




    //Create panning buttons
    var createPanButtons = function() {

        //Create the clickable groups

        //North
        var north = svg.append("g")
            .attr("class", "pan")	//All share the 'pan' class
            .attr("id", "north");	//The ID will tell us which direction to head

        north.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", w)
            .attr("height", 30);

        north.append("text")
            .attr("x", w/2)
            .attr("y", 20)
            .html("&uarr;");

        //South
        var south = svg.append("g")
            .attr("class", "pan")
            .attr("id", "south");

        south.append("rect")
            .attr("x", 0)
            .attr("y", h - 30)
            .attr("width", w)
            .attr("height", 30);

        south.append("text")
            .attr("x", w/2)
            .attr("y", h - 10)
            .html("&darr;");

        //West
        var west = svg.append("g")
            .attr("class", "pan")
            .attr("id", "west");

        west.append("rect")
            .attr("x", 0)
            .attr("y", 30)
            .attr("width", 30)
            .attr("height", h - 60);

        west.append("text")
            .attr("x", 15)
            .attr("y", h/2)
            .html("&larr;")

        //East
        var east = svg.append("g")
            .attr("class", "pan")
            .attr("id", "east");

        east.append("rect")
            .attr("x", w - 30)
            .attr("y", 30)
            .attr("width", 30)
            .attr("height", h - 60);

        east.append("text")
            .attr("x", w - 15)
            .attr("y", h/2)
            .html("&rarr;")

        //Panning interaction

        d3.selectAll(".pan")
            .on("click", function() {

                //Set how much to move on each click
                var moveAmount = 50;

                //Set x/y to zero for now
                var x = 0;
                var y = 0;

                //Which way are we headed?
                var direction = d3.select(this).attr("id");

                //Modify the offset, depending on the direction
                switch (direction) {
                    case "north":
                        y += moveAmount;  //Increase y offset
                        break;
                    case "south":
                        y -= moveAmount;  //Decrease y offset
                        break;
                    case "west":
                        x += moveAmount;  //Increase x offset
                        break;
                    case "east":
                        x -= moveAmount;  //Decrease x offset
                        break;
                    default:
                        break;
                }

                //This triggers a zoom event, translating by x, y
                map.transition()
                    .call(zoom.translateBy, x, y);

            });

    };

    //Create zoom buttons
    var createZoomButtons = function() {

        //Create the clickable groups

        //Zoom in button
        var zoomIn = svg.append("g")
            .attr("class", "zoom")	//All share the 'zoom' class
            .attr("id", "in")		//The ID will tell us which direction to head
            .attr("transform", "translate(" + (w - 110) + "," + (h - 70) + ")");

        zoomIn.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 30)
            .attr("height", 30);

        zoomIn.append("text")
            .attr("x", 15)
            .attr("y", 20)
            .text("+");

        //Zoom out button
        var zoomOut = svg.append("g")
            .attr("class", "zoom")
            .attr("id", "out")
            .attr("transform", "translate(" + (w - 70) + "," + (h - 70) + ")");

        zoomOut.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 30)
            .attr("height", 30);

        zoomOut.append("text")
            .attr("x", 15)
            .attr("y", 20)
            .html("&ndash;");

        //Zooming interaction

        d3.selectAll(".zoom")
            .on("click", function() {

                //Set how much to scale on each click
                var scaleFactor;

                //Which way are we headed?
                var direction = d3.select(this).attr("id");

                //Modify the k scale value, depending on the direction
                switch (direction) {
                    case "in":
                        scaleFactor = 1.5;
                        break;
                    case "out":
                        scaleFactor = 0.75;
                        break;
                    default:
                        break;
                }

                //This triggers a zoom event, scaling by 'scaleFactor'
                map.transition()
                    .call(zoom.scaleBy, scaleFactor);

            });

    };

    createPanButtons();
    createZoomButtons();



}


