/*******************************************************************************
 * Copyright (c) 2019, 2020 CleverClover
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT which is available at
 * https://spdx.org/licenses/MIT.html#licenseText
 *
 * SPDX-License-Identifier: MIT
 *
 * Contributors:
 *     CleverClover - initial API and implementation
 *******************************************************************************/
let Mds = function() {
    this.classic = function (distances) {
        let means = numeric.mul(-0.5, numeric.pow(distances, 2));
        function mean(array) {
            return numeric.div(numeric.add.apply(null, array), array.length);
        }

        let rowMeans = mean(means),
            colMeans = mean(numeric.transpose(means)),
            totalMean = mean(rowMeans);

        for (let i = 0; i < means.length; ++i) {
            for (let j = 0; j < means[0].length; ++j) {
                means[i][j] += totalMean - rowMeans[i] - colMeans[j];
            }
        }

         let ret = numeric.svd(means);
         return ret.U.map(function (row) {
             return numeric.mul(row, numeric.sqrt(ret.S)).splice(0, 2);
         });
    };

    this.draw = function (elementSelector, xPos, yPos,  data, params) {
        let element = d3.select(elementSelector);
        params = params || {};
        let padding = params.padding || 32,
            w = params.w || Math.min(720, document.documentElement.clientWidth - padding),
            h = params.h || w,
            xDomain = [
                Math.min.apply(null, xPos),
                Math.max.apply(null, xPos)].reverse(),
            yDomain = [
                Math.max.apply(null, yPos),
                Math.min.apply(null, yPos)].reverse(),
            pointRadius = params.pointRadius || 15,
            smallPointRadius = params.pointRadius || 10;

        let xScale = d3.scaleLinear().domain(xDomain)
            .range([padding, w - padding]);

        let yScale = d3.scaleLinear().domain(yDomain)
            .range([padding, h - padding]);

        let xAxis = d3.axisBottom()
            .scale(xScale)
            .ticks(params.xTicks || 7);

        let yAxis = d3.axisLeft()
            .scale(yScale)
            .ticks(params.yTicks || 7);

        let svg = element.select("svg")
            .attr("width", w)
            .attr("height", h);

        let palette =  new Colors().set15();

        let tooltip = d3.select("#tooltip")
            .style("opacity", 0);

        let nodes = svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("id", function (d, i) {
                return "b" + d.no;
            })
            .attr("r", radius)
            .attr("cx", function (d, i) {
                return xScale(xPos[i]);
            })
            .attr("cy", function (d, i) {
                return yScale(yPos[i]);
            })
            .attr("fill", function (d, i) {
                return palette[data[i].color - 1];
            })
            .attr("stroke", function (d, i) {
                if (data[i].coAuthor.length > 1) {
                    return 'black';
                } else {
                    return palette[data[i].color - 1].darker(1);
                }
            })
            .attr("stroke-width", function (d, i) {
                if (data[i].coAuthor.length > 1) {
                    return 2;
                } else {
                    return 3;
                }
            })
            .on('mouseover', function (d, i) {
                this.parentNode.appendChild(this);
                tooltip
                    .transition()
                    .duration(200)
                    .style("opacity", .9);
                svg.select("#b" + d.no)
                    .transition()
                    .duration(350)
                    .attr("r", 40);
                tooltip.html(d.title + "<br/>"  + d.releaseYear)
                    .style("left", (xScale(xPos[i])) + "px")
                    .style("top", (yScale(yPos[i])) + "px");
            })
            .on('mouseout', function (d, i) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
                svg.select("#b" + d.no)
                    .transition()
                    .duration(300)
                    .attr("r", radius(d, i));
            });

            function radius(d, i){
                if (data[i].literatureForm === 'novel') {
                    return pointRadius;
                } else {
                    return smallPointRadius;
                }
            }
    };

    this.update = function (elementSelector, xPos, yPos) {
        let element = d3.select(elementSelector);
        let svg = element.select("svg");
        let w = svg.attr("width");
        let h = svg.attr("height");
        let padding = 32;

        let xScale = d3.scaleLinear()
            .domain([
                Math.min.apply(null, xPos),
                Math.max.apply(null, xPos)]
                .reverse())
            .range([padding, w - padding]);

        let yScale = d3.scaleLinear()
            .domain([
                Math.max.apply(null, yPos),
                Math.min.apply(null, yPos)]
                .reverse())
            .range([padding, h - padding]);

        element.selectAll("circle")
            .transition()
            .duration(function(d, i) {return Math.random() * 3000 + 800})
            .delay(function (d, i) { return Math.random() * 500})
            .attr("transform", function (data, index, circles) {
                let current = circles[index];
                let x0 = current.cx.baseVal.value;
                let y0 = current.cy.baseVal.value;
                return "translate(" + (xScale(xPos[index] )- x0) + ", " + (yScale(yPos[index]) - y0) + ")";
            })
    };

};
