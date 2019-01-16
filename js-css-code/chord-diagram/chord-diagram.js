function plot_chord_diagram(matrix,teams)
{
    console.log('chord');
    console.log(teams);
    console.log(matrix);
    var error=false;
    if (teams.length<2 || matrix.every(function (t) { return t.every(function(v){return v===0}) })){
        var node1 ={'team_color':'#7fc97f','properties':{'admin':'team1'}};
        var node2 ={'team_color':'#beaed4','properties':{'admin':'team2'}};
        teams=[node1,node2];
        matrix=[[1,0],[0,1]];
        error=true;
    }
    //console.log("chord ");
    //console.log(teams);
    //console.log("hello");
    var margin = {
        top:5,
        left:35,
        rigth:20,
        down:0
    };
    var width=350,
        height=408;
    var out_width=width +margin.left+margin.down  ,
        out_height=height+margin.top+margin.down;

    var box =d3.select("body").select(".chordDiagram").append("svg").attrs({
        height:out_height,
        width:out_width})
        .append("g")
        .attrs({
            "transform":"translate("+margin.left+","+margin.top+")"
        });


    var outerRadius = Math.min(width, height) / 2 - 10,
        innerRadius = outerRadius - 15;

    var formatPercent = d3.format(",.0f");

    //var color_scale  = d3.scaleOrdinal(d3.schemeCategory10);


    //Europe Africa Asia America Oceania
    //var continent=["Europe", "Africa","Asia", "America", "Oceania"];
    //var continent_id =[0,1,2,3,4];

    //var olympic_color=["#3e76ec","#000000","#ffce01","#ff0000","#179a13"];

    var arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);


    var layout = d3.chord()
        .padAngle(.02)
        .sortSubgroups(d3.descending)
        .sortChords(d3.ascending);

    var ribbon = d3.ribbon()
        .radius(innerRadius);

    var svg = box
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("id", "circle")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    svg.append("circle")
        .attr("r", outerRadius);


/*
    d3.json("database/matrix.json", function(matrix) {

        var transformed_data = layout(matrix);
        //console.log(transformed_data.groups);
        var single_groups = transformed_data.groups;
        console.log(single_groups);

        // Add the group arc.
        var group = svg.selectAll(".group")
            .data(single_groups)
            .enter().append("g")
            .attr("class", "group");



        // Add the  path arc: real visualization.
        var groupPath = group.append("path")
            .attr("id", function(d, i) { return "group" + i; })
            .attr("d", arc)
            .style("fill", function(d, i) { return olympic_color_scale(i); })
            .on("mouseover", mouseover)
            .on("click", mouseclick);


        // Add an elaborate mouseover title for each arc.
        groupPath.append("title").text(function(d,i) {

            return continent[i] + " has won "+d.value+" matches";

        });

        // Add the  text label.
        var groupText = group.append("text")
            .attrs({x:2,dy:12});
        groupText.append("textPath")
            .attr("xlink:href", function(d, i) { return "#group" + i; })
            .style("text-anchor","start") //place the text halfway on the arc
            .attrs({"font-family":"Times New Roman"})
            .text(function(d, i) { return continent[i]; });




        // Add the chords.
        var chord = svg.selectAll(".chord")
            .data(transformed_data)
            .enter().append("path")
            .attr("class", "chord")
            .style("fill", function(d) { return olympic_color_scale(d.source.index); })
            .attr("d", ribbon);


        // Add an elaborate mouseover title for each chord.
        chord.append("title").text(function(d) {
            return continent[d.source.index]
                + " → " + continent[d.target.index]
                + ": " + formatPercent(d.source.value)
                + "\n" + continent[d.target.index]
                + " → " + continent[d.source.index]
                + ": " + formatPercent(d.target.value);
        });

        function mouseover(d, i) {
            console.log("ciao");
            chord.classed("myopacity",function(v)
            {
                return v.source.index !== i
                    && v.target.index !== i;

            });

        }
        function mouseclick(d, i) {
            console.log("ciao");
            chord.classed("myopacity",function(v)
            {
                return false;
            });

        }

    });
*/

    var transformed_data = layout(matrix);
    //console.log(transformed_data.groups);
    var single_groups = transformed_data.groups;
    //console.log(single_groups);

    // Add the group arc.
    var group = svg.selectAll(".group")
        .data(single_groups)
        .enter().append("g")
        .attr("class", "group");



    // Add the  path arc: real visualization.
    var groupPath = group.append("path")
        .attr("id", function(d, i) { return "group" + i; })
        .attr("d", arc)
        .style("fill", function(d, i) { return (teams[i].team_color); })
        .on("mouseover", mouseover)
        .on("click", mouseclick);


    // Add an elaborate mouseover title for each arc.
    groupPath.append("title").text(function(d,i) {

        return teams[i].properties.admin + " has won "+d.value+" matches";

    });

    // Add the  text label.
    var groupText = group.append("text")
        .attrs({x:2,dy:12});
    groupText.append("textPath")
        .attr("xlink:href", function(d, i) { return "#group" + i; })
        .style("text-anchor","start") //place the text halfway on the arc
        .attrs({"font-family":"Times New Roman"})
        //.text(function(d, i) {  return teams[i].properties.admin});



    if (error){return;}

    // Add the chords.
    var chord = svg.selectAll(".chord")
        .data(transformed_data)
        .enter().append("path")
        .attr("class", "chord")
        .style("fill", function(d) {return (teams[d.source.index].team_color); })
        .attr("d", ribbon);


    // Add an elaborate mouseover title for each chord.
    chord.append("title").text(function(d) {
        return teams[d.source.index].properties.admin
            + " → " + teams[d.target.index].properties.admin
            + ": " + formatPercent(d.source.value)
            + "\n" + teams[d.target.index].properties.admin
            + " → " + teams[d.source.index].properties.admin
            + ": " + formatPercent(d.target.value);
    });

    function mouseover(d, i) {
        //console.log("ciao");
        if (error)return;
        chord.classed("myopacity",function(v)
        {
            return v.source.index !== i
                && v.target.index !== i;

        });

    }
    function mouseclick(d, i) {
        //console.log("ciao");
        chord.classed("myopacity",function(v)
        {
            return false;
        });

    }


}