var svg = d3.select("svg")
            .attr("width", 1080)
            .attr("height", 1060);

var margin = {top: 50, right: 80, bottom: 480, left: 150},
    margin2 =  { top: 480, right: 80, bottom: 200, left: 200 },
    marginOverview = { top: 580, right: 400, bottom: 430,  left: 400 },
    
    width = svg.attr("width") - margin.left - margin.right,
    width2 = svg.attr("width") - margin2.left - margin2.right,
    height = svg.attr("height") - margin.top - margin.bottom,
    height2 = svg.attr("height") - margin2.top - margin2.bottom,
    
    heightOverview = svg.attr("height") - marginOverview.top - marginOverview.bottom,
    widthOverview = svg.attr("width") - marginOverview.left - marginOverview.right,
    
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


//color Def
var usBlue = "#99bbff", chiRed = "#ee4444", hebGreen = "#22aa22", rusDarkBlue = "#222299", spaYellow = "#ffaa33";

//define time format
var parseDate = d3.timeParse("%Y");
var show_number = true;
var maxY;

var formatComma = d3.format(",");

//define scales
var x = d3.scaleTime().range([0, width]),
    x_bar = d3.scaleBand().rangeRound([width / 10 * 8 + 10, width]).padding(0.3).align(0.3),
    y = d3.scaleLinear().range([height - 50, 50]),
    y_bar = d3.scaleLinear().range([height - 50, 50]),
    y_percent = d3.scaleLinear().range([height - 50, 50]),

    //color scale
    z_bar = d3.scaleOrdinal(d3.schemeCategory10);


// **********
// mathematical scales for the x2 and y2 axes
var x2 = d3.scaleTime().range([0, width2]);
var y2 = d3.scaleLinear().range([height2, 0]);
var xOverview = d3.scaleTime().range([0, widthOverview]);                   
var yOverview = d3.scaleLinear().range([heightOverview, 0]);                    

var colour = d3.scaleOrdinal().range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00","#ff7567"]);


// something for us to render the chart into

var main = svg.append("g")
              .attr("class", "main")
//              .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")")
              .attr("transform", "translate(142,500)");
var overview = svg.append("g")
                  .attr("class", "overview")
                  .attr("transform", "translate(" + 1.07 * marginOverview.left + "," + marginOverview.top + ")");

// brush tool to let us zoom and pan using the overview chart
var brush = d3.brushX()                // Initiate the brushX() 
    .extent([[0, 0], [widthOverview, heightOverview]])  // [0,0] means the distance between the top-margin of the gray shadow and that of the chart
    .on("brush end", brushed);

// **********


var stack = d3.stack();
//define Tooltip
var div = d3.select("body").append("toolTip")
        .attr("class", "tooltip")
        .style("opacity", 0);

//define line generator
var line = d3.line()
    .curve(d3.curveBasis)//interpolated using curveBagit sis: smooth
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.number); });

var line_percent = d3.line()
    .curve(d3.curveBasis)
    .x(function(d){ return x(d.year)})
    .y(function(d) {return y_percent(d.number/d.sum)});

var select_lang = [true,true,true,true,true];

//========== Toggle buttons =============
g.append("text")
        .attr("class", "toggleText")
        .style("fill", usBlue)
        .attr("x", 80)
        .attr("y", 20)
        .style("opacity", 1)
        .text("American English")
var button_us = g.append("rect")
        .attr("id", "usEng_button")
        .attr("x", 75)
        .attr("y", 5)
        .attr("height", "20px")
        .attr("width", "140px")
        .style("stroke", usBlue)
        .style("fill", "#ffffff")
        .style("fill-opacity", "0")
        .style("opacity", 1)
        .on("mouseover", function() { 
            svg.select("#usEng_button")
                .style("stroke-width","5px"); 
            }
        )
        .on("mouseout", function() { 
            svg.select("#usEng_button")
                .style("stroke-width","1px");
            }
        );

g.append("text")
        .attr("class", "toggleText")
        .style("fill", chiRed)
        .attr("x", width/10 * 3)
        .attr("y", 20)
        .style("opacity", 1)
        .text("Chinese")

