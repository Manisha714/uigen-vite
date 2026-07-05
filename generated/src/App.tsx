import React from 'react';
import { Button } from './components/Button/Button';
import { Card } from './components/Card/Card';
import { Input } from './components/Input/Input';
import { Badge } from './components/Badge/Badge';
import { Alert } from './components/Alert/Alert';
import { Tabs } from './components/Tabs/Tabs';
import { Modal } from './components/Modal/Modal';
import { Avatar } from './components/Avatar/Avatar';
import { Progress } from './components/Progress/Progress';
import { Checkbox } from './components/Checkbox/Checkbox';
import { Radio } from './components/Radio/Radio';
import { Spinner } from './components/Spinner/Spinner';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">React Storybook Components</h1>
        <p className="text-gray-600 mb-12">A comprehensive collection of reusable React components with Storybook integration</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Button Component */}
          <Card title="Button" description="Interactive button component">
            <div className="flex gap-2 flex-wrap">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="danger">Danger</Button>
            </div>
          </Card>

          {/* Badge Component */}
          <Card title="Badge" description="Status and label badges">
            <div className="flex gap-2 flex-wrap">
              <Badge label="Primary" variant="primary" />
              <Badge label="Success" variant="success" />
              <Badge label="Warning" variant="warning" />
            </div>
          </Card>

          {/* Avatar Component */}
          <Card title="Avatar" description="User profile avatars">
            <div className="flex gap-4">
              <Avatar initials="JD" size="md" />
              <Avatar initials="AB" size="md" variant="square" />
            </div>
          </Card>

          {/* Input Component */}
          <Card title="Input" description="Text input field">
            <Input placeholder="Enter text..." />
          </Card>

          {/* Checkbox Component */}
          <Card title="Checkbox" description="Checkbox input">
            <Checkbox label="Accept terms and conditions" />
          </Card>

          {/* Radio Component */}
          <Card title="Radio" description="Radio button input">
            <Radio label="Option 1" name="demo" value="option1" />
          </Card>

          {/* Progress Component */}
          <Card title="Progress" description="Progress bar">
            <Progress value={65} />
          </Card>

          {/* Spinner Component */}
          <Card title="Spinner" description="Loading spinner">
            <Spinner size="md" color="primary" />
          </Card>

          {/* Alert Component */}
          <Card title="Alert" description="Alert messages">
            <Alert
              title="Success!"
              message="Operation completed successfully"
              type="success"
              dismissible={false}
            />
          </Card>
        </div>

        {/* Info Section */}
        <Card
          title="Getting Started"
          description="How to use these components"
          variant="elevated"
        >
          <div className="space-y-4">
            <p>
              All components are built with React, TypeScript, and Tailwind CSS. Each component is fully documented in Storybook.
            </p>
            <p>
              To view the components in Storybook, run:
            </p>
            <code className="block bg-gray-100 p-3 rounded text-sm">npm run storybook</code>
            <p>
              This will open Storybook at <code className="bg-gray-100 px-2 py-1 rounded text-sm">http://localhost:6006</code>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default App;
