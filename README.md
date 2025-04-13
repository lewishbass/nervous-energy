# Nervous Energy 2 Website Frontend

### Lewis Bass
Personal resume website with WAY too many features

## Overview
Nervous Energy 2 is a feature-rich personal portfolio and resume website, designed to showcase skills, projects, and professional experience while implementing modern web technologies and best practices.

## Technologies
- Node.js frontend with React
- Netlify hosting and serverless functions
- MongoDB database for dynamic content
- Authentication and user management
- Responsive design for all devices

## Features
- Interactive portfolio display
- User login and interactions
  - Account Creation and Information
  - User DMs
  - rooms/groups
- Project web toys
  - multiplayer games
  - ML toys and graphs
- Analytics integration
  - track fetch ips and locations
- Blog/article publishing system
  - articles
  - comments

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB account (for database)
- Netlify account (for hosting)

### Setup
1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/nervous-energy.git
   cd nervous-energy
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Environment setup
   ```bash
   cp .env.example .env
   # Edit .env with your configuration details
   ```

4. Run development server
   ```bash
   npm run dev
   ```



1. Connect your GitHub repository to Netlify
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
3. Configure environment variables in Netlify dashboard

## TODO
- [+]Netlify backend implementation
- [+]Login page design and functionality
- [+]Authentication context setup
- [+]Deload modals when not in user and animation is done, WAIT FOR LOAD ON ANIMATION
- [+]User Data backend
- [+]User profile editors
- [+]log out on token expiration
- [+]Friend Management - requires friend request notifications
- [+]Book downloads
- [+]Messaging and social dashboard
- [+]Playground section
- [ ]Content management system
- [ ]Unit and integration tests
- [+]Fix education card aliment
- [ ]docked interface component template
- [ ]simple multiplayer game, maybe space duel
- [+]add shop content
- [ ]popup context
- [ ]message group chat names for direct messages

## License
[MIT License](LICENSE) - See LICENSE file for details

Lewis Bass - [lewisbass@vt.edu](mailto:lewisbass@vt.edu)
