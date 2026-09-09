---
title: Images & Accessibility
order: 9
---

> TODO: Needs review

# Images & Accessibility

Images on the site are managed as reusable **Image Asset** documents rather than
uploaded straight onto each resource. This page covers how they work, and the two
responsibilities that come with every image: **accessibility** (alt text) and
**licensing** (image source).

## Image Assets are reusable

An **Image Asset** is its own document, with three parts:

- **Image** — the actual uploaded file.
- **Alternative text** — a text description, for accessibility (see below).
- **Image Source** — a reference to where the image came from, for licensing.

Because it's a document, one Image Asset can be referenced by many resources and
pages. When you add an image to a resource, you're pointing at an Image Asset — so
check whether the right one already exists before uploading a duplicate.

On a resource, the image is usually only shown when the resource is **featured**, so
not every resource needs one.

## Alt text is not optional

The **Alternative text** ("alt text") is the single most important accessibility
feature on the site. It's the text a screen reader reads aloud to a visitor who
can't see the image, and it's what shows if the image fails to load. For a visitor
using assistive technology, the alt text _is_ the image.

Writing good alt text:

- **Describe what's in the image** and what it conveys, concisely.
- **Don't start with "image of…" or "photo of…"** — the screen reader already
  announces that it's an image. The field will warn you if you do this.
- Keep it short but meaningful — a sentence is usually plenty.
- If an image is purely decorative and carries no information, it still needs a
  short, honest description here (alt text is required on every Image Asset).

| Weak alt text     | Better alt text                              |
| ----------------- | -------------------------------------------- |
| "image of person" | "A person sitting alone by a window at dusk" |
| "photo"           | "Two people holding hands across a table"    |

## Image Source & licensing

Every image we use has to be one we're allowed to use. The **Image Source** field
links the Image Asset to an **Image Source** document that records where it came
from and under what licence.

- If the correct source isn't listed, **create one** — don't leave the field blank.
- An Image Source records the source's name, URL, and licence (Creative Commons
  variants, CC0, or a custom licence with a link to the terms).
- If the licence is **Custom**, read the terms carefully to confirm the image can be
  used — and, where attribution or permission is required, that it's been handled.

This isn't bureaucracy: it's how the project stays on the right side of copyright.
Treat "where did this image come from, and may we use it?" as a question you must be
able to answer for every image you add.

## Cropping and focal point

Image uploads support a **hotspot** (focal point): the point in the image that
should stay visible when the site crops it to different shapes and sizes on different
screens. If an image has an obvious subject (a face, a horizon), set the hotspot on
it so the important part is never cropped out.

## A quick checklist for every image

- [ ] Reused an existing Image Asset where possible (no needless duplicates)?
- [ ] Alt text written — descriptive, concise, and _not_ starting with "image of"?
- [ ] Image Source set, with a licence we're allowed to use?
- [ ] Hotspot set if the image has an important focal point?
