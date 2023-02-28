import Image from 'next/image';
import Link from 'next/link';
import HFHLogo from '@public/img/hfh_logo.svg';
import Menu from '../Menu';
import { useState } from 'react';

export default function PageHeader(props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = (e) => {
    setIsMenuOpen((prev) => !prev);
  };

  if (props.withMenu) {
    return (
      <header className="main-header full-bleed logged-in">
        <div className="flag">&nbsp;</div>
        <div className="container">
          <h1>Hotels for Heroes</h1>
          <div className="logo-nav">
            <Link href="/">
              <a className="hotels-logo">
                <Image src={HFHLogo} alt="Hotels for Heroes Logo" unoptimized />
              </a>
            </Link>
            <span className="toggle" onClick={toggleMenu}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/toggle.svg" alt="Menu" />
            </span>
          </div>

          <Menu isMenuOpen={isMenuOpen} />
        </div>
      </header>
    );
  } else {
    return (
      <header className="main-header full-bleed">
        <div className="flag">&nbsp;</div>
        <div className="container">
          <h1>Hotels for Heroes</h1>
          <div className="logo-nav">
            <Link href="/">
              <a className="hotels-logo">
                <Image src={HFHLogo} alt="Hotels for Heroes Logo" />
              </a>
            </Link>
          </div>
        </div>
      </header>
    );
  }
}

PageHeader.defaultProps = {
  withMenu: true,
};
