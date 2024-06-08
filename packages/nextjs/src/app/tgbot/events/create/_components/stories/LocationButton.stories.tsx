import type { Meta, StoryObj } from "@storybook/react";
import LocationButton from "../LocationButton";

const meta = {
  title: "Pages/_components/LocationButton",
  component: LocationButton,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof LocationButton>;

export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {};
