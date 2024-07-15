
# Movie Information App

Welcome to the Movie Information App! This mobile application allows you to explore and discover movies from The Movie Database (TMDb) on your device.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Building and Running](#building-and-running)
- [Generating the APK](#generating-the-apk)
- [Usage](#usage)
- [Future Improvements](#future-improvements)

## Introduction

This React Native app fetches movie data from TMDb API and provides a seamless user experience for browsing movies based on genres and release years.

## Features

- **Browse Movies:** View a list of movies fetched from TMDb API.
- **Filter by Genre:** Filter movies based on selected genres.
- **Smooth Scrolling:** Navigate through years to load movies from different release years.
- **Detailed Information:** Tap on a movie to view detailed information including synopsis, ratings, and release date.

## Requirements

### Covered Requirements:

- Displaying a list of movies from TMDb API.
- Filtering movies by genre.
- Smooth scrolling to load movies from previous and next years.
- Displaying detailed movie information.
- Built with React Native and TypeScript.

### Not Covered Requirements:

- Integration of additional APIs beyond TMDb.
- Advanced search functionalities.
- User authentication and personalized recommendations.
- Offline mode capabilities.

## Installation

To run the app locally, follow these steps:

### Clone Repository:

git clone https://github.com/suganram2942/movieApp
cd movieApp

### Install Dependencies:

npm install

### Configure Environment:

Obtain an API key from TMDb (https://www.themoviedb.org/documentation/api) and add it to your environment file (e.g., .env).

## Building and Running

### Running on iOS Simulator

#### Install Pods (if necessary):

cd ios && pod install && cd ..

#### Run the iOS App:

npx react-native run-ios

### Running on Android Emulator/Device

#### Start Android Emulator (if not started):

Open Android Studio and launch the emulator.

#### Run the Android App:

npx react-native run-android

## Generating the APK

To generate the debug APK and run it on a physical device, follow these steps:

1. Go to the project directory:

    **cd android**

2. Generate the debug APK:

    **./gradlew assembleDebug**

3. The APK will be generated in the directory

    **android/app/build/outputs/apk/debug/** 

   Transfer the APK to your physical device and install it.

## Usage

Upon launching the app, you will see a list of popular movies.
Use the genre filter to narrow down the list based on your preferences.
Scroll horizontally to load movies from different release years.
Tap on a movie to view its detailed information.

## Future Improvements

- Implement offline mode support for saved movies.
- Enhance search capabilities with more filters and sorting options.
- Incorporate user authentication for personalized recommendations.
