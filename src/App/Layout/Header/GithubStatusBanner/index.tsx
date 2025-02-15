import { useLocation } from "react-router";
import { RoutePaths } from "src/App";
import ExternalApi from "src/api/External";
import Button, { ButtonAccentColor, ButtonSize, ButtonType } from "src/components/Button";
import { useIntl } from "src/hooks/useIntl";
import GithubWarning from "src/icons/GithubWarning";
import { cn } from "src/utils/cn";

export function GithubStatusBanner() {
  const { T } = useIntl();
  const location = useLocation();

  const marginRoutes = [RoutePaths.Contributions];
  const shouldAddMargin = marginRoutes.some(route => route === location.pathname);

  const { data } = ExternalApi.queries.useGithubStatus();

  if (data && (data.status.indicator === "major" || data.status.indicator === "critical")) {
    return (
      <div
        className={cn("flex items-center justify-between gap-8 bg-orange-900 px-8 py-4", { "mb-4": shouldAddMargin })}
      >
        <div className="flex items-center gap-2">
          <div>
            <GithubWarning />
          </div>
          <p className="font-walsheim text-orange-500">{T("githubStatusBanner.message")}</p>
        </div>
        <a href="https://www.githubstatus.com/" target="_blank" rel="noopener noreferrer">
          <Button
            type={ButtonType.Secondary}
            accentColor={ButtonAccentColor.Orange}
            size={ButtonSize.Sm}
            className="whitespace-nowrap"
          >
            {T("githubStatusBanner.button")}
          </Button>
        </a>
      </div>
    );
  }

  return null;
}
