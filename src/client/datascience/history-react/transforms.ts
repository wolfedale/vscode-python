// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

'use strict';

// THis code is from @nteract/transforms-full except without the Vega transforms
// Vega transforms mess up our npm pkg install because they rely on the npm canvas module that needs
// to be built on each system.

/* tslint:disable */
import PlotlyTransform, {
    PlotlyNullTransform
} from "@nteract/transform-plotly";
import GeoJSONTransform from "@nteract/transform-geojson";

import ModelDebug from "@nteract/transform-model-debug";

import DataResourceTransform from "@nteract/transform-dataresource";

// import { VegaLite1, VegaLite2, Vega2, Vega3 } from "@nteract/transform-vega";

import {
    standardTransforms,
    standardDisplayOrder,
    registerTransform,
    richestMimetype
} from "@nteract/transforms";

const additionalTransforms = [
    DataResourceTransform,
    ModelDebug,
    PlotlyNullTransform,
    PlotlyTransform,
    GeoJSONTransform,
];

const { transforms, displayOrder } = additionalTransforms.reduce(
    registerTransform,
    {
        transforms: standardTransforms,
        displayOrder: standardDisplayOrder
    }
);

export { displayOrder, transforms, richestMimetype, registerTransform };