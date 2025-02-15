import { useIntl } from "src/hooks/useIntl";
import ErrorWarningLine from "src/icons/ErrorWarningLine";
import CheckLine from "src/icons/CheckLine";
import Button, { ButtonSize } from "src/components/Button";
import Tag, { TagSize } from "src/components/Tag";
import Header from "src/App/Stacks/ContributorProfileSidePanel/Header";
import Card from "./Card";
import { Section } from "./Section";
import Input, { Size } from "src/components/FormInput";
import { Controller, FormProvider, useForm } from "react-hook-form";
import GlobalLine from "src/icons/GlobalLine";
import MapPinLine from "src/icons/MapPinLine";
import { AllocatedTime, UserProfileInfo, fromFragment, mapFormDataToSchema } from "./types";
import ContactInformations from "src/components/ContactInformations";
import TechnologiesSelect from "src/components/TechnologiesSelect";
import FormSelect from "src/components/FormSelect";
import LockFill from "src/icons/LockFill";
import FormToggle from "src/components/FormToggle";
import CompletionBar from "src/components/CompletionBar";
import { useState } from "react";
import { viewportConfig } from "src/config";
import { useMediaQuery } from "usehooks-ts";
import { cn } from "src/utils/cn";
import MeApi from "src/api/me";
import { UseGetMyProfileInfoResponse } from "src/api/me/queries";
import { calculateFormCompletionScore, calculateUserCompletionScore } from "src/utils/calculateCompletionScore";
import useMutationAlert from "src/api/useMutationAlert";
import { Spinner } from "src/components/Spinner/Spinner";

type Props = {
  myProfile: UseGetMyProfileInfoResponse;
  setEditMode: (value: boolean) => void;
};

