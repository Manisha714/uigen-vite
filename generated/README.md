# React Storybook Components

A comprehensive collection of reusable React components with Storybook integration, built with TypeScript and Tailwind CSS.

## Components Included

1. **Button** - Interactive button with multiple variants and sizes
2. **Card** - Container component with different styles
3. **Input** - Text input field with validation
4. **Badge** - Status and label badges
5. **Alert** - Alert messages with different types
6. **Tabs** - Tabbed interface component
7. **Modal** - Modal dialog component
8. **Avatar** - User profile avatars
9. **Progress** - Progress bar component
10. **Checkbox** - Checkbox input component
11. **Radio** - Radio button input component
12. **Spinner** - Loading spinner component

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   └── Button.stories.tsx
│   │   ├── Card/
│   │   │   ├── Card.tsx
│   │   │   └── Card.stories.tsx
│   │   ├── Input/
│   │   │   ├── Input.tsx
│   │   │   └── Input.stories.tsx
│   │   ├── Badge/
│   │   │   ├── Badge.tsx
│   │   │   └── Badge.stories.tsx
│   │   ├── Alert/
│   │   │   ├── Alert.tsx
│   │   │   └── Alert.stories.tsx
│   │   ├── Tabs/
│   │   │   ├── Tabs.tsx
│   │   │   └── Tabs.stories.tsx
│   │   ├── Modal/
│   │   │   ├── Modal.tsx
│   │   │   └── Modal.stories.tsx
│   │   ├── Avatar/
│   │   │   ├── Avatar.tsx
│   │   │   └── Avatar.stories.tsx
│   │   ├── Progress/
│   │   │   ├── Progress.tsx
│   │   │   └── Progress.stories.tsx
│   │   ├── Checkbox/
│   │   │   ├── Checkbox.tsx
│   │   │   └── Checkbox.stories.tsx
│   │   ├── Radio/
│   │   │   ├── Radio.tsx
│   │   │   └── Radio.stories.tsx
│   │   └── Spinner/
│   │       ├── Spinner.tsx
│   │       └── Spinner.stories.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .storybook/
│   ├── main.ts
│   └── preview.ts
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.ts
```

## Installation

```bash
npm install
```

## Development

### Run Storybook

```bash
npm run storybook
```

This will start Storybook at `http://localhost:6006`

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Build Storybook

```bash
npm run build-storybook
```

## Features

- ✅ 12 reusable React components
- ✅ Full TypeScript support
- ✅ Tailwind CSS styling
- ✅ Storybook integration with stories for each component
- ✅ Interactive component playground
- ✅ Responsive design
- ✅ Accessibility features
- ✅ Proper prop typing and documentation

## Component Examples

### Button
```tsx
<Button variant="primary" size="md" onClick={() => console.log('clicked')}>
  Click Me
</Button>
```

### Card
```tsx
<Card title="My Card" description="Card description">
  Card content goes here
</Card>
```

### Input
```tsx
<Input 
  label="Email" 
  type="email" 
  placeholder="Enter email"
  onChange={(value) => console.log(value)}
/>
```

### Badge
```tsx
<Badge label="New" variant="success" dismissible />
```

### Alert
```tsx
<Alert 
  title="Success!" 
  message="Operation completed" 
  type="success"
/>
```

## Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Storybook 7** - Component documentation
- **Vite** - Build tool
- **PostCSS** - CSS processing

## License

MIT
