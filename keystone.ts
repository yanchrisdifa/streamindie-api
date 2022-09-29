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
  // The base URL to serve assets from
  ASSET_BASE_URL: baseUrl = "http://localhost:3000",
} = process.env;

export default withAuth(
  // Using the config function helps typescript guide you to the available options.
  config({
    // the db sets the database provider - we're using sqlite for the fastest startup experience
    server: {
      cors: { origin: ["http://localhost:4200"], credentials: true },
    },
    db: {
      provider: "sqlite",
      url: "file:./keystone.db",
    },
    // This config allows us to set up features of the Admin UI https://keystonejs.com/docs/apis/config#ui
    ui: {
      // For our starter, we check that someone has session data before letting them see the Admin UI.
      isAccessAllowed: (context) => !!context.session?.data,
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
      /** more storage */
    },
  })
);
