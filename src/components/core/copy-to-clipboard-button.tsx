"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Copy } from "lucide-react";

type CopyToClipboardButtonProps = {
  text: string;
  url: string;
};

const CopyToClipboardButton = ({ text, url }: CopyToClipboardButtonProps) => {
  const { toast } = useToast();
  const onClick = async (url: string) => {
    await navigator.clipboard.writeText(`${url}`);
    toast({
      title: "Copied to clipboard",
    });
  };
  return (
    <Button
      variant="link"
      className="flex flex-row gap-2"
      onClick={() => onClick(url)}
    >
      {text}
      <Copy className="size-4" />
    </Button>
  );
};

export default CopyToClipboardButton;
