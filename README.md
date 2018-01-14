# Introduction

Netlify StatusKit is a template to deploy your own Status pages on Netlify.

[![Netlify StatusKit Demo](http://statuskit.netlify.com/statuskit.png)](https://statuskit.netlify.com/)

Netlify StatusKit is released under the [MIT License](LICENSE).
Please make sure you understand its [implications and guarantees](https://writing.kemitchell.com/2016/09/21/MIT-License-Line-by-Line.html).

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/netlify/netlify-statuskit)

## Initial configuration

Click in the Deploy to Netlify button above to create your own site directly and push this repository to your own account.
Before creating the site, Netlify will ask you to fill required environment variables listed here:

- `STATUSKIT_PAGE_TITLE` - Title to show in the browser for your status site.
- `STATUSKIT_COMPANY_LOGO` - URL to your company's logo.
- `STATUSKIT_SUPPORT_CONTACT_LINK` - URL to a support page for your users to talk with you.
- `STATUSKIT_RESOURCES_LINK` - URL to documentation for your users.

## Extra configuration

After the site is created, you can modify the code as much as you want and push it to your GitHub repository. Netlify will pick up changes from there.

You will need to create a Netlify build hook, and add a webhook in GitHub that posts to it for any issue or issue comment event;
you will need to create labels for the severity levels (currently fixed)..

### Reporting systems

You can add systems you want to report about to your Status page. For instance, you might want to tell your users about a status change in your CDN infrastructure but not in your API.

To do this, add labels to your GitHub repo; any label with the colour #ffffff will be used as a reporting system.

### Full customization

This template is based in [Netlify's Victor-Hugo](https://github.com/netlify/victor-hugo) boilerplate.
To work on it you'll need NPM installed. To download dependencies type `npm run dependencies`, that will check if you have Hugo installed and will download it for you if you don't. It will also run `npm install` for the first time to download extra dependencies. After that, you can run `npm install` every time you want to install packages.

### Creating new incidents

Adding incidents to your status page is as simple as creating a new GitHub issue. Give it a system label
and a severity label, and that's it.

### Resolving incidents

Everything will be operational again when all issues are closed.

# Development

Netlify StatusKit uses NPM to manage dependencies. It also bundles a version of Hugo to work out of the box.

1. Use `npm install` to download dependencies.
2. Use `npm start` to start the development server.
