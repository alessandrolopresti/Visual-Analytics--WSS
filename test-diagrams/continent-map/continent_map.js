function draw_continent_map()
{


    //Width and height
    var w = 1000;
    var h = 500;

    //Define map projection
    var projection = d3.geoMercator()
        .translate([0, 0]);

    //Define path generator
    var path = d3.geoPath()
        .projection(projection);

    //Define quantize scale to sort data values into buckets of color
    var color = d3.scaleQuantize()
        .range(["rgb(237,248,233)","rgb(186,228,179)","rgb(116,196,118)","rgb(49,163,84)","rgb(0,109,44)"]);
    //Colors taken from colorbrewer.js, included in the D3 download

    //Number formatting for population values
    var formatAsThousands = d3.format(",");  //e.g. converts 123456 to "123,456"

    //Number formatting for ag productivity values
    var formatDecimals = d3.format(".3");  //e.g. converts 1.23456 to "1.23"

    //Create SVG element
    var svg = d3.select("body")
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
        var newScale = d3.event.transform.k * 2000;

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



    }

    //Then define the zoom behavior
    var zoom = d3.zoom()
        .scaleExtent([ 0.02, 20.0 ])
        .translateExtent([[ -12000, -7000 ], [ 12000, 7000 ]])
        .on("zoom", zooming);

    //The center of the country, roughly
    var center = projection([-97.0, 39.0]);

    //Create a container in which all zoom-able elements will live
    var map = svg.append("g")
        .attr("id", "map")
        .call(zoom)  //Bind the zoom behavior
        .call(zoom.transform, d3.zoomIdentity  //Then apply the initial transform
            .translate(w/2, h/2)
            .scale(0.09)
            .translate(-center[0], -center[1]));

    //Create a new, invisible background rect to catch zoom events
    map.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", w)
        .attr("height", h)
        .attr("opacity", 0);


    //Load in GeoJSON data
    d3.json("world.geo.json", function(json) {



        //Bind data and create one path per GeoJSON feature
        var tmp=json.features;
        console.log(tmp[0].properties.admin);
        color_scale=d3.scaleOrdinal(d3.schemeCategory10);
        map.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path)
            .style('stroke', 'white')
            .style('stroke-width', 1.5)
            .style("opacity",0.8)
            .style("fill", function(d,i) { return color_scale(i); })
            .on('mouseover',function(d){
                d3.select(this)
                    .style("opacity", 1)
                    .style("stroke","white")
                    .style("stroke-width",3);
                console.log(d3.select("#text-country-"+d.properties.admin.replace(/ /g,"_")));
                d3.select("#text-country-"+d.properties.admin.replace(/ /g,"_")).attr("visibility","visible");



            })
            .on('mouseout', function(d){
                d3.select("#text-country-"+d.properties.admin.replace(/ /g,"_")).attr("visibility","hidden");
                d3.select(this)
                    .style("opacity", 0.8)
                    .style("stroke","white")
                    .style("stroke-width",0.3);
            })
            .attrs({"class":"country","id":function(d){return d.properties.admin}});

        map.selectAll(".text-country").data(json.features).enter().append("text")
            .text(function(d) {
                return d.properties.admin;
            })
            .attrs({"visibility":"hidden",
                "class":"text-country",
                "id":function(d){return "text-country-"+d.properties.admin.replace(/ /g,"_")},
                "x":function(d) {return  path.centroid(d)[0]; },
                "y":function(d) {return  path.centroid(d)[1];}});




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
            .html("&uarr;")

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
            .html("&darr;")

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