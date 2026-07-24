# Contributing to the RoboJackets Mobile App

## Table of Contents

- [Getting Started](#getting-started)
- [Running the App](#running-the-app)
- [Development Workflow](#development-workflow)
- [Useful Resources](#useful-resources)
- [Points of Contact](#points-of-contact)

## Getting Started

### Prerequisites

Follow the instructions to [Set Up Your Environment](URL) for React Native development. **Windows** + **Linux**: Target OS = Android, **macOS**: Target OS = iOS and Android.

Also install the following:

- **Node.js** 18+ and npm
- **Git**

Lastly, this project is a refactoring of the [RoboJackets Android App](https://github.com/RoboJackets/apiary-mobile), so it would be worthwhile to set that up. It also needs Android Studio. 

### Initial Setup

1. **Fork and Clone**
From the directory you want to clone into:
```sh
git clone https://github.com/RoboJackets/apiary-react-native.git
```

2. **Install Dependencies**
```sh
npm install
```

## Running the App

### Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

### Step 2: Build and run your app

With Metro running, open a new terminal window/pane and navigate into the root of your React Native project. Then, use one of the following commands to build and run your Android or iOS app:

### Android

Make sure Android Studio is open. If testing on physical device, follow instructions [here](https://reactnative.dev/docs/running-on-device). If testing on virtual device, follow instructions under "Using a virtual device" [here](https://reactnative.dev/docs/set-up-your-environment?os=windows&platform=android). Then, run the following:

```sh
# Using npm
npm run android

# OR using Yarn
yarn android

# OR using npx
npx react-native run-android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install

# OR manually
cd ios
pod install
cd ..
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios

# OR using npx
npx react-native run-ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Development Workflow

Generally, you...
1. Create a branch
2. Make changes on the branch
3. Push changes to origin
4. Make a Pull Request (PR), requesting to merge changes
5. Go through review process 
6. Get code merged!

### Local Development on Branch

- `feat/[name]`: For new features
- `fix/[name]`: For bug fixes
- `docs/[name]`: For doc updates

1. **Create a Feature Branch**
```sh
git checkout -b feature/your-feature-name
```

2. **Make Your Changes**
- Follow instructions above to run app and test changes
- Make sure linter passes. (Linter checks for code style.)

3. **Commit Your Changes**
```sh
git add .
git commit -m "commit title here"
```

4. **Push and Create PR**
```sh
git push origin feat/your-feature-name
```

### Pull Requests

After you've pushed your changes, go to the "Pull requests" tab of the Github repository and make a new pull request, with compare: set to your branch. There is a template for you to fill out.

After you make the PR, add Reviewers under the Reviewers -> Settings cog menu. (If the option does not appear, message on Slack or let us know in our meetings.)

This is the general process by which features are merged into the project!

### Legal

This project is open-source and is supported by many open-source libraries.
The app includes a notice of these dependencies which must be updated when a
library is added. Run the below command whenever adding a dependency to update
the OSS notice:

```sh
npx react-native legal-generate

# OR with yarn
yarn react-native legal-generate
```

## Useful Resources

- [Git Command Cheat Sheet](https://git-scm.com/cheat-sheet)
- [Resolving Git Merge Conflicts](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/resolving-a-merge-conflict-using-the-command-line)
- [Linux Command Cheat Sheet](https://linux-commands.labex.io/)
- [React Native Basics](https://reactnative.dev/docs/getting-started)

## Points of Contact

Slack channels:
- **#web-app-development**: For questions about the development of this app
- **#apiary-mobile**: For IT questions about mobile app, provisioning iOS dev licenses
- **#apiary**: For questions about the RoboJackets website and APIs 
