# Component Documentation

## Overview

This Storybook contains 12 fully-featured React components, each with its own folder structure, TypeScript types, and Storybook stories.

---

## 1. Button Component

**Location:** `src/components/Button/`

### Props

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}
```

### Usage

```tsx
import { Button } from './components/Button/Button';

<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>
```

### Variants

- **primary** - Blue button (default)
- **secondary** - Gray button
- **danger** - Red button

### Sizes

- **sm** - Small button
- **md** - Medium button (default)
- **lg** - Large button

---

## 2. Card Component

**Location:** `src/components/Card/`

### Props

```typescript
interface CardProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
}
```

### Usage

```tsx
import { Card } from './components/Card/Card';

<Card 
  title="My Card" 
  description="This is a card"
  variant="elevated"
>
  Card content here
</Card>
```

### Variants

- **default** - Border style
- **elevated** - Shadow style
- **outlined** - Blue outline style

---

## 3. Input Component

**Location:** `src/components/Input/`

### Props

```typescript
interface InputProps {
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  disabled?: boolean;
  error?: string;
  value?: string;
  onChange?: (value: string) => void;
}
```

### Usage

```tsx
import { Input } from './components/Input/Input';

<Input 
  label="Email"
  type="email"
  placeholder="Enter email"
  onChange={(value) => console.log(value)}
/>
```

### Features

- Label support
- Multiple input types
- Error state with message
- Disabled state
- Controlled and uncontrolled modes

---

## 4. Badge Component

**Location:** `src/components/Badge/`

### Props

```typescript
interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  dismissible?: boolean;
  onDismiss?: () => void;
}
```

### Usage

```tsx
import { Badge } from './components/Badge/Badge';

<Badge 
  label="New" 
  variant="success"
  size="md"
  dismissible
  onDismiss={() => console.log('dismissed')}
/>
```

### Variants

- **primary** - Blue badge
- **success** - Green badge
- **warning** - Yellow badge
- **danger** - Red badge
- **info** - Cyan badge

---

## 5. Alert Component

**Location:** `src/components/Alert/`

### Props

```typescript
interface AlertProps {
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  dismissible?: boolean;
  onDismiss?: () => void;
}
```

### Usage

```tsx
import { Alert } from './components/Alert/Alert';

<Alert 
  title="Success!"
  message="Operation completed successfully"
  type="success"
  dismissible
/>
```

### Types

- **success** - Green alert
- **error** - Red alert
- **warning** - Yellow alert
- **info** - Blue alert

---

## 6. Tabs Component

**Location:** `src/components/Tabs/`

### Props

```typescript
interface TabsProps {
  tabs: Array<{
    id: string;
    label: string;
    content: React.ReactNode;
  }>;
  defaultTab?: string;
  onChange?: (tabId: string) => void;
}
```

### Usage

```tsx
import { Tabs } from './components/Tabs/Tabs';

const tabs = [
  { id: 'tab1', label: 'Tab 1', content: <p>Content 1</p> },
  { id: 'tab2', label: 'Tab 2', content: <p>Content 2</p> },
];

<Tabs tabs={tabs} defaultTab="tab1" onChange={(id) => console.log(id)} />
```

### Features

- Multiple tabs support
- Default tab selection
- Change callback
- Keyboard accessible

---

## 7. Modal Component

**Location:** `src/components/Modal/`

### Props

```typescript
interface ModalProps {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}
```

### Usage

```tsx
import { Modal } from './components/Modal/Modal';

<Modal
  isOpen={isOpen}
  title="Confirm Action"
  onClose={() => setIsOpen(false)}
  onConfirm={() => handleConfirm()}
  confirmText="Delete"
  cancelText="Cancel"
>
  Are you sure?
</Modal>
```

### Features

- Overlay backdrop
- Close button
- Confirm and cancel buttons
- Customizable button text

---

## 8. Avatar Component

**Location:** `src/components/Avatar/`

### Props

```typescript
interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'circle' | 'square';
}
```

### Usage

```tsx
import { Avatar } from './components/Avatar/Avatar';

