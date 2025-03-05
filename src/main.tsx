import React from 'react'
import { createRoot } from 'react-dom/client'

import './index.scss'
import Application from './Application'

// createRoot(
//   <React.StrictMode>
//     < />
//   </React.StrictMode>,
//   document.getElementById('root')
// )

createRoot(document.getElementById('root') as any).render(<Application />)
