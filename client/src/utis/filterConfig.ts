export type Filter = {
  name: string;
  property: string;
  value: number;
  range: {
    min: number;
    max: number;
  };
  unit: string;
  initialValue?: number;
  selected?: boolean;
};

export const filterConfig = [
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
    value: 100,
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
    value: 100,
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
];