var button_chi = g.append("rect")
        .attr("id", "chi_button")
        .attr("x", width/10 * 3 - 5)
        .attr("y", 5)
        .attr("height", "20px")
        .attr("width", "130px")
        .style("stroke", chiRed)
        .style("fill", "#ffffff")
        .style("fill-opacity", "0")
        .style("opacity", 1)
        .on("mouseover", function() { 
            svg.select("#chi_button")
                .style("stroke-width","5px"); 
            }
        )
        .on("mouseout", function() { 
            svg.select("#chi_button")
                .style("stroke-width","1px");
            }
        );

g.append("text")
        .attr("class", "toggleText")
        .style("fill", hebGreen)
        .attr("x", width/10 * 5)
        .attr("y", 20)
        .style("opacity", 1)
        .text("Hebrew")
var button_heb = g.append("rect")
        .attr("id", "heb_button")
        .attr("x", width/10 * 5 - 5)
        .attr("y", 5)
        .attr("height", "20px")
        .attr("width", "130px")
        .style("stroke", hebGreen)
        .style("fill", "#ffffff")
        .style("fill-opacity", "0")
        .style("opacity", 1)
        .on("mouseover", function() { 
            svg.select("#heb_button")
                .style("stroke-width","5px"); 
            }
        )
        .on("mouseout", function() { 
            svg.select("#heb_button")
                .style("stroke-width","1px");
            }
        );

g.append("text")
        .attr("class", "toggleText")
        .style("fill", rusDarkBlue)
        .attr("x", width / 10 * 7)
        .attr("y", 20)
        .style("opacity", 1)
        .text("Russian")
var button_rus = g.append("rect")
        .attr("id", "rus_button")
        .attr("x", width / 10 * 7 - 5)
        .attr("y", 5)
        .attr("height", "20px")
        .attr("width", "130px")
        .style("stroke", rusDarkBlue)
        .style("fill", "#ffffff")
        .style("fill-opacity", "0")
        .style("opacity", 1)
        .on("mouseover", function() { 
            svg.select("#rus_button")
                .style("stroke-width","5px"); 
            }
        )
        .on("mouseout", function() { 
            svg.select("#rus_button")
                .style("stroke-width","1px");
            }
        );

g.append("text")
        .attr("class", "toggleText")
        .style("fill", spaYellow)
        .attr("x", width/10 * 9)
        .attr("y", 20)
        .style("opacity", 1)
        .text("Spanish")
var button_spa = g.append("rect")
        .attr("id", "spa_button")
        .attr("x", width/10 * 9 - 5)
        .attr("y", 5)
        .attr("height", "20px")
        .attr("width", "130px")
        .style("stroke", spaYellow)
        .style("fill", "#ffffff")
        .style("fill-opacity", "0")
        .style("opacity", 1)
        .on("mouseover", function() { 
            svg.select("#spa_button")
                .style("stroke-width","5px"); 
            }
        )
        .on("mouseout", function() { 
            svg.select("#spa_button")
                .style("stroke-width","1px");
            }
        );
// =====================================//
//============ printPath ================//
function printPath_Eng(data) {
    var line_usEng = g.selectAll(".usEng")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "usEng");
    
    line_usEng.append("path")
            .attr("class", "line")
            .style("opacity", 0)
            .attr("d", function(d) {
                if (d.id == "average") {
                    if (show_number) {
                        return line(d.values);
                    } else {
                        return line_percent(d.values);
                    }
                }
            })
            .attr("clip-path", "url(#clip)")
            .style("stroke", usBlue)
            .transition()
            .duration(500)
            .style("opacity",0.8);
    
    line_usEng.on("mouseover", function(d) {
                line_usEng.style("opacity",1)
                    .style("stroke-width","6px");
                div.transition()
                    .duration(200)
                    .style("opacity", 0.9);
                div.html(
                        d.language + "<br/>" 
                        + "Democracy : " + formatComma(d.democracy) + "<br/>"
                        + "Liberty : " + formatComma(d.liberty) + "<br/>"
                        + "Justice : " + formatComma(d.justice) + "<br/>"
                        + "Equality : " + formatComma(d.equality) + "<br/>"
                        + "Rights : " + formatComma(d.rights) + "<br/>" 
                        + "Election : " + formatComma(d.election) + "<br/>"
                        + "Citizen : " + formatComma(d.citizen) + "<br/>"
                        + "Protests : " + formatComma(d.protests)
                )
                        .style("left", (d3.event.pageX + 30) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
               line_usEng.style("opacity",0.8)
                    .style("stroke-width","6px");
               div.transition()
                 .duration(500)
                 .style("opacity", 0);
               });
}

