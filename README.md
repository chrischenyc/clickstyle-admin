# Stylesquad admin app

## Important

This project re-uses some source files from stylesquad-web project. In order to run this admin app, place it inside 

## Running on local machine

`npm install` (don't use yarn, Meteor doesn't work well with yarn)

`meteor -s settings-development.json`

## Heroku deployment

### push credentials to heroku ENV

`heroku config:add METEOR_SETTINGS="$(cat settings-production.json)"`

## Accounts

- Deploy@Heroku: chrischen79@gmail.com
- Domain@Godaddy: viz.patel7@gmail.com, chrischen79@gmail.com
- Mailing@Mailgun: chrischen79@gmail.com
- Upload & CDN@cloudinary: chrischen79@gmail.com

## Coding guideline

- Separate React logic from view component. Take login for example, we should have a stateful (smart) React component `Login.jsx` to manage user input states, form validation, API invoking, and post-submit screen flow. While another stateless (dumb) React component `LoginPage.jsx` to render the actual web page version of login interface, to display loadings status and errors, and to redirect to another web url. When we start developing React Native app, we should be able to reuse `Login.jsx` while only need to develop a `LoginView.jsx` to render login interface for the native apps.