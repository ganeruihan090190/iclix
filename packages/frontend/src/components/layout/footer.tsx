import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full max-w-6xl mx-auto px-4 py-12 text-text-muted text-xs">
      <div className="flex gap-6 mb-6">
        <span className="hover:underline cursor-pointer">Audio and Subtitles</span>
        <span className="hover:underline cursor-pointer">Help Center</span>
        <span className="hover:underline cursor-pointer">Terms of Use</span>
        <span className="hover:underline cursor-pointer">Privacy</span>
      </div>
      <p className="mb-2">ICLIX Demo Streaming Platform — For educational and demonstration purposes.</p>
      <p>© {new Date().getFullYear()} ICLIX Inc.</p>
    </footer>
  );
}
