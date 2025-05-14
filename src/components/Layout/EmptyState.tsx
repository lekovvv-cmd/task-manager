import React from "react";
import { DocumentPlusIcon } from "@heroicons/react/24/outline";

type Props = {
  message: string;
  submessage?: React.ReactNode;
};

export function EmptyState({ message, submessage }: Props) {
  return (
    <div className="w-full text-center mt-20 text-gray-500 flex flex-col items-center gap-4">
      <DocumentPlusIcon className="h-20 w-20 text-gray-400" />
      <p className="text-lg">{message}</p>
      {submessage && <p className="text-sm text-gray-400">{submessage}</p>}
    </div>
  );
}
