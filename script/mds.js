(function (mds) {
    "use strict";
    /// given a matrix of distances between some points, returns the
    /// point coordinates that best approximate the distances using
    /// classic multidimensional scaling
    mds.classic = function (distances, dimensions) {
        dimensions = dimensions || 2;

        // square distances
        let means = numeric.mul(-0.5, numeric.pow(distances, 2));

        // double centre the rows/columns
        function mean(A) {
            return numeric.div(numeric.add.apply(null, A), A.length);
        }

        let rowMeans = mean(means),
            colMeans = mean(numeric.transpose(means)),
            totalMean = mean(rowMeans);

        for (let i = 0; i < means.length; ++i) {
            for (let j = 0; j < means[0].length; ++j) {
                means[i][j] += totalMean - rowMeans[i] - colMeans[j];
            }
        }

        // take the SVD of the double centred matrix, and return the points from it
        let ret = numeric.svd(means);
        let eigenValues = numeric.sqrt(ret.S);
        return ret.U.map(function (row) {
            return numeric.mul(row, eigenValues).splice(0, dimensions);
        });
    };

    // draws a scatter plot of points, useful for displaying the output from mds.classic etc
    mds.drawD3ScatterPlot = function (elementSelector, xPos, yPos,  data, params) {
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

        let nodes = svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("r", function (d, i) {
                if (data[i].literatureForm === 'novel') {
                    return pointRadius;
                } else {
                    return smallPointRadius;
                }
            })
            .attr("cx", function (d, i) {
                return xScale(xPos[i]);
            })
            .attr("cy", function (d, i) {
                return yScale(yPos[i]);
            })
            .attr("fill", function (d, i) {
                return data[i].color;
            })
            .attr("stroke", function (d, i) {
                if (data[i].coAuthor.length > 1) {
                    return 'black';
                } else {
                    return d3.color(data[i].color).darker(10);
                }
            })
            .attr("stroke-width", function (d, i) {
                if (data[i].coAuthor.length > 1) {
                    return 2;
                } else {
                    return 1;
                }
            });
    };

    mds.updateD3ScatterPlot = function (elementSelector, xPos, yPos) {
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
}(window.mds = window.mds || {}));