import RoundedImage, { ImageSize, Rounding } from "src/components/RoundedImage";
import Tag from "src/components/Tag";
import { useIntl } from "src/hooks/useIntl";
import TimeLine from "src/icons/TimeLine";
import { ContributionDetail } from "src/types";
import { cn } from "src/utils/cn";
import displayRelativeDate from "src/utils/displayRelativeDate";
import { formatPaymentId } from "src/utils/formatPaymentId";
import PayoutStatus from "../../../components/PayoutStatus/PayoutStatus";
import { AvailableConversion } from "../../../components/Currency/AvailableConversion";
import { useStackContributorProfile } from "src/App/Stacks/Stacks";

export function RewardCard({
  reward,
  onClick,
}: {
  reward: ContributionDetail["rewards"][number];
  onClick?: () => void;
}) {
  const { T } = useIntl();
  const [openProfilePanel] = useStackContributorProfile();

  return (
    <article
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-greyscale-50/8 bg-white/2 p-4 font-walsheim shadow-lg",
        onClick ? "cursor-pointer hover:bg-white/5" : ""
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-1 text-xs leading-none text-greyscale-300">
            <TimeLine className="text-base leading-none" />
            <span className="first-letter:uppercase">{displayRelativeDate(reward.createdAt)}</span>
            {reward.processedAt ? (
              <>
                &nbsp;&bull;&nbsp;
                <span>
                  {T("contributions.panel.rewards.processedAt", { date: displayRelativeDate(reward.processedAt) })}
                </span>
              </>
            ) : null}
          </div>
          <p className="text-base font-semibold leading-none text-greyscale-50">
            {T("contributions.panel.rewards.id", { id: formatPaymentId(reward.id) })}
          </p>
        </div>

        <PayoutStatus status={reward.status} />
      </div>

      <Tag>
        <AvailableConversion
          tooltipId={`${reward.id}-reward-conversion`}
          currency={{
            currency: reward.currency,
            amount: reward.amount,
            dollar: reward.dollarsEquivalent,
          }}
        />
      </Tag>

      <div className="flex items-center gap-2">
        <RoundedImage
          src={reward.from.avatarUrl ?? ""}
          alt={reward.from.login ?? ""}
          rounding={Rounding.Circle}
          size={ImageSize.Xxs}
        />
        <p className="text-sm leading-none text-greyscale-300">
          {T("contributions.panel.rewards.fromUser")}&nbsp;
          <button
            type="button"
            className="text-spacePurple-300 hover:text-spacePurple-200"
            onClick={e => {
              e.stopPropagation();
              if (reward.from.githubUserId) openProfilePanel({ githubUserId: reward.from.githubUserId });
            }}
          >
            {reward.from.login}
          </button>
        </p>
      </div>
    </article>
  );
}
