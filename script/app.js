function visualize(books, distances) {
    let positions = numeric.transpose(mds.classic(distances));
    let width = Math.min(1500, document.documentElement.clientWidth - 20);

    mds.drawD3ScatterPlot(
        "#picture",
        positions[0],
        positions[1],
        books,
        {
            w: width,
            h: width/2
        });
}

function update(distances) {
    let positions = numeric.transpose(mds.classic(distances));
    mds.updateD3ScatterPlot(
        "#picture",
        positions[0],
        positions[1]);
}