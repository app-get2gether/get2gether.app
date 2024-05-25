import type { Meta, StoryObj } from "@storybook/react";
import { EditableInput } from "../Editable";
import { fn } from "@storybook/test";

const meta = {
  title: "Editable",
  component: EditableInput,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof EditableInput>;

export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    placeholder: "Type something something",
    onSubmit: fn(),
  },
};
