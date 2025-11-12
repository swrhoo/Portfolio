import React, { useId } from 'react';

export const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
    const idSuffix = useId();
    const grad1 = `grad1_${idSuffix}`;
    const grad2 = `grad2_${idSuffix}`;
    const grad3 = `grad3_${idSuffix}`;

    return (
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
         viewBox="0 0 1063.95 283.3" enableBackground="new 0 0 1063.95 283.3" xmlSpace="preserve" {...props}>
        <defs>
            <linearGradient id={grad1} gradientUnits="userSpaceOnUse" x1="288.2995" y1="136.5056" x2="1042.5247" y2="136.5056">
                <stop offset="0" style={{stopColor:"#442682"}} />
                <stop offset="0.01" style={{stopColor:"#483887"}} />
                <stop offset="0.0223" style={{stopColor:"#4B4B8D"}} />
                <stop offset="0.0362" style={{stopColor:"#4E5B92"}} />
                <stop offset="0.052" style={{stopColor:"#516896"}} />
                <stop offset="0.0704" style={{stopColor:"#537298"}} />
                <stop offset="0.0931" style={{stopColor:"#55789A"}} />
                <stop offset="0.125" style={{stopColor:"#567C9A"}} />
                <stop offset="0.2135" style={{stopColor:"#577D9A"}} />
                <stop offset="0.4907" style={{stopColor:"#E5408F"}} />
                <stop offset="0.7506" style={{stopColor:"#F08181"}} />
                <stop offset="1" style={{stopColor:"#FCC87A"}} />
            </linearGradient>
            <linearGradient id={grad2} gradientUnits="userSpaceOnUse" x1="29.4606" y1="190.066" x2="267.2655" y2="190.066">
                <stop offset="0" style={{stopColor:"#442682"}} />
                <stop offset="0.01" style={{stopColor:"#483887"}} />
                <stop offset="0.0223" style={{stopColor:"#4B4B8D"}} />
                <stop offset="0.0362" style={{stopColor:"#4E5B92"}} />
                <stop offset="0.052" style={{stopColor:"#516896"}} />
                <stop offset="0.0704" style={{stopColor:"#537298"}} />
                <stop offset="0.0931" style={{stopColor:"#55789A"}} />
                <stop offset="0.125" style={{stopColor:"#567C9A"}} />
                <stop offset="0.2135" style={{stopColor:"#577D9A"}} />
                <stop offset="0.4907" style={{stopColor:"#E5408F"}} />
                <stop offset="0.7506" style={{stopColor:"#F08181"}} />
                <stop offset="1" style={{stopColor:"#FCC87A"}} />
            </linearGradient>
            <linearGradient id={grad3} gradientUnits="userSpaceOnUse" x1="24.0627" y1="106.2836" x2="261.8857" y2="106.2836">
                <stop offset="0" style={{stopColor:"#442682"}} />
                <stop offset="0.01" style={{stopColor:"#483887"}} />
                <stop offset="0.0223" style={{stopColor:"#4B4B8D"}} />
                <stop offset="0.0362" style={{stopColor:"#4E5B92"}} />
                <stop offset="0.052" style={{stopColor:"#516896"}} />
                <stop offset="0.0704" style={{stopColor:"#537298"}} />
                <stop offset="0.0931" style={{stopColor:"#55789A"}} />
                <stop offset="0.125" style={{stopColor:"#567C9A"}} />
                <stop offset="0.2135" style={{stopColor:"#577D9A"}} />
                <stop offset="0.4907" style={{stopColor:"#E5408F"}} />
                <stop offset="0.7506" style={{stopColor:"#F08181"}} />
                <stop offset="1" style={{stopColor:"#FCC87A"}} />
            </linearGradient>
        </defs>
        <g>
            <path fill={`url(#${grad1})`} d="M298.74,103.26c6.37,5.09,19.86,11.21,30.69,11.21c13.37,0,17.83-5.35,17.83-11.08 c0-8.79-10.06-10.82-21.14-12.99c-10.95-2.16-35.53-5.6-35.53-28.14c0-21.9,19.74-27.76,35.4-27.76s25.34,4.84,34.76,11.97 l-9.8,13.5c-7.64-5.22-16.81-8.91-26.87-8.91c-7,0-15.66,2.16-15.66,9.42c0,8.53,11.84,10.82,21.65,12.86 c11.21,2.29,35.02,4.07,35.02,29.03c0,19.23-14.39,28.52-35.4,28.52c-19.36,0-30.05-6.88-39.86-14.13L298.74,103.26z M367.51,129.11l47.62-93.21h1.78l47.62,93.21h-19.35l-7.26-14.64h-43.93l-7.13,14.64H367.51z M402.65,98.93h26.61l-13.24-28.14 L402.65,98.93z M539.54,113.32v15.79h-67.11V35.9h17.83v77.42H539.54z M618.36,35.9l-44.31,93.21h-1.02L528.84,35.9h19.61 l25.08,54.12l25.08-54.12H618.36z M604.87,129.11l47.62-93.21h1.78l47.62,93.21h-19.35l-7.26-14.64h-43.93l-7.13,14.64H604.87z M640.01,98.93h26.61l-13.24-28.14L640.01,98.93z M761.74,51.69h-26.61v77.42H717.3V51.69h-26.74V35.9h71.18V51.69z M768.62,82.51 c0-26.61,19.1-48.39,48.26-48.39c29.29,0,48.39,21.77,48.39,48.39c0,26.74-19.1,48.39-48.39,48.39 C787.72,130.89,768.62,109.25,768.62,82.51z M786.32,82.51c0,16.94,13.75,31.83,30.56,31.83c16.94,0,30.56-14.9,30.56-31.83 c0-16.81-13.62-31.71-30.56-31.71C800.08,50.8,786.32,65.7,786.32,82.51z M898.76,99.44v29.67h-17.7V35.9h42.28 c18.97,0,32.09,13.24,32.09,32.09c0,14.01-7.64,26.61-19.35,29.8l23.3,31.32h-21.26l-21.65-29.67H898.76z M898.76,83.91h20.37 c15.03,0,18.59-8.15,18.59-16.04c0-9.04-5.48-16.17-18.59-16.17h-20.37V83.91z M990.45,51.69v23.3h45.08v15.79h-45.08v22.54h50.81 v15.79h-68.51V35.9h68.51v15.79H990.45z M336.56,158.93c-16.81,0-30.43,14.39-30.43,31.71c0,17.57,13.62,31.71,30.43,31.71 c12.48,0,20.75-6.62,25.47-14.77l16.68,6.75c-6.88,14.52-22.16,24.58-42.15,24.58c-26.61,0-48.26-20.88-48.26-48.26 c0-27.12,21.65-48.26,48.26-48.26c20.75,0,35.53,11.33,42.15,24.7l-16.68,6.75C357.31,165.42,348.27,158.93,336.56,158.93z M473.96,143.9v93.21h-17.7v-37.18h-46.09v37.18h-17.7V143.9h17.7v40.24h46.09V143.9H473.96z M522.86,237.11h-17.83V143.9h17.83 V237.11z M647.77,143.9v93.21h-17.83V190l-29.16,35.02L571.75,190v47.11h-17.83V143.9h1.15l45.71,53.86l45.84-53.86H647.77z M696.8,237.11h-17.83V143.9h17.83V237.11z M745.57,159.69v23.3h45.08v15.79h-45.08v22.54h50.81v15.79h-68.51V143.9h68.51v15.79 H745.57z M903.34,237.11l-61.38-55.39v55.39h-17.7V143.9h1.91l61.25,56.41V143.9h17.83v93.21H903.34z M999.86,159.69h-26.61v77.42 h-17.83v-77.42h-26.74V143.9h71.18V159.69z M1042.52,237.11h-17.83V143.9h17.83V237.11z" />
            <path fill={`url(#${grad2})`} d="M267.27,135.27 c0,32.48-12.65,63.02-35.62,85.98c-22.97,22.97-53.5,35.62-85.99,35.62c-30.16,0-59.09-11.12-81.46-31.32 c-16.41-14.81-28.34-33.61-34.75-54.37H54.8c14.35,36.49,49.84,61.72,90.87,61.72c49.79,0,91-37.46,96.91-85.68h-34.32v-23.96 h34.32v0h24.11C267.07,127.23,267.27,131.23,267.27,135.27z" />
            <path fill={`url(#${grad3})`} d="M24.65,147.23 c-0.38-3.96-0.58-7.97-0.58-11.96c0-32.48,12.65-63.02,35.62-85.99c22.97-22.97,53.5-35.62,85.99-35.62s63.02,12.65,85.99,35.62 c14.22,14.22,24.48,31.33,30.24,50.02h-25.44c-14.35-36.09-49.63-61.67-90.78-61.67c-49.77,0-90.97,37.44-96.9,85.64h34.48 c5.63-29.37,31.51-51.63,62.5-51.63c30.98,0,56.86,22.26,62.5,51.63h-24.68c-5.1-16.03-20.12-27.67-37.81-27.67 c-21.88,0-39.67,17.8-39.67,39.67c0,21.87,17.8,39.67,39.67,39.67c17.7,0,32.74-11.66,37.83-27.71h24.68 c-5.61,29.39-31.51,51.67-62.51,51.67c-31,0-56.9-22.28-62.51-51.67H24.65z" />
        </g>
        </svg>
    );
};


