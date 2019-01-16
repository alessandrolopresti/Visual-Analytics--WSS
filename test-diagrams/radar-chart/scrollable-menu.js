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

            this.setAttribute("style","background:"+color(node.id) + ";opacity:"+"0.5");


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
                    .attr("id", function(d,i){return "radar-legend"+d}).attr("width",10)
                    .attr("height",10)
                    .attr("class","radar-legend-class")
                    .attr("x",245)
                    .attr("y",function(d,i){return -190+i*30})
                    .attr("fill",function(d,i){return color_scale(d)});
                star_plot.selectAll("void")
                    .data(list_teams).enter().append("text")
                    .attr("x",260)
                    .attr("y",function(d,i){return -180+i*30})
                    .text(function (d,i) {
                        return teams_name[d]

                    })
                    .attr("class","radar-legend-class");


                return;
            }

            star_plot.select("#radarWrapper"+this.id).attr("visibility","visible");
            node.clicked=true;

            star_plot.append("rect").attr("id","radar-legend"+this.id).attr("width",10)
                .attr("height",10)
                .attr("class","radar-legend-class")
                .attr("x",245)
                .attr("y",-190+selected_teams*30)
                .attr("fill",color_scale(this.id));
            star_plot.append("text")
                .attr("x",260)
                .attr("y",function(d,i){return -180+selected_teams*30})
                .text(function (d,i) {
                    return teams_name[node.id]

                })
                .attr("class","radar-legend-class");

            //console.log(tmp);
            list_teams.push(this.id);
            selected_teams+=1;


        });
        document.getElementById("radar-legend-myDropdown").appendChild(node);
        i++;

    });






}


function myFunction() {
    document.getElementById("radar-legend-myDropdown").classList.toggle("radar-legend-show");
}

function filterFunction() {
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