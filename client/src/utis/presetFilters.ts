import { filterConfig } from "./filterConfig";

export const presetFilters = [
  {
    name: "Warm",
    filters: [
      {
        name: "Brightness",
        property: "brightness",
        value: 95,
        range: {
          min: 50,
          max: 150,
        },
        unit: "%",
      },
      {
        name: "Contrast",
        property: "contrast",
        value: 90,
        range: {
          min: 50,
          max: 150,
        },
        unit: "%",
      },
      {
        name: "Saturation",
        property: "saturate",
        value: 160,
        range: {
          min: 0,
          max: 200,
        },
        unit: "%",
      },
      {
        name: "Sepia",
        property: "Sepia",
        value: 50,
        range: {
          min: 0,
          max: 100,
        },
        unit: "%",
      },
      {
        name: "Hue",
        property: "hue-rotate",
        value: 0,
        range: {
          min: 0,
          max: 360,
        },
        unit: "deg",
      },
    ],
  },
  {
    name: "Cold",
    filters: [
      {
        name: "Brightness",
        property: "brightness",
        value: 110,
        range: {
          min: 50,
          max: 150,
        },
        unit: "%",
      },
      {
        name: "Contrast",
        property: "contrast",
        value: 105,
        range: {
          min: 50,
          max: 150,
        },
        unit: "%",
      },
      {
        name: "Saturation",
        property: "saturate",
        value: 60,
        range: {
          min: 0,
          max: 200,
        },
        unit: "%",
      },
      {
        name: "Sepia",
        property: "Sepia",
        value: 0,
        range: {
          min: 0,
          max: 100,
        },
        unit: "%",
      },
      {
        name: "Hue",
        property: "hue-rotate",
        value: 18,
        range: {
          min: 0,
          max: 360,
        },
        unit: "deg",
      },
    ],
  },
  {
    name: "Classic",
    filters: [
      {
        name: "Brightness",
        property: "brightness",
        value: 100,
        range: {
          min: 50,
          max: 150,
        },
        unit: "%",
        initialValue: 100,
      },
      {
        name: "Contrast",
        property: "contrast",
        value: 105,
        range: {
          min: 50,
          max: 150,
        },
        unit: "%",
        initialValue: 100,
      },
      {
        name: "Saturation",
        property: "saturate",
        value: 0,
        range: {
          min: 0,
          max: 200,
        },
        unit: "%",
        initialValue: 100,
      },
      {
        name: "Sepia",
        property: "Sepia",
        value: 0,
        range: {
          min: 0,
          max: 100,
        },
        unit: "%",
        initialValue: 0,
      },
      {
        name: "Hue",
        property: "hue-rotate",
        value: 0,
        range: {
          min: 0,
          max: 360,
        },
        unit: "deg",
        initialValue: 0,
      },
    ],
  },
  {
    name: "Original",
    filters: filterConfig,
  },
];
