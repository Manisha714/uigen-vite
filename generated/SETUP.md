# Setup and Installation Guide

## Prerequisites

- Node.js 16+ 
- npm or yarn package manager

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React 18
- TypeScript
- Tailwind CSS
- Storybook 7
- Vite

### 2. Start Storybook

```bash
npm run storybook
```

Storybook will open automatically at `http://localhost:6006`

### 3. Start Development Server

In a new terminal:

```bash
npm run dev
```

This starts the Vite development server at `http://localhost:5173`

## Available Scripts

### Development

```bash
# Start Storybook
npm run storybook

# Start Vite dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm preview
```

### Storybook

```bash
# Start Storybook dev server
npm run storybook

# Build static Storybook
npm run build-storybook
```

## Project Structure

```
react-storybook-components/
├── .storybook/                 # Storybook configuration
│   ├── main.ts                # Main config
│   └── preview.ts             # Preview config
├── src/
│   ├── components/            # All components
│   │   ├── Alert/
│   │   ├── Avatar/
│   │   ├── Badge/
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Checkbox/
│   │   ├── Input/
│   │   ├── Modal/
│   │   ├── Progress/
│   │   ├── Radio/
│   │   ├── Spinner/
│   │   └── Tabs/
│   ├── App.tsx               # Main app component
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles
├── index.html                # HTML template
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── tailwind.config.js        # Tailwind config
├── postcss.config.js         # PostCSS config
├── vite.config.ts            # Vite config
├── README.md                 # Project readme
├── COMPONENTS.md             # Component documentation
└── SETUP.md                  # This file
```

## Configuration Files

### tailwind.config.js

Tailwind CSS configuration. Customize theme, colors, and plugins here.

```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### tsconfig.json

TypeScript configuration with strict mode enabled.

### vite.config.ts

Vite build configuration with React plugin.

### .storybook/main.ts

Storybook configuration:
- Story location patterns
- Addons configuration
- Framework setup

### .storybook/preview.ts

Storybook preview configuration:
- Global styles
- Default parameters
- Control matchers

## Customization

### Adding a New Component

1. Create a new folder in `src/components/ComponentName/`

2. Create `ComponentName.tsx`:

```tsx
import React from 'react';

export interface ComponentNameProps {
  // Define props
}

export const ComponentName: React.FC<ComponentNameProps> = (props) => {
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
};
```

3. Create `ComponentName.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from './ComponentName';

const meta = {
  title: 'Components/ComponentName',
  component: ComponentName,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Default props
  },
};
```

### Modifying Tailwind Styles

Edit `tailwind.config.js` to customize:

```javascript
theme: {
  extend: {
    colors: {
      // Add custom colors
    },
    spacing: {
      // Add custom spacing
    },
  },
}
```

### Adding Global Styles

Edit `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Add custom styles */
```

## Troubleshooting

### Storybook won't start

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run storybook
```

### Tailwind styles not applying

1. Check `tailwind.config.js` content paths
2. Ensure `src/index.css` is imported in `src/main.tsx`
3. Restart dev server

### TypeScript errors

1. Check `tsconfig.json` is correct
2. Ensure all imports have proper types
3. Run `npm run build` to check for errors

### Port already in use

Change port in scripts:

```bash
# Storybook on different port
npm run storybook -- -p 6007

# Vite on different port
npm run dev -- --port 5174
```

## Building for Production

### Build App

```bash
npm run build
```

Output goes to `dist/` folder.

### Build Storybook

```bash
npm run build-storybook
```

Output goes to `storybook-static/` folder.

### Deploy Storybook

The built Storybook can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting

## Performance Tips

1. **Code Splitting** - Vite automatically code splits
2. **Lazy Loading** - Use React.lazy for components
3. **Image Optimization** - Use optimized images
4. **CSS Purging** - Tailwind automatically purges unused CSS

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Next Steps

1. ✅ Install dependencies
2. ✅ Start Storybook
3. ✅ Explore components
4. ✅ Read COMPONENTS.md
5. ✅ Customize components
6. ✅ Build your app

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Storybook Documentation](https://storybook.js.org)
- [Vite Documentation](https://vitejs.dev)

## Support

For issues:

1. Check the troubleshooting section
2. Review component documentation
3. Check Storybook stories
4. Review TypeScript types

---

Happy coding! 🚀
