import { useIntl } from "src/hooks/useIntl";

import { pretty } from "src/utils/id";
import { MobileUserRewardItem } from "src/components/UserRewardTable/MobileUserRewardList";
import RoundedImage, { Rounding } from "src/components/RoundedImage";
import { RewardPageItemType } from "src/hooks/useInfiniteRewardsList";
import { PaymentStatus } from "src/types";
import PayoutStatus from "src/components/PayoutStatus/PayoutStatus";

export default function MobileRewardList({
  rewards,
  onRewardClick,
}: {
  rewards: RewardPageItemType[];
  onRewardClick: (reward: RewardPageItemType) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      {rewards.map(reward => (
        <button onClick={() => onRewardClick(reward)} key={reward.id}>
          <MobileRewardItemContainer reward={reward} />
        </button>
      ))}
    </div>
  );
}

function MobileRewardItemContainer({ reward }: { reward: RewardPageItemType }) {
  const { T } = useIntl();

  return (
    <MobileUserRewardItem
      id={reward.id}
      image={<RoundedImage src={reward.rewardedUserAvatar} alt={reward.rewardedUserLogin} rounding={Rounding.Circle} />}
      title={reward.rewardedUserLogin}
      request={T("reward.table.reward", {
        id: pretty(reward.id),
        count: reward.numberOfRewardedContributions,
      })}
      amount={reward.amount}
      date={new Date(reward.requestedAt)}
      payoutStatus={<PayoutStatus status={PaymentStatus[reward.status]} />}
    />
  );
}
