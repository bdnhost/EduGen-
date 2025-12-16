import React from 'react';
import { createRoot } from 'react-dom/client';
import CourseGenerator from './components/CourseGenerator';

const container = document.getElementById('generator-root');
if (container) {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <CourseGenerator />
        </React.StrictMode>
    );
}
