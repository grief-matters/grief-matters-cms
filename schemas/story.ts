import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'story',
  type: 'document',
  title: 'Story',
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
      title: 'Photograph',
      name: 'photo',
      type: 'accessibleImage',
    }),
  ],
})
