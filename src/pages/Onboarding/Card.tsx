import { PropsWithChildren, ReactNode } from "react";
import Button, { ButtonType } from "src/components/Button";
import { Flex } from "src/components/New/Layout/Flex";
import { Spinner } from "src/components/Spinner/Spinner";
import Tag, { TagSize } from "src/components/Tag";
import { useIntl } from "src/hooks/useIntl";
import ArrowLeftSLine from "src/icons/ArrowLeftSLine";
import ArrowRightSLine from "src/icons/ArrowRightSLine";
import CheckLine from "src/icons/CheckLine";
import LockFill from "src/icons/LockFill";

type Props = {
  title: string;
  description: string;
  step: number;
  stepCount: number;
  private?: boolean;
  prev?: () => void;
  next?: () => void;
  submit?: boolean;
  footerRightElement?: ReactNode;
  loading?: boolean;
} & PropsWithChildren;

export default function Card({
  step,
  stepCount,
  title,
  description,
  private: _private,
  prev,
  next,
  submit,
  children,
  footerRightElement,
  loading,
}: Props) {
  const { T } = useIntl();

  return (
    <div className="relative flex max-h-full w-full max-w-full flex-col overflow-hidden bg-card-background-base md:w-[688px] md:rounded-2xl">
      <div className="hidden w-full bg-mosaic bg-cover pb-1.5 md:block" />

      <div className="flex flex-col gap-4 bg-card-background-base p-12 pb-5">
        <div className="font-walsheim text-base font-normal text-spaceBlue-100">{`${step}/${stepCount}`}</div>
        {_private && (
          <Tag size={TagSize.Small}>
            <div className="flex flex-row items-center gap-2 text-orange-400">
              <LockFill />
              {T("onboarding.privateNotice")}
            </div>
          </Tag>
        )}
        <div className="font-belwe text-2xl font-normal text-greyscale-50">{title}</div>
        <div className="font-walsheim text-base font-normal text-spaceBlue-100">{description}</div>
      </div>
      <div className="flex flex-1 flex-col overflow-auto px-3">
        <div className="overflow-auto pt-2 scrollbar-thin scrollbar-thumb-spaceBlue-600 scrollbar-thumb-rounded scrollbar-w-1.5">
          <div className="overflow-hidden px-9 pb-4 pt-1">{children}</div>
        </div>
      </div>
      <Flex
        justify="between"
        item="center"
        gap={4}
        className="z-10 flex w-full border-t border-card-border-light bg-card-background-base p-6 shadow-medium xl:rounded-b-2xl"
      >
        <Flex justify="start" item="center">
          {footerRightElement ? footerRightElement : null}
        </Flex>
        <Flex justify="end" item="center" gap={6}>
          {prev && (
            <Button type={ButtonType.Secondary} onClick={prev}>
              <ArrowLeftSLine className="-ml-2 text-2xl" />
              {T("onboarding.backButton")}
            </Button>
          )}
          {next && (
            <Button onClick={next}>
              {T("onboarding.nextButton")}
              <ArrowRightSLine className="-mr-2 text-2xl" />
            </Button>
          )}
          {submit && (
            <Button htmlType="submit">
              {loading ? <Spinner /> : <CheckLine className="-ml-1 text-2xl" />}
              {T("onboarding.submitButton")}
            </Button>
          )}
        </Flex>
      </Flex>
    </div>
  );
}
