function finalproject() {
    var leetcode = "lc.csv";
    var sde_sal = "sde.csv";
    // lc_check(leetcode);
    // sde_check(sde_sal);
    question1(leetcode);
    question2(leetcode);
    question3(sde_sal);
    question4(sde_sal);
    question5(sde_sal);
}

var lc_check = function(leetcode) {
    d3.csv(leetcode).then(function (data) {
        console.log(data)
    });
}

var sde_check = function(sde_sal) {
    d3.csv(sde_sal).then(function (data) {
        console.log(data)
    });
}

var question1 = function(leetcode) {
    d3.csv(leetcode).then(function (data) {

        let svgwidth = 1000;
        let svgheight = 600;
        let padding = 100;

        let svg = d3.select("#q1_plot").append("svg")
            .attr("width", svgwidth)
            .attr("height", svgheight);

        var xScale = d3.scaleLinear()
            .domain([d3.min(data, d => d['acceptance_rate']),
            d3.max(data, d => d['acceptance_rate'])])
            .range([padding, svgwidth - padding])

        var xAxis = svg.append("g")
            .attr("class", "xAxis")
            .attr("transform", "translate(0," + (svgheight - padding) + ")")
            .call(d3.axisBottom(xScale).ticks())
            .selectAll("text")
            .attr("dx", "-10")
            .attr("dy", "-5")
            .attr("transform", "rotate(-90)")
            .style("text-anchor", "end");

        var yScale = d3.scaleLinear()
            .domain([d3.min(data, d => parseInt(d['rating'])),
            d3.max(data, d => parseInt(d['rating']))])
            .range([svgheight - padding, padding]);

        var yAxis = svg.append("g")
            .attr("transform", "translate(" + padding + ",0)")
            .call(d3.axisLeft(yScale));

        var points = svg.selectAll('scatter')
            .data(data)
            .enter()
            .append('circle').attr('class', 'scatter')
            .attr("cx", d => xScale(d["acceptance_rate"]))
            .attr("cy", d => svgheight - yScale(parseInt(d["rating"])))
            .attr("r", 0)
            .attr("fill", '#c497bd')
            .attr('opacity', 0.75)

        points.transition()
            .delay(function (d, i) { return i * 5; })
            .attr("r", function (d) { return 3; });

        var xLabel = svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "middle")
            .attr("x", svgwidth / 2)
            .attr("y", svgheight - padding / 2.5)
            .text("Acceptance Rate (Percentage)");

        var yLabel = svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "middle")
            .attr("y", padding / 4)
            .attr("x", -svgheight / 2)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text("Rating (Proportion of Likes)");

        var graphTitle = svg.append("text")
            .attr("x", svgwidth / 2)
            .attr("y", padding / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .text("Ratio of Likes by Acceptance Rate");

    });
}

