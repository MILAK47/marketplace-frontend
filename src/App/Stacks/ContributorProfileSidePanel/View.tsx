import ReadOnlyView from "./ReadOnlyView";
import EditView from "./EditView";
import { UserProfile } from "src/api/Users/queries";
import { UseGetMyProfileInfoResponse } from "src/api/me/queries";

type Props = {
  profile: UserProfile | UseGetMyProfileInfoResponse;
  isOwn?: boolean;
  setEditMode: (value: boolean) => void;
  editMode: boolean;
};

export default function View({ isOwn, profile, editMode, setEditMode }: Props) {
  return editMode ? (
    <EditView myProfile={profile} setEditMode={setEditMode} />
  ) : (
    <ReadOnlyView profile={profile} setEditMode={setEditMode} isOwn={isOwn} />
  );
}
