---
name: resource-review
description: A user invocable batch "internet resource" review. Take a batch of "internet resources" and review them against a set of detailed criteria, reviewing the resources for editorial accuracy, applying any necessary updates via Sanity MCP
disable-model-invocation: true
argument-hint: "[dataset] [numOfDocs]"
---

# Content Review

An "Internet Resource", in the context of the Why Grief Matters Sanity CMS, is a Sanity document that represents a specific grief or grief-adjacent resource somewhere on the internet. An internet resource document's job is to describe the resource accurately from an editorial perspective, as well as classify it appropriately based on the various taxonomies we have defined, in order to surface it when relevant to a user's situation or search criteria.

It is your job to ensure that internet resource documents have been accurately entered into the CMS by reviewing the source material directly and making updates as necessary. Your work should always be `draft` as it will be checked by a human content editor before publishing. **YOU MUST NEVER PUBLISH YOUR DRAFT CHANGES**

When you need to fetch, reference or update content in Sanity, you should do so using Sanity MCP tools against the "vg3sb730" and "$0" dataset

## Strict review Guidelines and further context

### Existing values and empty fields

**Existing values** - treat the existing value as a previous editor's judgement. Keep it unless the fetched content or the guidelines below give you a specific, citable reason to change it — a sentence or section you can point to that contradicts the existing value.

**Empty reference fields** - for most optional taxonomies, empty is the most common correct state. Add a tag only when it passes the inclusion test below.

Over-tagging optional taxonomies (themes, emotionalStates, demographics, supportedGriever, contentFunctions, griefPhases) is a worse failure mode than under-tagging — false positives surface in search and faceted browse and erode user trust.

### Field guidelines

You will need to ascertain via the Sanity document schemas cary which fields. Not all fields are present on all internet resource document types.

#### Value Fields

- title: this will usually be the actual title of the resource. If the existing title is too vague when viewed out of context (if it were syndicated for example), then try to improve it
- description: ~30 words, plain-English web copy. Convey what the resource is about and why a bereaved user, supporter, or professional might find it useful.
- availableLanguages: valid values available in `schemas/fields/languagesField.ts`. A generic "Translate this page" widget (e.g. Google Translate) does NOT count. Always include English unless the resource is explicitly not in English.` 'available' can be defined as:
  - a language toggle/switcher in site navigation (e.g. "En Español")
  - sections of the page rendered in that language
  - group/program names in that language ("Encuentros de apoyo")
  - an explicit statement that materials are available in that language
- searchAliases: Up to 5 focused words or phrases a user might search to find this resource. You **MUST NOT** include words or phrases that are already in (or that you plan to add) in `title`, `description` and you should not attempt to cover concepts already covered by the reference taxonomies.
- registrationRequired: set to `true` if access requires creating an account on the site OR a third-party platform (Sharewell, Zoom registration walls, Facebook private group approval), OR submitting an intake form/interview
- paywalled: set to `true` if accessing the substantive content requires a paid subscription. A suggested donation that is explicitly waivable is NOT paywalled.
- contactMethods: the available contact methods. Add as many as are applicable. For each method, set contactType and only the value fields relevant to that type (telephoneNumber for tel/tty/sms, smsBody for sms, email for email, contactForm for contactForm, liveChatUrl for liveChat). Leave the other value fields as null. availabilities applies to all types except email and contactForm
- audienceRole: who the content is WRITTEN FOR — not who might happen to find it useful. Allowed: "bereaved", "supporter", "professional". Default to a single value. The fact that a resource "could be useful" to another audience does NOT justify adding them. Only assign multiple values where the resource at explicitly targeted at multiple audiences. Concrete markers:
  - bereaved: addresses the reader as someone experiencing loss ("If you are grieving...", plain compassionate language, focus on the reader's own feelings/experience)
  - supporter: addresses someone helping a bereaved person ("If someone you love is grieving...", focus on what to say/do for another person)
  - professional: addresses clinicians, counselors, chaplains, or researchers (clinical terminology, assumes professional training, discusses client/patient work, cites research, offers CE credits, etc.)
- supportedGriever: describes attributes of the bereaved person being supported. Inspect `schemas/fields/supportedGrieverField.ts` for current permitted values. Only applies when audienceRole includes "supporter" or "professional" — i.e. the content is addressed to someone helping a bereaved person. Apply a tag only when the content specifically addresses supporting a bereaved person of that age group (e.g. "helping a grieving child", "supporting a teen through loss"). Leave empty if the supporter/professional content does not specifically focus on supporting a child or teen.

#### Classification Reference Fields

- lossRelationships: the relationship to the person, being, or aspect of self that has been lost (e.g. parent, spouse, pet). Apply a tag only when the content specifically addresses that relationship; **DO NOT** apply when it is only mentioned in passing or used as one example among many.
- causesOfDeath: The cause of a death that has been experienced (e.g. suicide, cancer, sudden / traumatic). Apply a tag only when the content specifically addresses bereavement shaped by that cause; do not apply to passing mentions or to deaths where a more specific cause fits.
- themes: A subject matter or theme covered by a resource. Apply only when the theme is the subject of a dedicated section — a paragraph or more discussing it in its own right — not introduced as example, modifier, or one item among many.
- griefPhases: The stages individuals often experience after a significant loss, based on contemporary grief research — a custom list, not the Kübler-Ross 5 stages. Apply only when a phase is the resource's organizing frame across multiple sections; a passing reference to growing, searching, or integrating does not qualify.
- griefTypes: Type of grief experience. Some overlap with phase and cause is fine — types describe a kind of experience rather than a moment in time or a cause. Apply a tag only when the resource explicitly names the type or substantively addresses it across the content.
- contentFunctions: The primary job(s) the resource does — what the reader is trying to accomplish when this resource serves them well.
- emotionalStates: Most resources warrant 0 emotional states. Apply only when the resource is structured around the state — a section devoted to it, repeated discussion, or the state named in headings. A passing mention of guilt, anger, etc. as one feeling among others **DOES NOT** qualify.
- demographics: A demographic describes a specific identity or community of people. Most resources warrant 0 demographics. Apply only when a resource is explicitly targeted at a demographic (named in title/positioning, dedicated programming, or framing throughout), not merely when members of that demographic might find it useful.

### Reference Fields — inclusion test

For each reference field, both gates must pass:

a. **Quote gate:** Identify the single strongest continuous passage in the content where the candidate concept appears.
b. **Primary-subject gate:** In that passage, is the concept the _subject_ — the thing being discussed in its own right, not the example, modifier, or one item in a list? If you deleted every sentence containing the concept, would the resource's purpose change?

Both yes → include. Either no → leave it out.

A reference does NOT apply if the resource only:

- mentions the concept in passing
- is thematically adjacent
- uses it as background context
- uses it as one example illustrating a different point

## Process

### 1. Fetch the target resource set

Using Sanity MCP, fetch the $1 oldest, published (without draft) documents that are one of these document types:

- "article",
- "blog",
- "book",
- "community",
- "course",
- "essentialService",
- "externalOrg",
- "crisisResource",
- "forum",
- "listicle",
- "memorial",
- "peerSupport",
- "story",
- "supportGroup",
- "therapyResource",
- "webinar",

We should skip any documents that have `skipLinkCheck` set to `true`. An example groq query to use would look like:

```groq
  *[
    _type in $docTypes
    && defined(resourceUrl)
    && !(_id in path('drafts.**'))
    && !defined(*[_id == "drafts." + ^._id][0])
    && skipLinkCheck != true
  ] | order(_updatedAt asc)[0...$limit]
