import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    tags: z.array(z.string()).optional(),
    link: z.string().url().optional(),
    image: z.string().optional(),
  }),
});

const achievementsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    organization: z.string().optional(),
    date: z.coerce.date(),
    type: z.enum([
      'academic',
      'certification',
      'award',
      'international',
      'other',
    ]),
  }),
});

const experienceCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    company: z.string(),
    location: z.string().optional(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(), // null for "present"
    current: z.boolean().default(false),
    description: z.string(),
  }),
});

export const collections = {
  projects: projectsCollection,
  achievements: achievementsCollection,
  experience: experienceCollection,
};
