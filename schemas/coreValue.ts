import {defineField, defineType} from 'sanity'

export default defineType({
  title: 'Core Value',
  name: 'coreValue',
  type: 'object',
  fields: [
    defineField({name: 'value', type: 'string', title: 'Core Value'}),
    defineField({name: 'description', type: 'text', title: 'Core Value Description'}),
  ],
})
