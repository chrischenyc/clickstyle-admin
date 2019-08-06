# Clickstyle admin app

- Meteor.js/React consumer-facing web app: https://github.com/chrischenyc/clickstyle-web
- Meteor.js/React partner/admin-facing web app: https://github.com/chrischenyc/clickstyle-admin
- React Native consumer-facing native app (incomplete): https://github.com/chrischenyc/clickstyle-app

## Run on local machine

`npm install` (don't use yarn, Meteor doesn't work well with yarn)

`npm run dev`

## Deploy on Heroku

`npm run deploy` (make sure heroku cli is installed and signed in)

## Service Accounts required

- Heroku - app hosting
- MongoDB Atlas - NoSQL database
- AWS S3 and Cloudfront - user-uploaded document
- Mailgun - transactional email
- cloudinary - image hosting
- Hotjar - front-end analytic
