```javascript
// eslint.config.js
import { defineConfig } from 'eslint-define-config'

export default defineConfig([
  {
    // ...existing config...
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
])
```