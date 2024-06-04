# Dev Manifesto

### General Guidelines

- Get into layout.tsx's

### Naming conventions

- Fuck CamelCaseComponents. Let's refactor to camel-case-components!
- exported actions are always handleSomething
- exported hooks are always useSomething
- client event callbacks are always onSomething
- page.tsx exported component is always PathToFilePage - keep short - use your brains.
  Example: /app/(protected)/survey/[surveyUuid]/answer/page.tsx -> SurveyUuidAnswerPage
- many > multiple for functions/consts - be consistent with server/api/routers for
  actions.
- Action names should be aligned 1:1 with the server/api/router that it invokes

### Folder Structure

- Keep /components/ui clean. Should only contain shadcn components
- For new themes or use-cases where generic components can be created, mkdir new
  directory (lowercase) where relevant components live
- We like the logical separation of server/api where filenames are straightforward and
  server v. schemas are nicely separated
- Under app/api leave only for trpc stuff. Whenever you feel like making an API route,
  consider whether it can be a server action directly.
- For client-side stuff, usually server actions are sufficient.
- Forms should be standalone components under /components/forms/{form-name} with
  schema.ts + form.tsx

##### (protected)

- /survey/create makes sense as it serves as point of origin for [surveyUuid]
- /[surveyUuid] in and of itself makes sense
- /[surveyUuid]/\_components I don't really like
  - /\_components in (protected) and (not-protected) go into /components/{whatever} and
    actions are passed as props
  - /\_table should go into /components/{'view'-table}

##### (not-protected)

- scrap /identified
- go for pattern: /respond/[surveyUuid]/...
- /identify and /rejected are probably not best practice. Look at how e.g.
  docusign/calendly etc. does magic link signup?
-
