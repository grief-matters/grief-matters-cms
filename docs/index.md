# Why Grief Matters Content Management System (CMS)

## Getting Started (Content Editors)

The Sanity CMS has a simple, intuitive, customizable interface that we can tailor to our needs.

### Quick Start

In Sanity, each piece of content is called a **"document"**. The types of content listed in the left-most column such as "Articles" and "Books" are our **"document types"**. A "document type" is essentially a template that allows us to create pieces of content that conform to a specific shape. For example, our "Book" document type has an "ISBN" field and an "Author" field but our "Website" document type does not.

A document type can even use other document types as part of its definition, or even reference other documents.

This technique allows us to create relationships between different documents. The best example of this is with our "Category" type. Not only do all of out resource document types have a "Categories" field to which one or more "category" documents can be assigned, but also, each "category" itself can have "Child Categories".

### Interface Overview

This is the Sanity Studio interface:

![Alt text](img/studio-overview.png)

The left hand column entitled **Content** is where all of our content resides.

When we select a document type in the left-hand column, the center column will be populated with all of the documents that we have created using that document type.

When we select a document from the list, the document editing pane will show over on the right.

Occasionally you will be able to create further documents of a specific type inside of another document.

![Alt text](img/new-document-from-field.png)

In the example above, we're creating a new "Website" document from the "Source" field of a "Book" document. Once created, the "Website" document will be available in the same way as if you were to create a "Website" document from scratch.

You may also notice that because we have to document panes open at once, the other columns have collapsed. If you need to focus on a single column you activate this collapsing of columns manually by clicking the heading of the column you want to minimize.

## Creating Documents

To create a document select the 'New document' button from either the top left of the interface (this will let you pick the document type you wish to create) or the 'New Document' button at the top of a document list. That button will create a document of that specific type.

![Alt text](img/create-doc.png)

Your document will initially be saved as a "draft" indicated by a yellow pencil icon in the bottom-left of the document editing pane. Changes in Sanity are saved constantly - so you can leave and come back to the document if you're not finished with your changes.

When you are ready for your document to be published to the website - you simply select "Publish" down on the bottom right.

## Document Editing

When you create a new document or select an existing one you will be presented with the document editing pane:

![Document editing pane](img/editing-pane.png)

When you start editing your document the changes made since it was created or last published will be tracked. Information is also available at the bottom for when the document was last published and how long since the last changes were made. To review any changes - you can click the pencil icon and they will be shown over on the right hand side. This additional menu let's you review (and revert) any changes made since the document was last published.

![Alt text](img/editing-documents.png)

We can even restore to an earlier version of a document by selecting the version menu in the top-right of the document pane, we can preview previous versions by selecting them from the menu and we can restore to a specific version by selecting "Restore".

![Alt text](img/restore-document.png)

## Document List

The document list shows us all of our documents for a given type.

For convenience, there are a number of icons that indicate the status of a document.

![Document status icons in the document list](img/status.png)

If the document is one of our internet resource types there will be a status icon to the left of the document title. Documents with this icon will contain a toggle with the label **Resource has been checked for errors**.

![Resource validation toggle](img/resource-check.png)

This is a temporary feature that we need whilst we sanitize the resources imported automatically from the original Word document version of the guide.

Documents that have been checked and validated will show a green checked circle icon.

To the right of the title are the "Published" (up arrow icon) and "Edited" (pencil icon) icons.

The published icon describes whether a document has been published. It is green when a document is published, and grey when it is unpublished. A document will only show on the website when it has been published in the CMS.

The edited icon describes whether the document currently has unpublished changes.

**_IMPORTANT: Sanity saves all changes on the fly. This means you can make many changes to many documents leaving them in a "draft" like state. Your changes will not be "live" until you have published._**

Once we have made changes to our document we will see that the "Publish" button turns green. Any changes we make to a document are saved, but they will not be reflected on our website until they have been "published". This means that we can work on changes to content without affecting the live website.

To the right of the publish button there is a menu that gives us a number of options depending on the state of the document.

![Alt text](img/options.png)

### Publish/Unpublish

Publishing a document will mark the document and any saved changes as ready for publishing to our website. Unpublish will mark the document as not ready. Unpublished documents will not be visible on the website.

### Discard Changes

When a document has saved changes but those changes have not yet been published (indicated by a yellow pencil icon in the document list) - then the changes can be discarded - and the document will revert to its last published version.

### Duplicate

DO NOT USE - This button is to be removed!!! We should not have duplicate resources within the CMS!!!

### Delete

This will delete a document from the CMS - use with care.

### Convert Resource

This will allow you to convert certain document types from one type to another - this will help where resources have been created as one type but are later identified as being another.

**_IMPORTANT: Some information may be lost during the conversion process - such as if you convert a 'Book' to an 'Article' - the ISBN and Author fields will be removed_**
