This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, set up AWS Amplify on your local machine:

1. Install Amplify CLI [Instructions](https://docs.amplify.aws/cli/start/install/)
2. Obtain a set of AWS access keys from Brian on Slack (recommend setting up an [AWS Profile](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html))
3. Run `amplify pull` from the root of your project. Select the profile you set up above when asked, specify the `hotelsforheroes` app, and specify the environment of `dev`. (Note: this process will change a number of files on your system as our linting rules modify the Amplify files on push.)

Second, we use NVM to manage node versions:

1. Install NVM per the documented [instructions](https://github.com/nvm-sh/nvm#installing-and-updating)
2. Use `nvm use` from the project directory to use the appropriate version.

Third, run the development server:

```bash
nvm use
npm run dev
# or
nvm use
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


[API routes](https://nextjs.org/docs/api-routes/introduction) are not used on this project. To provide APIs, use (AWS Amplify)[https://docs.amplify.aws/lib/restapi/getting-started/q/platform/js/]

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy

AWS Amplify will automatically deploy to the dev environment when a push is made to GitLab. This includes provisioning any AWS resources.
