# Implementation Plan - Event Bus Migration

**Goal**: Replace the `mitt` library with `@trutoo/event-bus` to enhance type safety and reliability of the micro-frontend event communication.

## User Review Required

> [!IMPORTANT]
> This is a breaking change for `shared-utils`. All micro-frontends consuming `eventBus` might need rebuilding.
> We need to verify if defining JSON Schemas for all existing events is required immediately or if we can incrementally adopt schemas. For this plan, I will assume we will add basic schema definitions to leverage the library's features.

## Proposed Changes

### Shared Utils Package (`shared-utils`)

#### [MODIFY] [package.json](file:///d:/Projects/mirco-frontend/shared-utils/package.json)

- Uninstall `mitt`
- Install `@trutoo/event-bus`

#### [MODIFY] [eventBus.ts](file:///d:/Projects/mirco-frontend/shared-utils/src/eventBus.ts)

- Replace `mitt` instance with `EventBus` class from `@trutoo/event-bus`.
- Initialize `EventBus`.
- Register schemas for existing events (based on `eventTypes.ts`).
- Update `emit`, `on`, `off`, `clear` wrappers to delegate to the new library.
- Ensure the API surface remains as compatible as possible to minimize refactoring in consumers.

#### [MODIFY] [eventTypes.ts](file:///d:/Projects/mirco-frontend/shared-utils/src/eventTypes.ts)

- (Optional) if the library requires specific type modifications, though the interfaces should remain largely the same.
- We might export const Schemas for runtime validation.

## Verification Plan

### Automated Tests

- Run build for `shared-utils`: `npm run build` in `shared-utils` directory.
- Check for type errors in consumers.

### Manual Verification

1.  **Build All Apps**:
    - Run `npm run build` in `host-app`, `remote-app-1`, and `remote-app-2` to ensure types are compatible.
2.  **Runtime Test**:
    - Start all applications.
    - Perform actions that trigger events:
      - Login/Logout (`user:login`, `user:logout`)
      - Add to Cart (`cart:item-added`)
      - Navigate between apps (`navigation:navigate`)
    - Verify in the console (using the existing logger in `EventBus` wrapper) that events are firing and payload is correct.
    - Verify that schemas are validating (if valid) or catching errors (if we simulate invalid data).
