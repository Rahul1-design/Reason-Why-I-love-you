import LoveReasons from './pages/LoveReasons';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Reasons Why I Love You',
    path: '/',
    element: <LoveReasons />
  }
];

export default routes;