var question2 = function(leetcode) {
    d3.csv(leetcode).then(function (data) {
        data = d3.rollup(data, v => d3.sum(v, d => d.submissions), d => d.difficulty)
        data = Array.from(data, ([difficulty, submissions]) => {
            const result = { submissions };
            result.difficulty = difficulty;
            return result;
        })
        // console.log(data)

        let svgwidth = 1200;
        let svgheight = 600;
        let padding = 125;

        var svg = d3.select("#q2_plot").append("svg")
            .attr("height", svgheight)
            .attr("width", svgwidth);

        var xScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => parseInt(d.submissions))])
            .range([padding, svgwidth - padding])

        var yScale = d3.scaleBand()
            .domain(data.map(d => d.difficulty))
            .range([svgheight - padding, padding])
            .paddingInner(0.1)

        var xAxis = svg.append("g")
            .attr("transform", "translate(0," + (svgheight - padding) + ")")
            .call(d3.axisBottom(xScale).ticks())
            .selectAll("text")
            .style("font-size", "12px");

        var yAxis = svg.append("g")
            .attr("class", "yAxis")
            .attr("transform", "translate(" + padding + ",0)")
            .call(d3.axisLeft(yScale).ticks())
            .selectAll("text")
            .style("font-size", "12px");

        var bars = svg.selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr('x', padding)
            .attr('y', d => yScale(d.difficulty))
            .attr('width', d => xScale(d.submissions) - padding)
            .attr('height', yScale.bandwidth())
            .attr('fill', '#f0dbff')

        const sortBars = function () {
            data.sort(function (a, b) {
                return d3.ascending(a.submissions, b.submissions)
            })
            // console.log(data)

            yScale = d3.scaleBand()
                .domain(data.map(d => d.difficulty))
                .range([svgheight - padding, padding])
                .paddingInner(0.1)

            d3.selectAll("g.yAxis")
                .transition()
                .duration(1000)
                .call(d3.axisLeft(yScale).ticks())

            bars.data(data)
                .transition()
                .duration(1000)
                .attr('y', d => yScale(d.difficulty))
                .attr('width', d => xScale(d.submissions) - padding)
        }

        d3.select('#sort_button')
            .on('click', function () {
                sortBars();
            });

        var xLabel = svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "middle")
            .attr("x", svgwidth / 2)
            .attr("y", svgheight - padding / 2.5)
            .text("Number of Submissions")

        var yLabel = svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "middle")
            .attr("y", padding / 4)
            .attr("x", -svgheight / 2)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text("Difficulty Level");

        var graphTitle = svg.append("text")
            .attr("x", svgwidth / 2)
            .attr("y", padding / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .text("Number of Submissions for each Difficulty Level");

    })
}

var question3 = function(sde_sal) {
    d3.csv(sde_sal).then(function (data) {
        var sum_by = ['Cost of Living avg', 'Rent avg']

        data = d3.rollup(data,
            v => Object.fromEntries(sum_by.map(col => [col, d3.sum(v, d => parseFloat(+d[col]))])),
            d => d.City)

        data = Array.from(data, ([City, values]) => {
            const result = { ...values };
            result.City = City;
            return result;
        }).sort((a, b) => d3.ascending(a.City, b.City))

        // console.log(data)

        let svgwidth = 1250;
        let svgheight = 600;
        let padding = 150;

        var svg = d3.select("#q3_plot").append("svg")
            .attr("height", svgheight)
            .attr("width", svgwidth);

        var xScale = d3.scaleBand()
            .domain(d3.map(data, d => d.City))
            .range([padding, svgwidth - padding])
            .paddingInner(0.05);

        var yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => parseFloat(d['Cost of Living avg']) + parseFloat(d['Rent avg']))])
            .range([svgheight - padding, padding]);

        var xAxis = svg.append("g")
            .attr("transform", "translate(0," + (svgheight - padding) + ")")
            .call(d3.axisBottom(xScale).ticks())
            .selectAll("text")
            .attr("dx", "-10")
            .attr("dy", "-5")
            .attr("transform", "rotate(-90)")
            .style("text-anchor", "end");;

        var yAxis = svg.append("g")
            .attr("transform", "translate(" + padding + ",0)")
            .call(d3.axisLeft(yScale).ticks());

        var series = d3.stack().keys(sum_by)
        var stacked = series(data)
        // console.log(stacked)

        var colors = d3.scaleOrdinal()
            .range(['pink', 'lavender'])

        var groups = svg.selectAll(".gbars")
            .data(stacked)
            .enter()
            .append("g")
            .attr("fill", d => colors(d.key))

        var tooltip = d3.select("#q3_plot").append("div").style("opacity", 0).attr("class", "tooltip");

        var rects = groups.selectAll("rect")
            .data(d => d)
            .enter()
            .append("rect")
            .attr('x', d => xScale(d.data.City) + 2.5)
            .attr('y', d => yScale(d[1]))
            .attr('width', xScale.bandwidth() - 5)
            .attr('height', d => yScale(d[0]) - yScale(d[1]))

            .on("mouseover", function (e, d) {
                tooltip.transition().duration(50).style("opacity", 0.9);
                d3.select(this).attr('stroke', 'white').attr('stroke-width', 3)
            })
            .on("mousemove", function (e, d) {
                tooltip.html(
                    "city: " + d.data.City + "<br>" +
                    "avg cost of living: $" + d.data['Cost of Living avg'] + " dollars" + "<br>" +
                    "avg rent: $" + d.data['Rent avg'] + " dollars"
                )
                    .style("top", (e.pageY + 20) + "px")
                    .style("left", (e.pageX + 20) + "px")
            })
            .on("mouseout", function (e, d) {
                tooltip.transition().duration(50).style("opacity", 0);
                d3.select(this).attr('stroke', null).attr('stroke-width', null)
            })

        var xLabel = svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "middle")
            .attr("x", svgwidth / 2)
            .attr("y", svgheight - padding / 4)
            .text("City");

        var yLabel = svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "middle")
            .attr("y", padding / 4)
            .attr("x", -svgheight / 2)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text("Average Cost (per Month) in Dollars");

        var graphTitle = svg.append("text")
            .attr("x", svgwidth / 2)
            .attr("y", padding / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .text("Average Cost of Living per City");

        var legend = svg.append("svg")
            .selectAll("g")
            .data(sum_by)
            .enter()
            .append("g")
            .attr("transform", (d, i) => "translate(0," + i * 20 + ")");

        legend.append("circle")
            .attr("cx", svgwidth - 1.75 * padding)
            .attr("cy", 0.5 * padding)
            .attr("r", 6)
            .style("fill", d => colors(d))

        legend.append("text")
            .data(sum_by)
            .attr("x", svgwidth - 1.75 * padding + 15)
            .attr("y", 0.5 * padding)
            .attr("dy", ".35em")
            .text(d => d)
            .attr("font-size", 15);

    });
}