function printPath_Chinese(data) {
    var line_Chinese = g.selectAll(".Chinese")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "Chinese");
    line_Chinese.append("path")
            .attr("class", "line")
            .style("opacity", 0)
            .attr("d", function(d) {
                if (d.id == "average") {
                    if (show_number) {
                        return line(d.values);
                    } else {
                        return line_percent(d.values);
                    }
                }
            })
            .attr("clip-path", "url(#clip)")
            .style("stroke", chiRed)
            .transition()
            .duration(500)
            .style("opacity",1);
    line_Chinese.on("mouseover", function(d) {
                div.transition()
                    .duration(200)
                    .style("opacity", 0.9);
                div.html(
                        d.language + "<br/>" 
                        + "Democracy : " + formatComma(d.democracy) + "<br/>"
                        + "Liberty : " + formatComma(d.liberty) + "<br/>"
                        + "Justice : " + formatComma(d.justice) + "<br/>"
                        + "Equality : " + formatComma(d.equality) + "<br/>"
                        + "Rights : " + formatComma(d.rights) + "<br/>" 
                        + "Election : " + formatComma(d.election) + "<br/>"
                        + "Citizen : " + formatComma(d.citizen) + "<br/>"
                        + "Protests : " + formatComma(d.protests)
                )
                        .style("left", (d3.event.pageX + 30) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
               div.transition()
                 .duration(500)
                 .style("opacity", 0);
               })
}
function printPath_Hebrew(data) {
    var line_Hebrew = g.selectAll(".Hebrew")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "Hebrew");
    line_Hebrew.append("path")
            .attr("class", "line")
            .style("opacity",0)
            .attr("d", function(d) {
                if (d.id == "average") {
                    if (show_number) {
                        return line(d.values);
                    } else {
                        return line_percent(d.values);
                    }
                }
            })
            .attr("clip-path", "url(#clip)")
            .style("stroke", hebGreen)
            .transition()
            .duration(500)
            .style("opacity",1);
    line_Hebrew.on("mouseover", function(d) {
                div.transition()
                    .duration(200)
                    .style("opacity", 0.9);
                div.html(
                        d.language + "<br/>" 
                        + "Democracy : " + formatComma(d.democracy) + "<br/>"
                        + "Liberty : " + formatComma(d.liberty) + "<br/>"
                        + "Justice : " + formatComma(d.justice) + "<br/>"
                        + "Equality : " + formatComma(d.equality) + "<br/>"
                        + "Rights : " + formatComma(d.rights) + "<br/>" 
                        + "Election : " + formatComma(d.election) + "<br/>"
                        + "Citizen : " + formatComma(d.citizen) + "<br/>"
                        + "Protests : " + formatComma(d.protests)
                )
                        .style("left", (d3.event.pageX + 30) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
               div.transition()
                 .duration(500)
                 .style("opacity", 0);
               });
}
function printPath_Russian(data) {
    var line_Russian = g.selectAll(".Russian")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "Russian");
    line_Russian.append("path")
            .attr("class", "line")
            .style("opacity",0)
            .attr("d", function(d) {
                if (d.id == "average") {
                    if (show_number) {
                        return line(d.values);
                    } else {
                        return line_percent(d.values);
                    }
                }
            })
            .attr("clip-path", "url(#clip)")
            .style("stroke", rusDarkBlue)
            .transition()
            .duration(500)
            .style("opacity",1);
    line_Russian.on("mouseover", function(d) {
                div.transition()
                    .duration(200)
                    .style("opacity", 0.9);
                div.html(
                        d.language + "<br/>" 
                        + "Democracy : " + formatComma(d.democracy) + "<br/>"
                        + "Liberty : " + formatComma(d.liberty) + "<br/>"
                        + "Justice : " + formatComma(d.justice) + "<br/>"
                        + "Equality : " + formatComma(d.equality) + "<br/>"
                        + "Rights : " + formatComma(d.rights) + "<br/>" 
                        + "Election : " + formatComma(d.election) + "<br/>"
                        + "Citizen : " + formatComma(d.citizen) + "<br/>"
                        + "Protests : " + formatComma(d.protests)
                )
                        .style("left", (d3.event.pageX + 30) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
               div.transition()
                 .duration(500)
                 .style("opacity", 0);
               });
}
function printPath_Spanish(data) {
    var line_Spanish = g.selectAll(".Spanish")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "Spanish");
    line_Spanish.append("path")
            .attr("class", "line")
            .style("opacity",0)
            .attr("d", function(d) {
                if (d.id == "average") {
                    if (show_number) {
                        return line(d.values);
                    } else {
                        return line_percent(d.values);
                    }
                }
            })
            .attr("clip-path", "url(#clip)")
            .style("stroke", spaYellow)
            .transition()
            .duration(500)
            .style("opacity",1);
    line_Spanish.on("mouseover", function(d) {
                div.transition()
                    .duration(200)
                    .style("opacity", 0.9);
                div.html(
                        d.language + "<br/>" 
                        + "Democracy " + formatComma(d.democracy) + "<br/>"
                        + "Liberty : " + formatComma(d.liberty) + "<br/>"
                        + "Justice : " + formatComma(d.justice) + "<br/>"
                        + "Equality : " + formatComma(d.equality) + "<br/>"
                        + "Rights : " + formatComma(d.rights) + "<br/>" 
                        + "Election : " + formatComma(d.election) + "<br/>"
                        + "Citizen : " + formatComma(d.citizen) + "<br/>"
                        + "Protests : " + formatComma(d.protests)
                )
                        .style("left", (d3.event.pageX + 30) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
               div.transition()
                 .duration(500)
                 .style("opacity", 0);
               });
}
function removePath(name) {
    var line = g.selectAll("." + name);
    line.remove();
}

