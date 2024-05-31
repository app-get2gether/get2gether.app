import type { Meta, StoryObj } from "@storybook/react";
import EventsPage from "../page";

import { HttpResponse, http } from "msw";
import moment from "moment";

const meta = {
  title: "Pages/events",
  component: EventsPage,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof EventsPage>;
export default meta;

const EventsData = [
  {
    title: "My event title",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    address: "050 Amy Station Suite 381, Beasleytown, NV 40290",
    addressInfo:
      "Located in the heart of Beasleytown, this office suite is part of a modern commercial building close to local amenities and public transport. Ideal for businesses looking for a professional setting.",
    lat: 38.3829293,
    lng: -122.3092458,
    startAt: moment().valueOf(),
  },
  {
    title: "Just simple",
    startAt: moment("2024/9/18 12:00pm").valueOf(),
  },
  {
    title: "Letter play positive sell. Interest rate begin under voice maybe. Develop break where street.",
    description: "However although its range he. Figure task difficult soldier wife night audience very.",
    address: "465 Dorsey Village, Derrickborough, NE 01893",
    startAt: moment("2024/8/18 12:00pm").valueOf(),
  },
];

type Story = StoryObj<typeof meta>;
export const Events: Story = {
  args: {
    params: {
      id: "1",
    },
  },
  parameters: {
    msw: {
      handlers: [
        http.get(`${process.env.NEXT_PUBLIC_API_URL}/tgbot/v1/events`, async () => HttpResponse.json(EventsData)),
      ],
    },
  },
};
