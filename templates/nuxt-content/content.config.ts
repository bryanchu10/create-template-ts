import { defineCollection, defineContentConfig, z } from "@nuxt/content";

const commonSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    date: z.string().optional(),
    updatedAt: z.string().optional(),
});

export default defineContentConfig({
    collections: {
        content_en: defineCollection({
            type: "page",
            source: {
                include: "en/**",
                prefix: "",
            },
            schema: commonSchema,
        }),
        content_zh_tw: defineCollection({
            type: "page",
            source: {
                include: "zh-TW/**",
                prefix: "",
            },
            schema: commonSchema,
        }),
    },
});
