import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projectsCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      publishDate: z.coerce.date(),
      tags: z.array(z.string()).optional(),
      link: z.string().url().optional(),
      gallery: z.array(image()).optional(),
    }),
});

const achievementsCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/achievements' }),
  schema: z.object({
    title: z.string(),
    organization: z.string().optional(),
    date: z.coerce.date(),
    type: z.enum([
      'academic',
      'certification',
      'award',
      'international',
      'publication',
      'other',
    ]),
    link: z.string().url().optional(),
    arxivId: z.string().optional(),
    description: z.string().optional(),
  }),
});

const experienceCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/experience' }),
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
