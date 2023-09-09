---
title: Content Editors
layout: home
parent: Getting Started
# permalink: /getting-started/content-editors/
---

# Content Editors

This guide will help you get started using the **Why Grief Matters Content Management System (CMS)**. The CMS is an implementation of [Sanity Studio](https://www.sanity.io/studio).

Sanity is a modern headless CMS (Content Management System). Sanity uses structured content to endlessly re-use content across any channel and a composable approach to help businesses connect to any third-party technology, data source, and front end framework.

Before we jump in to Sanity Studio there is some terminology to be familiar with.

### Documents

In Sanity Studio, a document refers to a piece of content like an article, image, or product. It's a structured unit of data with fields that hold information such as text, images, and dates. Documents are the building blocks managed in Sanity Studio's content system, allowing for flexible customization to fit specific project needs.

### Document Types

A "document type" in Sanity Studio is a blueprint for creating specific types of content. It defines the structure and fields that a document of that type can have. For instance, a "Story" document type includes fields for title, description, photograph etc. Document types provide consistency and organization to the content creation process, ensuring that each piece of content follows a predefined format.

### References

In Sanity Studio, "references" are connections between different documents. They allow us to link one document to another, creating relationships between pieces of content. For example, you can reference a "website" document within an "article" document to attribute its "source". These references enhance content management and enable dynamic updates, as changes to a referenced document automatically reflect in all connected instances.

## Sanity Studio Interface

The screenshot below shows the Sanity Studio interface:

![Alt text](/assets/images/ui-overview.png)

### Navigation Sidebar

Located on the left side of the screen, the navigation sidebar provides quick access to different sections of Sanity Studio. It typically includes links to various document types, tools, and settings.

you'll mostly use this to navigate to collections of different document types, such as articles or stories.

### Document List

The central area of the interface displays a list of documents based on the selected document type. Each entry in the list showcases key information, such as titles or preview images, allowing easy identification and selection.

### Document Editor

When you select a specific document from the list, the document editor appears. It's here that you can view and edit the content within the chosen document type. The editor displays fields and their corresponding data, enabling you to make changes and updates.

## Creating Documents

To follow along with this guide log in to the **"sandbox"** at [https://sandbox--grief-matters-sanity-studio.netlify.com](https://sandbox--grief-matters-sanity-studio.netlify.com).

This is a special environment - all of the content here is "sandboxed" away from our main dataset, so you are safe to play around and make changes without affecting any real data.

Let's create our first document by adding a "story"

In Sanity Studio you can create a new document in one of two ways:

You can either, select the document type you want to create in the navigation sidebar. Then select the **New Document** button at the top of the document list (_see #1 in the screenshot below_).

Or, select the "New Document" button in the header, and select the type of document you want to create (_see #2 in the screenshot below_).

![Create a new document](/assets/images/create-doc.png)

You'll be presented with an empty document editor as below:

![Empty document editor](/assets/images/new-document@2x.png)

The screenshot below shows a few pointers on what the various elements mean:

![Creating a document in the editor](/assets/images/new-doc-editing.png)

When you create a new document directly from a **reference field**. A second **document editor** will open so that you can conveniently create the referenced document without navigating away.

When two document editors are open, the left panels automatically collapse. Clicking on the collapsed panels reveals them; this collapses one document editor and vice versa. Panes might also collapse when browser space is limited, but a single click expands them for viewing.

![Multiple open document editors and collapsed navigation panes](/assets/images/two-editors.png)

Reference fields are **dependent** on the documents they reference, as such you will not be able to publish a document with a reference field unless the document it references is also published.

When you first create a document it will be created as a **draft** and will not show on our website until it has been **published**. The various document states are discussed in the nest section.

## Document States

Documents in Sanity can be in various states depending on what stage of the content editing lifecycle they are at.

The states are indicated in both the document list view as well as in the document editor.

### Draft

When a document is first created it will be in the **draft** state. A document that is in **draft** does not yet show on our website until it is published. All changes are saved automatically so a document can go through several revisions before it is published.

A document will also move to **draft** when changes have been made to a **published** document. The previously published version will remain visible on our website until the draft changes have been reviewed and published.

The **draft** state is generally indicated by a yellow pencil:

![Alt text](/assets/images/draft.png)

### Ready for Review

A document in **draft** must be marked as **ready for review** once the changes are ready to publish. This toggle is only available on new draft documents or previously published documents with changes.

The **pending review** state is generally indicated by a purple clock:

![Alt text](/assets/images/pending-review.png)

To move a document into the ready for review state, you can activate the toggle on the document:

![Alt text](/assets/images/publish-unavailable.png)
![Alt text](/assets/images/publish-ready.png)

### Published

Documents that have been marked as **ready for review** are then able to be **published**. This provides an extra step of protection to ensure that changes are approved before being published to the website.

Only authorized Sanity accounts are able to publish documents.

The **published** state is indicated by a green up arrow icon:

![Alt text](/assets/images/status-published@2x.png)

## Editing Documents

To get to an existing document to make edits there are two options. Either select the relevant type in the navigation sidebar, then select the document from the list (or search the list using the document list search), or using the header search bar you can search by title or any other attribute of a document to find what you are looking for.

Making changes is exactly the same as creating a new document. Just edit the fields you need to change and a new draft will be created. Previously published documents will remain the same until the draft changes are published much the same as a new document.

## Live Editing

Changes made to Sanity documents are saved on the fly (or autosaved). This has two benefits. First, it means you do not have to worry about saving your changes. Second, it means that multiple people can actually work on the same document at once - and you will see the changes made by another team member in real time.

You can see where other team members are working by the appearance of their user avatar.

![Alt text](/assets/images/live-editing-1.png)

![Alt text](/assets/images/live-editing-2.png)

## Document Revisions

You can view and restore previous versions of a document. You can see the version you are currently viewing in the upper-right of the document editor.

By clicking the current document version you can inspect previous versions as well as restore to a previous version.

Just above this control, the ellipsis will also allow you to review changes between versions to give a better impression of how a document has changed over time.

![Alt text](/assets/images/restore-document.png)

## Document Actions

In the bottom right of the document editor there are a number of **document actions** available based on the state or type of the current document. You may see some or all of these options in specific scenarios.

![Document actions](/assets/images/unpublish-discard@2x.png)

**1. Unpublish:** allows you to unpublish a document - this will remove it from the next build of the Grief Matters website.

**2. Discard Changes:** allows you to discard any changes made since the last published version of the document (in essence, deleting the current draft)

**3. Duplicate:** [[TODO - any control over the output?]]

**4. Delete:** this will delete the current document.

**5. Convert Resource:** will allow you to convert certain document types from one type to another - this will help where resources have been created as one type but are later identified as being another.

{: .warning}
Some information may be lost during the conversion process - such as if you convert a 'Book' to an 'Article' - the ISBN and Author fields will be removed
