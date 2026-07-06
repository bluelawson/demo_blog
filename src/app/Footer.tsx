import { NavButton } from '@/components/form';
import React from 'react';

const Footer = () => {
  return (
    <footer className="flex justify-between py-2 px-4 border-t">
      <small>@2024 YOSHIURA COMPANY</small>
      <NavButton
        href="/games/chargeBurst"
        iconClass="i-tabler-device-gamepad-2"
      />
    </footer>
  );
};

export default Footer;
