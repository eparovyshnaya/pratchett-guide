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
    let tooltip = d3.select("#tooltip")


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
                Math.min.apply(null, yPos)].reverse();

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

        tooltip.style("opacity", 0);

        let nodes = svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("id", function (d) {
                return "b" + d.no;
            })
            .attr("r", radius)
            .attr("cx", function (d, i) {
                d.x = xScale(xPos[i]);
                return d.x;
            })
            .attr("cy", function (d, i) {
                d.y = yScale(yPos[i]);
                return d.y;
            })
            .attr("fill", function (d) {
                return palette[d.color - 1];
            })
            .attr("stroke", function (d) {
                if (d.coAuthor.length > 1) {
                    return 'black';
                } else {
                    return palette[d.color - 1].darker(1);
                }
            })
            .attr("stroke-width", function (d) {
                if (d.coAuthor.length > 1) {
                    return 6;
                } else {
                    return 2;
                }
            })
            .attr("stroke-dasharray", function (d) {
                if (d.coAuthor.length > 1) {
                    return "1 4";
                }
            })
            .on('mouseover', function (d) {
                this.parentNode.appendChild(this); // move to the front
                drawToolTip(d);
            })
            .on('mouseout', function (d) {
                hideToolTip(d);
            });
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
                data.x = xScale(xPos[data.no]);
                data.y = yScale(yPos[data.no]);
                return "translate(" + (data.x - x0) + ", " + (data.y - y0) + ")";
            })
    };

    function drawToolTip(d){
        d3.select("svg").select("#b" + d.no)
            .transition()
            .duration(350)
            .attr("r", 40);
        tooltip
            .transition()
            .duration(200)
            .style("opacity", .95);
        tooltip.html(tooltipText(d))
            .style("left", (d.x + 40) + "px")
            .style("top", (d.y + 40) + "px");
    };

    function hideToolTip(d){
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
        d3.select("svg").select("#b" + d.no)
            .transition()
            .duration(300)
            .attr("r", radius(d));
    };

    function tooltipText(d){
        let coAuthor = "";
        if(d.coAuthor.length > 1){
            coAuthor = " with " + d.coAuthor;
        }
        let location = "";
        if(d.universe.length > 0){
            location = d.universe;
        }
        if(d.storyLine.length > 0){
            if(location.length > 0){
                location = location + " / "
            }
            location = location + d.storyLine;
        }
        return d.no + ".<br/>" +
            d.title + "<br/>"  +
            "written in " + d.releaseYear + coAuthor + "<br/>" +
            location;
    }

    function radius(d){
        if (d.literatureForm === 'novel') {
            return 15;
        } else {
            return 10;
        }
    };

};
