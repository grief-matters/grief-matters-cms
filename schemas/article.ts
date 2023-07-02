import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'article',
  type: 'document',
  title: 'Article',
  fields: [
    defineField({
      title: 'Title',
      name: 'title',
      type: 'string',
    }),
    defineField({
      title: 'Description',
      name: 'description',
      type: 'text',
    }),
    defineField({
      title: 'Resource Details',
      name: 'resourceDetails',
      type: 'resourceBase',
    }),
    defineField({
      title: 'Parent Blog',
      name: 'parentBlog',
      type: 'reference',
      to: [{type: 'blog'}],
    }),
  ],
})
