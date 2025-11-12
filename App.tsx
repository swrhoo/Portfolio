import { supabase } from './services/supabaseClient'
import React, { useState, useEffect, useMemo, useRef, useCallback, useLayoutEffect } from 'react';
import { type Project } from './types';
import { 
    LogoIcon, IconSearch, IconDrive, IconCalendar, IconUser, IconMail, 
    IconPencil, IconTrash, IconSort, IconFilter, IconMoon, 
    IconChevronLeft, IconChevronRight, IconSun, IconChevronUp, IconPlus, IconX, IconSparkles, IconKey, IconLogout, IconInfo, IconLock,
    IconTools, IconPhotoshop, IconIllustrator, IconInDesign, IconCanva, IconEuro, IconChartBar, IconArrowLeft, IconTrendingUp, IconBriefcase, IconUsers, IconReferrer
} from './components/icons';
import { Spinner } from './components/Spinner';
import { generateDescription } from './services/geminiService';
import { 
    Chart, 
    ArcElement, 
    BarElement, 
    CategoryScale, 
    LinearScale, 
    Title, 
    Tooltip, 
    Legend, 
    DoughnutController,
    BarController
} from 'chart.js';

// Register Chart.js components to make them available for use
Chart.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  DoughnutController,
  BarController
);


// --- Helper Hook for closing dropdowns ---
const useClickOutside = (refs: React.RefObject<HTMLDivElement>[], callback: () => void) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        const isInsideAny = refs.some(
            (ref) => ref.current && ref.current.contains(event.target as Node)
        );
      if (!isInsideAny) {
        callback();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refs, callback]);
};

const categoryColors: { [key: string]: string } = {
  'Brand Identity': 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/50 dark:text-orange-300 dark:border-orange-800/60',
  'Packaging': 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-800/60',
  'Logo': 'bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-900/50 dark:text-sky-300 dark:border-sky-800/60',
  'Locandine': 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/50 dark:text-rose-300 dark:border-rose-800/60',
  'Grafica Web': 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/50 dark:text-teal-300 dark:border-teal-800/60',
  'Kids Party': 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-800/60',
  'Brochure': 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300 dark:border-indigo-800/60',
  'Biglietti da Visita': 'bg-stone-100 text-stone-800 border-stone-200 dark:bg-stone-700/50 dark:text-stone-300 dark:border-stone-600/60',
  'Inviti': 'bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/50 dark:text-pink-300 dark:border-pink-800/60',
  'Menu': 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-800/60',
  'Mockup': 'bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/50 dark:text-cyan-300 dark:border-cyan-800/60',
  'Altro': 'bg-gray-200 text-gray-800 border-gray-300 dark:bg-gray-700/60 dark:text-gray-300 dark:border-gray-600/60',
};
const MASTER_CATEGORIES = Object.keys(categoryColors).filter(c => c !== 'Altro');


const getCategoryClass = (category: string) => categoryColors[category] || categoryColors['Altro'];

const categoryGlowColors: { [key: string]: string } = {
  'Brand Identity': '249, 115, 22',       // orange-500
  'Packaging': '168, 85, 247',            // purple-500
  'Logo': '56, 189, 248',                 // sky-400
  'Locandine': '244, 63, 94',              // rose-500
  'Grafica Web': '45, 212, 191',          // teal-400
  'Kids Party': '250, 204, 21',           // yellow-400
  'Brochure': '99, 102, 241',  // indigo-500
  'Biglietti da Visita': '115, 115, 115', // stone-500
  'Inviti': '236, 72, 153',               // pink-500
  'Menu': '251, 191, 36',                 // amber-500
  'Mockup': '34, 211, 238',// cyan-400
  'Altro': '107, 114, 128',                // gray-500
};

const getGlowColor = (category: string) => categoryGlowColors[category] || categoryGlowColors['Altro'];


// --- Components ---

