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
let Layout = function () {

    this.fresh = function (weights, books) {

        let maxCloseness = 0;
        let closeness = affinities(weights, books, function (value) {
            if (value > maxCloseness) {
                maxCloseness = value;
            }
        });
        return distances(closeness, maxCloseness);
    };

    function distances(affinities, max) {
        let distances = [];
        for (let i in affinities) {
            distances[i] = [];
            for (let j in affinities[i]) {
                if (i === j) {
                    distances[i][j] = 0;
                    continue;
                }
                distances[i][j] = max - affinities[i][j] + 1;
            }
        }
        return distances;
    }

    function affinities(weights, books, onEach) {
        let affinities = [];
        for (let i in books) {
            let bookI = books[i];
            affinities[i] = [];
            for (let j in books) {
                let bookJ = books[j];
                if (j === i) {
                    affinities[i][j] = 0;
                } else if (Number(j) < Number(i)) {
                    affinities[i][j] = affinities[j][i];
                } else {
                    let affinityIJ = affinity(bookI, bookJ, weights);
                    affinities[i][j] = affinityIJ;
                    onEach(affinityIJ);
                }
            }
        }
        return affinities;
    }

    function affinity(bookI, bookJ, weights) {
        let result = 0;
        result += criterionWeight(bookI, bookJ, weights, "universe");
        result += criterionWeight(bookI, bookJ, weights, "coAuthor");
        result += criterionWeight(bookI, bookJ, weights, "storyLine");
        result += criterionWeight(bookI, bookJ, weights, "literatureForm");
        result += criterionWeight(bookI, bookJ, weights, "setName");
        result += fractionWeight(bookI, bookJ, weights, "minorCharacters");
        result += fractionWeight(bookI, bookJ, weights, "mainCharacters");
        result += plotVariation();
        return result;
    }

    function criterionWeight(bookI, bookJ, weights, criterion) {
        if (bookI[criterion] !== undefined && bookI[criterion] === bookJ[criterion]) {
            return weights[criterion];
        }
        return 0;
    }

    function fractionWeight(bookI, bookJ, weights, criterion) {
        let setI = bookI[criterion];
        let setJ = bookJ[criterion];
        let common = setI.filter(item => setJ.includes(item));
        return common.length * weights[criterion];
    }

    function plotVariation() {
        return Math.random() * 3.33;
    }

};
