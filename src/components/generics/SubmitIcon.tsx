// SubmitIcon.tsx
// Node.js, react, tailwind, typescript, javascript
// a react component that handles validating, submitting and verifying information
// member functions
//  - update: updated state based on value change
//  - submit: attempts to submit data to route
// stores
//  - last successful data: initial/stored value for comparing if updated
// takes
//  - data: information to be submitted
//  - validation function: returns if data is valid or not
//  - submit info: name etc of submission
//  - submit route: route to submit data
// states
//  - no change: value unchanged - blue FaRegCircle
//  - changed valid: value changed and valid - only state that can submit - yellow FaRegCircle
//  - changed invalid: value changed and invalid - yellow FaTimes
//  - submitting: value submitted and waiting for response - spinning yellow FaCog
//  - submitted invalid: value submitted and response invalid - returns to changed after 2 seconds - green FaCheck
//  - submitted valid: value submitted and response valid - returns to no change after 2 seconds - red FaTimes