import {defineField, defineType} from 'sanity'

export default defineType({
  title: 'Website',
  name: 'website',
  type: 'document',
  fields: [
    defineField({
      title: 'Website Name',
      name: 'name',
      type: 'string',
    }),
    defineField({
      title: 'Description',
      name: 'description',
      type: 'text',
    }),
    defineField({
      title: 'URL',
      name: 'websiteUrl',
      type: 'url',
    }),
    defineField({
      title: 'Logo',
      name: 'logo',
      type: 'logo',
    }),
  ],
})
