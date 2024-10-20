# Project overview
Use this guide to build a web app where users can give a text prompt to generate emoj using model from openai dall-e-3.

# Feature requirements
- We will use Next.js, Shadcn, Lucid, Supabase, Clerk
- Create a form where users can put in prompt, and clicking on button that calls the openai model to generate emoji
- Have a nice UI & animation when the emoji is blank or generating
- Display all the images ever generated in grid
- When hover each emoj img, an icon button for download, and an icon button for like should be shown up

# Relevant docs
.env with the openai api key

import OpenAI from "openai";
const openai = new OpenAI();

const response = await openai.images.generate({
  model: "dall-e-3",
  prompt: "a white siamese cat",
  n: 1,
  size: "1024x1024",
});
image_url = response.data[0].url;

# Current file structure
emoji-maker/
├── .next/
├── app/
│   ├── fonts/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       └── input.tsx
├── node_modules/
├── requirements/
│   └── frontend_instructions.md
├── .eslintrc.json
├── .gitignore
├── components.json
├── next-env.d.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
└── tsconfig.json

# Rules
- All new components should go in /components and be named like example-component.tsx unless otherwise specified
- All new pages go in /app