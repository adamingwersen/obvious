"use client";

import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

type CopyToClipboardButtonProps = {
  text: string;
  url: string;
};

const CopyToClipboardButton = ({ text, url }: CopyToClipboardButtonProps) => {
  return (
    <Button
      variant="link"
      className="flex flex-row gap-2"
      onClick={() => navigator.clipboard.writeText(`${url}`)}
    >
      {text}
      <Copy className="size-4" />
    </Button>
  );
};

export default CopyToClipboardButton;