var question4 = function(sde_sal) {
    var width = 1000;
    var height = 800;
    var margin = 20;

    const projection = d3.geoAlbersUsa().scale(1000).translate([width / 2, height / 2])
    const pathgeo = d3.geoPath().projection(projection)

    var svg = d3.select("#q4_plot").append("svg")
        .attr("height", height)
        .attr("width", width);

    d3.csv(sde_sal).then(function (data) {

        data.forEach(function (d) {

            d.State = d.City.split(", ")[1];

        });

        // console.log(data)

        jobs_per_state = d3.rollup(data, v => d3.sum(v, d => d['Number of Software Developer Jobs']), d => d.State)
        jobs_distribution = Array.from(jobs_per_state, ([State, Jobs]) => {
            const result = { Jobs };
            result.State = State;
            return result;
        })

        // console.log(jobs_distribution)

        const statesmap = d3.json("us-states.json")
        statesmap.then(function (map) {
            for (var i = 0; i < jobs_distribution.length; i++) {
                var data_state = jobs_distribution[i].State;
                var data_jobs = jobs_distribution[i].Jobs;
                for (var j = 0; j < map.features.length; j++) {
                    var json_state = map.features[j].properties.name;
                    if (data_state == json_state) {
                        map.features[j].properties.jobs = data_jobs;
                        break;
                    }
                }
            }

            interval = [d3.min(jobs_distribution, d => d.Jobs), d3.max(jobs_distribution, d => d.Jobs)];
            color_range = ["#fff7fc", "pink"]

            var color = d3.scaleLog()
                .domain(interval)
                .range(color_range);

            svg.selectAll('path')
                .data(map.features)
                .enter()
                .append('path')
                .attr('d', pathgeo)
                .style("stroke", "black")
                .style("stroke-width", "1px")
                .style("fill", function (d) {
                    if (typeof d.properties.jobs == null || typeof d.properties.jobs == "undefined") {
                        return "white"
                    } else {
                        return color(d.properties.jobs)
                    }
                })

            function zoomed(event, d) {
                svg.selectAll("path")
                    .attr("transform", event.transform);
            }

            function brushed(event, d) {
                var selection = event.selection;

                if (selection) {
                    const [[x0, y0], [x1, y1]] = selection;
                    const k = Math.min(width / (x1 - x0), height / (y1 - y0));
                    const translateX = width / 2 - k * (x0 + x1) / 2;
                    const translateY = height / 2 - k * (y0 + y1) / 2;

                    svg.transition()
                        .duration(750)
                        .call(zoom.transform, d3.zoomIdentity.translate(translateX, translateY).scale(k));

                    d3.select(this).call(brush.move, null);
                }
            }

            function unzoomed() {
                svg.transition()
                    .duration(750)
                    .call(zoom.transform, d3.zoomIdentity);
            }

            var brush = d3.brush()
                .extent([[0, 0], [width, height]])
                .on("end", brushed)

            var zoom = d3.zoom()
                .scaleExtent([1, 10])
                .on("zoom", zoomed);

            var g = svg.append("g");
            g.call(brush);
            g.on("dblclick", unzoomed);

            let min_jobs = d3.min(jobs_distribution, d => d.Jobs)
            let max_jobs = d3.max(jobs_distribution, d => d.Jobs)
            let median_jobs = Math.round((min_jobs + max_jobs) / 2)
            var legend_values = [0, min_jobs, median_jobs, max_jobs];
            var legend_text = ["0 jobs (no data)", min_jobs + " jobs", median_jobs + " jobs", max_jobs + " jobs"]

            var legend = svg.append("svg")
                .selectAll("g")
                .data(legend_values)
                .enter()
                .append("g")
                .attr("transform", (d, i) => "translate(0," + i * 20 + ")");

            legend.append("circle")
                .attr("cx", 8 * margin)
                .attr("cy", height - 12 * margin)
                .attr("r", 6)
                .style("fill", d => color(d))
                .style("stroke", "black")

            legend.append("text")
                .data(legend_text)
                .attr("x", 8 * margin + 15)
                .attr("y", height - 12 * margin)
                .attr("dy", ".35em")
                .text(d => d)
                .attr("font-size", 15);

            var title = svg.append("text")
                .attr("x", width / 2)
                .attr("y", 2 * margin)
                .attr("text-anchor", "middle")
                .style("font-size", "20px")
                .text("Distribution of Software Developer Jobs Across the US");
        })

    });

}