export default function EditView({ myProfile, setEditMode }: Props) {
  const { T } = useIntl();
  const isXl = useMediaQuery(`(min-width: ${viewportConfig.breakpoints.xl}px)`);

  const formMethods = useForm<UserProfileInfo>({
    defaultValues: fromFragment(myProfile),
    mode: "onChange",
  });
  const { handleSubmit, formState, control, getValues } = formMethods;
  const { isDirty, isValid } = formState;
  const [completionScore, setCompletionScore] = useState(calculateUserCompletionScore(myProfile));

  const weeklyTimeAllocations: { [key in AllocatedTime]: string } = {
    [AllocatedTime.None]: T("profile.form.weeklyAllocatedTime.none"),
    [AllocatedTime.LessThanOneDay]: T("profile.form.weeklyAllocatedTime.lessThan1Day"),
    [AllocatedTime.OneToThreeDays]: T("profile.form.weeklyAllocatedTime.1to3days"),
    [AllocatedTime.GreaterThanThreeDays]: T("profile.form.weeklyAllocatedTime.moreThan3days"),
  };

  const {
    mutate: updateUserProfileInfo,
    isPending: userProfilInformationIsPending,
    ...restUpdateProfileMutation
  } = MeApi.mutations.useUpdateProfile({
    options: {
      onSuccess: () => {
        setEditMode(false);
      },
    },
  });

  useMutationAlert({
    mutation: restUpdateProfileMutation,
    success: {
      message: T("profile.form.success"),
    },
    error: {
      message: T("profile.form.error"),
    },
  });

  const updateCompletionScore = () => {
    const formValues = getValues();
    setCompletionScore(calculateFormCompletionScore({ ...formValues, avatarUrl: myProfile.avatarUrl || "" }));
  };

  const onSubmit = (formData: UserProfileInfo) => updateUserProfileInfo(mapFormDataToSchema(formData));

  return (
    <FormProvider {...formMethods}>
      <form
        id="profile-info-form"
        className="h-full min-h-0"
        onSubmit={handleSubmit(onSubmit)}
        onChange={updateCompletionScore}
        onClick={updateCompletionScore}
      >
        <div className="flex h-full flex-col justify-between">
          <div className="flex min-h-0 flex-col gap-6">
            <Controller
              name="cover"
              control={control}
              render={({ field: { onChange } }) => (
                <Header
                  editable
                  profile={myProfile}
                  onChange={onChange}
                  onChangeProfilePicture={url => {
                    formMethods.setValue("avatarUrl", url, { shouldDirty: true, shouldValidate: true });
                  }}
                />
              )}
            />

            <div className="-mt-[72px] mr-2 flex flex-col gap-6 pb-12 pl-8 pr-6 pt-[72px] scrollbar-thin scrollbar-thumb-white/12 scrollbar-thumb-rounded scrollbar-w-1.5">
              <div data-testid="login" className="font-belwe text-3xl font-normal text-white">
                {myProfile.login}
              </div>

              <Card>
                <Section title={T("profile.form.location")}>
                  <Input
                    size={Size.Sm}
                    withMargin={false}
                    name="location"
                    prefixComponent={<MapPinLine />}
                    inputClassName="pl-9"
                  />
                </Section>
                <Section title={T("profile.form.bio")}>
                  <Input
                    size={Size.Sm}
                    withMargin={false}
                    name="bio"
                    as="textarea"
                    inputProps={{
                      rows: 5,
                    }}
                  />
                </Section>
                <Section title={T("profile.form.website")}>
                  <Input
                    size={Size.Sm}
                    withMargin={false}
                    name="website"
                    prefixComponent={<GlobalLine />}
                    inputClassName="pl-9"
                  />
                </Section>
              </Card>
              <Card>
                <Section
                  gap="wide"
                  title={T("profile.form.contactInfo.title")}
                  subtitle={
                    <>
                      <ErrorWarningLine /> {T("profile.form.contactInfo.subtitle")}
                    </>
                  }
                >
                  <ContactInformations />
                </Section>
              </Card>
              <Card>
                <Section
                  gap="wide"
                  title={T("profile.edit.sections.technologies.title")}
                  subtitle={T("profile.edit.sections.technologies.subtitle")}
                >
                  <Controller
                    name="technologies"
                    render={({ field: { value, onChange } }) => (
                      <TechnologiesSelect technologies={value} setTechnologies={onChange} />
                    )}
                  />
                </Section>
              </Card>

              <Card>
                <Section
                  gap="wide"
                  title={
                    <div className="flex flex-row items-center justify-between">
                      {T("profile.form.weeklyAllocatedTime.title")}
                      <Tag size={TagSize.Small}>
                        <div className="flex flex-row items-center gap-1 text-orange-500">
                          <LockFill />
                          {T("profile.form.weeklyAllocatedTime.privacyNotice")}
                        </div>
                      </Tag>
                    </div>
                  }
                >
                  <FormSelect
                    name="weeklyAllocatedTime"
                    options={Object.entries(weeklyTimeAllocations).map(([value, label]) => ({ value, label }))}
                    control={control}
                  />
                  <FormToggle
                    name="lookingForAJob"
                    control={control}
                    label={T("profile.form.weeklyAllocatedTime.lookingForAJob")}
                  />
                </Section>
              </Card>
            </div>
          </div>

          <div className="flex flex-row items-center justify-between border-t border-greyscale-50/8 bg-white/2 px-8 py-5">
            <Tag size={TagSize.Medium} testid="dirtyTag">
              {isDirty || !isValid ? (
                <div
                  className={cn("flex flex-row items-center gap-1", {
                    "text-orange-500": !isValid,
                    "text-spacePurple-300": isValid,
                  })}
                >
                  <ErrorWarningLine />
                  {isValid ? T("profile.form.saveStatus.unsaved") : T("profile.form.saveStatus.invalid")}
                </div>
              ) : (
                <>
                  <CheckLine />
                  {T("profile.form.saveStatus.saved")}
                </>
              )}
            </Tag>
            <div className="flex flex-row items-center gap-5">
              {isXl && completionScore < 95 && (
                <div className="flex max-w-[100px] flex-col gap-2">
                  <div className="self-end font-walsheim text-sm font-medium text-greyscale-50">
                    {T("profile.form.completion", { completion: completionScore.toString() })}
                  </div>
                  <CompletionBar completionScore={completionScore} />
                </div>
              )}
              <Button
                size={ButtonSize.Md}
                htmlType="submit"
                disabled={userProfilInformationIsPending || !isValid}
                data-testid="profile-form-submit-button"
              >
                {userProfilInformationIsPending ? <Spinner /> : <CheckLine />}
                {T("profile.form.done")}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