export const IconSearch: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

export const IconDrive: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
    </svg>
);


export const IconCalendar: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
);

export const IconUser: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
    </svg>
);

export const IconReferrer: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="8.5" cy="7" r="4"/>
        <polyline points="17 11 19 13 23 9"/>
    </svg>
);

export const IconMail: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8"/>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
      <path d="M19 16v6"/>
      <path d="m22 19-3-3-3 3"/>
    </svg>
);


export const IconPencil: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
    </svg>
);

export const IconTrash: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
);

export const IconSort: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="m21 8-4-4-4 4"/><path d="M17 4v16"/>
    </svg>
);

export const IconFilter: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
    </svg>
);

export const IconMoon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
);

export const IconSun: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
);

export const IconChevronLeft: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
);

export const IconChevronRight: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
);

export const IconChevronUp: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polyline points="18 15 12 9 6 15"></polyline>
    </svg>
);

export const IconPlus: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

export const IconX: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

export const IconSparkles: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 3L9.27 9.27L3 12l6.27 2.73L12 21l2.73-6.27L21 12l-6.27-2.73L12 3z" />
        <path d="M4.5 4.5L6 6" />
        <path d="M18 6l1.5-1.5" />
        <path d="M6 18l-1.5 1.5" />
        <path d="M19.5 19.5L18 18" />
    </svg>
);

