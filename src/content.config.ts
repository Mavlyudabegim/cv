import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Each Markdown file in src/content/projects/ becomes a project card
// on the home page and its own page at /projects/<file-name>/.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    order: z.number(),                        // position on the home page (1 = first)
    color: z.enum(['violet', 'pink', 'teal', 'amber', 'blue']).default('violet'),
    metric: z.string().optional(),            // big number on the card, e.g. "95%"
    metricLabel: z.string().optional(),       // small text next to it, e.g. "mean IoU"
    label: z.string().optional(),             // shown instead of a metric, e.g. "Master's thesis"
    tags: z.array(z.string()).default([]),
    repo: z.string().url().optional(),        // optional GitHub link for the project
    demo: z.string().url().optional(),        // optional live demo link
  }),
});

export const collections = { projects };
