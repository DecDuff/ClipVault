import Link from 'next/link';

interface NavButtonProps {
  href: string;
  label: string;
  className?: string; // This line fixes the "Property does not exist" error
}

export const NavButton = ({ href, label, className }: NavButtonProps) => {
  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
};