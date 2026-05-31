import { useState, useEffect } from "react";
import { Plus, Trash2, Search, Pencil, Book, FileText, Edit, Bold, Italic, Save } from "lucide-react";
import { useApp } from "../store/AppContext";
import { showToast } from "../utils/toastHelper";

const Bag = () => {
  const {
    notebooks,
    pages,
    createNotebook,
    deleteNotebook,
    loadPages,
    createPage,
    updatePage,
    updateNotebook,
    deletePage
  } = useApp();

  const [search, setSearch] = useState("");
  const [pageSearch, setPageSearch] = useState("");
  const [editingNotebook, setEditingNotebook] = useState(null);
  const [tempName, setTempName] = useState("");
  const [view, setView] = useState("notebooks");
  const [activeNotebook, setActiveNotebook] = useState(null);
  const [activePage, setActivePage] = useState(null);
  const [editorContent, setEditorContent] = useState("");

  const currentNotebook = notebooks.find(nb => nb.id === activeNotebook);
  const currentPage = pages.find(p => p.id === activePage);

  useEffect(() => {
    if (currentPage) {
      setEditorContent(currentPage.content || "");
    }
  }, [activePage, currentPage]);

  const updateContent = (value) => {
    if (!activePage) return;
    updatePage(activePage, value);
  };

  const addNotebook = async () => {
    await createNotebook("New Notebook");
    showToast({ message: 'New Notebook Created', status: "success" });
  };

  const addPage = async () => {
    if (!activeNotebook) return;
    await createPage(activeNotebook);
    await loadPages(activeNotebook);
    showToast({ message: 'New Page Created', status: "success" });
  };

  // =========================
  // SUB-VIEWS RENDERING
  // =========================

  const renderNotebooksView = () => (
    <div className="h-full flex flex-col animate-fadeIn">
      <div className="flex justify-between items-center mb-5 px-1">
        <div>
          <h2 className="text-white text-2xl font-bold tracking-tight">Notebooks</h2>
          <p className="text-xs text-slate-400 mt-0.5">Organize your digital workspaces</p>
        </div>
        <button 
          className="bg-gradient-to from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-95 text-white p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center" 
          onClick={addNotebook}
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Search notebooks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-800/60 text-slate-200 placeholder-slate-500 rounded-xl border border-white/5 focus:border-indigo-500/50 focus:bg-slate-800 outline-none transition-all text-sm"
        />
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
        {notebooks
          .filter(nb => nb.name.toLowerCase().includes(search.toLowerCase()))
          .map(nb => {
            const isSelected = activeNotebook === nb.id;
            return (
              <div
                key={nb.id}
                onClick={() => {
                  setActiveNotebook(nb.id);
                  loadPages(nb.id);
                  setActivePage(null);
                  setView("pages");
                }}
                className={`group p-3.5 rounded-xl cursor-pointer border transition-all duration-200 ${
                  isSelected
                    ? "bg-indigo-600/15 border-indigo-500/40 text-white shadow-md shadow-indigo-500/5"
                    : "bg-slate-800/40 border-white/5 hover:border-white/10 text-slate-300 hover:bg-slate-800/70"
                }`}
              >
                {editingNotebook === nb.id ? (
                  <input
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onBlur={async () => {
                      if (!tempName.trim()) return;
                      await updateNotebook(nb.id, tempName);
                      showToast({ message: "Updated Name", status: "success" });
                      setEditingNotebook(null);
                    }}
                    onKeyDown={async (e) => {
                      if (e.key === "Enter") {
                        if (!tempName.trim()) return;
                        await updateNotebook(nb.id, tempName);
                        showToast({ message: "Updated Name", status: "success" });
                        setEditingNotebook(null);
                      }
                    }}
                    className="bg-slate-700 text-white px-2 py-0.5 rounded border border-indigo-500 outline-none w-full text-sm font-medium"
                    autoFocus
                  />
                ) : (
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm tracking-wide">{nb.name}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingNotebook(nb.id);
                          setTempName(nb.name);
                        }}
                        className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-white/5 transition-all"
                      >
                        <Pencil size={14} />
                      </button>
                      <button 
                        onClick={async (e) => {
                          e.stopPropagation();
                          await deleteNotebook(nb.id);
                          showToast({ message: `Notebook: ${nb.name} Deleted`, status: "success" });
                          setActiveNotebook(null);
                          setActivePage(null);
                          setView("notebooks");
                        }}
                        className="p-1 text-slate-400 hover:text-red-400 rounded-md hover:bg-red-500/10 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );

  const renderPagesView = () => {
    if (!currentNotebook) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-slate-500 animate-fadeIn">
          <Book className="mb-2 opacity-40" size={36} />
          <p className="text-sm">Select a notebook first to view pages</p>
        </div>
      );
    }

    return (
      <div className="h-full flex flex-col animate-fadeIn">
        <div className="flex justify-between items-center mb-5 px-1">
          <div>
            <h2 className="text-white text-xl font-bold tracking-tight truncate max-w-200px">
              {currentNotebook.name}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Manage inner documents</p>
          </div>
          <button 
            className="bg-gradient-to from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-95 text-white p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center" 
            onClick={addPage}
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search pages..."
            value={pageSearch}
            onChange={(e) => setPageSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800/60 text-slate-200 placeholder-slate-500 rounded-xl border border-white/5 focus:border-emerald-500/50 focus:bg-slate-800 outline-none transition-all text-sm"
          />
        </div>

        <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
          {pages
            .filter(p => p.title?.toLowerCase().includes(pageSearch.toLowerCase()))
            .map(p => {
              const isSelected = activePage === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    setActivePage(p.id);
                    setView("editor");
                  }}
                  className={`group p-3.5 rounded-xl cursor-pointer border transition-all duration-200 ${
                    isSelected
                      ? "bg-emerald-600/15 border-emerald-500/40 text-white shadow-md shadow-emerald-500/5"
                      : "bg-slate-800/40 border-white/5 hover:border-white/10 text-slate-300 hover:bg-slate-800/70"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm tracking-wide">{p.title || "Untitled Document"}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePage(p.id, activeNotebook);
                        if (activePage === p.id) setActivePage(null);
                        showToast({ message: "Page Removed", status: "success" });
                      }}
                      className="p-1 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-400 rounded-md hover:bg-red-500/10 transition-all duration-150"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
  };

  const renderEditorView = () => (
    <div className="h-full flex flex-col animate-fadeIn">
      <div className="mb-4 px-1">
        <h2 className="text-white text-base font-bold tracking-wide flex items-center gap-1.5 truncate">
          <span className="text-indigo-400 font-medium text-sm">{currentNotebook?.name}</span>
          {currentPage && <span className="text-slate-500 font-normal text-xs">&gt;</span>}
          <span className="text-slate-200 text-sm truncate">{currentPage?.title}</span>
        </h2>
      </div>

      {currentPage ? (
        <>
          <div className="flex gap-1.5 mb-3 p-1 bg-slate-800/50 border border-white/5 rounded-lg w-fit">
            <button
              onClick={() => updateContent(currentPage.content + "**bold**")}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded transition-all cursor-pointer"
              title="Bold"
            >
              <Bold size={15} />
            </button>
            <button
              onClick={() => updateContent(currentPage.content + "_italic_")}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded transition-all cursor-pointer"
              title="Italic"
            >
              <Italic size={15} />
            </button>
          </div>

          <textarea
            value={currentPage.content}
            onChange={(e) => {
              setEditorContent(e.target.value);
              updateContent(e.target.value);
            }}
            placeholder="Start typing your notes here using Markdown..."
            className="flex-1 w-full bg-slate-800/40 text-slate-200 placeholder-slate-600 border border-white/5 rounded-xl p-4 focus:outline-none focus:border-purple-500/30 focus:bg-slate-800/60 transition-all resize-none text-sm leading-relaxed custom-scrollbar"
          />
          
          <button
            onClick={async () => {
              try {
                if (!activePage) return;
                await updatePage(activePage, editorContent);
                showToast({ message: "Saved Content", status: "success" });
              } catch (error) {
                showToast({ message: error.message || "Error Saving", status: "error" });
              }
            }}
            className="mt-4 px-4 py-2 cursor-pointer bg-gradient from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md shadow-purple-600/10 text-white font-medium text-sm rounded-xl self-end flex items-center gap-2 active:scale-95 transition-all"
          >
            <Save size={16} />
            Save
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 text-slate-500">
          <Edit className="mb-2 opacity-40" size={36} />
          <p className="text-sm">Select a page step to initialize workspace view</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="relative h-[80vh] md:h-[85vh] bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 flex flex-col shadow-2xl shadow-black/40 overflow-hidden select-none">
      
      {/* Dynamic View Toggles Container */}
      <div className="mb-5 flex p-1 bg-slate-950/40 border border-white/5 rounded-xl">
        <button
          onClick={() => setView("notebooks")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer ${
            view === "notebooks" 
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" 
              : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
          }`}
        >
          <Book size={15} />
          <span>Notebooks</span>
        </button>

        <button
          onClick={() => setView("pages")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer ${
            view === "pages" 
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10" 
              : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
          }`}
        >
          <FileText size={15} />
          <span>Pages</span>
        </button>

        <button
          onClick={() => setView("editor")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer ${
            view === "editor" 
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/10" 
              : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
          }`}
        >
          <Edit size={15} />
          <span>Editor</span>
        </button>
      </div>

      {/* Primary Layout Engine */}
      <div className="flex-1 overflow-hidden relative">
        {view === "notebooks" && renderNotebooksView()}
        {view === "pages" && renderPagesView()}
        {view === "editor" && renderEditorView()}
      </div>
    </div>
  );
};

export default Bag;