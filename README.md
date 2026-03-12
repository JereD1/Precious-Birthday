# Precious-Birthday

Precious-Birthday is a modern web application I built to help you connect with friends, share moments, and never miss an important birthday. It combines a social feed for sharing posts with media, robust user authentication, and a dedicated section for tracking and celebrating birthdays.

## Features

*   **User Authentication**: Secure sign-in and sign-up powered by Clerk.
*   **Interactive Post Feed**: Browse a dynamic feed of posts from other users.
*   **Create Posts**: Share your thoughts, images, and videos with the community.
*   **Likes and Comments**: Engage with posts by liking them and adding comments.
*   **Birthday Reminders**: Keep track of upcoming birthdays with a dedicated banner, ensuring you never miss a special day.
*   **Content Management**: All application content, including posts and birthday information, is managed through Sanity.io.

## Tech Stack

This project is built using a robust and modern set of technologies:

*   **Frontend Framework**: [Next.js](https://nextjs.org/) (App Router)
*   **UI Library**: [React](https://react.dev/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Authentication**: [Clerk](https://clerk.com/)
*   **Content Management System (CMS)**: [Sanity.io](https://www.sanity.io/)
*   **Other Dependencies**: Firebase (included as a dependency for potential future features or specific integrations)

## Getting Started

Follow these steps to get Precious-Birthday up and running on your local machine.

### Prerequisites

Ensure you have Node.js and npm installed.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/JereD1/Precious-Birthday.git
    cd Precious-Birthday
    ```

2.  **Install dependencies for the main application:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env.local` file in the root of the project and add the following:
    ```
    NEXT_PUBLIC_SANITY_TOKEN=your_sanity_token_here
    ```
    You will also need to configure your Clerk environment variables (e.g., `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`) as per Clerk's documentation to enable authentication.

### Sanity Studio Setup

This project uses a separate Sanity Studio for content management.

1.  **Navigate to the `studio-thewall` directory:**
    ```bash
    cd studio-thewall
    ```

2.  **Install Studio dependencies:**
    ```bash
    npm install
    ```

3.  **Start the Sanity Studio:**
    ```bash
    npm run dev
    ```
    The Sanity Studio will typically be available at `http://localhost:3333`. You can use this interface to manage posts, birthdays, and other content for the application.

## Usage

Once both the main application and the Sanity Studio are set up and running:

1.  **Start the main development server:**
    From the root `Precious-Birthday` directory:
    ```bash
    npm run dev
    ```

2.  **Open the application:**
    Navigate to `http://localhost:3000` in your web browser to view the application.

You can now sign in, create posts, interact with the feed, and manage your content through the Sanity Studio.

## Available Scripts

In the project directory, you can run:

*   `npm run dev`: Starts the local development server.
*   `npm run build`: Builds the application for production.
*   `npm run start`: Runs the built application in production mode.
*   `npm run lint`: Runs ESLint to check for code quality and style issues.

## Author

*   **JereD1**