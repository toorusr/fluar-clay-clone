import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Search,
    Filter,
    LayoutTemplate,
    Download,
    Share2,
    Plus,
    ChevronDown,
    Zap,
    Play,
    ArrowUpRight,
    Loader2,
    Command,
    List,
    Grid3X3,
    X,
    Check,
    MoreHorizontal,
    Trash2,
    Sparkles,
    Settings,
    Globe,
    ExternalLink,
    Key,
    MessageSquare,
    Send,
    Wand2,
    Bot
} from 'lucide-react';

// --- Configuration ---
const apiKey = "";

// --- Mock Data & Config ---

const INITIAL_COLUMNS = [
    { id: 'name', label: "Name", w: 200, icon: "T", type: 'static' },
    { id: 'company', label: "Company", w: 160, icon: "T", type: 'static' },
    { id: 'linkedin', label: "Featured In", w: 160, icon: "U", type: 'static' },
    { id: 'type', label: "Type", w: 130, icon: "▶", type: 'enrichable' },
    { id: 'website', label: "Website URL", w: 200, icon: "U", type: 'enrichable' },
    { id: 'customers', label: "Customers", w: 260, icon: "T", type: 'enrichable' },
    { id: 'product', label: "Core Product", w: 260, icon: "T", type: 'enrichable' },
];

const INITIAL_DATA = [
    { id: 1, name: "Max Brodeur-Ur...", company: "Gumloop", linkedin: "linkedin.com/in/max", status: "idle" },
    { id: 2, name: "Robert Chandler", company: "Mordenre", linkedin: "linkedin.com/in/rob", status: "idle" },
    { id: 3, name: "Matt Stankiewic...", company: "ElventLabs", linkedin: "linkedin.com/in/matt", status: "idle" },
    { id: 4, name: "Max Bbezhaev", company: "Dopt", linkedin: "linkedin.com/in/maxb", status: "idle" },
    { id: 5, name: "Tuluo Otoki", company: "Tldraw", linkedin: "linkedin.com/in/tuluo", status: "idle" },
    { id: 6, name: "Dominik Sibley", company: "HegelAI", linkedin: "linkedin.com/in/dom", status: "idle" },
    { id: 7, name: "Raphael Schaad", company: "Cron", linkedin: "linkedin.com/in/raph", status: "idle" },
    { id: 8, name: "Teo Luvos-Lucas", company: "Outrank", linkedin: "linkedin.com/in/teo", status: "idle" },
    { id: 9, name: "Brian Chesky", company: "Airbnb", linkedin: "linkedin.com/in/brian", status: "idle" },
    { id: 10, name: "Emily Chen", company: "Figma", linkedin: "linkedin.com/in/emily", status: "idle" },
    { id: 11, name: "Alex Johnson", company: "Slack", linkedin: "linkedin.com/in/alex", status: "idle" },
    { id: 12, name: "Michael Green", company: "Shopify", linkedin: "linkedin.com/in/mike", status: "idle" },
    { id: 13, name: "Emmett Shear", company: "Twitch", linkedin: "linkedin.com/in/em", status: "idle" },
    { id: 14, name: "Tony Xu", company: "DoorDash", linkedin: "linkedin.com/in/tony", status: "idle" },
    { id: 15, name: "Apoorva Mehta", company: "Instacart", linkedin: "linkedin.com/in/apoorva", status: "idle" },
    { id: 16, name: "Arash Ferdowsi", company: "Dropbox", linkedin: "linkedin.com/in/arash", status: "idle" },
    { id: 17, name: "Hayl Tagger", company: "Triplebyte", linkedin: "linkedin.com/in/hayl", status: "idle" },
    { id: 18, name: "Oliver Touvia", company: "Applied In...", linkedin: "linkedin.com/in/oliver", status: "idle" },
    { id: 19, name: "Rand Fishkin", company: "SparkToro", linkedin: "linkedin.com/in/rand", status: "idle" },
    { id: 20, name: "Rob Walling", company: "Drip", linkedin: "linkedin.com/in/rob", status: "idle" },
];

// Mock Data with Metadata Structure
const ENRICHED_DATA_MOCK = {
    1: { type: { value: "VC-backed" }, website: { value: "https://gumloop.com" }, customers: { value: "Not listed" }, product: { value: "AI automation platform" } },
    2: { type: { value: "VC-backed" }, website: { value: "https://mordenre.com" }, customers: { value: "Zendesk, Garmin, Mint" }, product: { value: "Marketing automation..." } },
    3: { type: { value: "VC-backed" }, website: { value: "https://elevenlabs.io" }, customers: { value: "Not listed" }, product: { value: "AI voice models and products." } },
};

// --- Helper Components ---

const StatusBadge = ({ type }) => {
    if (!type) return null;
    let bg = "bg-slate-100 text-slate-600 border-slate-200";
    if (type === "VC-backed") bg = "bg-purple-50 text-purple-700 border-purple-200";
    if (type === "Bootstrapped") bg = "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (type === "Public") bg = "bg-sky-50 text-sky-700 border-sky-200";
    if (type === "Acquired") bg = "bg-orange-50 text-orange-700 border-orange-200";
    if (type === "Auth Error") bg = "bg-red-50 text-red-700 border-red-200";

    return (
        <span className= {`text-[10px] font-semibold tracking-tight px-1.5 py-0.5 rounded-[3px] border ${bg}`
}>
    { type }
    </span>
  );
};

