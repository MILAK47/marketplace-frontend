import { Controller, UseFormReturn } from "react-hook-form";
import { FieldProjectLead } from "src/pages/ProjectCreation/views/ProjectInformations/components/ProjectLead/ProjectLead";
import { FieldImage } from "src/components/New/Field/File";
import { FieldInput } from "src/components/New/Field/Input";
import { FieldSwitch } from "src/components/New/Field/Switch";
import { FieldTextarea } from "src/components/New/Field/Textarea";
import { Flex } from "src/components/New/Layout/Flex";
import InformationLine from "src/icons/InformationLine";
import { MultiStepsForm } from "src/pages/ProjectCreation/components/MultiStepsForm";
import { useContext } from "react";
import ProjectApi from "src/api/Project";
import { useIntl } from "src/hooks/useIntl";
import Button, { ButtonOnBackground } from "src/components/Button";
import CheckLine from "src/icons/CheckLine";
import { CreateProjectContext } from "../../ProjectCreation.context";
import { MoreInfosField } from "src/pages/ProjectDetails/ProjectEdition/pages/Information/components/MoreInfosField";
import { CreateFormData } from "../../types/ProjectCreationType";

export const ProjectInformationsPage = () => {
  const { T } = useIntl();
  const {
    form,
    helpers: { prev },
  } = useContext(CreateProjectContext);

  const {
    mutate: uploadProjectLogo,
    isSuccess: successUploadLogo,
    isPending: loadingUploadLogo,
  } = ProjectApi.mutations.useUploadLogo({
    options: {
      onSuccess: data => {
        form.setValue("logoUrl", data.url, { shouldDirty: true, shouldValidate: true });
      },
    },
  });

  return (
    <MultiStepsForm
      title={T("project.details.create.informations.title")}
      step={3}
      stepCount={3}
      submitButton={
        <Button
          htmlType="submit"
          onBackground={ButtonOnBackground.Blue}
          disabled={!form.formState?.isValid || form.formState.isSubmitting}
        >
          <CheckLine className="-ml-1 text-2xl" /> {T("common.publish")}
        </Button>
      }
      prev={prev}
    >
      <Flex direction="col" gap={8}>
        <Flex direction="col" gap={6} className="w-full">
          <Controller
            name="name"
            control={form.control}
            render={props => (
              <FieldInput
                {...props.field}
                {...props.fieldState}
                label={T("project.details.create.informations.form.fields.name.label")}
                placeholder={T("project.details.create.informations.form.fields.name.placeholder")}
                infoMessage={{
                  children: T("project.details.create.informations.form.fields.name.info"),
                  icon: ({ className }) => <InformationLine className={className} />,
                }}
              />
            )}
          />
          <Controller
            name="shortDescription"
            control={form.control}
            render={props => (
              <FieldInput
                {...props.field}
                {...props.fieldState}
                placeholder={T("project.details.create.informations.form.fields.short.placeholder")}
                label={T("project.details.create.informations.form.fields.short.label")}
              />
            )}
          />
          <Controller
            name="longDescription"
            control={form.control}
            render={props => (
              <FieldTextarea
                {...props.field}
                {...props.fieldState}
                rows={10}
                placeholder={T("project.details.create.informations.form.fields.long.placeholder")}
                label={T("project.details.create.informations.form.fields.long.label")}
              />
            )}
          />
          <Controller
            name="logoUrl"
            control={form.control}
            render={props => (
              <FieldImage
                {...props.field}
                {...props.fieldState}
                placeholder={T("project.details.create.informations.form.fields.logo.placeholder")}
                label={T("project.details.create.informations.form.fields.logo.label")}
                max_size_mo={10}
                upload={{
                  mutate: uploadProjectLogo,
                  success: successUploadLogo,
                  loading: loadingUploadLogo,
                }}
              />
            )}
          />
          <Controller
            name="moreInfos"
            control={form.control}
            render={({ field: { onChange, value } }) => (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              <MoreInfosField {...{ onChange, value, form: form as UseFormReturn<CreateFormData, unknown> as any }} />
            )}
          />
          <Controller
            name="projectLeads"
            control={form.control}
            render={({ field: { value, name } }) => (
              <FieldProjectLead
                name={name}
                value={{ invited: value, toKeep: [] }}
                onChange={({ invited }) => {
                  form.setValue(
                    "inviteGithubUserIdsAsProjectLeads",
                    invited.map(lead => lead.githubUserId).filter(Boolean) as number[],
                    { shouldDirty: true }
                  );
                  form.setValue("projectLeads", invited, { shouldDirty: true });
                }}
              />
            )}
          />
          <Controller
            name="isLookingForContributors"
            control={form.control}
            render={props => (
              <FieldSwitch
                {...props.field}
                {...props.fieldState}
                switchLabel={T("project.details.create.informations.form.fields.jobs.subLabel")}
                label={T("project.details.create.informations.form.fields.jobs.label")}
              />
            )}
          />
        </Flex>
      </Flex>
    </MultiStepsForm>
  );
};

export default ProjectInformationsPage;
