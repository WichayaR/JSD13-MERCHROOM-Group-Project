import { Link } from 'react-router-dom';
import iconMushroom from '../../../assets/Merchroom-Logo/icon-mushroom.svg';
import wordmarkWhite from '../../../assets/Merchroom-Logo/wordmark-white.svg';
import wordmarkLime from '../../../assets/Merchroom-Logo/wordmark-lime.svg';

const iconRatio = 1368.75 / 1500;
const wordmarkRatio = {
  light: 261.75 / 1500,
  lime: 231.644531 / 1500,
};

const sizes = {
  md: { icon: 29, wordmark: 122 },
  lg: { icon: 48, wordmark: 275 },
};

export default function Logo({ tone = 'light', size = 'md', className = '' }) {
  const s = sizes[size] || sizes.md;
  const isLime = tone === 'lime';
  const wordmarkSrc = isLime ? wordmarkLime : wordmarkWhite;

  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-2 transition hover:opacity-90 ${className}`}
      aria-label="MERCHROOM หน้าหลัก"
    >
      <img
        src={iconMushroom}
        alt=""
        width={s.icon}
        height={Math.round(s.icon * iconRatio)}
        aria-hidden="true"
      />
      <img
        src={wordmarkSrc}
        alt="MERCHROOM"
        width={s.wordmark}
        height={Math.round(s.wordmark * (isLime ? wordmarkRatio.lime : wordmarkRatio.light))}
      />
    </Link>
  );
}
