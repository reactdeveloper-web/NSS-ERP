import React, { ReactNode, useEffect, useRef, useState } from 'react';

interface Props {
  trigger: ReactNode;
  children: ReactNode;
  wrapperClassName?: string;
  menuClassName?: string;
  openOnHover?: boolean;
}

export const MetronicDropdown = (props: Props) => {
  const {
    trigger,
    children,
    wrapperClassName = '',
    menuClassName = '',
    openOnHover = false,
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className={wrapperClassName}
      onMouseEnter={openOnHover ? () => setIsOpen(true) : undefined}
      onMouseLeave={openOnHover ? () => setIsOpen(false) : undefined}
    >
      <div
        onClick={() => setIsOpen(prevState => !prevState)}
        style={{ cursor: 'pointer' }}
      >
        {trigger}
      </div>
      <div className={`${menuClassName} ${isOpen ? 'show' : ''}`.trim()}>
        {children}
      </div>
    </div>
  );
};
