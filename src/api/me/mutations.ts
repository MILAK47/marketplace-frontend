import { API_PATH } from "src/api/ApiPath";
import { UseMutationProps, useBaseMutation } from "../useBaseMutation";
import { PROJECT_TAGS } from "../Project/tags";
import MeApi from ".";
import { components } from "src/__generated/api";
import { UseUploaderProps, useBaseUploader } from "../useBaseUploader";

export type UseUpdateMeMeBody = components["schemas"]["PatchMeContract"];

const useUpdateMe = ({ options = {} }: UseMutationProps<unknown, unknown, UseUpdateMeMeBody>) => {
  return useBaseMutation<UseUpdateMeMeBody, unknown>({
    resourcePath: API_PATH.ME,
    method: "PATCH",
    invalidatesTags: [{ queryKey: MeApi.tags.user, exact: false }],
    ...options,
  });
};

const useAcceptProjectLeaderInvitation = ({
  options = {},
  params,
}: UseMutationProps<unknown, { projectId: string; projectSlug: string }, null>) => {
  return useBaseMutation<null, unknown>({
    resourcePath: API_PATH.ME_PROJECT_LEADER_INVITATIONS(params?.projectId || ""),
    enabled: !!params?.projectId,
    invalidatesTags: [
      { queryKey: PROJECT_TAGS.detail_by_slug(params?.projectSlug || ""), exact: false },
      { queryKey: MeApi.tags.all, exact: false },
    ],
    ...options,
  });
};

const useClaimProject = ({
  params,
  options = {},
}: UseMutationProps<unknown, { projectId?: string; projectSlug?: string }, unknown>) => {
  return useBaseMutation<unknown, unknown>({
    resourcePath: API_PATH.MY_CLAIM(params?.projectId || ""),
    method: "PUT",
    enabled: !!params?.projectId,
    invalidatesTags: [
      { queryKey: PROJECT_TAGS.detail_by_slug(params?.projectSlug || ""), exact: false },
      { queryKey: MeApi.tags.all, exact: false },
    ],
    ...options,
  });
};

const usePayoutInfo = ({ options = {} }: UseMutationProps) => {
  return useBaseMutation<unknown, unknown>({
    resourcePath: API_PATH.MY_PAYOUT_INFO,
    method: "PUT",
    ...options,
  });
};

const useApplyProject = ({
  params,
  options = {},
}: UseMutationProps<unknown, { projectSlug?: string }, { projectId: string }>) => {
  return useBaseMutation<{ projectId: string }, unknown>({
    resourcePath: API_PATH.ME_APPLY_TO_PROJECT,
    method: "POST",
    invalidatesTags: [
      { queryKey: PROJECT_TAGS.detail_by_slug(params?.projectSlug || ""), exact: false },
      { queryKey: MeApi.tags.all, exact: false },
    ],
    ...options,
  });
};

export type UseUpdateProfileBody = components["schemas"]["UserProfileRequest"];
export type UseUpdateProfileResponse = components["schemas"]["PrivateUserProfileResponse"];

const useUpdateProfile = ({ options = {} }: UseMutationProps<UseUpdateProfileResponse, UseUpdateProfileBody>) => {
  return useBaseMutation<UseUpdateProfileBody, UseUpdateProfileResponse>({
    resourcePath: API_PATH.ME_PROFILE,
    invalidatesTags: [{ queryKey: MeApi.tags.all, exact: false }],
    method: "PUT",
    ...options,
  });
};

const useUploadProfilePicture = ({ options = {} }: UseUploaderProps<{ url: string }, undefined>) => {
  return useBaseUploader<{ url: string }>({
    resourcePath: API_PATH.ME_PROFILE_PICTURE,
    method: "POST",
    ...options,
  });
};

export default {
  useAcceptProjectLeaderInvitation,
  useClaimProject,
  usePayoutInfo,
  useApplyProject,
  useUpdateMe,
  useUpdateProfile,
  useUploadProfilePicture,
};
