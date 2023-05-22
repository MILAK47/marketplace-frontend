import { PropsWithChildren } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";

export enum TooltipPosition {
  Top = "top",
  Bottom = "bottom",
  Left = "left",
  Right = "right",
}

type Props = {
  anchorId: string;
  position?: TooltipPosition;
  visible?: boolean;
  clickable?: boolean;
} & PropsWithChildren;

export default function Tooltip({
  anchorId,
  position = TooltipPosition.Bottom,
  visible = true,
  clickable,
  children,
}: Props) {
  return (
    <ReactTooltip
      anchorId={anchorId}
      place={position}
      style={{
        background: "#313030",
        fontFamily: "GT Walsheim",
        fontWeight: 400,
        textAlign: "center",
        fontSize: "0.75rem",
        lineHeight: "1rem",
        color: "#F3F0EE",
        borderRadius: 8,
        padding: "12 8",
        opacity: visible ? 100 : 0,
        zIndex: 10,
      }}
      clickable={clickable}
    >
      {children}
    </ReactTooltip>
  );
}
