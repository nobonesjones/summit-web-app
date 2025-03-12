import { StarBorder } from "./star-border";
import { Button } from "./button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function StarBorderDemo() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-8">
      <StarBorder className="max-w-xs">
        <Link href="/sign-up">
          <Button
            size="lg"
            className="rounded-full px-8 h-12 w-full"
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Button>
        </Link>
      </StarBorder>
    </div>
  );
} 