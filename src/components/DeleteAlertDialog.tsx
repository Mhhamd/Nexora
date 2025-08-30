"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { Loader2Icon, Trash2Icon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface DeleteProps {
  handleDelete: () => void;
  isDeleting: boolean;
  title?: string;
  description?: string;
}

function DeleteAlertDialog({
  handleDelete,
  isDeleting,
  title = "Delete this Post ?",
  description = "This action cannot be undone.",
}: DeleteProps) {
  return (
    <AlertDialog>
      <Tooltip delayDuration={800}>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            <Button
              disabled={isDeleting}
              variant="ghost"
              size="sm"
              className="hover:text-primary cursor-pointer flex-shrink-0">
              {isDeleting ? <Loader2Icon className="size-4 animate-spin" /> : <Trash2Icon size={16} />}
            </Button>
          </AlertDialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Delete</p>
        </TooltipContent>
      </Tooltip>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-500 text-white hover:bg-red-600 cursor-pointer"
            disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteAlertDialog;
