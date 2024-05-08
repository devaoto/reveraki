'use client';
import { usePathname } from 'next/navigation';
import NavComp from '@/components/Nav';

export default function NavBarRenderer() {
  console.log(usePathname().replace(/\//, ''));
  return <NavComp active={usePathname().replace(/\//, '')} />;
}
