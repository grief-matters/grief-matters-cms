---
name: resource-audit
description: Audit a specific set of resources by type and amount
disable-model-invocation: true
---

Using Sanity MCP with project "vg3sb730" against the $ARGUMENTS[0] dataset, get the oldest (by lastUpdated) $ARGUMENTS[1] documents of type $ARGUMENTS[2]

The documents catalogue an 'internet resource'. It is your job to validate that the information we have in the Sanity document accurately reflects the content of the resource.

For each document you'll need to:

- "read" the page content from the `resourceUrl` field to get an understanding of what you're reviewing

Then you should review each field of the document in turn to make sure it is accurate. Here are some guidelines as to what each field expects:

- `title` - should usually be the same as the title of the resource (i.e. the heading on the page). The only exception is if the actual title might be too vague within our system (e.g. "Resources")
- `description` - should be around 30 words, and should accurately describe what the user can expect when visiting the resource. It should be typical of good web copy, but be simple and plain english, and convey the subject of the resource and why the user may find it useful
- `imageAssetField` - can be ignored during your review
- `availableLanguages` - current values 'english' or 'spanish' - denotes what languages the resource is available in. You should let me know if it is in languages not currently available for selection
- `lossRelationships` - Specifies the relationship(s) to the person, being, or aspect of self that has been lost (e.g. parent, spouse, pet). This a reference field, so it may be worth getting all `lossRelationship` documents via Sanity MCP for context. References should only be added if the resource specifically targets them.
- `causesOfDeath` - Specifies the cause(s) of death that this resource speaks to. This a reference field, so it may be worth getting all `causeOfDeath` documents via Sanity MCP for context. References should only be added if the resource specifically targets that cause of death.
- `themes` - Specifies the specific topical themes this resource speaks to. This a reference field, so it may be worth getting all `theme` documents via Sanity MCP for context. References should only be added if the resource specifically targets that theme. You can add multiple if needed.
- `demographics` - Specific demographics that this resource is targeted towards (i.e. the reader not the subject - although this may be the same thing). You can add multiple, but if only the resource specifically targets them, not as a catch all
- `audienceRole` - the intended audience possible values are 'bereaved', 'supporter', 'professional'. Multiple can be used, but this would be unusual - a resource is usually targeting one specifically

- the remaining classification fields (griefPhases, griefTypes, contentFunctions, emotionalStates) are similar to the other reference fields, you'll probably need to fetch those documents vis Sanity MCP so you can understand the concept and apply them to the content of the resource. Populating these fields is optional and should only be done if the resource specifically resonates with that concept.

- `searchAliases` - Words or phrases a user might type to find this resource that do not already appear in the title or description - or that are not covered by our other reference fields. The purpose of this field si to enrich our Pagefind search on our frontend, so only add aliases that you would expect to have genuine value in that context. It's imperative that we do not repeat concepts already covered by other fields

If you are unable to fetch the content because of access issues, if this is due to a paywall, mark the `paywalled` field, if it's because you need to register a free account, mark the `registrationRequired` field, if you are unable to fetch the content for any other reason, include a follow on in your summary.

Once you have completed your review, any fields you want to update should be done by using the Sanity MCP tools to update the relevant document.

Once you have finished, I expect a tabulated summary of what done
