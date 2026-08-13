import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RevealOnScroll } from "@/components/animations";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[100vh] -mt-14 pt-14 px-4 text-center">
      <RevealOnScroll direction="up" duration={0.5}>
        <p className="text-sm font-medium text-primary mb-4">404</p>
      </RevealOnScroll>
      <RevealOnScroll direction="up" delay={0.15} duration={0.7}>
        <h1 className="font-serif text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
          Page Not Found
        </h1>
      </RevealOnScroll>
      <RevealOnScroll direction="up" delay={0.3} duration={0.7}>
        <p className="text-muted-foreground text-lg max-w-md mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </RevealOnScroll>
      <RevealOnScroll direction="up" delay={0.45} duration={0.7}>
        <Button asChild>
          <Link href="/">Go to Home</Link>
        </Button>
      </RevealOnScroll>
    </div>
  );
}
