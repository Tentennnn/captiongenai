import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebook,
  faTiktok,
  faYoutube,
  faTelegram,
} from '@fortawesome/free-brands-svg-icons';
import {
  faCopy,
  faCheck,
  faSync,
  faBullseye,
  faMagic,
  faHashtag,
  faArrowLeft,
  faSpinner,
  faInfoCircle,
  faUser,
  faSignOutAlt,
  faChevronDown,
  faSun,
  faMoon,
  faBolt
} from '@fortawesome/free-solid-svg-icons';

type IconProps = {
  className?: string;
};

// --- Social & Platform Icons ---

export const FacebookIcon: React.FC<IconProps> = ({ className }) => (
  <FontAwesomeIcon icon={faFacebook} className={className} />
);

export const TikTokIcon: React.FC<IconProps> = ({ className }) => (
  <FontAwesomeIcon icon={faTiktok} className={className} />
);

export const YouTubeIcon: React.FC<IconProps> = ({ className }) => (
  <FontAwesomeIcon icon={faYoutube} className={className} />
);

// --- Action Icons ---

export const CopyIcon: React.FC<IconProps> = ({ className }) => (
    <FontAwesomeIcon icon={faCopy} className={className} />
);

export const CheckIcon: React.FC<IconProps> = ({ className }) => (
    <FontAwesomeIcon icon={faCheck} className={className} />
);

export const RegenerateIcon: React.FC<IconProps> = ({ className }) => (
    <FontAwesomeIcon icon={faSync} className={className} />
);

// --- Brand & Feature Icons ---

export const HeaderIcon: React.FC<IconProps> = ({ className }) => (
    <FontAwesomeIcon icon={faBolt} className={className} />
);

export const FeaturesTargetIcon: React.FC<IconProps> = ({ className }) => (
    <FontAwesomeIcon icon={faBullseye} className={className} />
);

export const FeaturesMagicIcon: React.FC<IconProps> = ({ className }) => (
    <FontAwesomeIcon icon={faMagic} className={className} />
);

export const FeaturesHashtagIcon: React.FC<IconProps> = ({ className }) => (
    <FontAwesomeIcon icon={faHashtag} className={className} />
);

// --- UI & Navigation Icons ---

export const ArrowLeftIcon: React.FC<IconProps> = ({ className }) => (
    <FontAwesomeIcon icon={faArrowLeft} className={className} />
);

export const SpinnerIcon: React.FC<IconProps> = ({ className }) => (
    <FontAwesomeIcon icon={faSpinner} className={className} spin />
);

export const InfoIcon: React.FC<IconProps> = ({ className }) => (
    <FontAwesomeIcon icon={faInfoCircle} className={className} />
);

export const UserIcon: React.FC<IconProps> = ({ className }) => (
    <FontAwesomeIcon icon={faUser} className={className} />
);

export const LogoutIcon: React.FC<IconProps> = ({ className }) => (
    <FontAwesomeIcon icon={faSignOutAlt} className={className} />
);

export const ChevronDownIcon: React.FC<IconProps> = ({ className }) => (
    <FontAwesomeIcon icon={faChevronDown} className={className} />
);

// --- Theme Icons ---

export const SunIcon: React.FC<IconProps> = ({ className }) => (
    <FontAwesomeIcon icon={faSun} className={className} />
);

export const MoonIcon: React.FC<IconProps> = ({ className }) => (
    <FontAwesomeIcon icon={faMoon} className={className} />
);

// --- Additional Icons ---

export const TelegramIcon: React.FC<IconProps> = ({ className }) => (
    <FontAwesomeIcon icon={faTelegram} className={className} />
);
