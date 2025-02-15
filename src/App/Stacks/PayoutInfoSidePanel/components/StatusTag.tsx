import Tag, { TagSize } from "src/components/Tag";
import Box from "src/components/Utils/Box";
import { useIntl } from "src/hooks/useIntl";
import CheckLine from "src/icons/CheckLine";
import ErrorWarningLine from "src/icons/ErrorWarningLine";
import { cn } from "src/utils/cn";
import { RequiredFieldsType } from "src/App/Stacks/PayoutInfoSidePanel/usePayoutInfoValidation";
import { useMemo } from "react";
import { payoutInfoCombinedStatus } from "src/utils/payoutInfoStatusCombined";

export enum StatusType {
  Contact = "CONTACT",
  Payment = "PAYMENT",
}

const validMessages = {
  [StatusType.Contact]: "profile.form.contactSettingsValidTag",
  [StatusType.Payment]: "profile.form.payoutSettingsValidTag",
};

const invalidMessages = {
  [StatusType.Contact]: "profile.missing.contact",
  [StatusType.Payment]: "profile.missing.payment",
};

function getNetworkMessage(key: string) {
  const networksMessages: Record<keyof RequiredFieldsType, string> = {
    missingAptosWallet: "profile.missing.networkFull.APT",
    missingEthWallet: "profile.missing.networkFull.ETH",
    missingOptimismWallet: "profile.missing.networkFull.OP",
    missingSepaAccount: "profile.missing.networkFull.USD", // no using but keep for typing
    missingUsdcWallet: "profile.missing.networkFull.USD", // no using but keep for typing
    missingStarknetWallet: "profile.missing.networkFull.STARK",
  };

  return networksMessages[key as keyof typeof networksMessages];
}

type StatusTagType = {
  isValid: boolean;
  type: StatusType;
  requiredNetworks?: RequiredFieldsType;
  isCompany?: boolean;
  isBankWire?: boolean;
  isEthFormFilled?: boolean;
  isSepaFormFilled?: boolean;
};

export function StatusTag({
  isValid,
  type,
  requiredNetworks,
  isCompany,
  isBankWire,
  isEthFormFilled,
  isSepaFormFilled,
}: StatusTagType) {
  const { T } = useIntl();

  const networks = useMemo(() => {
    const { missingSepaAccount, missingUsdcWallet, missingEthWallet, ...networks } = requiredNetworks || {};
    const networkMessages = Object.entries(networks)
      .filter(([, value]) => value)
      .map(([key]) => T(getNetworkMessage(key)));

    const _missingSepaAccount = missingSepaAccount && !isSepaFormFilled;
    const _missingEthWallet = missingEthWallet && !isEthFormFilled;
    const _missingUsdcWallet = missingUsdcWallet && !isEthFormFilled && !isSepaFormFilled;

    const { eth, iban } = payoutInfoCombinedStatus({
      missingSepaAccount: _missingSepaAccount || false,
      missingUsdcWallet: _missingUsdcWallet || false,
      missingEthWallet: _missingEthWallet || false,
      isCompany,
      isBankWire,
    });

    return [
      ...networkMessages,
      ...(eth ? [T("profile.missing.networkFull.ETH")] : []),
      ...(iban ? [T("profile.missing.networkFull.USD")] : []),
    ];
  }, [requiredNetworks, isCompany, isBankWire]);

  const uniqueNetworks = [...new Set(networks)];

  return type !== StatusType.Payment || uniqueNetworks.length > 0 ? (
    <Box className="pb-6">
      <Tag size={TagSize.Medium} className="px-4">
        <div
          className={cn({
            "text-orange-500": !isValid,
          })}
        >
          {isValid ? (
            <div className="flex flex-row items-center gap-1">
              <CheckLine /> {T(validMessages[type])}
            </div>
          ) : (
            <>
              <ErrorWarningLine className="mr-1 text-orange-500" />
              {T(invalidMessages[type], { networks: uniqueNetworks.join(", ") })}
            </>
          )}
        </div>
      </Tag>
    </Box>
  ) : null;
}
