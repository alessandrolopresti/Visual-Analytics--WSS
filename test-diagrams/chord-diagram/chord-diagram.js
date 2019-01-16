function plot_chord_diagram()
{

    var width = 900,
        height = 900,
        outerRadius = Math.min(width, height) / 2 - 10,
        innerRadius = outerRadius - 24;

    var formatPercent = d3.format(",.0f");

    var arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

    var layout = d3.chord()
        .padAngle(.02)
        .sortSubgroups(d3.descending)
        .sortChords(d3.ascending);

    var ribbon = d3.ribbon()
        .radius(innerRadius);

    var svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("id", "circle")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    svg.append("circle")
        .attr("r", outerRadius);

    d3.csv("test-diagrams/chord-diagram/teams.csv", function(cities) {

        d3.json("test-diagrams/chord-diagram/matrix.json", function(matrix) {

            console.table(cities);
            var transformed_data = layout(matrix);
            //console.log(transformed_data.groups);
            var single_groups = transformed_data.groups;

            // Add the group arc.
            var group = svg.selectAll(".group")
                .data(single_groups)
                .enter().append("g")
                .attr("class", "group");






            // Add the  path arc :real visualization.
            var groupPath = group.append("path")
                .attr("id", function(d, i) { return "group" + i; })
                .attr("d", arc)
                .style("fill", function(d, i) { return cities[i].color; })
                .on("mouseover", mouseover)
                .on("click", mouseclick);


            // Add an elaborate mouseover title for each arc.
            groupPath.append("title").text(function(d,i) {

                return "ciao bello "+cities[i].name

            });

            // Add the  text label.
            var groupText = group.append("text")
                .attrs({x:2,dy:15});
            groupText.append("textPath")
                .attr("xlink:href", function(d, i) { return "#group" + i; })
                .style("text-anchor","start") //place the text halfway on the arc
                .text(function(d, i) { return cities[i].name; });



            // Add the chords.
            var chord = svg.selectAll(".chord")
                .data(transformed_data)
                .enter().append("path")
                .attr("class", "chord")
                .style("fill", function(d) { return cities[d.source.index].color; })
                .attr("d", ribbon)


            // Add an elaborate mouseover title for each chord.
            chord.append("title").text(function(d) {
                return cities[d.source.index].name
                    + " → " + cities[d.target.index].name
                    + ": " + formatPercent(d.source.value)
                    + "\n" + cities[d.target.index].name
                    + " → " + cities[d.source.index].name
                    + ": " + formatPercent(d.target.value);
            });

            function mouseover(d, i) {
                //console.log("ciao");
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

        });
    });


}