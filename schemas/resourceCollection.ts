import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'collection',
  type: 'document',
  title: 'Resource Collection',
  fields: [
    defineField({
      title: 'Label',
      name: 'label',
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
  ],
})
