interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <div className={`mb-8 md:mb-12 ${className || ''}`}>
      <h1 className="font-headline text-3xl md:text-4xl font-semibold text-foreground mb-2">
        {title}
      </h1>
      {description && (
        <p className="text-lg text-muted-foreground max-w-2xl">
          {description}
        </p>
      )}
    </div>
  );
}
