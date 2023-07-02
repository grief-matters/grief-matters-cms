import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string'}),
    defineField({
      title: 'Parent Categories',
      name: 'parentCategories',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [
            {
              type: 'category',
            },
          ],
          options: {
            filter: ({document}) => {
              return {
                filter: 'title != $title',
                params: {
                  title: document.title,
                },
              }
            },
          },
        }),
      ],
    }),
  ],
})