<Avatar 
  initials="JD"
  size="md"
  variant="circle"
/>

// or with image
<Avatar 
  src="https://example.com/avatar.jpg"
  alt="User"
  size="lg"
/>
```

### Sizes

- **sm** - 8x8 (32px)
- **md** - 12x12 (48px)
- **lg** - 16x16 (64px)
- **xl** - 24x24 (96px)

---

## 9. Progress Component

**Location:** `src/components/Progress/`

### Props

```typescript
interface ProgressProps {
  value: number;
  max?: number;
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
  animated?: boolean;
}
```

### Usage

```tsx
import { Progress } from './components/Progress/Progress';

<Progress 
  value={65}
  max={100}
  variant="success"
  showLabel
  animated
/>
```

### Features

- Customizable value and max
- Multiple color variants
- Optional percentage label
- Animation support

---

## 10. Checkbox Component

**Location:** `src/components/Checkbox/`

### Props

```typescript
interface CheckboxProps {
  label?: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}
```

### Usage

```tsx
import { Checkbox } from './components/Checkbox/Checkbox';

<Checkbox 
  label="Accept terms"
  checked={isChecked}
  onChange={(checked) => setIsChecked(checked)}
/>
```

### Features

- Optional label
- Controlled and uncontrolled modes
- Disabled state
- Change callback

---

## 11. Radio Component

**Location:** `src/components/Radio/`

### Props

```typescript
interface RadioProps {
  label?: string;
  name: string;
  value: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (value: string) => void;
}
```

### Usage

```tsx
import { Radio } from './components/Radio/Radio';

<Radio 
  label="Option 1"
  name="options"
  value="option1"
  checked={selected === 'option1'}
  onChange={(value) => setSelected(value)}
/>
```

### Features

- Grouped radio buttons
- Optional label
- Controlled and uncontrolled modes
- Disabled state

---

## 12. Spinner Component

**Location:** `src/components/Spinner/`

### Props

```typescript
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success' | 'danger';
}
```

### Usage

```tsx
import { Spinner } from './components/Spinner/Spinner';

<Spinner size="md" color="primary" />
```

### Sizes

- **sm** - 4x4 (16px)
- **md** - 8x8 (32px)
- **lg** - 12x12 (48px)

### Colors

- **primary** - Blue
- **secondary** - Gray
- **success** - Green
- **danger** - Red

---

## Storybook Stories

Each component has comprehensive Storybook stories demonstrating:

- Default state
- All variants
- All sizes
- Disabled states
- Interactive examples
- Edge cases

### Running Storybook

```bash
npm run storybook
```

This opens Storybook at `http://localhost:6006`

---

## Styling

All components use **Tailwind CSS** for styling. The configuration is in `tailwind.config.js`.

### Custom Styling

To customize component styles, modify the Tailwind classes in each component file.

---

## TypeScript Support

All components are fully typed with TypeScript. Props interfaces are exported for use in your application:

```tsx
import { Button, ButtonProps } from './components/Button/Button';

const MyComponent: React.FC<ButtonProps> = (props) => {
  return <Button {...props} />;
};
```

---

## Accessibility

Components include accessibility features:

- Semantic HTML
- ARIA labels where appropriate
- Keyboard navigation support
- Focus management
- Color contrast compliance

---

## Best Practices

1. **Use TypeScript** - Leverage full type safety
2. **Check Storybook** - View all component variations
3. **Read Props** - Understand available options
4. **Test Interactions** - Use Storybook's interaction testing
5. **Customize Styling** - Modify Tailwind classes as needed

---

## Contributing

To add a new component:

1. Create a new folder in `src/components/`
2. Create `ComponentName.tsx` with the component
3. Create `ComponentName.stories.tsx` with Storybook stories
4. Export the component from the folder
5. Add to this documentation

---

## Support

For issues or questions, refer to:

- Component Storybook stories
- TypeScript interfaces
- README.md
- This documentation file
