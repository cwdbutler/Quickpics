import { Tab } from "@headlessui/react";
import { useCallback, useEffect, useState } from "react";
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react";
import { getFilteredImg } from "../../utils/cropImage";
import { LeftArrowIcon } from "../Icons";
import { Filter, filterConfig } from "../../utils/filterConfig";
import { Fragment } from "react";
import { presetFilters } from "../../utils/presetFilters";

type Props = {
  styles: {
    header: string;
  };
  croppedImage: string | null;
  setCroppedImage: (croppedImage: string | null) => void;
  filters: Filter[];
  setFilters: (filters: Filter[]) => void;
  setFilteredImage: (filteredImage: string) => void;
};

export default function ImageEditor({
  styles,
  croppedImage,
  setCroppedImage,
  setFilteredImage,
  filters,
  setFilters,
}: Props) {
  const [selectedPreset, setSelectedPreset] = useState("");

  const getImageStyle = (filters: Filter[]) => {
    // turn the filter object into a valid css filter string
    const cssFilters = filters.map((filter) => {
      return `${filter.property}(${filter.value}${filter.unit})`;
    });

    return { filter: cssFilters.join(" ") };
  };

  const getStyledImage = async () => {
    try {
      const styledImage = await getFilteredImg(
        croppedImage!,
        getImageStyle(filters).filter
      );
      setFilteredImage(styledImage as string);
    } catch (err) {
      // do something here
    }
  };

  const goBack = () => {
    // prevent memory leak
    URL.revokeObjectURL(croppedImage!);
    setCroppedImage(null);
    setFilters(filterConfig);
  };

  return (
    <>
      <section className={styles.header}>
        <button type="button" onClick={goBack}>
          <LeftArrowIcon className="h-6 stroke-2" />
        </button>
        <h1>Edit</h1>
        <button
          className="font-semibold text-blue w-10"
          onClick={getStyledImage}
        >
          Next
        </button>
      </section>
      <img
        src={croppedImage!}
        className="h-full w-full select-none"
        style={getImageStyle(filters)}
        draggable={false}
      />
      <section className="h-64 w-full flex flex-col">
        <div className="h-full flex flex-col">
          <Tab.Group>
            <Tab.List className="grid grid-cols-2 w-full border-b-[1px] p-0 border-gray-300">
              <Tab as={Fragment}>
                {({ selected }) => (
                  <button
                    className={
                      selected
                        ? "font-semibold border-b-[1px] border-gray-500 -m-[1px] w-full p-2"
                        : "text-gray-300 font-semibold"
                    }
                  >
                    Filters
                  </button>
                )}
              </Tab>
              <Tab as={Fragment}>
                {({ selected }) => (
                  <button
                    className={
                      selected
                        ? "font-semibold border-b-[1px] border-gray-500 -m-[1px] w-full p-2"
                        : "text-gray-300 font-semibold"
                    }
                  >
                    Adjustments
                  </button>
                )}
              </Tab>
            </Tab.List>
            <Tab.Panels className="h-full w-full p-4">
              <Tab.Panel className="h-full gap-x-8 grid grid-cols-4 content-center justify-items-center">
                {presetFilters.map((presetFilter) => (
                  <button
                    onClick={() => {
                      setFilters(presetFilter.filters);
                      setSelectedPreset(presetFilter.name);
                    }}
                    key={presetFilter.name}
                    className="flex flex-col items-center justify-between select-none"
                  >
                    <div
                      className={` ${
                        selectedPreset === presetFilter.name
                          ? "border-blue"
                          : "border-transparent"
                      } border-2 border-solid rounded-md overflow-clip`}
                    >
                      <img
                        draggable={false}
                        style={getImageStyle(presetFilter.filters)}
                        className="select-none w-16 sm:w-32 rounded-s"
                        src="sunflower.jpg"
                      />
                    </div>
                    <div
                      className={`${
                        selectedPreset === presetFilter.name &&
                        "text-blue font-semibold"
                      } pt-2 flex-shrink-0 text-sm sm:text-mm`}
                    >
                      {presetFilter.name}
                    </div>
                  </button>
                ))}
              </Tab.Panel>
              <Tab.Panel className="text-m sm:text-mm md:text-mm w-full h-full flex flex-col items-center">
                {filters.map((filter, index) => (
                  <div
                    key={index}
                    className="group grid grid-cols-3 place-items-center w-full h-full"
                  >
                    <h3>{filter.name}</h3>
                    <Slider
                      onChange={(newValue) => {
                        setFilters(
                          filters.map((prevFilter) => {
                            if (prevFilter.name !== filter.name) {
                              return prevFilter;
                            }
                            return { ...prevFilter, value: newValue };
                          })
                        );
                      }}
                      defaultValue={filter.initialValue}
                      value={filter.value}
                      min={filter.range.min}
                      max={filter.range.max}
                      step={1}
                      aria-label={`${filter.name} slider`}
                      w="80%"
                      focusThumbOnChange={false}
                    >
                      <SliderTrack bg="lightgray" h={0.5}>
                        <SliderFilledTrack bg="black" />
                      </SliderTrack>
                      <SliderThumb boxSize={4} bg="black" />
                    </Slider>
                    <div className="grid grid-cols-4 place-items-center h-full w-full">
                      <button
                        onClick={() =>
                          setFilters(
                            filters.map((prevFilter) => {
                              if (prevFilter.name !== filter.name) {
                                return prevFilter;
                              }
                              return {
                                ...prevFilter,
                                value: filter.initialValue!,
                              };
                            })
                          )
                        }
                        className="invisible group-hover:visible text-blue text-xxs sm:text-xs  font-semibold"
                      >
                        Reset
                      </button>
                      <span className="flex justify-center">
                        {Math.round(
                          ((filter.value - filter.range.min) /
                            (filter.range.max - filter.range.min)) *
                            100
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </section>
    </>
  );
}
