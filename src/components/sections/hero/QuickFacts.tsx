import { CircleCheck, Crosshair, Layers, MapPin, Send } from 'lucide-react';
import { site } from '../../../data/site';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

/** Quick facts shown in the strip (from site data where possible). */
const FACTS = [
  { icon: MapPin, label: 'Based in', value: site.location, cls: 'fact--wide' },
  {
    icon: Crosshair,
    label: 'Focus',
    value: 'Data engineering',
    cls: undefined,
  },
  {
    icon: Layers,
    label: 'Stack',
    value: 'Python · SQL · React',
    cls: 'fact--stack',
  },
  { icon: CircleCheck, label: 'Status', value: 'Open to work', cls: undefined },
];

/**
 * Quick-facts strip: the reference search bar's size (min(900px,
 * 100% - 40px) x 90px), radius 26px, raised-tile hover (white tile,
 * radius 14px) and send-button styling (black 40px square, paper-plane
 * icon, hover scale 1.1 + rotate -8deg). The send button is labelled
 * "Contact me" and smooth-scrolls to #contact. On <= 640px the strip
 * becomes a 2x2 grid with a full-width send button.
 */
export default function QuickFacts() {
  const reduced = useReducedMotion();

  const scrollToContact = () => {
    document
      .getElementById('contact')
      ?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <div className="hero-facts" role="group" aria-label="Quick facts">
      {FACTS.map(({ icon: Icon, label, value, cls }) => (
        <div className={`fact ${cls ?? ''}`} key={label}>
          <Icon className="fact-icon" size={16} strokeWidth={1.5} aria-hidden />
          <div className="fact-text">
            <div className="fact-label">{label}</div>
            <div className="fact-value">{value}</div>
          </div>
        </div>
      ))}
      <button
        type="button"
        className="facts-send"
        aria-label="Contact me"
        onClick={scrollToContact}
      >
        <Send size={17} strokeWidth={1.6} aria-hidden />
      </button>
    </div>
  );
}