//move the Y axis to close to the chart
function move_percent(){
       g.selectAll(".axis-y")
        .attr("transform", "translate(" + (show_number ? "0" : "-80") + ", 0)")
        .style("opacity", show_number ? 1 : 0.2);
       g.selectAll("#rightText")
        .attr("y", show_number ? -75 : -150);
       g.selectAll("#rightRect")
        .attr("y", show_number ? -75: - 150);

       g.selectAll(".axis-y-percent")
        .transition()
        .duration(500)
        .attr("transform", "translate(" + (show_number ? "-90" : "0") + ", 0)" )
        .style("opacity", show_number ? 0.2 : 1);
       g.selectAll("#percentText")
        .transition()
        .duration(500)
        .attr("y", show_number ? -145 : -65);
       g.selectAll("#percentRect")
        .transition()
        .duration(500)
        .attr("y", show_number ? -145: - 65);
}


//======================= load data ===========================
d3.queue()
    .defer(d3.csv, "usEng.csv", type)
    .defer(d3.csv, "Chinese.csv", type)
    .defer(d3.csv, "Heb.csv", type)
    .defer(d3.csv, "rus.csv", type)
    .defer(d3.csv, "spa.csv", type)
    .await(function(error, usEng_data, chi_data, heb_data, rus_data, spa_data) {
        if (error) {console.error("csv reading error: " + error)}
    var list = [usEng_data, chi_data, heb_data, rus_data, spa_data];
    
    
    list.forEach(function(language) {
        //console.table(language);
        language.forEach(function(d) {
            d.date = parseDate(d.year);
            d.sum = + d.all;
        });
    });
    
    var words_usEng = list[0].columns.slice(1,10).map(function(id) {
        return {
          language: "American English",
          id: (id === "total" ? "average" : id),
          values: (id === "total" ? list[0].map(function(d) {
                return {language: "American English", year: d.year, number: d[id]/8, sum: +d.sum}; }) : list[0].map(function(d) {
              return {language: "AmericanEnglish", year: d.year, number:d[id], sum: +d.sum};
          })),
          democracy: 38131,
          liberty: 62626,
          justice: 83210,
          equality: 50127,
          rights: 123266,
          election: 50707,
          citizen: 60464,
          protests: 30176
        }
    });
    console.log(words_usEng.values);
    var words_chi = list[1].columns.slice(1,10).map(function(id) {
        return {
          language: "Chinese",
          id: (id === "total" ? "average" : id),
          values: (id === "total" ? list[1].map(function(d) {
                return {language: "Chinese", year: d.year, number: d[id]/8, sum: +d.sum}; }) : list[1].map(function(d) {
              return {language: "Chinese", year: d.year, number:d[id], sum: +d.sum};
          })),
          democracy: 8853,
          liberty: 10217,
          justice: 5785,
          equality: 5378,
          rights: 8455,
          election: 5872,
          citizen: 5695,
          protests: 3891
        }
    });
    var words_heb = list[2].columns.slice(1,10).map(function(id) {
        return {
          language: "Hebrew",
          id: (id === "total" ? "average" : id),
          values: (id === "total" ? list[2].map(function(d) {
                return {language: "Hebrew", year: d.year, number: d[id]/8, sum: +d.sum}; }) : list[2].map(function(d) {
              return {language: "Hebrew", year: d.year, number:d[id], sum: +d.sum};
          })),
          democracy: 630,
          liberty: 2021,
          justice: 2798,
          equality: 1163,
          rights: 2605,
          election: 1248,
          citizen: 1497,
          protests: 501
        }
    });
    var words_rus = list[3].columns.slice(1,10).map(function(id) {
        return {
          language: "Russian",
          id: (id === "total" ? "average" : id),
          values: (id === "total" ? list[3].map(function(d) {
                return {language: "Russian", year: d.year, number: d[id]/8, sum: +d.sum}; }) : list[3].map(function(d) {
              return {language: "Russian", year: d.year, number:d[id], sum: +d.sum};
          })),
          democracy: 1735,
          liberty: 12047,
          justice: 11870,
          equality: 9131,
          rights: 22706,
          election: 6277,
          citizen: 7254,
          protests: 7761
        }
    });
    var words_spa = list[4].columns.slice(1,10).map(function(id) {
        return {
          language: "Russian",
          id: (id === "total" ? "average" : id),
          values: (id === "total" ? list[4].map(function(d) {
                return {language: "Spanish", year: d.year, number: d[id]/8, sum: +d.sum}; }) : list[4].map(function(d) {
              return {language: "Spanish", year: d.year, number:d[id], sum: +d.sum};
          })),
          democracy: 16707,
          liberty: 14000,
          justice: 211,
          equality: 20606,
          rights: 29628,
          election: 23942,
          citizen: 19138,
          protests: 17607
        }
    });
    var list_lang = [words_usEng, words_chi, words_heb, words_rus, words_spa];
    
    
    
    var array_maxNumsOfList = [];
    list_lang.forEach(function(lang_words) {
        var temp = findMaxFromLanguageTable(lang_words);
        console.log(findMaxFromLanguageTable(lang_words));
        array_maxNumsOfList.push(temp);
    });
    
    var array_maxPercentOfList = [];
    list_lang.forEach(function(lang_words) {
        var temp = findMaxPercent(lang_words);
        array_maxPercentOfList.push(temp);
    });
    console.log(array_maxPercentOfList);
    console.log(array_maxNumsOfList);
    
    //define x axis
    x.domain(d3.extent(usEng_data, function(d) { return d.year; }));
    //define y axis
    y.domain([
        0,
        d3.max(array_maxNumsOfList)
    ]);
    y_percent.domain([
        0,
        d3.max(array_maxPercentOfList)*0.94
    ]);

    
    //append x axis
    g.append("g")
        .attr("class", "axis axis-x")
        .attr("transform", "translate(0," + (height - 50) + ")")
        .call(d3.axisBottom(x));

    //append y axis
    g.append("g")
        .attr("class", "axis axis-y")
        .call(d3.axisLeft(y))
        .style("opacity", 0)
        .transition()
        .duration(500)
        .style("opacity", 1);
    
    //append y text

    g.append("text")
        .attr("id", "rightText")
        .attr("y", -75)
        .attr("x", -300)
        .attr("dy", "0.9em")
        .attr("transform", "rotate(-90)")
        .style("opacity", 0)
        .text("Volume of Books")
        .transition()
        .duration(500)
        .style("opacity", 1);
    
    //Dray y title box/button
    g.append("rect")
        .attr("id", "rightRect")
        .attr("x", -305)
        .attr("y", -75)
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("height", "20px")
        .attr("width", 125)
        .attr("transform", "rotate(-90)")
        .style("stroke", "#000000")
        .style("fill", "#ffffff")
        .style("fill-opacity", "0")
        .style("opacity",0)
        .on("mouseover", function() {
            svg.select("#rightRect")
                .style("stroke-width","3px");
            }
        )
        .on("mouseout", function() {
            svg.select("#rightRect")
                .style("stroke-width","1px");
            }
        )
        .on("click", function() {
            show_number = true;
            move_percent();
            removePath("usEng");
            removePath("Chinese");
            removePath("Hebrew");
            removePath("Russian");
            removePath("Spanish");
        
            printPath_Eng(words_usEng);
            printPath_Chinese(words_chi);
            printPath_Hebrew(words_heb);
            printPath_Russian(words_rus);
            printPath_Spanish(words_spa);      
         })
        .transition()
        .duration(500)
        .style("opacity",1);
    
    
    //append y_percent axis
    g.append("g")
        .attr("class", "axis axis-y-percent")
        .attr("transform", "translate(-90, 0)")
        .call(d3.axisLeft(y_percent))

        .attr("dy", "0.9em")
        .style("opacity", 0)
        .transition()
        .duration(500)
        .style("opacity", 0.2);
    
    
        
    //append y_percent text
    g.append("text")
        .attr("id", "percentText")
        .attr("y", -145)
        .attr("x", -300)
        .attr("dy", "0.9em")
        .attr("transform", "rotate(-90)")
        .style("opacity", 0)
        .text("percentage of the year")
        .transition()
        .duration(500)
        .style("opacity", 1);
    
    //Draw y_percent title box/button
    g.append("rect")
        .attr("id", "percentRect")
        .attr("x", -305)
        .attr("y", -145)
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("height", "20px")
        .attr("width", 175)
        .attr("transform", "rotate(-90)")
        .style("stroke", "#000000")
        .style("fill", "#ffffff")
        .style("fill-opacity", "0")
        .style("opacity",0)
        .on("mouseover", function() {
            svg.select("#percentRect")
                .style("stroke-width","3px");
            }
        )
        .on("mouseout", function() {
            svg.select("#percentRect")
                .style("stroke-width","1px");
            }
        )
        .on("click", function() {
            show_number = false;
            move_percent();
            removePath("usEng");
            removePath("Chinese");
            removePath("Hebrew");
            removePath("Russian");
            removePath("Spanish");
            
            printPath_Eng(words_usEng);
            printPath_Chinese(words_chi);
            printPath_Hebrew(words_heb);
            printPath_Russian(words_rus);
            printPath_Spanish(words_spa);
         })
        .transition()
        .duration(500)
        .style("opacity",1);
        
        printPath_Eng(words_usEng);
        printPath_Chinese(words_chi);
        printPath_Hebrew(words_heb);
        printPath_Russian(words_rus);
        printPath_Spanish(words_spa);
        
        button_us.on("click", function() {
            
            if (select_lang[0]) {
                removePath("usEng");
            } else {
                printPath_Eng(words_usEng);
            }
            select_lang[0] = !select_lang[0];
        });
        button_chi.on("click", function() {
            
            if (select_lang[1]) {
                removePath("Chinese");
            } else {
                printPath_Chinese(words_chi);
            }
            select_lang[1] = !select_lang[1];
        });
        button_heb.on("click", function() {
            
            if (select_lang[2]) {
                removePath("Hebrew");
            } else {
                printPath_Hebrew(words_heb);
            }
            select_lang[2] = !select_lang[2];
        });
        button_rus.on("click", function() {
            
            if (select_lang[3]) {
                removePath("Russian");
            } else {
                printPath_Russian(words_rus);
            }
            select_lang[3] = !select_lang[3];
        });
        button_spa.on("click", function() {
            
            if (select_lang[4]) {
                removePath("Spanish");
            } else {
                printPath_Spanish(words_spa);
            }
            select_lang[4] = !select_lang[4];
        });
});



