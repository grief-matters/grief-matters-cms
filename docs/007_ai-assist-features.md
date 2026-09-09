---
title: AI Assist Features
order: 7
---

# Working with the AI Assist Features

The project runs an automated **AI Content Editor** that helps keep the resource collection accurate and well-described. This page explains what it does, what the fields it uses mean, and — most importantly — where _your_ judgement fits in.

## Guiding principle

The AI Content Editor **never changes the live site on its own.** When it reviews a resource, it writes its suggested changes into a **draft** and leaves the published version alone. A human editor then reviews that draft and decides whether to publish it, amend it, or discard it.

Treat every AI suggestion as a _proposal from a well-read but fallible colleague_, not as a correction to rubber-stamp. It can misread a page, miss nuance, or misjudge tone — exactly the things your domain expertise exists to catch.

## What the AI Content Editor actually does

On a schedule, it:

1. Picks resources that are due for review (oldest first, plus anything flagged).
2. Fetches the content at the resource's URL and reads it.
3. Compares that content against the resource's current fields and its knowledge of the taxonomy.
4. Writes any suggested corrections — to the description, tags, and so on — into a **draft** for a human to approve.
5. On the resource types that support it, proposes a **Quality Score** with written notes.

When you next open a resource with a pending AI draft, you'll see the proposed changes waiting. Review them the same way you'd review your own draft before publishing.

## The fields in the AI group

These live on the **AI** tab of a resource (on Essential Service they sit under Access Restrictions).

### Flagged for AI Review

A toggle you can set to _request an off-cycle review_ — for example, right after you add a resource and want the AI's read on it, or after the linked page has changed. The flag **clears itself automatically** once the next review runs. You can't set it while the resource is skipped (below).

> **Caution**
>
> Don't forget to publish after setting the flag toggle as counter-intuitive as this feels - or the AI will not pick it up

### Skipped by AI Content Editor

Excludes the resource from automated checks. Set this when the AI genuinely _can't_ read the resource — for example, the host site blocks crawlers, or requires a login the AI can't pass. A skipped resource won't be reviewed until you un-skip it.

### Skip Reason (read-only)

Filled in **automatically** by the AI when _it_ decides to disable checking for a resource — e.g. the site's `robots.txt` disallows it, or the URL returned an error. It's read-only and only visible when the resource is skipped. To re-enable auditing, un-tick **Skipped by AI Content Editor**.

### Quality Score

On some resource types (Article, Blog, Story, Forum, Peer Support, Printed Material, and others) the AI proposes a quality rating. The scale:

| Score    | Meaning                  |
| -------- | ------------------------ |
| **9–10** | Flagship / exceptional   |
| **7–8**  | Strong                   |
| **5–6**  | Acceptable / serviceable |
| **3–4**  | Weak                     |
| **1–2**  | Remove or replace        |
| **N/A**  | Couldn't be scored       |

A score is **required before you can publish** these resource types — but the proposed number is _yours to override_. If your editorial judgement disagrees with the AI, change it. You're the authority on quality; the AI is a first pass.

### Quality Score Notes (read-only)

The AI's written rationale for the score (including why it chose "N/A"). It's editorial context for _you_, the human approving the draft, and for audit purposes — it is **not shown to visitors**.

## How the AI understands the taxonomy — and why hints matter

When the AI classifies a resource, it doesn't see everything you see. For each tag, it is given only two things: the tag's **title** and its **AI Prompt Hint**. It does _not_ see the longer editor-facing description.

That makes the **AI Prompt Hint** on each classification document (Grief Type, Theme, Emotional State, and the rest) _critical_: it is the only per-tag steering the model gets. A vague or drifting hint produces vague or drifting tagging across the whole site.

**Editing AI hints will drastically alter the output of the AI.** Because the hints encode what each tag is _for_, changing one can quietly redefine a category. Hint wording — like taxonomy scope generally — is owned by the project's editorial lead. If you notice the AI consistently mis-tagging in a way that traces back to a hint, **report it for editorial review** rather than rewriting the hint yourself. See **Tagging & Classification**.

## Summary

Review what the AI proposes, apply your grief expertise where the machine can't, and publish only what you'd be comfortable putting in front of someone.
