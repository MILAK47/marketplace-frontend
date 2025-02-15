import { useIntl } from "src/hooks/useIntl";
import { useShowToaster } from "src/hooks/useToaster";
import { copyClickHandlerFactory } from "src/utils/clickHandler";

interface SocialLinkProps extends React.PropsWithChildren {
  link?: string;
  copyableValue?: string;
  copyableValueName?: string;
  testId?: string;
}

export default function SocialLink({ link, copyableValue, copyableValueName, testId, children }: SocialLinkProps) {
  const showToaster = useShowToaster();
  const { T } = useIntl();

  const Component = link ? "a" : "div";

  const linkProps = { href: link, target: "_blank", rel: "noreferrer" };
  const copyProps = {
    onClick: copyClickHandlerFactory(copyableValue || "", () => {
      showToaster(T("profile.valueCopiedToClipboard", { valueName: copyableValueName }));
    }),
  };

  const props = link ? linkProps : copyProps;
  return (
    <Component className="rounded-xl bg-white/4" data-testid={testId} {...props}>
      <div className="flex h-10 w-10 flex-row items-center justify-center rounded-xl bg-noise-light text-2xl text-greyscale-200  hover:cursor-pointer hover:opacity-60">
        {children}
      </div>
    </Component>
  );
}