// **********
d3.csv("Average_Data.csv", parse, function(data) {
    var keys = data.columns.slice(1);
    // data ranges for the x and y axes
    x2.domain(d3.extent(data, function(d) { return d.year; }));
    y2.domain([0, d3.max(data, function(d) { return d.total; })]);
    xOverview.domain(x2.domain());
    yOverview.domain(y2.domain());

    // data range for the bar colours
    // (essentially maps attribute names to colour values)
    colour.domain(d3.keys(data[0]));

    // draw the axes now that they are fully set up
    main.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(8,500)")
        .call(d3.axisBottom(x2));
    main.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(8,120)")
        .call(d3.axisRight(y2));
    overview.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + heightOverview + ")")
        .call(d3.axisBottom(xOverview));
    
    main.append("defs").append("clipPath")       // Make sure that the blue area will not appear on the left side of YAxis
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);

    // draw the bars
    main.append("g")
        .attr("class", "bars")
        // a group for each stack of bars, positioned in the correct x position
        .selectAll(".bar.stack")
        .data(data)
        .enter().append("g")
        .attr("class", "bar stack")
        .attr("transform", function(d) { return "translate(" + x2(d.year) + ",120)"; })
          
        // a bar for each value in the stack, positioned in the correct y positions
        .selectAll("rect")
        .data(function(d) { return d.words; })
        .enter().append("rect")
        .attr("class", "bar")
        .attr("width", 25)
        .attr("y", function(d) { return y2(d.y1); })
        .attr("height", function(d) { return y2(d.y0) - y2(d.y1); })
        .style("fill", function(d) { return colour(d.name); })
    
    main.append("text")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .style("font-size", "20px") 
        .text("Word Distribution in All Language (Average)")
        .attr("transform", "translate(250,110)");

    overview.append("g")
            .attr("class", "bars")
            .selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return xOverview(d.year) - 3; })
            .attr("width", 12)
            .attr("y", function(d) { return yOverview(d.total); })
            .attr("height", function(d) { return heightOverview - yOverview(d.total); });

    // add the brush target area on the overview chart
    overview.append("g")
            .attr("class", "x brush")
            .call(brush)
            .selectAll("rect")
            // -6 is magic number to offset positions for styling/interaction to feel right
            .attr("y", -6)
            // need to manually set the height because the brush has
            // no y scale, i.e. we should see the extent being marked
            // over the full height of the overview chart
            .attr("height", heightOverview + 7);  // +7 is magic number for styling
    
    var legend = g.append("g")
                  .attr("font-family", "sans-serif")
                  .attr("font-size", 10)
                  .attr("transform", "translate(-700,570)")
                  .attr("text-anchor", "end")
                  .selectAll("g")
                  .data(keys.slice().reverse())
                  .enter().append("g")
                  .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
          .attr("x", width - 19)
          .attr("width", 19)
          .attr("height", 19)
          .attr("fill", colour);

    legend.append("text")
          .attr("x", width - 24)
          .attr("y", 9.5)
          .attr("dy", "0.32em")
          .text(function(d) { return d; });
});


