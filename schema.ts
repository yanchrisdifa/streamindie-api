/*
Welcome to the schema! The schema is the heart of Keystone.

Here we define our 'lists', which will then be used both for the GraphQL
API definition, our database tables, and our Admin UI layout.

Some quick definitions to help out:
A list: A definition of a collection of fields with a name. For the starter
  we have `User`, `Post`, and `Tag` lists.
A field: The individual bits of data on your list, each with its own type.
  you can see some of the lists in what we use below.

*/

// Like the `config` function we use in keystone.ts, we use functions
// for putting in our config so we get useful errors. With typescript,
// we get these even before code runs.
import { list } from "@keystone-6/core";

import {
  text,
  relationship,
  password,
  timestamp,
  select,
  file,
  checkbox,
} from "@keystone-6/core/fields";
import { document } from "@keystone-6/fields-document";
import { Lists } from ".keystone/types";
import { image } from "@keystone-6/core/fields";
const isAdmin = ({ session }: { session: any }) =>
  session?.data.userType === "admin";
const isPerson = ({ session, item }: { session: any; item: any }) =>
  session?.data.id === item.id;
const isAdminOrPerson = ({ session, item }: { session: any; item: any }) =>
  isAdmin({ session }) || isPerson({ session, item });

export const lists: Lists = {
  User: list({
    fields: {
      name: text({
        validation: { isRequired: true },
      }),
      email: text({
        validation: { isRequired: true },
        isIndexed: "unique",
        isFilterable: true,
      }),
      password: password({ validation: { isRequired: true } }),
      posts: relationship({ ref: "Post.author", many: true }),
      profile_picture: image({ storage: "artists_profile_picture" }),
      image: image({ storage: "artist_images" }),
      genres: relationship({ ref: "Genre.artists", many: true }),
      songs: relationship({ ref: "Song.artists", many: true }),
      userType: select({
        options: [
          { label: "Admin", value: "admin" },
          { label: "Artist", value: "artist" },
          { label: "User", value: "user" },
        ],
        defaultValue: "user",
        ui: {
          displayMode: "radio",
        },
        type: "enum",
      }),
    },
  }),

  Song: list({
    fields: {
      title: text({ validation: { isRequired: true } }),
      image: image({ storage: "song_cover_images" }),
      artists: relationship({ ref: "User.songs", many: false }),
      genre: relationship({ ref: "Genre.songs", many: false }),
      postedAt: timestamp({
        defaultValue: { kind: "now" },
        validation: { isRequired: true },
      }),
      audio: file({ storage: "song_audio" }),
    },
  }),

  Genre: list({
    fields: {
      name: text({ validation: { isRequired: true } }),
      image: image({ storage: "genre_images" }),
      artists: relationship({ ref: "User.genres", many: true }),
      songs: relationship({ ref: "Song.genre", many: true }),
    },
  }),

  Post: list({
    fields: {
      title: text(),
      status: select({
        options: [
          { label: "Published", value: "published" },
          { label: "Draft", value: "draft" },
        ],
        defaultValue: "draft",
        ui: {
          displayMode: "segmented-control",
        },
      }),
      content: document({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1],
        ],
        links: true,
        dividers: true,
      }),
      publishDate: timestamp(),
      author: relationship({
        ref: "User.posts",
        ui: {
          displayMode: "cards",
          cardFields: ["name", "email"],
          inlineEdit: { fields: ["name", "email"] },
          linkToItem: true,
          inlineConnect: true,
        },
      }),
      tags: relationship({
        ref: "Tag.posts",
        ui: {
          displayMode: "cards",
          cardFields: ["name"],
          inlineEdit: { fields: ["name"] },
          linkToItem: true,
          inlineConnect: true,
          inlineCreate: { fields: ["name"] },
        },
        many: true,
      }),
    },
  }),
  Tag: list({
    ui: {
      isHidden: true,
    },
    fields: {
      name: text(),
      posts: relationship({ ref: "Post.tags", many: true }),
    },
  }),
};
