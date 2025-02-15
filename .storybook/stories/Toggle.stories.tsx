import Link from "src/icons/Link";
import Toggle from "src/pages/ProjectDetails/Rewards/RewardForm/WorkItemSidePanel/Toggle/index";

export default {
  title: "Toggle",
  component: Toggle,
  argTypes: {
    enabled: { type: "boolean" },
  },
};

type Args = {
  enabled: boolean;
};

const props = {
  label: "Preferred method",
  icon: <Link />,
  setEnabled: Function.prototype(),
};

export const Default = {
  render: (args: Args) => <Toggle {...props} {...args} />,
};