```

`$docTypes` being those listed above, and `$limit` being $1

### 2. Fetch the reference field taxonomy documents

Internet resources are classified using a set of classification Sanity document types applied as references to the resources. Fetch all of the published taxonomy documents:

- "lossRelationship",
- "causeOfDeath",
- "theme",
- "demographic",
- "griefPhase",
- "griefType",
- "emotionalState",
- "contentFunction",

You are specifically interested in the `aiPromptHintField` on these documents, as they will instruct you when each reference document should be used, and in some cases, when it should not be used.

### 3. Perform document reviews

For each resource in the target resource set, perform the following steps:

1. **Fetch the resource** - use Jina MCP tools with the document's `resourceUrl` field to fetch a markdown summary of the web content. If this fails, try **once only** to get the content of the page using web-fetch. If this fails, skip all other document review steps and apply a document update in accordance with the relevant failure mode.
2. **Review the Sanity document against the content** - evaluate all existing values against the content and determine which fields need to be updated, and to what values, including removals of incorrectly assigned values
3. **Update the document** - using Sanity MCP to update the document. **NEVER** try and publish your changes.

Failure modes:

- **Fetch failure** - in the event that you are unable to fetch the source content, update the document as follows: update the `skipLinkCheckReason` field with one of: 'blocked_by_robots', 'content_error', 'temporary_failure' 'unknown', whichever is the most applicable. If the failure is 'blocked_by_robots', also update the `skipLinkCheck` field to `true`

### 4. Provide a summary

Provide a summary of your review in the form of a markdown table. It should include the columns:

- id: the non-draft id of the Sanity document reviewed
- result: was the review successful - one of `ok` or `fail`
- updated: did you make any changes to the document - one of `true` or `false`
- confidence: the confidence you have in the outcome of the review as a percentage - 100% being fully confident

Write the summary to `reports/llm/resource-review/` using the filename format `{TODAY}_content-review.md` - `{TODAY}` should be replaced with today's date in the format YYYY-MM-DDThh:mm
