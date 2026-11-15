/**
 * Portfolio Data Store for Limerson Lopez
 * Grounded in Limerson Lopez's real resume, STI College Batangas coursework,
 * certifications, projects, and verified social links.
 */
(function () {
  'use strict';

  const TECH_ICONS = {
    HTML5: {
      color: '#E34F26',
      bg: 'rgba(227, 79, 38, 0.14)',
      svg: '<svg viewBox="0 0 24 24" class="w-8 h-8" fill="none"><path d="M4 3l1.5 16.5L12 21.5l6.5-2L20 3H4z" fill="#E34F26"/><path d="M12 4.5v15.4l5.1-1.5L18.3 4.5H12z" fill="#EF652A"/><path d="M7.5 8h9l-.3 2.5H9.8l.2 2.2h6l-.6 5.2-3.4 1-3.4-1-.2-2.4h2.2l.1 1 1.3.4 1.3-.4.2-1.8H7.8L7.5 8z" fill="#fff"/></svg>'
    },
    CSS3: {
      color: '#1572B6',
      bg: 'rgba(21, 114, 182, 0.14)',
      svg: '<svg viewBox="0 0 24 24" class="w-8 h-8" fill="none"><path d="M4 3l1.5 16.5L12 21.5l6.5-2L20 3H4z" fill="#1572B6"/><path d="M12 4.5v15.4l5.1-1.5L18.3 4.5H12z" fill="#33A9DC"/><path d="M7.5 8h9l-.3 2.5h-4.4l4.2 1.7-.5 5.4-3.5 1-3.5-1-.2-2.3h2.2l.1.9 1.4.4 1.4-.4.2-1.9H8.3l.2-2.2h4.2l.2-1.6H7.7L7.5 8z" fill="#fff"/></svg>'
    },
    JavaScript: {
      color: '#F7DF1E',
      bg: 'rgba(247, 223, 30, 0.13)',
      svg: '<svg viewBox="0 0 24 24" class="w-8 h-8" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" fill="#F7DF1E"/><path d="M13.2 17.4c.4.7.9 1.2 1.8 1.2.8 0 1.3-.4 1.3-1 0-.7-.5-1-1.5-1.4l-.5-.2c-1.5-.6-2.4-1.4-2.4-3 0-1.5 1.1-2.6 2.9-2.6 1.3 0 2.2.4 2.8 1.6l-1.5 1c-.3-.6-.7-.8-1.3-.8-.6 0-1 .4-1 .8 0 .6.4.9 1.2 1.2l.5.2c1.7.7 2.7 1.5 2.7 3.2 0 1.8-1.4 2.8-3.3 2.8-1.8 0-3-.9-3.6-2l1.6-1zm-6.1.2c.3.5.6.9 1.2.9.6 0 1-.2 1-1.2v-6.6h1.9v6.7c0 2-1.2 2.9-2.9 2.9-1.5 0-2.4-.8-2.9-1.8l1.7-.9z" fill="#0B1120"/></svg>'
    },
    Python: {
      color: '#3776AB',
      bg: 'rgba(55, 118, 171, 0.16)',
      svg: '<svg viewBox="0 0 24 24" class="w-8 h-8" fill="none"><path d="M11.9 3C8.5 3 8.8 4.5 8.8 4.5v1.6h3.2v.6H6.5S4 6.4 4 9.9c0 3.5 2.2 3.4 2.2 3.4h1.3v-1.7s-.1-2.2 2.2-2.2h3.7s2.1 0 2.1-2V4.9S15.8 3 11.9 3zm-1.6 1.1a.7.7 0 110 1.4.7.7 0 010-1.4z" fill="#3776AB"/><path d="M12.1 21c3.4 0 3.1-1.5 3.1-1.5v-1.6H12v-.6h5.5s2.5.3 2.5-3.2c0-3.5-2.2-3.4-2.2-3.4h-1.3v1.7s.1 2.2-2.2 2.2h-3.7s-2.1 0-2.1 2v2.5S8.2 21 12.1 21zm1.6-1.1a.7.7 0 110-1.4.7.7 0 010-1.4z" fill="#FFD43B"/></svg>'
    },
    MySQL: {
      color: '#4479A1',
      bg: 'rgba(68, 121, 161, 0.16)',
      svg: '<svg viewBox="0 0 24 24" class="w-8 h-8" fill="none"><ellipse cx="12" cy="6.5" rx="7" ry="2.8" stroke="#4479A1" stroke-width="1.8" fill="rgba(68,121,161,0.22)"/><path d="M5 6.5v5c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8v-5" stroke="#4479A1" stroke-width="1.8"/><path d="M5 11.5v5.5c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8v-5.5" stroke="#F29111" stroke-width="1.8"/></svg>'
    },
    PHP: {
      color: '#777BB4',
      bg: 'rgba(119, 123, 180, 0.16)',
      svg: '<svg viewBox="0 0 24 24" class="w-8 h-8" fill="none"><ellipse cx="12" cy="12" rx="10" ry="6" fill="#777BB4"/><text x="12" y="14.2" text-anchor="middle" fill="#fff" font-size="7.2" font-weight="800" font-family="Space Grotesk, sans-serif">PHP</text></svg>'
    },
    Java: {
      color: '#F89820',
      bg: 'rgba(248, 152, 32, 0.14)',
      svg: '<svg viewBox="0 0 24 24" class="w-8 h-8" fill="none"><path d="M9.5 17.5c-2 .6 1.5 2 5 1.5M8.5 14.5c-2.5.7 1.8 2 6.2 1.2M10 11.5c3-.8 4.8.3 2.5 1.5" stroke="#5382A1" stroke-width="1.6" stroke-linecap="round"/><path d="M12.5 3.5c1.5 1.8-1.8 3.2-.5 5 .8 1.1 2.2 1.6 1 3" stroke="#F89820" stroke-width="1.7" stroke-linecap="round"/><path d="M16 11.5c2 0 3 .8 2.4 2.2-.5 1-1.6 1.3-2.6 1.3" stroke="#5382A1" stroke-width="1.6" stroke-linecap="round"/></svg>'
    },
    'C#': {
      color: '#9B4F96',
      bg: 'rgba(155, 79, 150, 0.16)',
      svg: '<svg viewBox="0 0 24 24" class="w-8 h-8" fill="none"><polygon points="12,2.5 20.2,7.2 20.2,16.8 12,21.5 3.8,16.8 3.8,7.2" fill="#68217A"/><text x="12" y="14.4" text-anchor="middle" fill="#fff" font-size="8.2" font-weight="800" font-family="Space Grotesk, sans-serif">C#</text></svg>'
    },
    'Blender 5.2.1': {
      color: '#EA7600',
      bg: 'rgba(234, 118, 0, 0.14)',
      svg: '<svg viewBox="0 0 24 24" class="w-8 h-8" fill="none"><path d="M12.5 5.5l4.2 3.2M7.2 9.5h7.3M5 13.4l4.5-3.9" stroke="#EA7600" stroke-width="2" stroke-linecap="round"/><circle cx="13.5" cy="13.5" r="5" stroke="#EA7600" stroke-width="2.2"/><circle cx="13.5" cy="13.5" r="2.2" fill="#3B82F6"/></svg>'
    },
    PyOpenGL: {
      color: '#5586A4',
      bg: 'rgba(85, 134, 164, 0.16)',
      svg: '<svg viewBox="0 0 24 24" class="w-8 h-8" fill="none"><polygon points="12,3 20,7.5 20,16.5 12,21 4,16.5 4,7.5" stroke="#60A5FA" stroke-width="1.7" fill="rgba(59,130,246,0.16)"/><path d="M12 3v9m0 0l8-4.5M12 12L4 7.5M12 12v9" stroke="#93C5FD" stroke-width="1.4"/></svg>'
    },
    Wireshark: {
      color: '#1679A7',
      bg: 'rgba(22, 121, 167, 0.18)',
      svg: '<svg viewBox="0 0 24 24" class="w-8 h-8" fill="none"><rect x="3" y="4" width="18" height="16" rx="4" fill="#1679A7"/><path d="M6 16.5c3.5 0 4.5-8 8.8-9.5-.8 3.6.3 7.2 3.2 9.5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    },
    'Draw.io': {
      color: '#F08705',
      bg: 'rgba(240, 135, 5, 0.14)',
      svg: '<svg viewBox="0 0 24 24" class="w-8 h-8" fill="none"><rect x="9" y="3.5" width="6" height="5" rx="1.2" fill="#F08705"/><rect x="3.5" y="15.5" width="6" height="5" rx="1.2" fill="#F08705"/><rect x="14.5" y="15.5" width="6" height="5" rx="1.2" fill="#60A5FA"/><path d="M12 8.5v3m0 0H6.5v4m5.5-4h5.5v4" stroke="#CBD5E1" stroke-width="1.6" stroke-linecap="round"/></svg>'
    },
    Git: {
      color: '#F05032',
      bg: 'rgba(240, 80, 50, 0.15)',
      svg: '<svg viewBox="0 0 24 24" class="w-8 h-8" fill="none"><path d="M20.4 11.1L12.9 3.6a1.3 1.3 0 00-1.8 0L9.4 5.3l2.2 2.2a1.5 1.5 0 011.9 1.9l2.1 2.1a1.5 1.5 0 11-.9.9l-2-2v5.2a1.5 1.5 0 11-1.2 0V10a1.5 1.5 0 01-.8-2L8.5 5.9 3.6 10.8a1.3 1.3 0 000 1.8l7.5 7.5a1.3 1.3 0 001.8 0l7.5-7.5a1.3 1.3 0 000-1.5z" fill="#F05032"/></svg>'
    },
    'VS Code': {
      color: '#007ACC',
      bg: 'rgba(0, 122, 204, 0.16)',
      svg: '<svg viewBox="0 0 24 24" class="w-8 h-8" fill="none"><path d="M17.5 3.5L7.5 13l-3-2.3-1.8.8v5l1.8.8 3-2.3 10 9.5 3.8-1.8V5.3l-3.8-1.8zm0 4.6v7.8L12 12l5.5-3.9z" fill="#38BDF8"/></svg>'
    }
  };

  window.PORTFOLIO_DATA = {
    contact: {
      email: 'limersonlopez05@gmail.com',
      phone: '0905-378-2092',
      location: 'Malabrigo, Lobo, Batangas'
    },

    socials: [
      {
        id: 'instagram',
        name: 'Instagram',
        handle: '@lmrsnlpz_',
        subtitle: 'Character sketches, campus life & dev progress shots',
        url: 'https://www.instagram.com/lmrsnlpz_?psln=MTdzMWt2OXJ3N2xtYg%3D%3D&utm_source=qr',
        accent: 'hover:border-sky-400/60',
        icon: '<svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>'
      },
      {
        id: 'facebook',
        name: 'Facebook',
        handle: 'Limerson Lopez',
        subtitle: 'Direct messages, STI updates & project milestones',
        url: 'https://www.facebook.com/share/14w1ThZnrEs/?mibextid=wwXIfr',
        accent: 'hover:border-blue-500/60',
        icon: '<svg viewBox="0 0 24 24" class="w-5 h-5" fill="currentColor" aria-hidden="true"><path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.5 1.6-1.5h1.6V4.9c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1V11H7.7v3h2.6v8h3.2z"/></svg>'
      },
      {
        id: 'github',
        name: 'GitHub',
        handle: '@limersonlopez05-svg',
        subtitle: 'Repositories, Python 3D scripts & full-stack builds',
        url: 'https://github.com/limersonlopez05-svg',
        accent: 'hover:border-blue-400/60',
        icon: '<svg viewBox="0 0 24 24" class="w-5 h-5" fill="currentColor" aria-hidden="true"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>'
      }
    ],

    projects: [
      {
        id: 'traxvet',
        title: 'TraxVet (Trax Vet VIS)',
        badge: 'Capstone Full-Stack System',
        year: '2026',
        shortDescription:
          'Web-based Veterinary Information System featuring digital patient records, 24/7 appointment booking, pet health trackers, clinic locator, and a responsive web interface.',
        overview:
          'Led the system architecture and full-stack engineering of TraxVet, a centralized Veterinary Information System built to modernize pet clinic workflows. Designed the normalized MySQL relational schema from scratch, implemented secure PHP server logic and role-based clinic & pet owner portals, and crafted an intuitive web interface featuring online appointment booking, digital medical records, vaccination trackers, and clinic location discovery.',
        highlights: [
          'Sole Full-Stack Developer & Capstone Team Leader at STI College Batangas',
          'Normalized MySQL relational database linking owners, pets, medical logs, and clinic appointments',
          'Responsive clinic web portal with 24/7 appointment booking and service discovery'
        ],
        technologies: ['HTML5', 'CSS3', 'JavaScript', 'PHP', 'MySQL', 'Draw.io'],
        image: 'assets/project-traxvet.png',
        imageAlt: 'TraxVet Animal Clinic web application homepage showing appointment booking and clinic overview',
        repoUrl: 'https://github.com/limersonlopez05-svg'
      },
      {
        id: 'python-3d-blender',
        title: 'Python 3D Graphics & Blender Automation',
        badge: '3D Graphics & Scripting',
        year: '2026',
        shortDescription:
          'Custom Python (bpy, PyOpenGL, pygame) scripts automating 3D keyframing, rigid body physics simulations, and procedural camera movements in Blender 5.2.1.',
        overview:
          'Built a suite of Python automation pipelines bridging Blender 5.2.1 (bpy) and standalone real-time rendering experiments in PyOpenGL and pygame. Automated batch mesh generation, rigid-body collision triggers, dynamic Bezier camera rigs, and programmatic keyframe interpolation to cut manual animation setup time while preserving deterministic physics playback.',
        highlights: [
          'Procedural rigid-body drop & collision scripts authored via Blender bpy API',
          'Real-time wireframe geometry and shader tests in PyOpenGL + pygame',
          'Automated multi-angle camera orbit keyframes and clean render presets'
        ],
        technologies: ['Python', 'Blender 5.2.1', 'PyOpenGL', 'Git'],
        image: 'assets/project-blender3d.png',
        imageAlt: 'Blender 5.2.1 Scripting workspace displaying rigid-body icospheres and bpy Python automation script',
        repoUrl: 'https://github.com/limersonlopez05-svg'
      },
      {
        id: 'network-security-labs',
        title: 'Network Security & Packet Analysis Labs',
        badge: 'Networking & Security',
        year: '2025',
        shortDescription:
          'Deep-packet inspection of IEEE 802.11 WLAN management frames, Radiotap headers, and EAPOL/WPA2-Enterprise handshakes using Wireshark, paired with MAN/WAN topology architectures.',
        overview:
          'Conducted structured protocol dissection and enterprise topology modeling labs focused on wireless and campus network security. Analyzed live IEEE 802.11 beacon/probe management frames, Radiotap RF metrics, and 4-way EAPOL WPA2-Enterprise authentication exchanges in Wireshark, alongside resilient multi-tier MAN/WAN routing diagrams designed in Draw.io.',
        highlights: [
          'IEEE 802.11 management frame & Radiotap signal telemetry inspection',
          'EAPOL 4-way handshake & WPA2-Enterprise authentication flow verification',
          'Redundant core/distribution MAN & WAN architecture blueprints in Draw.io'
        ],
        technologies: ['Wireshark', 'Draw.io', 'Python', 'Git'],
        image: 'assets/project-netsec.png',
        imageAlt: 'Draw.io campus MAN/WAN topology diagram and Wireshark IEEE 802.11 EAPOL packet capture',
        repoUrl: 'https://github.com/limersonlopez05-svg'
      }
    ],

    certificates: [
      {
        id: 'cert-sap-s4',
        title: 'Basic SAP S/4 HANA',
        issuer: 'STI College Batangas',
        date: 'June 7, 2025',
        credentialCode: 'STI-SAP-2025',
        summary: 'Completed institutional training on enterprise ERP workflows, core organizational modules, and SAP S/4 HANA operational fundamentals.',
        tags: ['SAP S/4 HANA', 'Enterprise Systems', 'STI Batangas']
      },
      {
        id: 'cert-java-fund',
        title: 'Java Fundamentals',
        issuer: 'STI College Batangas',
        date: 'June 19, 2024',
        credentialCode: 'STI-JAVA-2024',
        summary: 'Completed object-oriented programming coursework covering Java syntax, classes, encapsulation, inheritance, and algorithmic problem solving.',
        tags: ['Java', 'OOP', 'STI Batangas']
      },
      {
        id: 'cert-capstone-hs',
        title: 'Best in Capstone Research',
        issuer: 'Lobo Senior High School',
        date: '2023',
        credentialCode: 'LSHS-CAP-2023',
        summary: 'Awarded Best in Capstone Research for structured technical documentation, methodology execution, and project defense presentation.',
        tags: ['Capstone Research', 'Systems Analysis', 'Award']
      },
      {
        id: 'cert-ojt-ready',
        title: '486-Hour IT OJT Internship Readiness',
        issuer: 'STI College Batangas — BSIT (Exp. Grad 2027)',
        date: 'Preferred Start: Feb 2027',
        credentialCode: 'BSIT-OJT-486',
        summary: 'Completed core BSIT tracks in Web Development, Database Management Systems, Systems Analysis & Design, OOP, Networking Fundamentals, and InfoSec.',
        tags: ['PHP & MySQL', 'Full-Stack', '486 Hours']
      }
    ],

    techStack: Object.keys(TECH_ICONS).map(function (name) {
      return {
        name: name,
        color: TECH_ICONS[name].color,
        bg: TECH_ICONS[name].bg,
        svg: TECH_ICONS[name].svg
      };
    }),

    playlist: [
      {
        id: 'track-1',
        title: 'Midnight Commit (Lo-Fi Synth)',
        artist: 'CodingTime • 82 BPM',
        duration: 164,
        baseFreq: 220,
        chord: [220, 261.63, 329.63, 392.0],
        tempoMs: 520
      },
      {
        id: 'track-2',
        title: 'Blue Nebula Render',
        artist: 'bpy & chill • 90 BPM',
        duration: 188,
        baseFreq: 196,
        chord: [196, 246.94, 293.66, 369.99],
        tempoMs: 460
      },
      {
        id: 'track-3',
        title: 'Packet Stream 802.11',
        artist: 'Deep Focus • 96 BPM',
        duration: 172,
        baseFreq: 174.61,
        chord: [174.61, 220.0, 261.63, 329.63],
        tempoMs: 420
      },
      {
        id: 'track-4',
        title: 'TraxVet Late Night Build',
        artist: 'SQL & Chill • 78 BPM',
        duration: 205,
        baseFreq: 246.94,
        chord: [246.94, 293.66, 369.99, 440.0],
        tempoMs: 560
      },
      {
        id: 'track-5',
        title: 'Batangas Starlight Horizon',
        artist: 'Ambient Space • 74 BPM',
        duration: 194,
        baseFreq: 164.81,
        chord: [164.81, 196.0, 246.94, 329.63],
        tempoMs: 600
      }
    ]
  };
})();
