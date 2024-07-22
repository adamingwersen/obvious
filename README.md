## Tasklist: Cascading Multilingual Surveys:

- [x] Navbar
  - [x] -> Survey Page
  - [x] -> Dashboard Page
  - [x] -> Settings Page
- [x] survey/page.tsx
  - [x] Nice way to display all existing surveys in list/table
  - [x] Make surveys deletable
  - [x] Fix routers/survey to handle new logic
  - [x] Add status & due date to table
- [x] survey/create/page.tsx
  - [x] Add description
  - [x] Add dueAt Date
  - [x] Router-based back button
  - [x] Add keywords (maybe from ESRS json file)
- [x] Answers:
  - [x] Routing pattern for answers?
  - [x] Display Q -> Receive answer
  - [x] Translate Q/A
  - [x] Forward Survey instance
- [x] Email + Signup + Login flows (user setup)
- [x] survey/.../create/page.tsx
  - [x] Add some polish
  - [ ] Stop empty surveys from allowing "finish"
- [x] survey/.../validate/page.tsx
  - [x] Show all survey questions in nice format
  - [x] Order questions?
  - [ ] How should 'sharing' work?
    - [ ] By copy link & send to email address
- [ ] dashboard/page.tsx
  - [ ] ??
- [ ] settings/page.tsx
  - [ ] ??

#### Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

###### What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

##### Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

##### How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