export const IconKey: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
    </svg>
);

export const IconLogout: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
);

export const IconInfo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
);

export const IconLock: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
);

export const IconTools: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
    </svg>
);

export const IconPhotoshop: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M21 4H3C2.44772 4 2 4.44772 2 5V19C2 19.5523 2.44772 20 3 20H21C21.5523 20 22 19.5523 22 19V5C22 4.44772 21.5523 4 21 4Z" fill="#31A8FF"/>
        <path d="M10 8H7.5V16H10C12.2091 16 14 14.2091 14 12V12C14 9.79086 12.2091 8 10 8Z" fill="#001E36"/>
        <path d="M16.5 8C15.6716 8 15 8.67157 15 9.5V11H18V9.5C18 8.67157 17.3284 8 16.5 8Z" fill="#001E36"/>
    </svg>
);

export const IconIllustrator: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M3 4H21C21.5523 4 22 4.44772 22 5V19C22 19.5523 21.5523 20 21 20H3C2.44772 20 2 19.5523 2 19V5C2 4.44772 2.44772 4 3 4Z" fill="#FF7C00"/>
        <path d="M8.5 8L6 16H8L8.5 14.5H11.5L12 16H14L11.5 8H8.5ZM10 10.108L10.97 13H9.03L10 10.108Z" fill="#2A0000"/>
        <path d="M15 8H17V16H15V8Z" fill="#2A0000"/>
    </svg>
);

export const IconInDesign: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M21 4H3C2.44772 4 2 4.44772 2 5V19C2 19.5523 2.44772 20 3 20H21C21.5523 20 22 19.5523 22 19V5C22 4.44772 21.5523 4 21 4Z" fill="#FF3366"/>
        <path d="M8 8H10V16H8V8Z" fill="#290000"/>
        <path d="M12.5 8H15C16.6569 8 18 9.34315 18 11V13C18 14.6569 16.6569 16 15 16H12.5V8ZM14.5 10H14.25V14H14.5C15.6046 14 16.5 13.1046 16.5 12V12C16.5 10.8954 15.6046 10 14.5 10Z" fill="#290000"/>
    </svg>
);

export const IconCanva: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <defs>
            <linearGradient id="canva-gradient" x1="2" y1="12" x2="22" y2="12" gradientUnits="userSpaceOnUse">
            <stop stopColor="#00C4CC"/>
            <stop offset="1" stopColor="#A239F4"/>
            </linearGradient>
        </defs>
        <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" fill="url(#canva-gradient)"/>
        <path d="M14.6655 7.91797C15.4519 7.91797 16.0918 8.55786 16.0918 9.34424C16.0918 10.1306 15.4519 10.7705 14.6655 10.7705C13.8791 10.7705 13.2393 10.1306 13.2393 9.34424C13.2393 8.55786 13.8791 7.91797 14.6655 7.91797Z" fill="white"/>
        <path d="M9.34473 7.91797C10.1311 7.91797 10.771 8.55786 10.771 9.34424C10.771 10.1306 10.1311 10.7705 9.34473 10.7705C8.55835 10.7705 7.91846 10.1306 7.91846 9.34424C7.91846 8.55786 8.55835 7.91797 9.34473 7.91797Z" fill="white"/>
        <path d="M9.34473 13.2383C10.1311 13.2383 10.771 13.8782 10.771 14.6646C10.771 15.4509 10.1311 16.0908 9.34473 16.0908C8.55835 16.0908 7.91846 15.4509 7.91846 14.6646C7.91846 13.8782 8.55835 13.2383 9.34473 13.2383Z" fill="white"/>
    </svg>
);

export const IconEuro: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M4 10h12"/>
        <path d="M4 14h12"/>
        <path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2.2 0 4.2-1 5.5-2.5"/>
    </svg>
);

export const IconChartBar: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20V16"/>
    </svg>
);

export const IconArrowLeft: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
);

export const IconTrendingUp: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
        <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
);

export const IconBriefcase: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
    </svg>
);

export const IconUsers: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
);