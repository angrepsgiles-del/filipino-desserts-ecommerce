"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import CartModal from './CartModal';
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import styles from './Header.module.css';

const Header = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { getTotalItems } = useCart();

  return (
    <>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Link href="/">Filipino Desserts</Link>
        </div>
        <nav className={styles.nav}>
          <Link href="/">Product</Link>
          <Link href="/about">About Us</Link>
          <button onClick={() => setIsCartOpen(true)} className="relative p-2 rounded-full hover:bg-white/20 dark:hover:bg-zinc-700/50">
            <img src="/images/Cart.png" alt="Cart" className="w-6 h-6 dark:invert" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </button>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
        </nav>
      </header>
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Header;