const SourcePopover = ({ metadata, onClose }) => {
    if (!metadata) return null;

    const processSteps = metadata.process || [
        "Analyzed the cell context and prompt.",
        "Searched Google for relevant company information.",
        "Extracted the answer from the top search results.",
        "Formatted the output as requested."
    ];

    const sources = metadata.sources || [];

    return (
        <div 
      onClick= {(e) => e.stopPropagation()}
className = "absolute top-[calc(100%+4px)] left-0 w-[300px] bg-white rounded-lg shadow-xl border border-slate-200 z-50 animate-in fade-in slide-in-from-top-2 duration-200 flex flex-col overflow-hidden"
    >
    <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between" >
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700" >
            <Zap className="w-3 h-3 text-indigo-600 fill-indigo-100" />
                Process
                </div>
                < button onClick = { onClose } className = "text-slate-400 hover:text-slate-600" > <X className="w-3.5 h-3.5" /> </button>
                    </div>

                    < div className = "p-3 max-h-[200px] overflow-y-auto" >
                        <div className="relative border-l-2 border-slate-100 ml-1.5 space-y-4 pb-1" >
                        {
                            processSteps.map((step, i) => (
                                <div key= { i } className = "relative pl-4" >
                                <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white bg-slate-300 shadow-sm" > </div>
                            < p className = "text-xs text-slate-600 leading-relaxed" > { step } </p>
                            </div>
                            ))
                        }
                            < div className = "relative pl-4" >
                                <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white bg-indigo-500 shadow-sm" > </div>
                                    < p className = "text-xs font-medium text-indigo-700" > Final Answer Extracted </p>
                                        </div>
                                        </div>
                                        </div>

{
    sources.length > 0 && (
        <div className="bg-slate-50 px-3 py-2.5 border-t border-slate-100" >
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2" > Sources </div>
                < div className = "flex flex-wrap gap-2" >
                {
                    sources.map((source, i) => (
                        <a 
                key= { i } 
                href = { source.uri } 
                target = "_blank" 
                rel = "noreferrer"
                className = "flex items-center gap-1.5 bg-white border border-slate-200 rounded-md pl-1.5 pr-2 py-1 hover:border-indigo-300 hover:shadow-sm transition-all group max-w-full"
                        >
                        <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-500" >
                        { source.title ? source.title[0] : <Globe className="w-2.5 h-2.5" /> }
                        </div>
                    < span className = "text-xs text-slate-600 truncate max-w-[100px] group-hover:text-indigo-600" > { source.title || "Web Source" } </span>
                    < ExternalLink className = "w-2.5 h-2.5 text-slate-400 opacity-0 group-hover:opacity-100" />
                    </a>
                    ))
                }
                    </div>
                    </div>
      )
}
</div>
  );
};

const DataCell = ({
    rowId,
    colId,
    children,
    width,
    isSelected,
    isSelectionTop,
    isSelectionBottom,
    isSelectionLeft,
    isSelectionRight,
    isFillTarget,
    isLoading,
    onMouseDown,
    onMouseEnter,
    onDoubleClick,
    onHandleMouseDown,
    isEditing,
    onEdit,
    valueObj
}) => {
    const [editValue, setEditValue] = useState(valueObj?.value || "");
    const [showSourcePopover, setShowSourcePopover] = useState(false);

    useEffect(() => {
        if (!isEditing) setEditValue(valueObj?.value || "");
    }, [valueObj, isEditing]);

    useEffect(() => {
        if (!isSelected) setShowSourcePopover(false);
    }, [isSelected]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onEdit(editValue);
        }
    };

    const hasMetadata = valueObj && (valueObj.process || valueObj.sources);

    return (
        <div 
      onMouseDown= {(e) => onMouseDown(rowId, colId, e)}
onMouseEnter = {() => onMouseEnter(rowId, colId)}
onDoubleClick = {() => onDoubleClick(rowId, colId)}
style = {{ width: width }}
className = {`
        relative h-[36px] border-r border-b border-slate-200/60 cursor-default select-none transition-colors duration-75 group
        ${isSelected ? 'bg-indigo-50/20' : 'bg-white hover:bg-slate-50'}
        ${isFillTarget ? 'bg-indigo-50/40' : ''} 
      `}
    >
    <div className="w-full h-full px-3 py-2 flex items-center overflow-hidden text-ellipsis whitespace-nowrap text-[13px]" >
        {
            isLoading?(
            <div className = "flex items-center text-slate-400 gap-2" >
                    <Loader2 className="w-3 h-3 animate-spin" />
        <span className="italic text-xs font-medium" > Generating...</span>
            </div>
          ) : isEditing ? (
    <input 
               autoFocus
               value = { editValue }
onChange = {(e) => setEditValue(e.target.value)}
onBlur = {() => onEdit(editValue)}
onKeyDown = { handleKeyDown }
className = "w-full h-full bg-white outline-none text-slate-900 p-0 m-0 border-none"
onClick = {(e) => e.stopPropagation()}
             />
          ) : children}
</div>

{
    !isLoading && !isEditing && hasMetadata && isSelected && (
        <div className="absolute right-1 bottom-1 z-30" >
            <button 
                onClick={ (e) => { e.stopPropagation(); setShowSourcePopover(!showSourcePopover); } }
    className = {`p-0.5 rounded-full transition-all ${showSourcePopover ? 'bg-indigo-100 text-indigo-600' : 'text-slate-300 hover:text-indigo-500 hover:bg-indigo-50'}`
}
             >
    <Sparkles className="w-3 h-3 fill-current" />
        </button>
{
    showSourcePopover && (
        <SourcePopover metadata={ valueObj } onClose = {(e) => { e.stopPropagation(); setShowSourcePopover(false); }
} />
             )}
</div>
      )}

{
    isSelected && !isEditing && (
        <>
        { isSelectionTop && <div className="absolute top-[-1px] left-[-1px] right-[-1px] h-[2px] bg-indigo-600 z-20 pointer-events-none" />}
{ isSelectionBottom && <div className="absolute bottom-[-1px] left-[-1px] right-[-1px] h-[2px] bg-indigo-600 z-20 pointer-events-none" />}
{ isSelectionLeft && <div className="absolute top-[-1px] bottom-[-1px] left-[-1px] w-[2px] bg-indigo-600 z-20 pointer-events-none" />}
{ isSelectionRight && <div className="absolute top-[-1px] bottom-[-1px] right-[-1px] w-[2px] bg-indigo-600 z-20 pointer-events-none" />}
{
    isSelectionBottom && isSelectionRight && (
        <div 
                  onMouseDown={ (e) => { e.stopPropagation(); onHandleMouseDown(rowId, colId, e); } }
    className = "absolute -bottom-[3px] -right-[3px] w-[7px] h-[7px] bg-indigo-600 z-30 border border-white shadow-sm cursor-crosshair square hover:scale-125 transition-transform"
        > </div>
            )
}
</>
      )}

{
    isFillTarget && (
        <div className="absolute inset-0 border border-dashed border-indigo-400 z-10 pointer-events-none" > </div>
      )
}
</div>
  );
};

