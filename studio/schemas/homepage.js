
export default {
    name: 'homepage',
    title: 'Home Page',
    type: 'document',
    __experimental_actions: ['create', 'update', /*'delete',*/ 'publish'], 
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'string',
        validation: Rule => [
          Rule.required().error('A title is required'),
        ],
      },
      {
        name: 'slug',
        title: 'Slug',
        type: 'slug',
        options: {
          source: 'title',
          maxLength: 96,
        },
        description: 'This is needed to generate the live preview',
        validation: Rule => [
          Rule.required().error('A slug must be generated for each page'),
          Rule.warning('A slug must be generated for each page'),
        ],
      },
      {
        name: "mainImage",
        title: "Main Image",
        type: "asset",
      },
      {
        name: 'body',
        title: 'Body Text',
        type: 'blockContent',
      },
      {
        name: 'contact',
        title: 'Contact Section',
        type: 'blockContent',
      },
      {
        name: 'description',
        title: 'Meta Description',
        type: 'string',
      },
    ],
  
    preview: {
      select: {
        title: 'title',
        media: 'mainImage',
      },
    },
  }
  