const categoryFilterColors: { [key: string]: { border: string; active: string; } } = {
    'Brand Identity':       { border: 'border-orange-200 dark:border-orange-800/60', active: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300' },
    'Packaging':            { border: 'border-purple-200 dark:border-purple-800/60', active: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300' },
    'Logo':                 { border: 'border-sky-200 dark:border-sky-800/60',    active: 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300' },
    'Locandine':            { border: 'border-rose-200 dark:border-rose-800/60',   active: 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300' },
    'Grafica Web':          { border: 'border-teal-200 dark:border-teal-800/60',   active: 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300' },
    'Kids Party':           { border: 'border-yellow-200 dark:border-yellow-800/60', active: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' },
    'Brochure':             { border: 'border-indigo-200 dark:border-indigo-800/60', active: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300' },
    'Biglietti da Visita':  { border: 'border-stone-200 dark:border-stone-600/60', active: 'bg-stone-100 text-stone-800 dark:bg-stone-700/50 dark:text-stone-300' },
    'Inviti':               { border: 'border-pink-200 dark:border-pink-800/60',   active: 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300' },
    'Menu':                 { border: 'border-amber-200 dark:border-amber-800/60', active: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300' },
    'Mockup':               { border: 'border-cyan-200 dark:border-cyan-800/60',   active: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300' },
    'Altro':                { border: 'border-gray-300 dark:border-gray-600/60',   active: 'bg-gray-200 text-gray-800 dark:bg-gray-700/60 dark:text-gray-300' },
};


const ResponsiveDriveButton: React.FC<{ href: string }> = ({ href }) => {
    const [level, setLevel] = useState(0); // 0: full, 1: short, 2: icon
    const buttonRef = useRef<HTMLAnchorElement>(null);
    
    const labels = useMemo(() => ['Apri in Drive', 'Drive', ''], []);

    const checkWidth = useCallback(() => {
        const button = buttonRef.current;
        if (!button) return;

        const availableWidth = button.clientWidth;
        
        const clone = button.cloneNode(true) as HTMLElement;
        const icon = clone.querySelector('svg');
        let span = clone.querySelector('span');
        
        if (!span) {
            span = document.createElement('span');
            if (icon) icon.after(span); else clone.appendChild(span);
        }
        
        clone.style.position = 'absolute';
        clone.style.top = '-9999px';
        clone.style.left = '-9999px';
        clone.style.width = 'auto';
        clone.style.whiteSpace = 'nowrap';
        document.body.appendChild(clone);
        
        span.textContent = labels[0];
        const fullWidth = clone.scrollWidth;

        span.textContent = labels[1];
        const shortWidth = clone.scrollWidth;

        document.body.removeChild(clone);
        
        let newLevel = 2; // Default to icon only
        if (availableWidth >= fullWidth) {
            newLevel = 0;
        } else if (availableWidth >= shortWidth) {
            newLevel = 1;
        }

        setLevel(prevLevel => prevLevel !== newLevel ? newLevel : prevLevel);

    }, [labels]);

    useLayoutEffect(() => {
        const button = buttonRef.current;
        if (!button) return;
        
        const container = button.parentElement;
        if (!container) return;

        const observer = new ResizeObserver(() => {
            window.requestAnimationFrame(checkWidth);
        });
        
        observer.observe(container);
        checkWidth();

        return () => {
            observer.unobserve(container);
        }
    }, [checkWidth]);

    const currentLabel = labels[level];

    return (
         <a ref={buttonRef} href={href} target="_blank" rel="noopener noreferrer" className={`flex-grow flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-gray-100 dark:bg-dark-ui font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-dark-ui-hover transition-colors text-xs sm:text-sm overflow-hidden light-theme-text-primary dark:text-gray-200`}>
            <IconDrive className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            {currentLabel && <span className="whitespace-nowrap">{currentLabel}</span>}
        </a>
    );
};


const ProjectCard: React.FC<{ project: Project; onDelete: (id: string) => void; onEdit: (id: string) => void; onImageClick: (project: Project) => void; onClientClick: (client: string) => void; onAccountClick: (account: string) => void; onYearClick: (year: number) => void; onReferrerClick: (referrer: string) => void; isVisible: boolean; isAuthenticated: boolean; }> = ({ project, onDelete, onEdit, onImageClick, onClientClick, onAccountClick, onYearClick, onReferrerClick, isVisible, isAuthenticated }) => {
    const glowStyle = { '--glow-color': getGlowColor(project.categoria) } as React.CSSProperties;
    const projectYear = new Date(project.data).getFullYear();
    const accountName = project.accountDrive.split('@')[0];
    
    return (
        <div style={glowStyle} className={`project-card bg-white rounded-lg shadow-sm overflow-hidden group transition-all duration-300 ease-in-out hover:-translate-y-1 flex flex-col ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div 
              className={`relative aspect-[4/3] overflow-hidden ${isAuthenticated ? 'cursor-pointer' : 'cursor-default'}`} 
              onClick={isAuthenticated ? () => onImageClick(project) : undefined}
            >
                <img src={project.immagine} alt={project.nome} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" referrerPolicy="no-referrer" />
                 {isAuthenticated && project.visibilita === 'Privato' && (
                    <div className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full z-10 backdrop-blur-sm" title="Progetto Privato">
                        <IconLock className="w-3 h-3 text-red-500" />
                    </div>
                )}
            </div>
            <div className="px-3 pt-2 pb-2 sm:px-5 sm:pt-3 sm:pb-3 flex flex-col flex-grow">
                <h3 className="font-bold text-[13px] sm:text-base tracking-normal sm:tracking-wide uppercase mb-2 truncate light-theme-text-primary">{project.nome}</h3>
                <div className="mb-3 sm:mb-4">
                    <div className="flex justify-between items-center gap-2">
                        <span className={`text-[13px] font-semibold px-3 py-1 rounded-full border ${getCategoryClass(project.categoria)}`}>
                            {project.categoria}
                        </span>
                        {project.linkBehance && (
                            <a 
                                href={project.linkBehance} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                aria-label="Vedi progetto su Behance"
                                className="behance-link font-bold text-lg tracking-wider transition-opacity hover:opacity-75 light-theme-text-primary"
                            >
                                Bē
                            </a>
                        )}
                    </div>
                </div>
                <div className="card-details space-y-2 sm:space-y-1.5 text-xs sm:text-[15px] flex-grow light-theme-text-secondary">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <IconCalendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                        <button 
                          onClick={() => onYearClick(projectYear)}
                          className="card-detail-link text-left truncate leading-snug transition-colors dark:hover:text-white"
                        >
                          {projectYear}
                        </button>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <IconUser className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                        <button 
                          onClick={() => onClientClick(project.cliente)}
                          className="card-detail-link text-left truncate leading-snug transition-colors dark:hover:text-white"
                        >
                            {project.cliente}
                        </button>
                    </div>
                     {isAuthenticated && project.commissionatoDa && (
                        <div className="flex items-center gap-2 sm:gap-3">
                            <IconReferrer className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                            <button 
                                onClick={() => onReferrerClick(project.commissionatoDa!)}
                                className="card-detail-link text-left truncate leading-snug transition-colors dark:hover:text-white"
                            >
                                {project.commissionatoDa}
                            </button>
                        </div>
                    )}
                    
                    {!isAuthenticated && (
                         <div className="flex items-center gap-2 sm:gap-3">
                            <IconInfo className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                            <button 
                              onClick={() => onImageClick(project)}
                              className="card-detail-link text-left truncate leading-snug transition-colors dark:hover:text-white"
                            >
                              Info progetto
                            </button>
                        </div>
                    )}

                    {isAuthenticated && (
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                            <IconMail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                             <button 
                              onClick={() => onAccountClick(project.accountDrive)}
                              className="card-detail-link text-left truncate leading-snug transition-colors dark:hover:text-white"
                              title={project.accountDrive}
                            >
                              {accountName}
                            </button>
                        </div>
                    )}
                </div>
                {isAuthenticated && (
                    <div className="card-actions flex items-center gap-2 mt-2 sm:mt-3">
                        <ResponsiveDriveButton href={project.linkDrive} />
                        <button onClick={() => onEdit(project.id)} aria-label="Modifica progetto" className="p-2 sm:p-2.5 bg-gray-100 dark:bg-dark-ui rounded-lg hover:bg-gray-200 dark:hover:bg-dark-ui-hover transition-colors light-theme-text-secondary dark:text-gray-300">
                            <IconPencil className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <button onClick={() => onDelete(project.id)} aria-label="Elimina progetto" className="p-2 sm:p-2.5 bg-gray-100 dark:bg-dark-ui rounded-lg hover:bg-gray-200 dark:hover:bg-dark-ui-hover transition-colors light-theme-text-secondary dark:text-gray-300 card-action-delete-hover">
                            <IconTrash className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const CategoryFilter: React.FC<{ categories: string[]; activeCategory: string; onSelectCategory: (category: string) => void; }> = ({ categories, activeCategory, onSelectCategory }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeftStart = useRef(0);

    const scroll = (direction: 'left' | 'right') => {
        scrollContainerRef.current?.scrollBy({
            left: direction === 'left' ? -250 : 250,
            behavior: 'smooth'
        });
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        const el = scrollContainerRef.current;
        if (!el) return;
        isDragging.current = true;
        startX.current = e.pageX - el.offsetLeft;
        scrollLeftStart.current = el.scrollLeft;
        el.style.cursor = 'grabbing';
    };

    const handleMouseUpAndLeave = () => {
        const el = scrollContainerRef.current;
        if (el) el.style.cursor = 'grab';
        isDragging.current = false;
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current) return;
        e.preventDefault();
        const el = scrollContainerRef.current;
        if (!el) return;
        const x = e.pageX - el.offsetLeft;
        const walk = (x - startX.current) * 1.5; // scroll-fast multiplier
        el.scrollLeft = scrollLeftStart.current - walk;
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        const el = scrollContainerRef.current;
        if (!el) return;
        isDragging.current = true;
        startX.current = e.touches[0].pageX - el.offsetLeft;
        scrollLeftStart.current = el.scrollLeft;
    };

    const handleTouchEnd = () => {
        isDragging.current = false;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging.current) return;
        const el = scrollContainerRef.current;
        if (!el) return;
        const x = e.touches[0].pageX - el.offsetLeft;
        const walk = (x - startX.current) * 1.5;
        el.scrollLeft = scrollLeftStart.current - walk;
    };

    const buttonSizeClasses = 'px-4 py-2 text-sm';
    
    return (
        <div className="inline-flex items-center justify-center gap-4 max-w-full">
            <button onClick={() => scroll('left')} className="category-scroll-btn p-1.5 rounded-full bg-white dark:bg-dark-ui shadow-md border border-gray-200 dark:border-dark-border text-gray-600 dark:text-gray-300 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-dark-ui-hover flex-shrink-0 hidden sm:flex" aria-label="Scorri categorie a sinistra">
                <IconChevronLeft className="w-5 h-5"/>
            </button>
            <div 
                ref={scrollContainerRef} 
                className="category-tabs flex-1 min-w-0 flex items-center gap-2 overflow-x-auto scrollbar-hide select-none"
                style={{ cursor: 'grab' }}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUpAndLeave}
                onMouseLeave={handleMouseUpAndLeave}
                onMouseMove={handleMouseMove}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onTouchMove={handleTouchMove}
            >
                {['Tutti', ...categories].map((cat) => {
                    const isActive = activeCategory === cat;

                    if (cat === 'Tutti') {
                        return (
                            <button
                                key={cat}
                                onClick={() => onSelectCategory(cat)}
                                className={`${buttonSizeClasses} font-medium rounded-full transition-all duration-200 whitespace-nowrap border ${
                                    isActive
                                        ? 'bg-slate-800 text-white dark:bg-slate-700 dark:text-gray-100 border-transparent shadow-md category-active'
                                        : 'bg-white dark:bg-dark-ui dark:text-gray-200 border-gray-200 dark:border-dark-border hover:bg-gray-100 dark:hover:bg-dark-ui-hover light-theme-text-secondary'
                                }`}
                            >
                                {cat}
                            </button>
                        );
                    }

                    const colors = categoryFilterColors[cat] || categoryFilterColors['Altro'];
                    const activeClasses = `${colors.active} shadow-md category-active`;
                    const inactiveClasses = `bg-white dark:bg-dark-ui dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-ui-hover light-theme-text-secondary`;

                    return (
                        <button
                            key={cat}
                            onClick={() => onSelectCategory(cat)}
                            className={`${buttonSizeClasses} font-medium rounded-full transition-all duration-200 whitespace-nowrap border ${colors.border} ${
                                isActive ? activeClasses : inactiveClasses
                            }`}
                        >
                            {cat}
                        </button>
                    );
                })}
            </div>
            <button onClick={() => scroll('right')} className="category-scroll-btn p-1.5 rounded-full bg-white dark:bg-dark-ui shadow-md border border-gray-200 dark:border-dark-border text-gray-600 dark:text-gray-300 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-dark-ui-hover flex-shrink-0 hidden sm:flex" aria-label="Scorri categorie a destra">
                <IconChevronRight className="w-5 h-5"/>
            </button>
        </div>
    );
};

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2 id="modal-title" className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">{title}</h2>
                <p className="mb-6 text-gray-800 dark:text-gray-300">{message}</p>
                <div className="flex justify-end gap-4">
                    <button 
                        onClick={onClose} 
                        className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Annulla
                    </button>
                    <button 
                        onClick={onConfirm} 
                        className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Elimina
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- Add/Edit Project Modal ---
type ProjectFormData = {
    nome: string;
    annoCreazione: string;
    categoria: string;
    cliente: string;
    commissionatoDa: string;
    tag: string;
    accountDrive: string;
    linkDrive: string;
    immagine: string;
    linkBehance: string;
    descrizione: string;
    visibilita: 'Pubblico' | 'Privato';
    software: string[];
    costo: string;
};

interface ProjectFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (project: Omit<Project, 'id'>, id?: string) => void;
    categories: string[];
    projectToEdit: Project | null;
}

const availableSoftware = [
    { name: 'Photoshop', icon: IconPhotoshop },
    { name: 'Illustrator', icon: IconIllustrator },
    { name: 'InDesign', icon: IconInDesign },
    { name: 'Canva', icon: IconCanva }
];

const ProjectFormModal: React.FC<ProjectFormModalProps> = ({ isOpen, onClose, onSubmit, categories, projectToEdit }) => {
    const initialFormState: ProjectFormData = {
        nome: '',
        annoCreazione: new Date().getFullYear().toString(),
        categoria: '',
        cliente: '',
        commissionatoDa: '',
        tag: '',
        accountDrive: '',
        linkDrive: '',
        immagine: '',
        linkBehance: '',
        descrizione: '',
        visibilita: 'Pubblico',
        software: [],
        costo: '',
    };
    
    const [formData, setFormData] = useState<ProjectFormData>(initialFormState);
    const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
    const isEditing = !!projectToEdit;

    useEffect(() => {
        if (isOpen) {
            if (projectToEdit) {
                 setFormData({
                    nome: projectToEdit.nome,
                    annoCreazione: new Date(projectToEdit.data).getFullYear().toString(),
                    categoria: projectToEdit.categoria,
                    cliente: projectToEdit.cliente === 'Personal' ? '' : projectToEdit.cliente,
                    commissionatoDa: projectToEdit.commissionatoDa || '',
                    tag: projectToEdit.tag ? projectToEdit.tag.join(', ') : '',
                    accountDrive: projectToEdit.accountDrive,
                    linkDrive: projectToEdit.linkDrive,
                    immagine: projectToEdit.immagine,
                    linkBehance: projectToEdit.linkBehance || '',
                    descrizione: projectToEdit.descrizione || '',
                    visibilita: projectToEdit.visibilita || 'Pubblico',
                    software: projectToEdit.software || [],
                    costo: projectToEdit.costo ? projectToEdit.costo.toFixed(2).replace('.', ',') : '',
                });
            } else {
                setFormData(initialFormState);
            }
        }
    }, [isOpen, projectToEdit]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

     const handleSoftwareChange = (softwareName: string) => {
        setFormData(prev => {
            const currentSoftware = prev.software || [];
            const newSoftware = currentSoftware.includes(softwareName)
                ? currentSoftware.filter(s => s !== softwareName)
                : [...currentSoftware, softwareName];
            return { ...prev, software: newSoftware };
        });
    };
    
    const handleGenerateDescription = async () => {
        if (!formData.nome || !formData.categoria) {
            alert('Per favore, inserisci almeno il Nome e la Categoria del progetto per generare una descrizione.');
            return;
        }
        setIsGeneratingDescription(true);
        try {
            const description = await generateDescription({
                nome: formData.nome,
                categoria: formData.categoria,
                cliente: formData.cliente,
                tag: formData.tag,
                commissionatoDa: formData.commissionatoDa,
            });
            setFormData(prev => ({ ...prev, descrizione: description }));
        } catch (error) {
            alert(error instanceof Error ? error.message : "Si è verificato un errore sconosciuto.");
        } finally {
            setIsGeneratingDescription(false);
        }
    };
    
    const handleImageLinkBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        let url = e.target.value.trim();
        if (!url) return;

        // Regex to find Google Drive file ID from various URL formats
        const driveRegex = /drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)([a-zA-Z0-9_-]+)/;
        const match = url.match(driveRegex);

        let fileId: string | null = null;

        if (match && match[1]) {
            fileId = match[1];
        } else if (!url.startsWith('http') && !url.includes('/') && url.length > 20) {
            // Heuristic for raw file IDs: not a URL, no slashes.
            fileId = url;
        }

        if (fileId) {
            // Use the more reliable direct content link format from googleusercontent
            const directLink = `https://lh3.googleusercontent.com/d/${fileId}`;
            
            // Only update if the URL has changed
            if (directLink !== url) {
                setFormData(prev => ({ ...prev, immagine: directLink }));
            }
        }
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const requiredFields: (keyof ProjectFormData)[] = ['nome', 'annoCreazione', 'categoria', 'accountDrive', 'linkDrive', 'visibilita', 'immagine'];
        const isFormValid = requiredFields.every(field => formData[field] && String(formData[field]).trim() !== '');

        if (isFormValid) {
            const costValue = formData.costo ? parseFloat(formData.costo.replace(',', '.')) : undefined;

            const projectData: Omit<Project, 'id'> = {
                nome: formData.nome,
                data: `${formData.annoCreazione}-01-01T00:00:00.000Z`,
                categoria: formData.categoria,
                tag: formData.tag.split(',').map(t => t.trim()).filter(Boolean),
                cliente: formData.cliente || 'Personal',
                commissionatoDa: formData.commissionatoDa || undefined,
                accountDrive: formData.accountDrive,
                linkDrive: formData.linkDrive,
                immagine: formData.immagine,
                linkBehance: formData.linkBehance,
                descrizione: formData.descrizione,
                visibilita: formData.visibilita,
                software: formData.software,
                costo: costValue && !isNaN(costValue) ? costValue : undefined,
            };
            onSubmit(projectData, projectToEdit?.id);
        } else {
            alert('Per favore, compila tutti i campi obbligatori (*).');
        }
    };
    
    return (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="modal-content">
                <form onSubmit={handleSubmit} noValidate>
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h2 id="modal-title" className="text-2xl font-bold text-slate-900 dark:text-gray-100">
                                {isEditing ? 'Modifica Progetto' : 'Aggiungi Nuovo Progetto'}
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {isEditing ? 'Aggiorna i dettagli del progetto grafico.' : 'Inserisci i dettagli del progetto grafico da aggiungere al portfolio'}
                            </p>
                        </div>
                        <button type="button" onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-dark-ui transition-colors">
                            <IconX className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        </button>
                    </div>
                    
                    <div className="space-y-5 mt-6">
                        <div>
                            <label htmlFor="nome" className="form-label">Nome Progetto <span>*</span></label>
                            <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} placeholder="Es. LOGO AZIENDA TECH" className="form-input" required />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="annoCreazione" className="form-label">Anno Creazione <span>*</span></label>
                                <input type="number" id="annoCreazione" name="annoCreazione" value={formData.annoCreazione} onChange={handleChange} placeholder="2025" className="form-input" required />
                            </div>
                            <div>
                                <label htmlFor="categoria" className="form-label">Categoria <span>*</span></label>
                                <select id="categoria" name="categoria" value={formData.categoria} onChange={handleChange} className="form-select" required>
                                    <option value="" disabled>Seleziona categoria</option>
                                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="cliente" className="form-label">Destinatario (Cliente)</label>
                                <input type="text" id="cliente" name="cliente" value={formData.cliente} onChange={handleChange} placeholder="Nome cliente (o 'Personal')" className="form-input" />
                            </div>
                            <div>
                                <label htmlFor="commissionatoDa" className="form-label">Commissionato da (Referente)</label>
                                <input type="text" id="commissionatoDa" name="commissionatoDa" value={formData.commissionatoDa} onChange={handleChange} placeholder="Es. Giovanni Rossi" className="form-input" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <div>
                                <label htmlFor="visibilita" className="form-label">Tipologia Progetto <span>*</span></label>
                                <select id="visibilita" name="visibilita" value={formData.visibilita} onChange={handleChange} className="form-select" required>
                                    <option value="Pubblico">Pubblico (Visibile a tutti)</option>
                                    <option value="Privato">Privato (Visibile solo a te)</option>
                                </select>
                            </div>
                             <div>
                                <label htmlFor="tag" className="form-label">Tag (separati da virgola)</label>
                                <input type="text" id="tag" name="tag" value={formData.tag} onChange={handleChange} placeholder="branding, design, logo" className="form-input" />
                            </div>
                        </div>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <div>
                                <label htmlFor="costo" className="form-label">Costo Progetto (€)</label>
                                <input 
                                    type="text" 
                                    id="costo" 
                                    name="costo" 
                                    value={formData.costo} 
                                    onChange={handleChange} 
                                    placeholder="Es. 50,00" 
                                    className="form-input" 
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="form-label">Software Utilizzati</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                                {availableSoftware.map(software => (
                                    <label key={software.name} className={`flex flex-col items-center justify-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${formData.software.includes(software.name) ? 'bg-blue-50 dark:bg-blue-900/40 border-blue-500 dark:border-blue-700 ring-2 ring-blue-500/50' : 'bg-white dark:bg-dark-ui border-gray-300 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-ui-hover'}`}>
                                        <input
                                            type="checkbox"
                                            checked={formData.software.includes(software.name)}
                                            onChange={() => handleSoftwareChange(software.name)}
                                            className="hidden"
                                        />
                                        <software.icon className="w-8 h-8 mb-1.5" />
                                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{software.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                             <div className="flex justify-between items-center mb-2">
                                <label htmlFor="descrizione" className="form-label m-0">Descrizione Progetto</label>
                                <button 
                                    type="button" 
                                    onClick={handleGenerateDescription}
                                    disabled={isGeneratingDescription}
                                    className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    aria-label="Genera descrizione con AI"
                                >
                                    {isGeneratingDescription ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            In corso...
                                        </>
                                    ) : (
                                        <>
                                            <IconSparkles className="w-4 h-4" />
                                            Genera con AI
                                        </>
                                    )}
                                </button>
                            </div>
                            <textarea id="descrizione" name="descrizione" value={formData.descrizione} onChange={handleChange} placeholder="Descrivi brevemente il progetto, gli obiettivi e il risultato..." rows={4} className="form-input" />
                        </div>

                        <div>
                            <label htmlFor="accountDrive" className="form-label">Account Google Drive <span>*</span></label>
                            <input type="email" id="accountDrive" name="accountDrive" value={formData.accountDrive} onChange={handleChange} placeholder="account@gmail.com" className="form-input" required />
                        </div>

                        <div>
                            <label htmlFor="linkDrive" className="form-label">Link Cartella Drive <span>*</span></label>
                            <input type="url" id="linkDrive" name="linkDrive" value={formData.linkDrive} onChange={handleChange} placeholder="https://drive.google.com/drive/folders/..." className="form-input" required />
                        </div>

                        <div>
                           <label htmlFor="immagine" className="form-label">Link Immagine Anteprima <span>*</span></label>
                            <input 
                                type="text"
                                id="immagine" 
                                name="immagine" 
                                value={formData.immagine} 
                                onChange={handleChange}
                                onBlur={handleImageLinkBlur}
                                placeholder="Incolla URL o ID Google Drive..."
                                className="form-input" 
                                required 
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                                Se inserisci un link o ID di Google Drive, verrà convertito automaticamente.
                            </p>
                        </div>

                        <div>
                            <label htmlFor="linkBehance" className="form-label">Link Behance</label>
                            <input type="url" id="linkBehance" name="linkBehance" value={formData.linkBehance} onChange={handleChange} placeholder="https://www.behance.net/gallery/..." className="form-input" />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-8">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 bg-transparent text-gray-800 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-dark-ui-hover transition-colors">
                            Annulla
                        </button>
                        <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-dark-bg">
                            {isEditing ? 'Salva Modifiche' : 'Aggiungi Progetto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Scroll to Top Button ---
const ScrollToTopButton: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = useCallback(() => {
        if (window.scrollY > 500) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility, { passive: true });
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, [toggleVisibility]);

    return (
        <button
            type="button"
            onClick={scrollToTop}
            className={`utility-button dark:bg-dark-bg dark:border-2 dark:border-dark-border p-2.5 rounded-full shadow-md transition-all duration-300 ease-in-out border ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
            aria-label="Torna in cima"
        >
            <IconChevronUp className="w-5 h-5" />
        </button>
    );
};

// --- Project Preview Modal ---
interface ProjectPreviewModalProps {
    project: Project | null;
    onClose: () => void;
    isAuthenticated: boolean;
}

const SoftwareIcon: React.FC<{ name: string; className?: string, title?: string }> = ({ name, ...props }) => {
  switch (name) {
    case 'Photoshop': return <IconPhotoshop {...props} />;
    case 'Illustrator': return <IconIllustrator {...props} />;
    case 'InDesign': return <IconInDesign {...props} />;
    case 'Canva': return <IconCanva {...props} />;
    default: return null;
  }
};


const ProjectPreviewModal: React.FC<ProjectPreviewModalProps> = ({ project, onClose, isAuthenticated }) => {
    if (!project) return null;

    return (
        <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-[110] backdrop-blur-sm p-4 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div 
                className="rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col lg:flex-row animate-scale-in overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                <div className="w-full lg:w-3/5 xl:w-2/3 flex-shrink-0 bg-white">
                     <img
                        src={project.immagine}
                        alt={`Anteprima per ${project.nome}`}
                        className="w-full h-64 lg:h-full object-cover"
                        referrerPolicy="no-referrer"
                    />
                </div>
                <div className="w-full lg:w-2/5 xl:w-1/3 p-6 lg:p-8 flex flex-col overflow-y-auto bg-white">
                    <div className="flex justify-between items-start mb-4">
                        <span className={`text-sm font-semibold px-3 py-1 rounded-full border ${getCategoryClass(project.categoria)}`}>
                            {project.categoria}
                        </span>
                         <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-200 transition-colors">
                            <IconX className="w-5 h-5 text-gray-500 dark:text-gray-500" />
                        </button>
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-gray-900 dark:!text-gray-900">{project.nome}</h2>
                    {project.descrizione && (
                        <p className="mb-6 text-gray-700 dark:!text-gray-700 text-base leading-relaxed">{project.descrizione}</p>
                    )}
                    <div className="mt-auto pt-6 border-t border-gray-200 dark:!border-gray-200 space-y-3 text-sm">
                         <div className="flex items-center gap-3">
                            <IconCalendar className="w-5 h-5 text-gray-500 dark:!text-gray-500 flex-shrink-0" />
                            <span className="text-gray-700 dark:!text-gray-700">{new Date(project.data).getFullYear()}</span>
                        </div>
                         <div className="flex items-center gap-3">
                            <IconUser className="w-5 h-5 text-gray-500 dark:!text-gray-500 flex-shrink-0" />
                            <span className="text-gray-700 dark:!text-gray-700">{project.cliente}</span>
                        </div>
                        {isAuthenticated && project.commissionatoDa && (
                             <div className="flex items-center gap-3">
                                <IconReferrer className="w-5 h-5 text-gray-500 dark:!text-gray-500 flex-shrink-0" />
                                <span className="text-gray-700 dark:!text-gray-700">{project.commissionatoDa}</span>
                            </div>
                        )}
                        {isAuthenticated && typeof project.costo === 'number' && (
                             <div className="flex items-center gap-3">
                                <IconEuro className="w-5 h-5 text-gray-500 dark:!text-gray-500 flex-shrink-0" />
                                <span className="text-gray-700 dark:!text-gray-700 font-medium">
                                    {project.costo.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}
                                </span>
                            </div>
                        )}
                        {project.software && project.software.length > 0 && (
                             <div className="flex items-center gap-3">
                                <IconTools className="w-5 h-5 text-gray-500 dark:!text-gray-500 flex-shrink-0" />
                                <div className="flex flex-wrap items-center gap-2">
                                     {project.software.map(s => <SoftwareIcon key={s} name={s} className="w-6 h-6" title={s} />)}
                                </div>
                            </div>
                        )}
                        {project.linkBehance && (
                             <div className="flex items-center gap-3">
                                <span className="font-bold text-lg leading-none w-5 text-center text-gray-500 dark:!text-gray-500 flex-shrink-0">Bē</span>
                                <a href={project.linkBehance} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline truncate">
                                    Vedi su Behance
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Login Modal ---
interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: (success: boolean) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // IMPORTANT: These credentials are hardcoded for simplicity.
        // This is not a secure method for a real-world, multi-user application.
        if (username === 'admin' && password === 'password') {
            onLogin(true);
        } else {
            setError('Credenziali non valide. Riprova.');
            onLogin(false);
        }
    };
    
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="login-modal-title">
            <div className="modal-content max-w-sm" onClick={e => e.stopPropagation()}>
                 <form onSubmit={handleSubmit}>
                    <div className="flex justify-between items-start mb-2">
                        <div>
                             <h2 id="login-modal-title" className="text-2xl font-bold text-slate-900 dark:text-gray-100">
                                Accesso Privato
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Inserisci le credenziali per modificare i contenuti.
                            </p>
                        </div>
                         <button type="button" onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-dark-ui transition-colors">
                            <IconX className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        </button>
                    </div>

                    <div className="space-y-5 mt-6">
                        <div>
                            <label htmlFor="username" className="form-label">Username</label>
                            <input 
                                type="text" 
                                id="username" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                                className="form-input" 
                                required 
                                autoFocus
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="form-label">Password</label>
                            <input 
                                type="password" 
                                id="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-input" 
                                required 
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                    </div>

                    <div className="flex justify-end gap-4 mt-8">
                         <button type="button" onClick={onClose} className="px-5 py-2.5 bg-transparent text-gray-800 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-dark-ui-hover transition-colors">
                            Annulla
                        </button>
                        <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-dark-bg">
                            Accedi
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const InfiniteScrollLoader: React.FC = () => (
    <div className="inline-flex items-center justify-center gap-3" aria-live="polite" aria-busy="true">
        <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="spinner-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4B4B8D" />
                    <stop offset="50%" stopColor="#E5408F" />
                    <stop offset="100%" stopColor="#FCC87A" />
                </linearGradient>
            </defs>
            <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 9.27455 20.9097 6.80375 19.1414 5" stroke="url(#spinner-gradient)" strokeWidth="4" strokeLinecap="round"/>
        </svg>
        <span className="font-semibold light-theme-text-primary dark:text-slate-200">
            Caricamento...
        </span>
    </div>
);


const BouncingDotsLoader: React.FC = () => (
    <div className="flex items-center justify-center gap-1.5">
        <span className="w-1.5 h-1.5 bg-[#4B4B8D] rounded-full animate-bounce-wave" />
        <span
            className="w-1.isloading-spinner5 h-1.5 bg-[#E5408F] rounded-full animate-bounce-wave"
            style={{ animationDelay: '0.15s' }}
        />
        <span
            className="w-1.5 h-1.5 bg-[#FCC87A] rounded-full animate-bounce-wave"
            style={{ animationDelay: '0.3s' }}
        />
    </div>
);

// --- Analytics Dashboard Component ---
const AnalyticsDashboard: React.FC<{ projects: Project[]; onBack: () => void }> = ({ projects, onBack }) => {
    const [activeModal, setActiveModal] = useState<string | null>(null);

    const kpiData = useMemo(() => {
        const totalProjects = projects.length;
        const totalRevenue = projects.reduce((sum, p) => sum + (p.costo || 0), 0);
        const averageValue = totalProjects > 0 ? totalRevenue / totalProjects : 0;
        const uniqueClients = new Set(projects.filter(p => p.cliente.toLowerCase() !== 'personal').map(p => p.cliente)).size;
        return { totalProjects, totalRevenue, averageValue, uniqueClients };
    }, [projects]);

    const chartData = useMemo(() => {
        const categoryProjectData = projects.reduce((acc, p) => {
            acc[p.categoria] = (acc[p.categoria] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const categoryRevenueData = projects.reduce((acc, p) => {
            if (p.costo) {
                acc[p.categoria] = (acc[p.categoria] || 0) + p.costo;
            }
            return acc;
        }, {} as Record<string, number>);

        const driveData = projects.reduce((acc, p) => {
            acc[p.accountDrive] = (acc[p.accountDrive] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        
        const referrerData = projects.reduce((acc, p) => {
            const referrer = p.commissionatoDa || 'Diretto / Personale';
            acc[referrer] = (acc[referrer] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const sortedCategoryProjects = Object.entries(categoryProjectData).sort((a, b) => Number(b[1]) - Number(a[1]));
        const sortedCategoryRevenue = Object.entries(categoryRevenueData).sort((a, b) => Number(b[1]) - Number(a[1]));
        const sortedDriveData = Object.entries(driveData).sort((a, b) => Number(b[1]) - Number(a[1]));
        const sortedReferrerData = Object.entries(referrerData).sort((a, b) => Number(b[1]) - Number(a[1]));

        return { sortedCategoryProjects, sortedCategoryRevenue, sortedDriveData, sortedReferrerData };
    }, [projects]);

    const recentProjects = useMemo(() => {
        return [...projects]
            .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
            .slice(0, 5);
    }, [projects]);
    
    const KpiCard = ({ icon, title, value, format }: { icon: React.ReactNode, title: string, value: number, format?: (v: number) => string }) => (
        <div className="kpi-card">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 dark:bg-dark-ui rounded-full">
                    {icon}
                </div>
                <div>
                    <p className="text-sm font-medium light-theme-text-secondary dark:text-gray-400">{title}</p>
                    <p className="text-2xl font-bold light-theme-text-primary dark:text-gray-100">{format ? format(value) : value}</p>
                </div>
            </div>
        </div>
    );

    const AnalyticsCard = ({ title, description, icon, preview, onClick }: { title: string, description: string, icon: React.ReactNode, preview: React.ReactNode, onClick: () => void }) => (
        <div className="analytics-card" onClick={onClick}>
            <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-100 dark:bg-dark-ui rounded-full">{icon}</div>
                <div>
                    <h3 className="font-semibold text-lg light-theme-text-primary dark:text-gray-100">{title}</h3>
                    <p className="text-sm light-theme-text-secondary dark:text-gray-400 mt-1">{description}</p>
                </div>
            </div>
            <div className="mt-auto pt-4 flex-grow flex items-end justify-center">{preview}</div>
        </div>
    );
    
    const AnalyticsModal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
        if (!isOpen) return null;

        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content modal-content-lg" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
                        <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-dark-ui transition-colors">
                            <IconX className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        </button>
                    </div>
                    {children}
                </div>
            </div>
        );
    };
    
    const ChartComponent: React.FC<{
        chartId: string;
        type: 'bar' | 'doughnut';
        data: { labels: string[]; datasets: any[] };
        options?: any;
        className?: string;
    }> = ({ chartId, type, data, options = {}, className = '' }) => {
        const canvasRef = useRef<HTMLCanvasElement>(null);
    
        useEffect(() => {
            const canvas = canvasRef.current;
            if (!canvas) return;
    
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
    
            const chartInstance = new Chart(ctx, {
                type,
                data,
                options,
            });
    
            return () => {
                chartInstance.destroy();
            };
        }, [chartId, type, data, options]);
    
        return <div className={className}><canvas ref={canvasRef} id={chartId}></canvas></div>;
    };
    
    const chartColors = Object.values(categoryGlowColors).map(rgb => `rgba(${rgb}, 0.7)`);
    const chartBorderColors = Object.values(categoryGlowColors).map(rgb => `rgb(${rgb})`);

    const modalContent = useMemo(() => {
        const isDarkMode = document.documentElement.classList.contains('dark');
        const tickColor = isDarkMode ? '#9ca3af' : '#4b5563';

        switch (activeModal) {
            case 'projectsByCategory':
                return {
                    title: 'Progetti per Categoria',
                    content: <ChartComponent chartId="modalProjectsPerCategory" type="bar" data={{ labels: chartData.sortedCategoryProjects.map(c => c[0]), datasets: [{ label: 'Numero di Progetti', data: chartData.sortedCategoryProjects.map(c => c[1]), backgroundColor: chartColors, borderColor: chartBorderColors, borderWidth: 1 }] }} options={{ indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { ticks: { color: tickColor } }, y: { ticks: { color: tickColor } } } }} className="h-96" />
                };
            case 'revenueByCategory':
                 return {
                    title: 'Ricavi per Categoria',
                    content: <ChartComponent chartId="modalRevenuePerCategory" type="doughnut" data={{ labels: chartData.sortedCategoryRevenue.map(c => c[0]), datasets: [{ label: 'Fatturato', data: chartData.sortedCategoryRevenue.map(c => c[1]), backgroundColor: chartColors, borderColor: chartBorderColors, borderWidth: 1 }] }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { color: tickColor } } } }} className="h-96 flex justify-center" />
                };
            case 'projectsPerDrive':
                return {
                    title: 'Progetti per Account Drive',
                    content: <ChartComponent chartId="modalProjectsPerDrive" type="bar" data={{ labels: chartData.sortedDriveData.map(d => d[0]), datasets: [{ label: 'Numero di Progetti', data: chartData.sortedDriveData.map(d => d[1]), backgroundColor: '#818cf8', borderColor: '#6366f1', borderWidth: 1 }] }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { ticks: { color: tickColor } }, y: { ticks: { color: tickColor } } } }} className="h-96" />
                };
            case 'projectsByReferrer':
                return {
                    title: 'Origine dei Progetti',
                    content: <ChartComponent chartId="modalProjectsByReferrer" type="doughnut" data={{ labels: chartData.sortedReferrerData.map(d => d[0]), datasets: [{ label: 'Numero di Progetti', data: chartData.sortedReferrerData.map(d => d[1]), backgroundColor: chartColors, borderColor: chartBorderColors, borderWidth: 1 }] }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { color: tickColor } } } }} className="h-96 flex justify-center" />
                };
            case 'recentProjects':
                return {
                    title: 'Ultimi Progetti Aggiunti',
                    content: (
                         <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs uppercase bg-gray-50 dark:bg-dark-ui dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-4 py-3 light-theme-text-secondary">Progetto</th>
                                        <th scope="col" className="px-4 py-3 light-theme-text-secondary">Cliente</th>
                                        <th scope="col" className="px-4 py-3 light-theme-text-secondary">Costo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentProjects.map(p => (
                                         <tr key={p.id} className="border-b dark:border-dark-border">
                                            <th scope="row" className="px-4 py-3 font-medium whitespace-nowrap light-theme-text-primary">{p.nome}</th>
                                            <td className="px-4 py-3 light-theme-text-secondary">{p.cliente}</td>
                                            <td className="px-4 py-3 light-theme-text-secondary">{p.costo ? p.costo.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' }) : 'N/D'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                         </div>
                    )
                };
            default:
                return { title: '', content: null };
        }
    }, [activeModal, chartData, recentProjects, chartColors, chartBorderColors]);


    return (
        <div className="animate-fade-in">
             <div className="flex justify-between items-center mb-6">
                 <div>
                    <h1 className="text-3xl font-bold light-theme-text-primary dark:text-gray-100">Analytics Dashboard</h1>
                    <p className="text-md light-theme-text-secondary dark:text-gray-400 mt-1">Una panoramica delle tue attività.</p>
                 </div>
                <button onClick={onBack} className="utility-button flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors">
                    <IconArrowLeft className="w-4 h-4" />
                    Torna al Portfolio
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <KpiCard icon={<IconBriefcase className="w-6 h-6 text-blue-500"/>} title="Progetti Totali" value={kpiData.totalProjects} />
                <KpiCard 
                    icon={<IconTrendingUp className="w-6 h-6 text-emerald-500"/>} 
                    title="Fatturato Totale" 
                    value={kpiData.totalRevenue} 
                    format={(v) => v.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}
                />
                <KpiCard 
                    icon={<IconEuro className="w-6 h-6 text-amber-500"/>} 
                    title="Valore Medio Progetto" 
                    value={kpiData.averageValue}
                    format={(v) => v.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}
                />
                <KpiCard icon={<IconUsers className="w-6 h-6 text-violet-500"/>} title="Clienti Unici" value={kpiData.uniqueClients} />
            </div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                 <AnalyticsCard
                    title="Progetti per Categoria"
                    description="Distribuzione dei progetti nelle varie categorie."
                    icon={<IconChartBar className="w-6 h-6 text-blue-500" />}
                    onClick={() => setActiveModal('projectsByCategory')}
                    preview={
                        <div className="preview-bar-chart">
                            <div className="preview-bar" style={{ height: '70%', backgroundColor: '#818cf8' }}></div>
                            <div className="preview-bar" style={{ height: '50%', backgroundColor: '#a78bfa' }}></div>
                            <div className="preview-bar" style={{ height: '90%', backgroundColor: '#f472b6' }}></div>
                            <div className="preview-bar" style={{ height: '40%', backgroundColor: '#fb923c' }}></div>
                            <div className="preview-bar" style={{ height: '60%', backgroundColor: '#60a5fa' }}></div>
                        </div>
                    }
                />
                <AnalyticsCard
                    title="Ricavi per Categoria"
                    description="Analisi del fatturato generato da ogni categoria."
                    icon={<IconEuro className="w-6 h-6 text-emerald-500" />}
                    onClick={() => setActiveModal('revenueByCategory')}
                    preview={<div className="preview-doughnut"></div>}
                />
                <AnalyticsCard
                    title="Origine dei Progetti"
                    description="Distribuzione dei progetti in base al referente."
                    icon={<IconReferrer className="w-6 h-6 text-pink-500" />}
                    onClick={() => setActiveModal('projectsByReferrer')}
                    preview={<div className="preview-doughnut" style={{ background: 'conic-gradient(#f472b6 0% 35%, #fb923c 35% 60%, #a78bfa 60% 80%, #818cf8 80% 100%)'}}></div>}
                />
                <AnalyticsCard
                    title="Progetti per Account Drive"
                    description="Conteggio dei progetti per ogni account Google Drive."
                    icon={<IconDrive className="w-6 h-6 text-violet-500" />}
                    onClick={() => setActiveModal('projectsPerDrive')}
                     preview={
                        <div className="preview-bar-chart">
                            <div className="preview-bar" style={{ height: '80%', backgroundColor: '#818cf8' }}></div>
                            <div className="preview-bar" style={{ height: '45%', backgroundColor: '#818cf8' }}></div>
                            <div className="preview-bar" style={{ height: '65%', backgroundColor: '#818cf8' }}></div>
                        </div>
                    }
                />
                 <AnalyticsCard
                    title="Ultimi Progetti Aggiunti"
                    description="Visualizza i 5 progetti più recenti inseriti."
                    icon={<IconCalendar className="w-6 h-6 text-amber-500" />}
                    onClick={() => setActiveModal('recentProjects')}
                    preview={
                        <div className="w-full space-y-2.5 text-left pl-2">
                            {recentProjects.slice(0, 3).map(p => (
                                <div key={p.id} className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0"></div>
                                    <div>
                                        <p className="text-xs font-semibold truncate light-theme-text-primary dark:text-gray-200">{p.nome}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{p.cliente}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    }
                />
            </div>
            
            <AnalyticsModal
                isOpen={activeModal !== null}
                onClose={() => setActiveModal(null)}
                title={modalContent.title}
            >
                {modalContent.content}
            </AnalyticsModal>
        </div>
    );
};


const LOCAL_STORAGE_KEY = 'portfolio_projects_v2';

const App: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('Tutti');
    const [activeClient, setActiveClient] = useState<string | null>(null);
    const [activeReferrer, setActiveReferrer] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState('Più recenti');
    const [activeAccount, setActiveAccount] = useState<string | null>(null);
    const [activeYear, setActiveYear] = useState<number | null>(null);
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
    const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
    const [projectForPreview, setProjectForPreview] = useState<Project | null>(null);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [displayLimit, setDisplayLimit] = useState(20);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isAnalyticsView, setIsAnalyticsView] = useState(false);
    
    // State for animation
    const [displayedProjects, setDisplayedProjects] = useState<Project[]>([]);
    const [isGridVisible, setGridVisible] = useState(false);
    
    const [isSortMenuOpen, setSortMenuOpen] = useState(false);
    const [isFilterMenuOpen, setFilterMenuOpen] = useState(false);
    
    const sortMenuRefDesktop = useRef<HTMLDivElement>(null);
    const filterMenuRefDesktop = useRef<HTMLDivElement>(null);
    const sortMenuRefMobile = useRef<HTMLDivElement>(null);
    const filterMenuRefMobile = useRef<HTMLDivElement>(null);

    const closeSortMenu = useCallback(() => setSortMenuOpen(false), []);
    const closeFilterMenu = useCallback(() => setFilterMenuOpen(false), []);

    useClickOutside(
        [sortMenuRefDesktop, sortMenuRefMobile],
        closeSortMenu
    );
    useClickOutside(
        [filterMenuRefDesktop, filterMenuRefMobile],
        closeFilterMenu
    );

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);
    
    const handleThemeToggle = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };
    
     // Check session storage for auth state on initial load
    useEffect(() => {
        const loggedIn = sessionStorage.getItem('isAuthenticated') === 'true';
        setIsAuthenticated(loggedIn);
    }, []);

    // Effect to toggle dashboard background
    useEffect(() => {
        const htmlElement = document.documentElement;
        if (isAnalyticsView) {
            htmlElement.classList.add('dashboard-view');
        } else {
            htmlElement.classList.remove('dashboard-view');
        }
        return () => {
            htmlElement.classList.remove('dashboard-view');
        };
    }, [isAnalyticsView]);

    // Load projects from localStorage on startup, or fall back to the initial JSON file.
    useEffect(() => {
        const loadProjects = async () => {
            setIsLoading(true);
            try {
                const savedProjectsJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
                let projectsToLoad: Project[] = [];
                if (savedProjectsJSON) {
                    const savedProjects = JSON.parse(savedProjectsJSON);
                    if (savedProjects && Array.isArray(savedProjects)) {
                        projectsToLoad = savedProjects;
                    }
                }
                
                if(projectsToLoad.length === 0) {
                    const response = await fetch('/projects.json');
                    if (!response.ok) throw new Error('Network response was not ok');
                    const initialProjects: Project[] = await response.json();
                    projectsToLoad = initialProjects;
                }
                
                const projectsWithIds = projectsToLoad.map((p, i) => ({ ...p, id: p.id || `proj-${Date.now()}-${i}`}));
                setProjects(projectsWithIds);
                setDisplayedProjects(projectsWithIds);
                
            } catch (error) {
                console.error("Failed to load or parse projects:", error);
                localStorage.removeItem(LOCAL_STORAGE_KEY); // Clear potentially corrupted data
                setProjects([]);
                setDisplayedProjects([]);
            } finally {
                setIsLoading(false);
                setTimeout(() => setGridVisible(true), 50); // Fade in after loading
            }
        };
        loadProjects();
    }, []);

    // Save projects to localStorage whenever the projects state changes.
    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
        }
    }, [projects, isLoading]);


    const handleDeleteRequest = (id: string) => {
        const project = projects.find(p => p.id === id);
        if (project) {
            setProjectToDelete(project);
        }
    };

    const handleConfirmDelete = () => {
        if (projectToDelete) {
            setProjects(prev => prev.filter(p => p.id !== projectToDelete.id));
            setProjectToDelete(null);
        }
    };
    
    const handleEditRequest = (id: string) => {
        const project = projects.find(p => p.id === id);
        if (project) {
            setProjectToEdit(project);
            setIsProjectModalOpen(true);
        }
    };

const handleSaveProject = async (projectData: Omit<Project, 'id'>, id?: string) => {
  try {
    if (id) {
      // 🔹 Aggiorna un progetto esistente
      const { error } = await supabase
        .from('projects')
        .update(projectData)
        .eq('id', id);

      if (error) throw error;
      alert('Progetto aggiornato con successo!');
    } else {
      // 🔹 Crea un nuovo progetto
      const { error } = await supabase
        .from('projects')
        .insert([
          {
            ...projectData,
          },
        ]);

      if (error) throw error;
      alert('Progetto aggiunto con successo!');
    }

    // 🔹 Dopo il salvataggio, ricarica i progetti da Supabase
    const { data: projects, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) throw fetchError;

    setProjects(projects || []);
  } catch (error) {
    console.error('Errore Supabase:', error);
    alert('Errore nel salvataggio del progetto.');
  } finally {
    // 🔹 Chiudi il modal e resetta lo stato di editing
    setIsProjectModalOpen(false);
    setProjectToEdit(null);
  }
};



    const categories = useMemo(() => {
        const projectCategories = projects.map(p => p.categoria);
        const combined = new Set([...MASTER_CATEGORIES, ...projectCategories]);
        const allCategories = Array.from(combined);

        const sortedCategories = allCategories
            .filter(cat => cat !== 'Altro')
            .sort((a, b) => a.localeCompare(b));

        if (allCategories.includes('Altro')) {
            sortedCategories.push('Altro');
        }

        return sortedCategories;
    }, [projects]);
    
    const accounts = useMemo(() => ['Tutti', ...Array.from(new Set(projects.map(p => p.accountDrive)))], [projects]);
    
    const filteredAndSortedProjects = useMemo(() => {
        const filtered = projects
            .filter(p => {
                const searchMatch = searchTerm.toLowerCase() === '' ||
                    p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    p.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    p.tag.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    p.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (p.commissionatoDa && p.commissionatoDa.toLowerCase().includes(searchTerm.toLowerCase()));
                const categoryMatch = activeCategory === 'Tutti' || p.categoria === activeCategory;
                const accountMatch = !activeAccount || p.accountDrive === activeAccount;
                const clientMatch = !activeClient || p.cliente === activeClient;
                const referrerMatch = !activeReferrer || p.commissionatoDa === activeReferrer;
                const yearMatch = !activeYear || new Date(p.data).getFullYear() === activeYear;
                const visibilityMatch = isAuthenticated || p.visibilita === 'Pubblico' || !p.visibilita;
                return searchMatch && categoryMatch && accountMatch && clientMatch && referrerMatch && yearMatch && visibilityMatch;
            });

        // The sorting logic is intentionally independent of the project category.
        // It strictly follows the user's selected sortOrder (date or name).
        const sortableProjects = [...filtered];

        switch (sortOrder) {
            case 'A - Z':
                return sortableProjects.sort((a, b) => a.nome.localeCompare(b.nome));
            case 'Z - A':
                return sortableProjects.sort((a, b) => b.nome.localeCompare(a.nome));
            case 'Meno recenti':
                return sortableProjects.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
            case 'Più recenti':
            default:
                return sortableProjects.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
        }
    }, [projects, searchTerm, activeCategory, activeAccount, sortOrder, activeClient, activeYear, activeReferrer, isAuthenticated]);
    
    // Effect for handling filter/sort animations
    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isAnalyticsView) return; // Don't re-animate grid when switching to analytics
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        setGridVisible(false); // Fade out

        const timer = setTimeout(() => {
            setDisplayedProjects(filteredAndSortedProjects); // Swap projects
            setDisplayLimit(20); // Reset the limit when filters change
            setGridVisible(true); // Fade back in
        }, 300); // This should match the CSS transition duration

        return () => clearTimeout(timer);
    }, [filteredAndSortedProjects, isAnalyticsView]);
    
    // --- Infinite Scroll Logic ---
    const observerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (isAnalyticsView) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const firstEntry = entries[0];
                if (firstEntry.isIntersecting && !isLoadingMore && filteredAndSortedProjects.length > displayLimit) {
                    handleLoadMore();
                }
            },
            { threshold: 1.0 } // Trigger when the sentinel is fully in view
        );

        const currentObserverRef = observerRef.current;
        if (currentObserverRef) {
            observer.observe(currentObserverRef);
        }

        return () => {
            if (currentObserverRef) {
                observer.unobserve(currentObserverRef);
            }
        };
    }, [isLoadingMore, displayLimit, filteredAndSortedProjects.length, handleLoadMore, isAnalyticsView]);


    const sortOptions = ['Più recenti', 'Meno recenti', 'A - Z', 'Z - A'];

    return (
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 transition-colors duration-300">
             <div className="header-sticky-container sticky top-0 z-20 main-bg pt-2 pb-1 sm:pt-3 sm:pb-4">
                {/* --- DESKTOP HEADER --- */}
                <header className="hidden sm:block text-center">
                    <LogoIcon className="mx-auto mb-4 h-14 w-auto" />
                    <div className="relative max-w-2xl mx-auto flex items-center gap-2">
                        <div className="relative flex-grow">
                            <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none"/>
                            <input
                                type="text"
                                placeholder="Cerca progetti..."
                                className="search-input w-full pl-11 pr-4 py-3 border border-gray-200 bg-white dark:bg-dark-ui dark:border-dark-border dark:text-white rounded-full focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div ref={sortMenuRefDesktop} className="relative">
                            <button onClick={() => setSortMenuOpen(prev => !prev)} className="header-action-btn p-3 bg-white dark:bg-dark-ui border border-gray-200 dark:border-dark-border rounded-full light-theme-text-secondary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-ui-hover hover:text-gray-800 dark:hover:text-white transition-colors shadow-sm" aria-label="Ordina progetti">
                                <IconSort className="w-5 h-5"/>
                            </button>
                            {isSortMenuOpen && (
                                <div className="dropdown-menu absolute top-full right-0 mt-2 w-48 rounded-md py-1 z-10">
                                    {sortOptions.map(option => (
                                        <button 
                                            key={option} 
                                            onClick={() => { setSortOrder(option); setSortMenuOpen(false); }} 
                                            className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                                                sortOrder === option 
                                                    ? 'font-semibold text-blue-600 dark:text-blue-400' 
                                                    : ''
                                            }`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        {isAuthenticated && (
                           <>
                                <div ref={filterMenuRefDesktop} className="relative">
                                    <button onClick={() => setFilterMenuOpen(prev => !prev)} className="header-action-btn relative p-3 bg-white dark:bg-dark-ui border border-gray-200 dark:border-dark-border rounded-full light-theme-text-secondary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-ui-hover hover:text-gray-800 dark:hover:text-white transition-colors shadow-sm" aria-label="Filtra progetti per account">
                                        <IconFilter className="w-5 h-5"/>
                                        {activeAccount && <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-blue-500"></span>}
                                    </button>
                                    {isFilterMenuOpen && (
                                        <div className="dropdown-menu absolute top-full right-0 mt-2 w-64 rounded-md py-1 z-10 max-h-60 overflow-y-auto">
                                            {accounts.map(account => (
                                                <button 
                                                    key={account} 
                                                    onClick={() => { setActiveAccount(account === 'Tutti' ? null : account); setFilterMenuOpen(false); }} 
                                                    className={`w-full text-left px-4 py-2 text-sm truncate transition-colors ${
                                                        activeAccount === account || (account === 'Tutti' && !activeAccount)
                                                            ? 'font-semibold text-blue-600 dark:text-blue-400' 
                                                            : ''
                                                    }`}
                                                >
                                                    {account}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                 <button onClick={() => setIsAnalyticsView(prev => !prev)} className={`header-action-btn p-3 border rounded-full transition-colors shadow-sm ${isAnalyticsView ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800' : 'bg-white dark:bg-dark-ui border-gray-200 dark:border-dark-border light-theme-text-secondary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-ui-hover'}`} aria-label="Dashboard Analytics">
                                    <IconChartBar className="w-5 h-5"/>
                                </button>
                           </>
                        )}
                        <button onClick={handleAuthAction} className="header-action-btn p-3 bg-white dark:bg-dark-ui border border-gray-200 dark:border-dark-border rounded-full light-theme-text-secondary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-ui-hover hover:text-gray-800 dark:hover:text-white transition-colors shadow-sm" aria-label={isAuthenticated ? "Logout" : "Accesso privato"}>
                           {isAuthenticated ? <IconLogout className="w-5 h-5"/> : <IconKey className="w-5 h-5"/>}
                        </button>
                        <button onClick={handleThemeToggle} className="header-action-btn p-3 bg-white dark:bg-dark-ui border border-gray-200 dark:border-dark-border rounded-full light-theme-text-secondary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-ui-hover hover:text-gray-800 dark:hover:text-white transition-colors shadow-sm" aria-label="Cambia tema">
                            {theme === 'light' ? <IconMoon className="w-5 h-5"/> : <IconSun className="w-5 h-5"/>}
                        </button>
                    </div>
                </header>

                {/* --- MOBILE HEADER --- */}
                <header className={`sm:hidden flex items-center justify-between ${isSearchActive ? 'h-14' : 'h-[116px]'}`}>
                    {isSearchActive ? (
                         <div className="flex items-center w-full gap-2">
                            <button onClick={() => setIsSearchActive(false)} className="p-2 text-gray-500 dark:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-dark-ui-hover">
                                <IconChevronLeft className="w-6 h-6" />
                            </button>
                            <div className="relative flex-grow">
                                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none"/>
                                <input
                                    type="text"
                                    placeholder="Cerca progetti..."
                                    className="search-input w-full pl-10 pr-4 py-2 border border-gray-200 bg-white dark:bg-dark-ui dark:border-dark-border dark:text-white rounded-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="w-full">
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-center">
                                    <LogoIcon className="h-12 w-auto" />
                                </div>
                                <div className="flex items-center gap-2">
                                     {isAuthenticated ? (
                                        <button 
                                            onClick={() => setIsSearchActive(true)}
                                            className="header-action-btn admin-mobile-search-button flex-grow flex items-center justify-start gap-2 py-2.5 pl-3 pr-4 bg-white dark:bg-dark-ui border border-gray-200 dark:border-dark-border rounded-full hover:bg-gray-100 dark:hover:bg-dark-ui-hover transition-all duration-300 shadow-sm"
                                        >
                                            <IconSearch className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                            <span className="admin-mobile-search-text text-gray-500 dark:text-gray-400 whitespace-nowrap overflow-hidden">
                                                {searchTerm || 'Cerca...'}
                                            </span>
                                        </button>
                                    ) : (
                                        <div className="relative flex-grow" onClick={() => setIsSearchActive(true)}>
                                            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none"/>
                                            <div
                                                className="search-input w-full pl-10 pr-4 py-2 border border-gray-200 bg-white dark:bg-dark-ui dark:border-dark-border text-gray-500 dark:text-gray-400 rounded-full cursor-text"
                                            >
                                                {searchTerm || 'Cerca progetti...'}
                                            </div>
                                        </div>
                                    )}
                                     <div ref={sortMenuRefMobile} className="relative">
                                        <button onClick={() => setSortMenuOpen(prev => !prev)} className="header-action-btn p-2.5 bg-white dark:bg-dark-ui border border-gray-200 dark:border-dark-border rounded-full light-theme-text-secondary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-ui-hover transition-colors shadow-sm" aria-label="Ordina progetti">
                                            <IconSort className="w-5 h-5"/>
                                        </button>
                                        {isSortMenuOpen && (
                                            <div className="dropdown-menu absolute top-full right-0 mt-2 w-48 rounded-md py-1 z-10">
                                                {sortOptions.map(option => <button key={option} onClick={() => { setSortOrder(option); setSortMenuOpen(false); }} className={`w-full text-left px-4 py-2 text-sm transition-colors ${sortOrder === option ? 'font-semibold text-blue-600 dark:text-blue-400' : ''}`}>{option}</button>)}
                                            </div>
                                        )}
                                    </div>
                                    {isAuthenticated && (
                                        <>
                                            <div ref={filterMenuRefMobile} className="relative">
                                                <button onClick={() => setFilterMenuOpen(prev => !prev)} className="header-action-btn relative p-2.5 bg-white dark:bg-dark-ui border border-gray-200 dark:border-dark-border rounded-full light-theme-text-secondary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-ui-hover transition-colors shadow-sm" aria-label="Filtra progetti per account">
                                                    <IconFilter className="w-5 h-5"/>
                                                    {activeAccount && <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-blue-500"></span>}
                                                </button>
                                                {isFilterMenuOpen && (
                                                    <div className="dropdown-menu absolute top-full right-0 mt-2 w-64 rounded-md py-1 z-10 max-h-60 overflow-y-auto">
                                                        {accounts.map(account => <button key={account} onClick={() => { setActiveAccount(account === 'Tutti' ? null : account); setFilterMenuOpen(false); }} className={`w-full text-left px-4 py-2 text-sm truncate transition-colors ${activeAccount === account || (account === 'Tutti' && !activeAccount) ? 'font-semibold text-blue-600 dark:text-blue-400' : ''}`}>{account}</button>)}
                                                    </div>
                                                )}
                                            </div>
                                            <button onClick={() => setIsAnalyticsView(prev => !prev)} className={`header-action-btn p-2.5 border rounded-full transition-colors shadow-sm ${isAnalyticsView ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800' : 'bg-white dark:bg-dark-ui border-gray-200 dark:border-dark-border light-theme-text-secondary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-ui-hover'}`} aria-label="Dashboard Analytics">
                                                <IconChartBar className="w-5 h-5"/>
                                            </button>
                                        </>
                                    )}
                                    <button onClick={handleAuthAction} className="header-action-btn p-2.5 bg-white dark:bg-dark-ui border border-gray-200 dark:border-dark-border rounded-full light-theme-text-secondary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-ui-hover transition-colors shadow-sm" aria-label={isAuthenticated ? "Logout" : "Accesso privato"}>
                                        {isAuthenticated ? <IconLogout className="w-5 h-5"/> : <IconKey className="w-5 h-5"/>}
                                    </button>
                                    <button onClick={handleThemeToggle} className="header-action-btn p-2.5 bg-white dark:bg-dark-ui border border-gray-200 dark:border-dark-border rounded-full light-theme-text-secondary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-ui-hover transition-colors shadow-sm" aria-label="Cambia tema">
                                        {theme === 'light' ? <IconMoon className="w-5 h-5"/> : <IconSun className="w-5 h-5"/>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </header>

                <section className={`sm:py-0 sm:mt-8 flex flex-col items-center ${isAnalyticsView ? 'hidden' : ''}`}>
                    <CategoryFilter categories={categories} activeCategory={activeCategory} onSelectCategory={handleSelectCategory} />
                    <div className="mt-2 flex flex-wrap justify-center gap-2">
                        {activeClient && (
                            <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-sm font-semibold px-3 py-1.5 rounded-full">
                                <span>{activeClient}</span>
                                <button 
                                    onClick={() => setActiveClient(null)} 
                                    className="p-1 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800/60"
                                    aria-label={`Rimuovi filtro per cliente ${activeClient}`}
                                >
                                    <IconX className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                         {activeReferrer && (
                            <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-sm font-semibold px-3 py-1.5 rounded-full">
                                <span>{activeReferrer}</span>
                                <button 
                                    onClick={() => setActiveReferrer(null)} 
                                    className="p-1 rounded-full hover:bg-emerald-200 dark:hover:bg-emerald-800/60"
                                    aria-label={`Rimuovi filtro per referente ${activeReferrer}`}
                                >
                                    <IconX className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                        {activeYear && (
                             <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 text-sm font-semibold px-3 py-1.5 rounded-full">
                                <span>{activeYear}</span>
                                <button 
                                    onClick={() => setActiveYear(null)} 
                                    className="p-1 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800/60"
                                    aria-label={`Rimuovi filtro per anno ${activeYear}`}
                                >
                                    <IconX className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            </div>
            
            <main className="mt-2 sm:mt-8 pb-20 sm:pb-0">
                {isLoading ? (
                    <div className="text-center py-20 col-span-full"><Spinner /></div>
                ) : isAnalyticsView && isAuthenticated ? (
                    <AnalyticsDashboard projects={projects} onBack={() => setIsAnalyticsView(false)} />
                ) : (
                    <div>
                        {displayedProjects.length > 0 ? (
                            <>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-5">
                                    {displayedProjects.slice(0, displayLimit).map(project => (
                                        <ProjectCard key={project.id} project={project} onDelete={handleDeleteRequest} onEdit={handleEditRequest} onImageClick={setProjectForPreview} onClientClick={handleClientFilter} onAccountClick={handleAccountFilter} onYearClick={handleYearFilter} onReferrerClick={handleReferrerFilter} isVisible={isGridVisible} isAuthenticated={isAuthenticated} />
                                    ))}
                                </div>
                                
                                {isLoadingMore && (
                                    <div className="text-center py-12 col-span-full">
                                        <InfiniteScrollLoader />
                                    </div>
                                )}
                                
                                {/* Sentinel element for infinite scroll trigger */}
                                {displayedProjects.length > displayLimit && !isLoadingMore && (
                                    <div ref={observerRef} style={{ height: '20px' }} />
                                )}
                            </>
                        ) : (
                             <div className="text-center py-20 col-span-full">
                                <p className="text-gray-500 dark:text-gray-400 text-lg">Nessun progetto trovato.</p>
                                <p className="text-gray-400 dark:text-gray-500 text-sm">Prova a cambiare la ricerca o i filtri.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
            
            <ProjectPreviewModal 
                project={projectForPreview}
                onClose={() => setProjectForPreview(null)}
                isAuthenticated={isAuthenticated}
            />
            
            {isAuthenticated && (
                <ProjectFormModal 
                    isOpen={isProjectModalOpen}
                    onClose={() => {
                        setIsProjectModalOpen(false);
                        setProjectToEdit(null);
                    }}
                    onSubmit={handleSaveProject}
                    categories={categories}
                    projectToEdit={projectToEdit}
                />
            )}

            {isAuthenticated && (
                <ConfirmationModal 
                    isOpen={!!projectToDelete}
                    onClose={() => setProjectToDelete(null)}
                    onConfirm={handleConfirmDelete}
                    title="Conferma Eliminazione"
                    message={`Sei sicuro di voler eliminare il progetto "${projectToDelete?.nome}"? L'azione è irreversibile.`}
                />
            )}
            
            <LoginModal 
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                onLogin={handleLogin}
            />


            <footer className="text-center py-8 mt-12 border-t border-gray-200/75 dark:border-black/40">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    © 2025 - Portfolio privato di progetti grafici
                </p>
            </footer>

            {/* --- Floating Action Buttons --- */}
            
            {isAuthenticated && (
                <div className="fixed z-50 bottom-6 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-6 sm:bottom-[76px]">
                     <button
                        type="button"
                        onClick={() => {
                            setProjectToEdit(null);
                            setIsProjectModalOpen(true);
                        }}
                        className="utility-button utility-button-new-project dark:bg-dark-bg dark:border-2 dark:border-dark-border shadow-md font-semibold transition-colors border rounded-full p-2.5 sm:px-4 sm:py-2.5 sm:flex sm:items-center sm:gap-2"
                        aria-label="Aggiungi nuovo progetto"
                    >
                        <IconPlus className="w-5 h-5 text-emerald-500" />
                        <span className="hidden sm:inline">New Project</span>
                    </button>
                </div>
            )}
            
            {/* "Scroll To Top" Button */}
            {/* Always on the bottom right */}
            <div className="fixed bottom-6 right-6 z-50">
                <ScrollToTopButton />
            </div>
        </div>
    );
};

export default App;