const ToolbarButton = ({ children, icon: Icon, isActive = false, onClick }) => (
    <button 
    onClick= { onClick }
className = {`
      flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-[4px] transition-all border
      ${isActive
        ? 'bg-slate-100 text-slate-900 border-slate-300 shadow-sm'
        : 'bg-white text-slate-600 border-transparent hover:bg-slate-50 hover:border-slate-200'}
    `}
  >
    { Icon && <Icon className="w-3.5 h-3.5 opacity-70" />}
{ children }
</button>
);

// --- Column Settings Popover ---

const ColumnSettingsPopover = ({ onClose, onSave, initialName = "", initialPrompt = "", mode = "create" }) => {
    const [name, setName] = useState(initialName);
    const [prompt, setPrompt] = useState(initialPrompt);

    return (
        <div 
        onClick= {(e) => e.stopPropagation()}
className = "absolute top-12 right-4 w-[320px] bg-white rounded-lg shadow-xl border border-slate-200 z-50 animate-in fade-in zoom-in-95 duration-200"
    >
    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100" >
        <div className="flex items-center gap-2" >
            <div className={ `p-1 rounded-md ${mode === 'create' ? 'bg-indigo-100' : 'bg-slate-100'}` }>
                { mode === 'create' ? <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> : <Settings className="w-3.5 h-3.5 text-slate-600" />}
</div>
    < span className = "text-sm font-semibold text-slate-800" > { mode === 'create' ? "New AI Column" : "Column Settings"}</span>
        </div>
        < button onClick = { onClose } className = "text-slate-400 hover:text-slate-600" >
            <X className="w-4 h-4" />
                </button>
                </div>
                < div className = "p-4 space-y-4" >
                    <div className="space-y-1.5" >
                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wider" > Column Name </label>
                            < input
value = { name }
onChange = {(e) => setName(e.target.value)}
placeholder = "e.g. Summary, Sentiment"
className = "w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
autoFocus
    />
    </div>
    < div className = "space-y-1.5" >
        <div className="flex items-center justify-between" >
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider" > Prompt </label>
                < span className = "text-[10px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded font-medium" > Gemini Flash </span>
                    </div>
                    < textarea
value = { prompt }
onChange = {(e) => setPrompt(e.target.value)}
placeholder = "Find the CEO of the company..."
rows = { 4}
className = "w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
    />
    </div>
    < button
onClick = {() => onSave(name, prompt)}
disabled = {!name || !prompt}
className = {`w-full flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all shadow-sm
            ${name && prompt
        ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow'
        : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
          `}
        >
    { mode === 'create' ? <Zap className="w-3.5 h-3.5 fill-current" /> : <Check className="w-3.5 h-3.5" />}
{ mode === 'create' ? "Create Column" : "Save Changes" }
</button>
    </div>
    </div>
  );
};

const SmartEditPopover = ({ onClose, onRun }) => {
    const [prompt, setPrompt] = useState("");

    return (
        <div 
        onClick= {(e) => e.stopPropagation()}
className = "absolute bottom-14 left-1/2 -translate-x-1/2 w-[300px] bg-white rounded-lg shadow-xl border border-slate-200 z-50 animate-in slide-in-from-bottom-2 duration-200"
    >
    <div className="p-3" >
        <div className="flex items-center gap-2 mb-2 text-xs font-medium text-slate-500 uppercase tracking-wider" >
            <Wand2 className="w-3.5 h-3.5 text-indigo-500" /> Smart Edit
                </div>
                < input
value = { prompt }
onChange = {(e) => setPrompt(e.target.value)}
placeholder = "e.g. Fix formatting, Translate to Spanish..."
className = "w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 mb-2"
autoFocus
onKeyDown = {(e) => {
    if (e.key === 'Enter' && prompt) onRun(prompt);
}}
        />
    < div className = "flex justify-end gap-2" >
        <button onClick={ onClose } className = "px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700" > Cancel </button>
            < button
onClick = {() => onRun(prompt)}
disabled = {!prompt}
className = {`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5
                   ${prompt ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-100 text-slate-400'}
                `}
            >
    Run < ArrowUpRight className = "w-3 h-3" />
        </button>
        </div>
        </div>
        </div>
  );
};

// --- API Key Modal ---

