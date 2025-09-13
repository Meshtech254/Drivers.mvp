# User Profiles App

This is a web application for managing user profiles using Supabase as the backend. The application allows users to view, edit, and manage their profiles seamlessly.

## Features

- User profile management
- Fetch and display user profiles from Supabase
- Edit user profile information
- Responsive design

## Technologies Used

- React
- TypeScript
- Supabase
- React Router

## Project Structure

```
user-profiles-app
├── src
│   ├── components
│   │   └── UserProfile.tsx
│   ├── pages
│   │   ├── Home.tsx
│   │   └── Profile.tsx
│   ├── services
│   │   └── supabaseClient.ts
│   ├── types
│   │   └── index.ts
│   └── App.tsx
├── public
│   └── index.html
├── package.json
├── tsconfig.json
└── README.md
```

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd user-profiles-app
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Set up Supabase:
   - Create a Supabase project.
   - Configure your Supabase URL and API key in the `src/services/supabaseClient.ts` file.

5. Start the development server:
   ```
   npm start
   ```

## Usage

- Navigate to the home page to view a list of user profiles.
- Click on a profile to view detailed information and edit options.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.