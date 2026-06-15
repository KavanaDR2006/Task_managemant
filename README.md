#
```

1. Install dependencies:

```
npm install
```

1. Create a `.env.local` file in the root directory:

```
M
```

1. Run the development server:

```
npm run dev
```

1. Open [http://localhost:3000](http://localhost:3000) to see the application

## Project Structure

```
taskflow/
├── app
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - Logout user

### Tasks

- `GET /api/tasks` - Get all tasks for authenticated user
- `POST /api/tasks` - Create new task
- `GET /api/tasks/[id]` - Get specific task
- `PUT /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task

## Deployment

The application can be deployed on Vercel or any platform that supports Next.js:

```
npm
```

Make sure to set the environment variables on your hosting platform.

## License

MIT

## Author

Your Name

Built with Next.js and Tailwind CSS

