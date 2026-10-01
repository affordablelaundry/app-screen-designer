# Affordable Laundry mobile frontend

## Build

- Turn the supplied screen set into one centered, mobile-first app experience using the provided logo and blue brand style.
- Include splash, two onboarding steps, mock login/sign-up, home, services, calculator, booking, tracking, payments, notifications, profile, and a separate admin demo.
- Connect all buttons, tabs, forms, steppers, filters, and back actions with local React state only.
- Persist mock bookings and preferences in browser storage; no backend, real authentication, payment processing, or external API.

## Quality

- Validate mock forms, clearly label payment as a demonstration, and preserve the supplied Ghanaian business details and GH₵13/kg pricing.
- Optimize the shell for iPhone and Android sizes, with a centered device preview on larger screens.
- Add app-specific page metadata and the supplied logo as the favicon.
- Verify the primary customer journey and admin entry in desktop and mobile-sized previews.

## Technical details

- Keep the existing TanStack Start structure and Tailwind v4 design tokens.
- Build reusable screen, navigation, card, and form controls with semantic color tokens.
- Keep all demo data client-side and guard browser storage for server rendering.
