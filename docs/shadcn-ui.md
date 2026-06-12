# shadcn UI — Usage Guidelines

Purpose

- Enforce consistent UI across the app by using the shadcn UI component library.

Rules

- **Use shadcn components only:** All UI elements must be implemented with shadcn UI components provided by the project's shadcn setup. Do not create custom UI components.
- **No custom components:** Avoid creating new, app-specific UI components. If a required composition is not available, prefer composing existing shadcn primitives in the feature file rather than adding a reusable custom component; open an issue if a shared component appears necessary.
- **Use existing tokens/styles:** Respect the project's design tokens, CSS variables, and Tailwind/shadcn conventions.
- **Accessibility:** Ensure shadcn components are used following their accessibility guidance (labels, roles, focus states).

How to add UI

- Import directly from the shadcn component exports and use them in the app/page/component.
- Keep components local to the page unless multiple pages reuse them; for reusable pieces, discuss with maintainers before extracting.

If shadcn is not installed

- Ask maintainers before adding the dependency. Typical install may look like:

```bash
npm install @shadcn/ui
# and follow project-specific shadcn setup steps
```

Notes

- These are strict rules: do not introduce custom component libraries or bespoke UI patterns. If you need a component not provided by shadcn, open an issue explaining the use-case and proposed API.

***

Short: use only shadcn UI components; don't create custom components; follow project style and accessibility practices.