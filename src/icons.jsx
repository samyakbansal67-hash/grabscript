const Ico = ({ d, size = 20, stroke = 2, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" {...rest}>{d}</svg>
)

export const IconPlay       = (p) => <Ico {...p} d={<polygon points="6 4 20 12 6 20 6 4" />} />
export const IconLink       = (p) => <Ico {...p} d={<><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" /><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" /></>} />
export const IconPaste      = (p) => <Ico {...p} d={<><rect x="8" y="3" width="8" height="4" rx="1" /><path d="M16 5h2a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2" /></>} />
export const IconSpark      = (p) => <Ico {...p} d={<><path d="M12 3v4"/><path d="M12 17v4"/><path d="M5 12H1"/><path d="M23 12h-4"/><path d="M19 5l-3 3"/><path d="M8 16l-3 3"/><path d="M19 19l-3-3"/><path d="M8 8L5 5"/></>} />
export const IconArrowRight = (p) => <Ico {...p} d={<><path d="M5 12h14"/><path d="M13 5l7 7-7 7"/></>} />
export const IconCopy       = (p) => <Ico {...p} d={<><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>} />
export const IconDownload   = (p) => <Ico {...p} d={<><path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M5 21h14"/></>} />
export const IconSearch     = (p) => <Ico {...p} d={<><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>} />
export const IconCheck      = (p) => <Ico {...p} d={<path d="M4 12l5 5L20 6" />} />
export const IconClock      = (p) => <Ico {...p} d={<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>} />
export const IconHash       = (p) => <Ico {...p} d={<><path d="M4 9h16"/><path d="M4 15h16"/><path d="M10 3 8 21"/><path d="M16 3l-2 18"/></>} />
export const IconBolt       = (p) => <Ico {...p} d={<polygon points="13 2 4 14 12 14 11 22 20 10 12 10 13 2" />} />
export const IconType       = (p) => <Ico {...p} d={<><path d="M4 7V5h16v2"/><path d="M12 5v14"/><path d="M9 19h6"/></>} />
export const IconGift       = (p) => <Ico {...p} d={<><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5" rx="1"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 1 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 1 0 0-5C13 2 12 7 12 7z"/></>} />
export const IconLayers     = (p) => <Ico {...p} d={<><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></>} />
export const IconGlobe      = (p) => <Ico {...p} d={<><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18z"/></>} />
export const IconX          = (p) => <Ico {...p} d={<><path d="M6 6l12 12"/><path d="M18 6L6 18"/></>} />
export const IconWaveform   = (p) => <Ico {...p} d={<><path d="M3 12h2"/><path d="M7 8v8"/><path d="M11 5v14"/><path d="M15 9v6"/><path d="M19 11v2"/></>} />
export const IconAlert      = (p) => <Ico {...p} d={<><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></>} />

export const ICONS = {
  IconPlay, IconLink, IconPaste, IconSpark, IconArrowRight, IconCopy, IconDownload,
  IconSearch, IconCheck, IconClock, IconHash, IconBolt, IconType, IconGift,
  IconLayers, IconGlobe, IconX, IconWaveform, IconAlert,
}
