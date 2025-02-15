import StylizedCombobox, { Props, Option } from "src/components/StylizedCombobox";

export default {
  title: "StylizedCombobox",
  component: StylizedCombobox,
};

const people: Option[] = [
  "Durward Reynolds",
  "Kenton Towne",
  "Therese Wunsch",
  "Benedict Kessler",
  "Katelyn Rohan",
].map(p => ({ id: p, value: p, displayValue: p }));

const props: Props<Option> = {
  options: people,
  selectedOptions: people[0],
  setSelectedOptions: (value: Option) => {
    console.log("Selected option", value);
  },
  optionFilter: (query: string, option: Option) => option.displayValue.toLowerCase().includes(query.toLowerCase()),
  placeholder: "People name",
  maxDisplayedOptions: 3,
};

export const Default = {
  render: () => (
    <div className="w-5/12">
      <StylizedCombobox {...props} />
    </div>
  ),
};

const propsMulti: Props<Option> = {
  options: people,
  selectedOptions: people.slice(0, 3),
  setSelectedOptions: (value: Option[]) => {
    console.log("Selected option(s)", value);
  },
  optionFilter: (query: string, option: Option) => option.displayValue.toLowerCase().includes(query.toLowerCase()),
  placeholder: "People name",
  multiple: true,
  maxDisplayedOptions: 3,
};

export const Multi = {
  render: () => (
    <div className="w-5/12">
      <StylizedCombobox {...propsMulti} />
    </div>
  ),
};
