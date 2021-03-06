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
function visualize(books, distances) {
    let mds = new Mds();
    let positions = numeric.transpose(mds.classic(distances));
    let width = Math.min(1200, document.documentElement.clientWidth - 20);
    let height = Math.min(700, document.documentElement.clientHeight - 20);
    mds.draw(
        "#picture",
        positions[0],
        positions[1],
        books,
        {
            w: width,
            h: height
        });
}

function update(distances) {
    let mds = new Mds();
    let positions = numeric.transpose(mds.classic(distances));
    mds.update(
        "#picture",
        positions[0],
        positions[1]);
}
