import { FaRegNewspaper } from "react-icons/fa";

export default {
    name: 'page',
    title: 'Photo Pages',
    type: 'document',
    icon: FaRegNewspaper,
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'string',
        validation: Rule => [
          Rule.required().min(3).error('A title with a minimum of 3 characters is required'),
          Rule.max(50).warning('The title field accepts a maximum of 50 characters'),
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
        description: 'This will be the path to the page',
        validation: Rule => [
          Rule.required().error('A slug must be generated for each page'),
          Rule.warning('A slug must be generated for each page'),
        ],
      },
      {
        name: 'publishedAt',
        title: 'Published at',
        type: 'datetime',
        options: {
          dateFormat: 'YYYY-MM-DD',
          timeFormat: 'HH:mm',
          timeStep: 15,
          calendarTodayLabel: 'Today'
        },
      },
      {
        name: "mainImage",
        title: "Main Image",
        type: "asset",
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
                name: "image",
                title: "Image",
                type: "image",
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
  