# NuxtHub

## Features

- Nuxt 3 with TypeScript support
- Modular file structure
- Authentication System
  - User registration and login
  - Secure authentication with Supabase
  - Protected routes with middleware
  - Email confirmation flow
- Internationalization (i18n) with English and Ukrainian
- Customizable layouts and pages
- Todo Management System
  - Create, read, update, and delete todo items
  - Form validation with Zod
  - Modal-based forms for creating and editing
  - Interactive table display with action buttons
- Real-time Chat System
  - Socket.io integration with Supabase
  - Real-time message updates
  - User avatars and personalized display
  - Composable-based architecture
- API Fetch Plugin with Retry Functionality
  - Custom fetch wrapper implemented as a Nuxt plugin
  - Automatic retry for failed requests (up to 3 retries)
  - Exponential back-off delay between retries
  - Timeout handling and error management
  - Request deduplication to prevent duplicate in-flight requests

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the development server:**
   ```bash
   npm run dev
   ```
3. **Start the Socket.io server:**
   ```bash
   npm run socket
   ```
4. **Build for production:**
   ```bash
   npm run build
   ```

## Project Structure

- `src/` - Main source code
  - `pages/` - Application pages
  - `layouts/` - Layout components
  - `components/` - Reusable components
    - `todo/` - Todo management components
      - `TodoCreateForm.vue` - Form for creating new todos
      - `TodoEditForm.vue` - Form for editing existing todos
      - `TodoTable.vue` - Table display of todo items
    - `chat/` - Chat components
      - `ChatBubble.vue` - Individual message display
      - `ChatFooter.vue` - Message input interface
  - `composables/` - Reusable logic hooks
    - `useUserDisplay.ts` - User display formatting
    - `useChatMessages.ts` - Chat message management
  - `i18n/` - Internationalization config and locales
  - `assets/` - Static assets (CSS, images)
  - `server/` - Server-side API endpoints and Socket.io server
    - `server-socket.ts` - Real-time chat server
    - `api/todo/` - Todo CRUD operations
  - `middleware/` - Route middleware
    - `auth.ts` - Authentication protection for routes
  - `plugins/` - Nuxt plugins
    - `socket.client.ts` - Socket.io client integration
    - `apiFetch.ts` - API fetch plugin with retry functionality
- `nuxt.config.ts` - Nuxt configuration
- `package.json` - Project dependencies and scripts

## Authentication

The application features a comprehensive authentication system built with Supabase:

### Features

- **User Registration**: Sign up with email and password
- **User Login**: Secure authentication with session management
- **Email Confirmation**: Verification process for new accounts
- **Protected Routes**: Auth middleware to secure application pages
- **Profile Management**: User profile viewing and editing capabilities

### Authentication Flow

1. Users can register or log in via the `/auth` page
2. New users receive an email confirmation link
3. After email verification, users are redirected to the dashboard
4. Protected routes check authentication status via middleware
5. Users can log out from any authenticated page

### Implementation

- Uses Nuxt-Supabase integration for authentication services
- Dedicated auth layout for registration and login pages
- Server-side session validation for secure API endpoints
- Client-side route guards with auth middleware

## Todo Management

The application includes a complete todo management system with the following features:

### Components

- **TodoTable**: Displays todo items with actions for editing, completing, and deleting
- **TodoCreateForm**: Handles creation of new todo items with validation
- **TodoEditForm**: Specialized form for editing existing todo items

### API Endpoints

- `GET /api/todo/list` - Retrieve all todos for the current user
- `POST /api/todo/create` - Create a new todo item
- `POST /api/todo/update` - Update an existing todo item
- `POST /api/todo/delete` - Delete a todo item

### Form Validation

All forms use Zod schema validation to ensure data integrity before submission.

## State Management with Pinia

The application uses Pinia for state management, providing a clean and type-safe approach:

### Todo Store

- **Centralized State**: Manages todo items in a reactive store
- **Actions**: Provides methods for CRUD operations on todos
- **Error Handling**: Consistent error handling with toast notifications
- **Service Integration**: Communicates with the API through the todoService

### Implementation

- Uses the Composition API style with `defineStore`
- Reactive state with Vue's `ref`
- Typed interfaces for all data structures
- Integration with the API fetch plugin through service layer

### Benefits

- Type safety across the entire state management system
- Simplified component logic by moving state management to stores
- Consistent error handling patterns
- Easy debugging with Vue DevTools

## Real-time Chat

The application includes a real-time chat system with Supabase integration:

### Features

- **Real-time Messaging**: Instant message delivery with Socket.io
- **Supabase Integration**: Chat history stored in Supabase with real-time subscriptions
- **User Identification**: Shows "You" for current user, with names and avatars for all users
- **Message Formatting**: Properly formatted timestamps and message styling
- **Dual Connection**: Combines Socket.io for immediate delivery with Supabase for persistence

### Components

- **ChatBubble**: Displays individual messages with user information and timestamps
- **ChatFooter**: Input interface for sending new messages

### Composables

- **useUserDisplay**: Manages user name formatting, avatar generation, and message timestamps with localization support
  - Formats dates according to the user's selected language (English or Ukrainian)
  - Integrates with i18n to detect current locale
  - Uses date-fns/locale for proper date localization
- **useChatMessages**: Handles message fetching, real-time subscriptions, and message sending

### Implementation

- Socket.io server connects to Supabase using the service role key
- Messages are stored in the `chat` table in Supabase
- Real-time Supabase subscriptions provide message persistence
- Duplicate message detection prevents showing the same message twice