var question5 = function(sde_sal) {
    d3.csv(sde_sal).then(function (data) {
        // data = d3.rollup(data, v => d3.sum(v, d => d['Mean Software Developer Salary (adjusted)']), d => d.Metro)
        data = d3.map(data, d => parseFloat(d['Mean Software Developer Salary (adjusted)']))
        // console.log(data)

        var sorted = data.sort(d3.ascending)
        var q1 = d3.quantile(sorted, .25)
        var median = d3.quantile(sorted, .5)
        var q3 = d3.quantile(sorted, .75)
        var iqr = q3 - q1
        var min = q1 - 1.5 * iqr
        var max = q1 + 1.5 * iqr

        // console.log(sorted)

        let svgwidth = 500;
        let svgheight = 750;
        let padding = 125;

        var svg = d3.select("#q5_plot").append("svg")
            .attr("height", svgheight)
            .attr("width", svgwidth);

        var yScale = d3.scaleLinear()
            .domain([d3.min(sorted), d3.max(sorted)])
            .range([svgheight - padding, padding]);

        var yAxis = svg.append("g")
            .attr("transform", "translate(" + padding + ",0)")
            .call(d3.axisLeft(yScale).ticks());

        var center = 200
        var width = 100

        svg.append("line")
            .attr("x1", center + padding / 2)
            .attr("x2", center + padding / 2)
            .attr("y1", yScale(min))
            .attr("y2", yScale(max))
            .attr("stroke", "black")

        svg.append("rect")
            .attr("x", center - width / 2 + padding / 2)
            .attr("y", yScale(q3))
            .attr("height", (yScale(q1) - yScale(q3)))
            .attr("width", width)
            .attr("stroke", "black")
            .style("fill", "#fdebff")

        svg.selectAll("lines")
            .data([min, median, max])
            .enter()
            .append("line")
            .attr("x1", center - width / 2 + padding / 2)
            .attr("x2", center + width / 2 + padding / 2)
            .attr("y1", d => yScale(d))
            .attr("y2", d => yScale(d))
            .attr("stroke", "black")

        var yLabel = svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "middle")
            .attr("y", padding / 4)
            .attr("x", -svgheight / 2)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text("Salary in Dollars");

        var graphTitle = svg.append("text")
            .attr("x", svgwidth / 2)
            .attr("y", padding / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .text("Box Plot of Mean Software Developer Salaries in the US");
    })

}