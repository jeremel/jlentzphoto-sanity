export default {
    name: 'page',
    title: 'Pages',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'string',
      },
      {
        name: 'slug',
        title: 'Slug',
        type: 'slug',
        options: {
          source: 'title',
          maxLength: 96,
        },
      },
      {
        name: 'mainImage',
        title: 'Main image',
        type: 'image',
        options: {
          hotspot: true,
        },
        fields: [
          {
            name: 'alt',
            type: 'string',
            title: 'Alternative text',
          },
        ],
      },
      {
        name: 'body',
        title: 'Body',
        type: 'blockContent',
      },
      {
        name: 'gallery',
        type: 'object',
        title: 'Gallery',
        fields: [
          {
            name: 'images',
            type: 'array',
            title: 'Images',
            of: [
              {
                name: 'image',
                type: 'image',
                title: 'Image',
                options: {
                  hotspot: true,
                },
                fields: [
                  {
                    name: 'alt',
                    type: 'string',
                    title: 'Alternative Text',
                  },
                ],
              },
            ],
          },
        ],
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
  