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
let Inputs = function (elements) {
    const names = ["universe", "storyLine", "setName", "mainCharacters", "minorCharacters", "literatureForm", "coAuthor"];
    const defaults = [170, 370, 92, 150, 30, 4, 10];
    const controls = named(elements);

    this.weights = function () {
        return  transformValues(controls, function (c) {
            return c.valueAsNumber / 100;
        });
    };

    this.defaults = function () {
        return named(defaults);
    };

    this.resetDefaults = function () {
        let def = this.defaults(); // FIXME: multiple onChange firing are in their way
        for (let name in def) {
            controls[name].value = def[name];
        }
    };

    function named(elements) {
        let result = {};
        for (let index in names) {
            result[names[index]] = elements[index];
        }
        return result;
    }

    function transformValues(map, func) {
        let result = {};
        for (let name in map) {
            result[name] = func(map[name]);
        }
        return result;
    }
};
