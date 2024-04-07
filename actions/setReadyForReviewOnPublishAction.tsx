import {
  DocumentActionComponent,
  DocumentActionProps,
  DocumentActionsContext,
  useDocumentOperation,
} from "sanity";

export function setReadyForReviewOnPublishAction(
  publishAction: DocumentActionComponent,
  context: DocumentActionsContext
) {
  const canPublish =
    context?.currentUser?.role === "administrator" ||
    context?.currentUser?.email === "camille.wortman@sunysb.edu" ||
    context?.currentUser?.email === "j.k.rae.sullivan@gmail.com";

  const Action = (props: DocumentActionProps) => {
    const { patch } = useDocumentOperation(props.id, props.type);

    const originalResult = publishAction(props);

    return {
      ...originalResult,
      disabled:
        originalResult?.disabled || !props.draft?.readyForReview || !canPublish,
      onHandle: () => {
        patch.execute([{ set: { readyForReview: false } }]);
        if (originalResult?.onHandle) {
          originalResult.onHandle();
        }
      },
    };
  };

  return Action;
}
