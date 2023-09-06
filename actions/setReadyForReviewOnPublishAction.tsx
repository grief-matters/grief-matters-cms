import { DocumentActionProps, useDocumentOperation } from "sanity";

export function setReadyForReviewOnPublishAction(
  publishAction: any,
  context: any
) {
  const canPublish =
    context.currentUser.role === "administrator" ||
    context.currentUser.email === "camille.wortman@sunysb.edu";

  const Action = (props: DocumentActionProps) => {
    const { patch } = useDocumentOperation(props.id, props.type);

    const originalResult = publishAction(props);

    return {
      ...originalResult,
      disabled: !props.draft?.readyForReview || !canPublish,
      onHandle: () => {
        patch.execute([{ set: { readyForReview: false } }]);
        originalResult.onHandle();
      },
    };
  };

  return Action;
}
