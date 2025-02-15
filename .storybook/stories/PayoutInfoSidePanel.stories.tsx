import PayoutInfoSidePanel from "src/App/Stacks/PayoutInfoSidePanel/PayoutInfoSidePanel";
import withAuthProvider from "../decorators/withAuthProvider";
import withMockedProvider from "../decorators/withMockedProvider";
import withSidePanelStackProvider from "../decorators/withSidePanelStackProvider";
import withToasterProvider from "../decorators/withToasterProvider";

export default {
  title: "PayoutInfoSidePanel",
  component: PayoutInfoSidePanel,
  decorators: [withAuthProvider, withToasterProvider, withMockedProvider(), withSidePanelStackProvider],
};

export const Default = {
  render: () => <PayoutInfoSidePanel />,
};
