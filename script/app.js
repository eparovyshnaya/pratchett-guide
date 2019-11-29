function visualize(books, distances) {
    let labels = [];
    for (let j = 0; j < books.length; j++) {
        labels[labels.length] = books[j].no + 1;
    }
    let positions = numeric.transpose(mds.classic(distances));
    let w = Math.min(1500, document.documentElement.clientWidth - 20);
    let h = w / 2;

    mds.drawD3ScatterPlot(
        "#picture",
        positions[0],
        positions[1],
        labels,
        books,
        {
            w: w,
            h: h
        });
}

function update(distances) {
    let positions = numeric.transpose(mds.classic(distances));
    mds.updateD3ScatterPlot(
        "#picture",
        positions[0],
        positions[1]);
}