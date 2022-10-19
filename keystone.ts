/*
Welcome to Keystone! This file is what keystone uses to start the app.

It looks at the default export, and expects a Keystone config object.

You can find all the config options in our docs here: https://keystonejs.com/docs/apis/config
*/

import { config } from "@keystone-6/core";

// Look in the schema file for how we define our lists, and how users interact with them through graphql or the Admin UI
import { lists } from "./schema";

// Keystone auth is configured separately - check out the basic auth setup we are importing from our auth file.
import { withAuth, session } from "./auth";

import dotenv from "dotenv";

dotenv.config();

const {
  // The S3 Bucket Name used to store assets
  S3_BUCKET_NAME: bucketName = "keystone-test",
  // The region of the S3 bucket
  S3_REGION: region = "ap-southeast-2",
  // The Access Key ID and Secret that has read/write access to the S3 bucket
  S3_ACCESS_KEY_ID: accessKeyId = "keystone",
  S3_SECRET_ACCESS_KEY: secretAccessKey = "keystone",
  ASSET_BASE_URL: baseUrl = "https://streamindie-api.herokuapp.com/",
} = process.env;

export default withAuth(
  config({
    // the db sets the database provider - we're using sqlite for the fastest startup experience
    server: {
      cors: { origin: ["http://streamindie.space/"], credentials: true },
    },
    graphql: {
      // debug: process.env.NODE_ENV !== "production",
      // path: "/api/graphql",
      apolloConfig: {
        debug: true,
        introspection: true,
      },
      playground: true,
    },
    db: {
      provider: "sqlite",
      url: "file:./keystone.db",
      useMigrations: true,
    },
    // This config allows us to set up features of the Admin UI https://keystonejs.com/docs/apis/config#ui
    ui: {
      // For our starter, we check that someone has session data before letting them see the Admin UI.
      isAccessAllowed: async (context) => true,
    },
    lists,
    session,
    storage: {
      my_s3_files: {
        // Files that use this store will be stored in an s3 bucket
        kind: "s3",
        // This store is used for the file field type
        type: "file",
        // The S3 bucket name pulled from the S3_BUCKET_NAME environment variable
        bucketName,
        // The S3 bucket region pulled from the S3_REGION environment variable
        region,
        // The S3 Access Key ID pulled from the S3_ACCESS_KEY_ID environment variable
        accessKeyId,
        // The S3 Secret pulled from the S3_SECRET_ACCESS_KEY environment variable
        secretAccessKey,
        // The S3 links will be signed so they remain private
        signed: { expiry: 5000 },
      },
      artist_images: {
        // Images that use this store will be stored on the local machine
        kind: "local",
        // This store is used for the image field type
        type: "image",
        // The URL that is returned in the Keystone GraphQL API
        generateUrl: (path) => `${baseUrl}/images/artists${path}`,
        // The route that will be created in Keystone's backend to serve the images
        serverRoute: {
          path: "/images/artists",
        },
        // Set serverRoute to null if you don't want a route to be created in Keystone
        // serverRoute: null
        storagePath: "public/images/artists",
      },
      artists_profile_picture: {
        // Images that use this store will be stored on the local machine
        kind: "local",
        // This store is used for the image field type
        type: "image",
        // The URL that is returned in the Keystone GraphQL API
        generateUrl: (path) =>
          `${baseUrl}/images/profile-picture/artists${path}`,
        // The route that will be created in Keystone's backend to serve the images
        serverRoute: {
          path: "/images/profile-picture/artists",
        },
        // Set serverRoute to null if you don't want a route to be created in Keystone
        // serverRoute: null
        storagePath: "public/images/profile-picture/artists",
      },
      genre_images: {
        // Images that use this store will be stored on the local machine
        kind: "local",
        // This store is used for the image field type
        type: "image",
        // The URL that is returned in the Keystone GraphQL API
        generateUrl: (path) => `${baseUrl}/images/genres${path}`,
        // The route that will be created in Keystone's backend to serve the images
        serverRoute: {
          path: "/images/genres",
        },
        // Set serverRoute to null if you don't want a route to be created in Keystone
        // serverRoute: null
        storagePath: "public/images/genres",
      },
      song_cover_images: {
        // Images that use this store will be stored on the local machine
        kind: "local",
        // This store is used for the image field type
        type: "image",
        // The URL that is returned in the Keystone GraphQL API
        generateUrl: (path) => `${baseUrl}/images/song-cover${path}`,
        // The route that will be created in Keystone's backend to serve the images
        serverRoute: {
          path: "/images/song-cover",
        },
        // Set serverRoute to null if you don't want a route to be created in Keystone
        // serverRoute: null
        storagePath: "public/images/song-cover",
      },
      song_audio: {
        // Images that use this store will be stored on the local machine
        kind: "local",
        // This store is used for the image field type
        type: "file",
        // The URL that is returned in the Keystone GraphQL API
        generateUrl: (path) => `${baseUrl}/audio/songs${path}`,
        // The route that will be created in Keystone's backend to serve the images
        serverRoute: {
          path: "/audio/songs",
        },
        // Set serverRoute to null if you don't want a route to be created in Keystone
        // serverRoute: null
        storagePath: "public/audio/songs",
      },
      /** more storage */
    },
  })
);
