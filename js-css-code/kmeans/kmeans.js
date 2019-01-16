
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
    ,'Ukraine']


function draw_scatterplot_kmeans()
{
    var margin = {top: 4, right: 27.5, bottom: 36, left: 32.5},
        width = 910 - margin.left - margin.right,
        height = 420.65 - margin.top - margin.bottom;

    /*
     * value accessor - returns the value to encode for a given data object.
     * scale - maps value to a visual display encoding, such as a pixel position.
     * map function - maps from data value to display value
     * axis - sets up axis
     */

// setup x
    var xValue = function(d) { return d.x;}, // data -> value
        xScale = d3.scaleLinear().range([0, width]), // value -> display
        xMap = function(d) { return xScale(xValue(d));}, // data -> display
        xAxis = d3.axisBottom().scale(xScale);

// setup y
    var yValue = function(d) { return d.y;}, // data -> value
        yScale = d3.scaleLinear().range([height, 0]), // value -> display
        yMap = function(d) { return yScale(yValue(d));}, // data -> display
        yAxis = d3.axisLeft().scale(yScale);

// setup fill color
    var cValue = function(d) { return d.cluster;},
        //color = d3.scaleOrdinal().range(['#7fc97f','#beaed4','#fdc086', '#ffff99', '#386cb0
        color = d3.scaleOrdinal().range(['#1b9e77','#d95f02','#7570b3','#e7298a',





'#66a61e']);



// add the graph canvas to the body of the webpage
    var svg = d3.select("body").select('#kmeans').append("svg")
		.attr("id", "kmeans")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom + 20)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



// load data
    /*
    d3.csv("cereal.csv", function(error, data) {

        // change string (from CSV) into number format
        data.forEach(function(d) {
            d.Calories = +d.Calories;
            d["Protein (g)"] = +d["Protein (g)"];
//    console.log(d);
        });

        // don't want dots overlapping axis, so add in buffer to data domain
        xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
        yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

        // x-axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("x", width)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text("Calories");

        // y-axis
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Protein (g)");

        // draw dots
        svg.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 3.5)
            .attr("cx", xMap)
            .attr("cy", yMap)
            .style("fill", function(d) { return color(cValue(d));})
            .on("mouseover", function(d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(d["Cereal Name"] + "<br/> (" + xValue(d)
                    + ", " + yValue(d) + ")")
                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        // draw legend
        var legend = svg.selectAll(".legend")
            .data(color.domain())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        // draw legend colored rectangles
        legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        // draw legend text
        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return d;})
    });
    */

    d3.csv('database/kmeans.csv',function(error,data){
        console.log(data);



        // don't want dots overlapping axis, so add in buffer to data domain
        //xScale.domain([ d3.min(data, xValue)-100, d3.max(data, xValue)+100]);
        //yScale.domain([d3.min(data, yValue)-100, d3.max(data, yValue) +100]);
        xScale.domain([-40, 40]);
        yScale.domain([-70, 30]);

        // x-axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        // y-axis
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        // draw dots
        svg
		.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 3.5)
            .attr("cx", xMap)
            .attr("cy", yMap)
            .style("fill", function(d) { return color(cValue(d));})
            .on("mouseover", function(d) {

                console.log(d);
                d3.select("#tooltip2")
                    .style("left", xMap(d) + 850+"px")
                    .style("top", yMap(d) +600+ "px")//sistema qua x il tooltip
                    .select("#value2")
                    .text(d.team+': '+d.rank);

                d3.select("#tooltip2").classed("hidden", false);
                if (team_in_legend_global.map(function(d){return d.properties.admin;}).indexOf(d.team)!==-1) return;

                showCountry(d.team, color(cValue(d)));

                team_id=country_id_by_pos.indexOf(d.team);
                console.log("asasdsd");
                console.log(team_id);



                d3.select("#radarWrapper"+ team_id).attr("visibility","visible").style('fill','none');;

                d3.select("#contorni"+ team_id).style("stroke",color(cValue(d))).style("fill",color(cValue(d))).style("fill-opacity",0.1)
                    .style('fill','none');
                d3.selectAll(".radarCircle"+ team_id).style("fill",color(cValue(d)));







            })
            .on("mouseout", function(d) {
            	console.log("sasdd");
            	console.log(team_in_legend_global);
            	
                d3.select("#tooltip2").classed("hidden", true);
                if (team_in_legend_global.map(function(d){return d.properties.admin;}).indexOf(d.team)!==-1) return;
                removeCountryFromLineChart(d.team);
                team_id=country_id_by_pos.indexOf(d.team);
                d3.select("#radarWrapper"+ team_id).attr("visibility","hidden");

            });

        // draw legend
        var legend = svg.selectAll(".legend")
            .data(color.domain().sort())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        // draw legend colored rectangles
        legend.append("rect")
            .attr("x", width - 820)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        // draw legend text
        legend.append("text")
            .attr("x", width - 720)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return "Cluster: "+d;})

    });

}