const APIKeyModal = ({ onClose, onSave, currentKey }) => {
    const [key, setKey] = useState(currentKey || "");
    return (
        <div className= "absolute inset-0 bg-black/20 backdrop-blur-sm z-[100] flex items-center justify-center" onClick = { onClose } >
            <div className="bg-white rounded-lg shadow-2xl w-[400px] p-6" onClick = { e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4" >
                    <h2 className="text-lg font-semibold text-slate-900" > Connect API </h2>
                        < button onClick = { onClose } className = "text-slate-400 hover:text-slate-600" > <X className="w-5 h-5" /> </button>
                            </div>
                            < p className = "text-sm text-slate-500 mb-4" >
                                Enter your Gemini API key to enable AI features.This key is stored locally in your browser.
                </p>
                                    < input
type = "password"
placeholder = "Enter API Key (starts with AIza...)"
className = "w-full border border-slate-300 rounded-md px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
value = { key }
onChange = { e => setKey(e.target.value) }
autoFocus
    />
    <button 
                    onClick={ () => onSave(key) }
className = "w-full bg-indigo-600 text-white py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
    >
    Save Key
        </button>
        </div>
        </div>
    )
}

// --- Chat Sidebar ---

const ChatSidebar = ({ isOpen, onClose, data, columns, getCellValueObj, apiKey }) => {
    const [messages, setMessages] = useState([{ role: 'assistant', text: 'Hello! I can analyze your data. Ask me anything about the table.' }]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || !apiKey) return;

        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        const tableContext = data.slice(0, 20).map(row => {
            const rowObj = {};
            columns.forEach(col => {
                const cellVal = getCellValueObj(row.id, col.id).value;
                rowObj[col.label] = cellVal;
            });
            return rowObj;
        });

        const prompt = `
            You are a data analyst assistant. 
            Here is a sample of the current dataset (first 20 rows):
            ${JSON.stringify(tableContext)}

            User Question: ${userMsg.text}

            Answer concisely based on the data provided.
        `;

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }]
                    })
                }
            );
            const result = await response.json();
            const text = result.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't analyze that.";

            setMessages(prev => [...prev, { role: 'assistant', text }]);
        } catch (e) {
            setMessages(prev => [...prev, { role: 'assistant', text: "Error connecting to AI." }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className= "fixed right-0 top-0 bottom-0 w-[350px] bg-white shadow-2xl border-l border-slate-200 z-[100] flex flex-col animate-in slide-in-from-right duration-300" >
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50" >
            <div className="flex items-center gap-2 font-semibold text-slate-800" >
                <Bot className="w-5 h-5 text-indigo-600" /> Ask Data
                    </div>
                    < button onClick = { onClose } className = "text-slate-400 hover:text-slate-600" > <X className="w-4 h-4" /> </button>
                        </div>

                        < div className = "flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30" ref = { scrollRef } >
                        {
                            messages.map((msg, i) => (
                                <div key= { i } className = {`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`} >
                            <div className={ `max-w-[85%] p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-700 shadow-sm'}` }>
                                { msg.text }
                                </div>
                                </div>
                ))}
{
    isLoading && (
        <div className="flex justify-start" >
            <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-sm" >
                <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                    </div>
                    </div>
                )
}
</div>

    < div className = "p-4 border-t border-slate-100 bg-white" >
        <div className="relative" >
            <input 
                        value={ input }
onChange = { e => setInput(e.target.value) }
onKeyDown = { e => e.key === 'Enter' && handleSend() }
placeholder = "Ask about your data..."
className = "w-full pl-4 pr-10 py-2.5 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm"
    />
    <button 
                        onClick={ handleSend }
disabled = {!input.trim() || isLoading}
className = "absolute right-1.5 top-1.5 p-1.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
    >
    <Send className="w-3.5 h-3.5" />
        </button>
        </div>
        </div>
        </div>
    );
};


export default function FluarPrototype() {
    // --- Columns State with LocalStorage ---
    const [columns, setColumns] = useState(() => {
        try {
            const saved = localStorage.getItem('fluar_columns');
            return saved ? JSON.parse(saved) : INITIAL_COLUMNS;
        } catch (e) {
            return INITIAL_COLUMNS;
        }
    });

    // --- Local API Key State ---
    const [localApiKey, setLocalApiKey] = useState(() => {
        try {
            return localStorage.getItem('fluar_api_key') || "";
        } catch (e) { return ""; }
    });
    const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

    const [data, setData] = useState(INITIAL_DATA);

    const [selectedRowIds, setSelectedRowIds] = useState(new Set());
    const [selectedCells, setSelectedCells] = useState(new Set());
    const [anchorCell, setAnchorCell] = useState(null);

    const [isDragging, setIsDragging] = useState(false);
    const [dragMode, setDragMode] = useState('replace');
    const [selectionSnapshot, setSelectionSnapshot] = useState(new Set());
    const [editingCell, setEditingCell] = useState(null);

    const [isFillDragging, setIsFillDragging] = useState(false);
    const [fillStartCell, setFillStartCell] = useState(null);
    const [fillTargetCells, setFillTargetCells] = useState(new Set());

    const [isAddColOpen, setIsAddColOpen] = useState(false);
    const [editingColumnId, setEditingColumnId] = useState(null);

    const [processingCells, setProcessingCells] = useState(new Set());

    // State for new features
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isSmartEditOpen, setIsSmartEditOpen] = useState(false);

    // --- Data Store with LocalStorage ---
    const [enrichedDataStore, setEnrichedDataStore] = useState(() => {
        try {
            const saved = localStorage.getItem('fluar_data');
            if (saved) return JSON.parse(saved);
            const initial = {};
            Object.keys(ENRICHED_DATA_MOCK).forEach(rowId => {
                const rowData = ENRICHED_DATA_MOCK[rowId];
                Object.keys(rowData).forEach(colId => {
                    initial[`${rowId}:${colId}`] = rowData[colId];
                });
            });
            return initial;
        } catch (e) {
            return {};
        }
    });

    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    useEffect(() => {
        setHistory([enrichedDataStore]);
        setHistoryIndex(0);
    }, []);

    useEffect(() => {
        localStorage.setItem('fluar_columns', JSON.stringify(columns));
    }, [columns]);

    useEffect(() => {
        localStorage.setItem('fluar_data', JSON.stringify(enrichedDataStore));
    }, [enrichedDataStore]);

    useEffect(() => {
        localStorage.setItem('fluar_api_key', localApiKey);
    }, [localApiKey]);

    const gridRef = useRef(null);

    const updateDataWithHistory = (newState) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newState);
        if (newHistory.length > 50) newHistory.shift();
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
        setEnrichedDataStore(newState);
    };

    const undo = useCallback(() => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setEnrichedDataStore(history[newIndex]);
        }
    }, [history, historyIndex]);

    const redo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setEnrichedDataStore(history[newIndex]);
        }
    }, [history, historyIndex]);

    const getRangeKeys = (start, end) => {
        const startRowIdx = data.findIndex(d => d.id === start.rowId);
        const endRowIdx = data.findIndex(d => d.id === end.rowId);
        const startColIdx = columns.findIndex(c => c.id === start.colId);
        const endColIdx = columns.findIndex(c => c.id === end.colId);

        if (startRowIdx === -1 || endRowIdx === -1) return new Set();

        const minRow = Math.min(startRowIdx, endRowIdx);
        const maxRow = Math.max(startRowIdx, endRowIdx);
        const minCol = Math.min(startColIdx, endColIdx);
        const maxCol = Math.max(startColIdx, endColIdx);

        const keys = new Set();
        for (let r = minRow; r <= maxRow; r++) {
            for (let c = minCol; c <= maxCol; c++) {
                keys.add(`${data[r].id}:${columns[c].id}`);
            }
        }
        return keys;
    };

    const getCellValueObj = useCallback((rowId, colId) => {
        const cellKey = `${rowId}:${colId}`;
        if (enrichedDataStore[cellKey] !== undefined) return enrichedDataStore[cellKey];
        const row = data.find(d => d.id === rowId);
        return row ? { value: row[colId] || "" } : { value: "" };
    }, [enrichedDataStore, data]);

    useEffect(() => {
        const handleGlobalKeyDown = (e) => {
            if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

            if ((e.key === 'Delete' || e.key === 'Backspace') && !editingCell) {
                if (selectedCells.size > 0) {
                    e.preventDefault();
                    const newState = { ...enrichedDataStore };
                    selectedCells.forEach(key => {
                        newState[key] = { value: "" };
                    });
                    updateDataWithHistory(newState);
                }
                return;
            }
            if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                undo();
                return;
            }
            if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
                e.preventDefault();
                redo();
                return;
            }
        };
        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [selectedCells, editingCell, enrichedDataStore, history, historyIndex, undo, redo]);

    const toggleRowSelect = (id) => {
        const newSelected = new Set(selectedRowIds);
        if (newSelected.has(id)) newSelected.delete(id);
        else newSelected.add(id);
        setSelectedRowIds(newSelected);
        setSelectedCells(new Set());
        setAnchorCell(null);
    };

    const toggleSelectAllRows = () => {
        if (selectedRowIds.size === data.length) setSelectedRowIds(new Set());
        else setSelectedRowIds(new Set(data.map(d => d.id)));
        setSelectedCells(new Set());
    };

    const handleCellMouseDown = (rowId, colId, e) => {
        if (colId === 'checkbox' || colId === 'index') return;
        if (editingCell) return;

        setIsDragging(true);
        const cellKey = `${rowId}:${colId}`;

        if (e.shiftKey && anchorCell) {
            const rangeKeys = getRangeKeys(anchorCell, { rowId, colId });
            if (e.metaKey || e.ctrlKey) {
                const combined = new Set([...selectedCells, ...rangeKeys]);
                setSelectedCells(combined);
            } else {
                setSelectedCells(rangeKeys);
            }
            return;
        }
        if (e.metaKey || e.ctrlKey) {
            setDragMode('add');
            setSelectionSnapshot(new Set(selectedCells));
            setAnchorCell({ rowId, colId });
            const newSelected = new Set(selectedCells);
            if (newSelected.has(cellKey)) newSelected.delete(cellKey);
            else newSelected.add(cellKey);
            setSelectedCells(newSelected);
            return;
        }
        setDragMode('replace');
        setSelectionSnapshot(new Set());
        setAnchorCell({ rowId, colId });
        setSelectedCells(new Set([cellKey]));
        setSelectedRowIds(new Set());
    };

    const handleCellMouseEnter = (rowId, colId) => {
        if (isDragging && anchorCell && !isFillDragging) {
            const rangeKeys = getRangeKeys(anchorCell, { rowId, colId });
            if (dragMode === 'add') {
                const combined = new Set([...selectionSnapshot, ...rangeKeys]);
                setSelectedCells(combined);
            } else {
                setSelectedCells(rangeKeys);
            }
        }
        if (isFillDragging && fillStartCell) {
            const rangeKeys = getRangeKeys(fillStartCell, { rowId, colId });
            const targetOnly = new Set();
            rangeKeys.forEach(k => {
                if (!selectedCells.has(k)) targetOnly.add(k);
            });
            setFillTargetCells(targetOnly);
        }
    };

    const handleFillHandleMouseDown = (rowId, colId, e) => {
        setIsFillDragging(true);
        setFillStartCell({ rowId, colId });
        setFillTargetCells(new Set());
    };

    const handleMouseUp = () => {
        if (isFillDragging && fillTargetCells.size > 0 && selectedCells.size > 0) {
            const sourceCellsArr = Array.from(selectedCells).map(k => {
                const [rid, cid] = k.split(':');
                return { rowId: parseInt(rid), colId: cid, valObj: getCellValueObj(parseInt(rid), cid) };
            });

            const targetCellsArr = Array.from(fillTargetCells).map(k => {
                const [rid, cid] = k.split(':');
                return { rowId: parseInt(rid), colId: cid, key: k };
            });

            const newStore = { ...enrichedDataStore };

            targetCellsArr.forEach(target => {
                const targetCol = columns.find(c => c.id === target.colId);
                let matchingSource = sourceCellsArr.find(s => s.colId === target.colId);
                if (!matchingSource) matchingSource = sourceCellsArr.find(s => s.rowId === target.rowId);
                if (!matchingSource && sourceCellsArr.length === 1) matchingSource = sourceCellsArr[0];

                if (matchingSource) {
                    const sourceCol = columns.find(c => c.id === matchingSource.colId);
                    if (sourceCol.type === targetCol.type) {
                        newStore[target.key] = JSON.parse(JSON.stringify(matchingSource.valObj));
                    }
                }
            });

            updateDataWithHistory(newStore);
            setSelectedCells(new Set([...selectedCells, ...fillTargetCells]));
        }

        setIsDragging(false);
        setIsFillDragging(false);
        setFillTargetCells(new Set());
        setFillStartCell(null);
    };

    useEffect(() => {
        const handlePaste = async (e) => {
            if (selectedCells.size === 0 || editingCell) return;
            if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

            e.preventDefault();
            const text = (e.clipboardData || window.clipboardData).getData('text');

            if (text !== undefined) {
                const newState = { ...enrichedDataStore };
                selectedCells.forEach(key => {
                    newState[key] = { value: text };
                });
                updateDataWithHistory(newState);
            }
        };

        document.addEventListener('paste', handlePaste);
        return () => document.removeEventListener('paste', handlePaste);
    }, [selectedCells, editingCell, enrichedDataStore, history, historyIndex]);

    useEffect(() => {
        const handleCopy = (e) => {
            if (selectedCells.size === 0 || editingCell) return;
            if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

            const keysArray = Array.from(selectedCells);
            const activeKey = anchorCell ? `${anchorCell.rowId}:${anchorCell.colId}` : keysArray[0];
            const keyToCopy = selectedCells.has(activeKey) ? activeKey : keysArray[0];
            const [rid, cid] = keyToCopy.split(':');
            const valObj = getCellValueObj(parseInt(rid), cid);
            e.clipboardData.setData('text/plain', valObj.value);
            e.preventDefault();
        };

        document.addEventListener('copy', handleCopy);
        return () => document.removeEventListener('copy', handleCopy);
    }, [selectedCells, editingCell, enrichedDataStore, data, anchorCell]);


    useEffect(() => {
        window.addEventListener('mouseup', handleMouseUp);
        return () => window.removeEventListener('mouseup', handleMouseUp);
    }, [isFillDragging, fillTargetCells, selectedCells, enrichedDataStore, history, historyIndex]);

    const handleDoubleClick = (rowId, colId) => setEditingCell({ rowId, colId });
    const handleCellEdit = (newValue) => {
        if (!editingCell) return;
        const { rowId, colId } = editingCell;
        const currentObj = getCellValueObj(rowId, colId);
        const newState = { ...enrichedDataStore, [`${rowId}:${colId}`]: { ...currentObj, value: newValue } };
        updateDataWithHistory(newState);
        setEditingCell(null);
    };
    const handleDeleteColumn = (colId) => {
        if (window.confirm("Delete column?")) setColumns(prev => prev.filter(c => c.id !== colId));
    };
    const handleSaveApiKey = (key) => {
        setLocalApiKey(key);
        setIsApiKeyModalOpen(false);
    };

    // --- Gemini API with Fallback ---
    const runGeminiForCell = async (row, colDef, instruction = "") => {
        const cellKey = `${row.id}:${colDef.id}`;

        // Use user's local key if available, otherwise the environment key
        const effectiveKey = localApiKey || apiKey;

        if (!effectiveKey) {
            setProcessingCells(prev => { const next = new Set(prev); next.delete(cellKey); return next; });
            setEnrichedDataStore(prev => ({ ...prev, [cellKey]: { value: "Auth Error", process: ["No API Key provided"], sources: [] } }));
            return;
        }

        let fullPrompt = "";

        if (instruction) {
            const currentVal = getCellValueObj(row.id, colDef.id).value;
            fullPrompt = `Transform this value: "${currentVal}".\nInstruction: ${instruction}.\nOutput ONLY the transformed value text.`;
        } else {
            let contextString = "Row Data:\n";
            columns.forEach(c => {
                if (c.id === colDef.id) return;
                const valObj = getCellValueObj(row.id, c.id);
                contextString += `- ${c.label}: ${valObj.value}\n`;
            });
            fullPrompt = `${contextString}\n\nTask: ${colDef.prompt}\n\nIMPORTANT: Use Google Search to find accurate info. \nOutput ONLY a JSON object with this structure:\n{ "answer": "The concise answer", "process": ["Step 1...", "Step 2..."] }`;
        }

        const performRequest = async (useGrounding, useJson) => {
            const payload = {
                contents: [{ parts: [{ text: fullPrompt }] }]
            };

            // Only add generationConfig if we want JSON and it's not an instruction-based edit
            if (useJson && !instruction) {
                payload.generationConfig = { responseMimeType: "application/json" };
            }

            if (useGrounding) {
                payload.tools = [{ google_search: {} }];
            }

            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${effectiveKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                }
            );

            if (!response.ok) {
                const text = await response.text();
                console.warn("API Error", response.status, text);
                throw new Error(`HTTP ${response.status}`);
            }
            return await response.json();
        };

        try {
            let result;
            let usedGrounding = true;

            try {
                // 1. Try Search + JSON
                result = await performRequest(true, true);
            } catch (e) {
                console.log("Retrying without grounding...");
                usedGrounding = false;
                try {
                    // 2. Try Just JSON
                    result = await performRequest(false, true);
                } catch (e2) {
                    console.log("Retrying as plain text...");
                    // 3. Try Plain Text
                    result = await performRequest(false, false);
                }
            }

            const candidate = result.candidates?.[0];
            const text = candidate?.content?.parts?.[0]?.text || "";
            const groundingMetadata = candidate?.groundingMetadata;

            let newData;

            if (instruction) {
                newData = {
                    value: text.trim(),
                    process: ["Smart Edit Applied: " + instruction],
                    sources: []
                };
            } else {
                let parsedResponse = { answer: "Error parsing", process: [] };
                // Attempt to parse JSON from raw text even if mimetype wasn't enforced
                // Often models output ```json ... ``` blocks in text mode
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                const jsonText = jsonMatch ? jsonMatch[0] : text;

                try {
                    parsedResponse = JSON.parse(jsonText);
                } catch (e) {
                    // Final fallback: treat entire text as answer
                    parsedResponse.answer = text;
                }

                const sources = groundingMetadata?.groundingAttributions?.flatMap(attr =>
                    attr.web ? [{ title: attr.web.title, uri: attr.web.uri }] : []
                ) || [];

                const process = parsedResponse.process || ["Executed prompt with context."];
                if (!usedGrounding) process.push("(Search was unavailable, used internal knowledge)");

                newData = {
                    value: parsedResponse.answer,
                    process: process,
                    sources: sources
                };
            }

            setProcessingCells(prev => { const next = new Set(prev); next.delete(cellKey); return next; });
            setEnrichedDataStore(prev => ({ ...prev, [cellKey]: newData }));

        } catch (error) {
            console.error("Gemini Final Error", error);
            setProcessingCells(prev => { const next = new Set(prev); next.delete(cellKey); return next; });
            const errVal = "Failed";
            setEnrichedDataStore(prev => ({ ...prev, [cellKey]: { value: errVal, process: ["API Error"], sources: [] } }));
        }
    };

    const handleSmartEdit = (instruction) => {
        setIsSmartEditOpen(false);
        if (selectedCells.size === 0) return;

        const newProcessing = new Set(processingCells);
        Array.from(selectedCells).forEach(cellKey => newProcessing.add(cellKey));
        setProcessingCells(newProcessing);

        Array.from(selectedCells).forEach((cellKey, index) => {
            const [rowId, colId] = cellKey.split(':');
            const row = data.find(r => r.id === parseInt(rowId));
            const colDef = columns.find(c => c.id === colId);

            setTimeout(() => {
                runGeminiForCell(row, colDef, instruction);
            }, index * 50);
        });
    };

    const handleCreateColumn = (name, prompt) => {
        const newColId = name.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now();
        const newColDef = { id: newColId, label: name, w: 220, icon: "✨", type: 'enrichable', prompt: prompt };
        setColumns(prev => [...prev, newColDef]);
        setIsAddColOpen(false);
    };

    const handleUpdateColumn = (name, prompt) => {
        if (!editingColumnId) return;
        setColumns(prev => prev.map(col =>
            col.id === editingColumnId
                ? { ...col, label: name, prompt: prompt }
                : col
        ));
        setEditingColumnId(null);
    };

    const handleEnrichSelection = async () => {
        let cellsToProcess = [];
        if (selectedCells.size > 0) {
            Array.from(selectedCells).forEach(cellKey => {
                const [rowId, colId] = cellKey.split(':');
                const colDef = columns.find(c => c.id === colId);
                if (colDef?.prompt) cellsToProcess.push({ rowId: parseInt(rowId), colDef });
            });
        }
        if (cellsToProcess.length === 0) return;
        const newProcessing = new Set(processingCells);
        cellsToProcess.forEach(item => newProcessing.add(`${item.rowId}:${item.colDef.id}`));
        setProcessingCells(newProcessing);
        cellsToProcess.forEach((item, index) => {
            setTimeout(() => { runGeminiForCell(data.find(r => r.id === item.rowId), item.colDef); }, index * 50);
        });
    };

    const editingColumnDef = editingColumnId ? columns.find(c => c.id === editingColumnId) : null;
    const selectionCount = selectedCells.size > 0 ? selectedCells.size : selectedRowIds.size;
    const runnableCount = Array.from(selectedCells).filter(k => {
        const cid = k.split(':')[1];
        return columns.find(c => c.id === cid)?.prompt;
    }).length;

    return (
        <div className= "flex flex-col h-screen bg-white text-slate-900 font-sans tracking-tight overflow-hidden select-none" >

        { isApiKeyModalOpen && <APIKeyModal onClose={ () => setIsApiKeyModalOpen(false) } onSave = { handleSaveApiKey } currentKey = { localApiKey } />}

<ChatSidebar 
        isOpen={ isChatOpen }
onClose = {() => setIsChatOpen(false)}
data = { data }
columns = { columns }
getCellValueObj = { getCellValueObj }
apiKey = { localApiKey || apiKey} 
      />

    < div className = "h-12 border-b border-slate-200 flex items-center justify-between px-3 bg-white z-20 shrink-0" >
        <div className="flex items-center gap-3" >
            <div className="w-6 h-6 bg-slate-900 rounded-[4px] flex items-center justify-center text-white font-bold text-xs shadow-sm" > F </div>
                < div className = "flex items-center gap-2 text-sm text-slate-500" >
                    <span className="hover:bg-slate-50 px-1.5 rounded cursor-pointer" > Projects </span>
                        < span className = "text-slate-300" > /</span >
                            <span className="font-medium text-slate-900 px-1.5 rounded cursor-pointer" > Fluar </span>
                                </div>
                                </div>
                                < div className = "flex items-center gap-3" >
                                    <button className="text-xs font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-[4px] border border-slate-200" > <Command className="w-3 h-3" /> Search </button>
                                        < div className = "w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border-2 border-white shadow-sm" > </div>
                                            </div>
                                            </div>
                                            < div className = "h-12 border-b border-slate-200 flex items-center px-3 gap-2 shrink-0 overflow-x-auto no-scrollbar bg-white" >
                                                <ToolbarButton icon={ Zap } onClick = {() => setIsApiKeyModalOpen(true)} isActive = {!!localApiKey}> Connect API </ToolbarButton>
                                                    < div className = "h-4 w-[1px] bg-slate-200 mx-1" > </div>
                                                        < ToolbarButton icon = { Download } > Import CSV </ToolbarButton>
                                                            < div className = "flex-1" > </div>
                                                                < ToolbarButton icon = { MessageSquare } onClick = {() => setIsChatOpen(true)} isActive = { isChatOpen } > Ask Data </ToolbarButton>
                                                                    < ToolbarButton icon = { Share2 } > Share </ToolbarButton>
                                                                        < button className = "flex items-center gap-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-[4px] shadow-sm transition-all active:scale-95" >
                                                                            <Zap className="w-3.5 h-3.5 fill-current" /> AI Agent
                                                                                </button>
                                                                                </div>

                                                                                < div className = "flex-1 overflow-auto relative bg-slate-50/50" ref = { gridRef } >
                                                                                    <div className="inline-block min-w-full align-middle" >
                                                                                        <div className="sticky top-0 z-20 bg-white flex border-b border-slate-200 w-max min-w-full shadow-sm" >
                                                                                            <div className="w-10 px-2 py-2 flex items-center justify-center border-r border-slate-200 bg-slate-50/80 backdrop-blur-sm" >
                                                                                                <input type="checkbox" checked = { selectedRowIds.size === data.length && data.length > 0 } onChange = { toggleSelectAllRows } className = "rounded-[3px] border-slate-300 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5 cursor-pointer bg-white" />
                                                                                                    </div>
                                                                                                    < div className = "w-10 px-2 py-2 flex items-center justify-center border-r border-slate-200 bg-slate-50/80 backdrop-blur-sm text-[10px] font-bold text-slate-400" ># </div>
{
    columns.map((col) => (
        <div key= { col.id } style = {{ width: col.w }} className = {`px-3 py-2 border-r border-slate-200 bg-slate-50/80 backdrop-blur-sm flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500 group hover:bg-slate-100 cursor-pointer select-none relative`}>
            { col.icon && <span className="text-[10px] text-slate-400 opacity-70"> { col.icon } </span> }
{ col.label }
<div className="ml-auto flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-1" >
    <button onClick={ (e) => { e.stopPropagation(); setEditingColumnId(col.id); } } className = "p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-600" title = "Settings" > <Settings className="w-3 h-3" /> </button>
        < button onClick = {(e) => { e.stopPropagation(); handleDeleteColumn(col.id); }} className = "p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-red-500" title = "Delete" > <Trash2 className="w-3 h-3" /> </button>
            </div>
            </div>
                ))}
<div onClick={ () => setIsAddColOpen(!isAddColOpen) } className = "relative w-24 px-3 py-2 border-r border-slate-200 bg-slate-50/80 backdrop-blur-sm flex items-center text-[11px] font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors" >
    + Add
{ isAddColOpen && <ColumnSettingsPopover mode="create" onClose = {(e) => { e.stopPropagation(); setIsAddColOpen(false); } } onSave = { handleCreateColumn } />}
</div>
{
    editingColumnId && editingColumnDef && (
        <div className="absolute top-12 z-50" style = {{ left: "50%" }
}>
    <ColumnSettingsPopover mode="edit" initialName = { editingColumnDef.label } initialPrompt = { editingColumnDef.prompt || "" } onClose = {(e) => { e.stopPropagation(); setEditingColumnId(null); }} onSave = { handleUpdateColumn } />
        </div>
                )}
</div>

    < div className = "bg-white w-max min-w-full pb-32" >
    {
        data.map((row, index) => {
            const isRowSelected = selectedRowIds.has(row.id);
            return (
                <div key= { row.id } className = {`flex group ${isRowSelected ? 'bg-indigo-50/40' : ''}`
        }>
        <div className={`w-10 px-2 py-2 flex items-center justify-center border-r border-b border-slate-200 sticky left-0 z-10 transition-colors ${isRowSelected ? 'bg-indigo-50/40' : 'bg-white group-hover:bg-slate-50'}`} >
        <input type="checkbox" checked = { isRowSelected } onChange = {(e) => { toggleRowSelect(row.id); }} className = "rounded-[3px] border-slate-300 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5 cursor-pointer" />
            </div>
            < div className = {`w-10 px-2 py-2 flex items-center justify-center border-r border-b border-slate-200 text-[10px] text-slate-400 font-mono select-none transition-colors ${isRowSelected ? 'bg-indigo-50/40' : 'bg-white group-hover:bg-slate-50'}`}>
                { index + 1}
</div>

{
    columns.map((col, colIdx) => {
        const cellKey = `${row.id}:${col.id}`;
        const isSelected = selectedCells.has(cellKey);
        const isFillTarget = fillTargetCells.has(cellKey);
        const isLoading = processingCells.has(cellKey);
        const valueObj = getCellValueObj(row.id, col.id);
        const isEditing = editingCell && editingCell.rowId === row.id && editingCell.colId === col.id;

        let isSelectionTop = false, isSelectionBottom = false, isSelectionLeft = false, isSelectionRight = false;
        if (isSelected) {
            const topKey = `${data[index - 1]?.id}:${col.id}`;
            const bottomKey = `${data[index + 1]?.id}:${col.id}`;
            const leftKey = `${row.id}:${columns[colIdx - 1]?.id}`;
            const rightKey = `${row.id}:${columns[colIdx + 1]?.id}`;
            isSelectionTop = !selectedCells.has(topKey);
            isSelectionBottom = !selectedCells.has(bottomKey);
            isSelectionLeft = !selectedCells.has(leftKey);
            isSelectionRight = !selectedCells.has(rightKey);
        }

        let content = valueObj.value;
        if (col.id === 'name' && !isEditing) content = <div className="flex items-center gap-2 font-medium text-slate-800" > <div className={ `w-4 h-4 rounded-[2px] flex items-center justify-center text-[9px] text-white font-bold flex-shrink-0 ${['bg-indigo-500', 'bg-rose-500', 'bg-emerald-500', 'bg-amber-500'][row.id % 4]}` }> { valueObj.value[0] } < /div>{valueObj.value}</div >;
                                else if (col.id === 'type' && !isEditing) content = <StatusBadge type={ valueObj.value } />;
                                else if (col.id === 'website' && valueObj.value && !isEditing) content = <span className="text-indigo-600 hover:underline cursor-pointer" > { valueObj.value } </span>;
                                else if (!valueObj.value && col.prompt && !isLoading && !isEditing) content = <span className="text-slate-300 text-xs italic" > Ready to generate </span>;

        return (
            <DataCell
                                        key= { col.id }
        rowId = { row.id }
        colId = { col.id }
        width = { col.w }
        isSelected = { isSelected }
        isSelectionTop = { isSelectionTop }
        isSelectionBottom = { isSelectionBottom }
        isSelectionLeft = { isSelectionLeft }
        isSelectionRight = { isSelectionRight }
        isFillTarget = { isFillTarget }
        isLoading = { isLoading }
        onMouseDown = { handleCellMouseDown }
        onMouseEnter = { handleCellMouseEnter }
        onDoubleClick = { handleDoubleClick }
        onHandleMouseDown = { handleFillHandleMouseDown }
        isEditing = { isEditing }
        onEdit = { handleCellEdit }
        valueObj = { valueObj }
            >
            { content }
            </DataCell>
                                );
})}
<div className="w-20 border-b border-r border-slate-200 bg-white group-hover:bg-slate-50" />
    </div>
                    );
                })}
<div className="flex border-b border-slate-200 bg-white hover:bg-slate-50 group" >
    <div className="w-10 border-r border-slate-200 p-2 flex items-center justify-center text-slate-300" > <Plus className="w-4 h-4" /> </div>
        < div className = "w-full p-2 text-xs text-slate-400 italic cursor-pointer flex items-center gap-2" > <Plus className="w-3 h-3" /> New entry </div>
            </div>
            </div>
            </div>
            </div>

{
    (selectedCells.size > 0) && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white rounded-[6px] shadow-[0_8px_30px_rgb(0,0,0,0.2)] py-1 px-1 flex items-center gap-1 animate-in slide-in-from-bottom-4 duration-200 z-50 border border-slate-800 ring-1 ring-white/10" >
            <div className="px-3 py-1.5 text-xs font-medium border-r border-slate-700 flex items-center gap-2 text-slate-300" > <span className="min-w-[18px] h-[18px] rounded-[3px] bg-indigo-500 text-white flex items-center justify-center text-[10px] font-bold shadow-sm" > { selectionCount } < /span>Cells</div >

                <button onClick={ () => setIsSmartEditOpen(true) } className = "flex items-center gap-2 px-3 py-1.5 hover:bg-white/10 cursor-pointer hover:shadow-sm rounded-[4px] transition-all group border-r border-slate-700 mr-1" >
                    <Wand2 className="w-3.5 h-3.5 text-indigo-300 group-hover:text-indigo-100" />
                        <span className="text-xs font-semibold text-slate-300 group-hover:text-white" > Smart Edit </span>
                            </button>

                            < button onClick = { handleEnrichSelection } disabled = { runnableCount === 0
} className = {`flex items-center gap-2 px-3 py-1.5 rounded-[4px] transition-all group ${runnableCount === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white/10 cursor-pointer hover:shadow-sm'}`}>
    <div className="relative w-3.5 h-3.5" > <Play className={ `w-3.5 h-3.5 ${runnableCount > 0 ? 'text-indigo-400 fill-indigo-400' : 'text-slate-500 fill-slate-500'}` } /></div > <span className={ `text-xs font-semibold ${runnableCount > 0 ? 'text-indigo-100 group-hover:text-white' : 'text-slate-400'}` }> { runnableCount > 0 ? `Run ${runnableCount} cells` : 'Run Column'}</span>
        </button>

{ isSmartEditOpen && <SmartEditPopover onClose={ () => setIsSmartEditOpen(false) } onRun = { handleSmartEdit } />}
</div>
      )}
</div>
  );
}