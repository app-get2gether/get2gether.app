import type { Meta, StoryObj } from "@storybook/react";
import FooterTabs from "../FooterTabs";

const meta = {
  title: "FooterTabs",
  component: FooterTabs,
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/tgbot/events",
      },
    },
  },
} satisfies Meta<typeof FooterTabs>;

export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {};
