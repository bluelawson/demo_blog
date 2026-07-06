import Link from 'next/link';

type Props = {
  href?: string;
  iconClass: string;
  text?: string;
  onClick?: () => void;
};

const NavButton = ({ href, iconClass, text, onClick }: Props) => {
  const commonClasses =
    'px-2 py-2 mx-1 space-x-2 text-xs rounded-lg hover:bg-sky-700';

  return href ? (
    <Link href={href} className={commonClasses}>
      <span className={`${iconClass} relative top-[1px] scale-150`}></span>
      {text ? <span>{text}</span> : null}
    </Link>
  ) : (
    <button onClick={onClick} className={commonClasses}>
      <span className={`${iconClass} relative top-[1px] scale-150`}></span>
      {text ? <span>{text}</span> : null}
    </button>
  );
};

export default NavButton;