// **********



//bind with multiseries data
function type(d, _, columns) {
    d.year = parseDate(d.year);
    //iterate through each column
    for(var i = 1, n = columns.length, c; i < n; ++i)
        //bind column data to year
        d[c = columns[i]] = +d[c];
        return d;
}


function findMaxFromLanguageTable(data) {
    var maxValues = data.map(function(d) {
        if(d.id == "average") {
            return d3.max(d.values, function(value) {
                return value.number;
            });
        }
    });
    return d3.max(maxValues);
}

function findMaxPercent(data) {
    var maxValues = data.map(function(d) {
            return d3.max(d.values, function(value) {
                return value.number / value.sum;
            });
    });
    return d3.max(maxValues); 
}

// **********
// by habit, cleaning/parsing the data and return a new object to ensure/clarify data object structure
function parse(d) {
    var value = { year: parseDate(d.year) }; // turn the date string into a date object

    // adding calculated data to each count in preparation for stacking
    var y0 = 0; // keeps track of where the "previous" value "ended""
    value.words = ["democracy","liberty","justice","equality","rights","election","citizen","protests"].map(function(name) {
        return { name: name,
                 y0: y0,
                 // add this count on to the previous "end" to create a range, and update the "previous end" for the next iteration
                 y1: y0 += +d[name]
               };
    });
    // quick way to get the total from the previous calculations
    value.total = value.words[value.words.length - 1].y1;
    return value;
}

// zooming/panning behaviour for overview chart
function brushed(data) {
    var selection = d3.event.selection;
    // update the main chart's x axis data range
    x2.domain(selection.map(xOverview.invert, xOverview));
    // redraw the bars on the main chart
    main.selectAll(".bar.stack")
        .attr("transform", function(d) {
            return "translate(" + x2(d.year) +",120)"; 
        });
    // redraw the x2 axis of the main chart
    main.select(".x.axis").call(d3.axisBottom(x2));
}
// **********
