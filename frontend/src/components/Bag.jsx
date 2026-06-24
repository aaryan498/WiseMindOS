import { useMemo, useState } from "react";
import { Plus, Trash2, Search, Pencil, Book, FileText, Edit } from "lucide-react";
import { useApp } from "../store/AppContext";
import { showToast } from "../utils/toastHelper";
import EmptyState from "./EmptyState";

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
  const currentNotebook = notebooks.find(nb => nb.id === activeNotebook);
  const currentPage = pages.find(p => p.id === activePage);
  const filteredNotebooks = notebooks.filter(nb =>
    nb.name.toLowerCase().includes(search.toLowerCase())
  );

  const notebookPages = useMemo(() => (
    pages
      .filter(p => String(p.notebookId) === String(activeNotebook))
      .sort((a, b) => a.order - b.order)
  ), [pages, activeNotebook]);

  const filteredPages = notebookPages.filter(p =>
    (p.title ?? '')
      .toLowerCase()
      .includes(pageSearch.toLowerCase())
  );

  const updateContent = (value) => {
    if (!activePage) return;
    updatePage(activePage, value);
  };

  const addNotebook = async() => {
    await createNotebook("New Notebook");
    showToast({message: 'New Notebook Created', status: "success"})
  };

  const addPage = async () => {
    if (!activeNotebook) return;
    await createPage(activeNotebook);
    await loadPages(activeNotebook);
  };

  return (
    <div className="relative h-[80vh] md:h-[85vh] bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 flex flex-col">

      {/* Bottom Navigation */}
      <div className="mb-4 flex justify-around border-b border-white/10 pb-3">
        <button
          onClick={() => setView("notebooks")}
          className={`flex flex-col cursor-pointer items-center ${view === "notebooks" ? "text-indigo-400" : "text-gray-400"
            }`}
        >
          <Book size={20} />
          <span className="text-xs">Notebooks</span>
        </button>

        <button
          onClick={() => setView("pages")}
          className={`flex flex-col cursor-pointer items-center ${view === "pages" ? "text-green-400" : "text-gray-400"
            }`}
        >
          <FileText size={20} />
          <span className="text-xs">Pages</span>
        </button>

        <button
          onClick={() => setView("editor")}
          className={`flex flex-col cursor-pointer items-center ${view === "editor" ? "text-purple-400" : "text-gray-400"
            }`}
        >
          <Edit size={20} />
          <span className="text-xs">Editor</span>
        </button>
      </div>

      {/* MAIN VIEW */}
      <div className="flex-1 overflow-hidden">
        {view === "notebooks" && (
          <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-4 px-3">
              <h2 className="text-white text-xl font-semibold">Notebooks</h2>
              <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:translate-y-1 active:scale-95 text-white p-3 rounded-lg transition-all cursor-pointer" onClick={addNotebook}>
                <Plus size={24} />
              </button>
            </div>

            <input
              placeholder="Search notebooks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-4 px-3 py-2 bg-gray-800 text-white rounded-lg outline-none"
            />

            <div className="flex-1 overflow-y-auto space-y-2">
              {filteredNotebooks.length > 0 ? (
                filteredNotebooks.map(nb => (
                  <div
                    key={nb.id}
                    onClick={() => {
                      setActiveNotebook(nb.id);
                      loadPages(nb.id);
                      setActivePage(null);
                      setView("pages");
                    }}
                    className={`p-3 rounded-lg cursor-pointer ${activeNotebook === nb.id
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-700 text-gray-300"
                      }`}
                  >
                    {editingNotebook === nb.id ? (
                      <input
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        onBlur={async() => {
                          if (!tempName.trim()) return;
                          await updateNotebook(nb.id, tempName);
                          showToast({message: "Updated Name", status: "success"})
                          setEditingNotebook(null);
                        }}
                        onKeyDown={async(e) => {
                          if (e.key === "Enter") {
                            if (!tempName.trim()) return;
                            await updateNotebook(nb.id, tempName);
                            showToast({message: "Updated Name", status: "success"})
                            setEditingNotebook(null);
                          }
                        }}
                        className="bg-transparent text-white outline-none"
                        autoFocus
                      />
                    ) : (
                      <div className="flex justify-between items-center">
                        <span>{nb.name}</span>
                        <div className="flex gap-2">
                          <Pencil
                            size={14}
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingNotebook(nb.id);
                              setTempName(nb.name);
                            }}
                          />
                          <Trash2
                            size={14}
                            className="text-red-400"
                            onClick={async(e) => {
                              e.stopPropagation();
                              await deleteNotebook(nb.id);
                              showToast({message: `Notebook: ${nb.name} Deleted`, status: "success"})
                              setActiveNotebook(null);
                              setActivePage(null);
                              setView("notebooks");
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <EmptyState
                  icon={search ? Search : Book}
                  title={search ? "No notebooks found" : "No notebooks yet"}
                  description={search ? "Try a different search term." : "Create a notebook to start collecting notes and plans."}
                  actionLabel={search ? undefined : "Create Notebook"}
                  onAction={search ? undefined : addNotebook}
                  testId="empty-create-notebook-btn"
                  className="border-0 bg-transparent shadow-none"
                />
              )}
            </div>
          </div>
        )}
        {view === "pages" && (
          currentNotebook ? (
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center mb-4 px-3">
                <h2 className="text-white text-lg font-semibold">
                  {currentNotebook.name}
                </h2>
                <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:translate-y-1 active:scale-95 text-white p-3 rounded-xl transition-all cursor-pointer" onClick={addPage}>
                  <Plus size={24} />
                </button>
              </div>

              <input
                placeholder="Search pages..."
                value={pageSearch}
                onChange={(e) => setPageSearch(e.target.value)}
                className="mb-4 px-3 py-2 bg-gray-800 text-white rounded-lg outline-none"
              />

              <div className="flex-1 overflow-y-auto space-y-2">
                {filteredPages.length > 0 ? (
                  filteredPages.map(p => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setActivePage(p.id);
                        setView("editor");
                      }}
                      className={`p-3 rounded-lg cursor-pointer ${activePage === p.id
                        ? "bg-green-600 text-white"
                        : "bg-gray-700 text-gray-300"
                        }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{p.title}</span>
                        <Trash2
                          size={14}
                          className="text-red-400"
                          onClick={async (e) => {
                            e.stopPropagation();
                            await deletePage(p.id, activeNotebook);
                            if (activePage === p.id) setActivePage(null);
                          }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState
                    icon={pageSearch ? Search : FileText}
                    title={pageSearch ? "No pages found" : "No pages in this notebook"}
                    description={pageSearch ? "Try a different page title." : "Add a page to begin writing in this notebook."}
                    actionLabel={pageSearch ? undefined : "Add Page"}
                    onAction={pageSearch ? undefined : addPage}
                    testId="empty-add-page-btn"
                    className="border-0 bg-transparent shadow-none"
                  />
                )}
              </div>
            </div>
          ) : (
            <EmptyState
              icon={Book}
              title="Select a notebook first"
              description="Choose or create a notebook before adding pages."
              actionLabel="Create Notebook"
              onAction={addNotebook}
              testId="empty-pages-create-notebook-btn"
              className="border-0 bg-transparent shadow-none"
            />
          )
        )}
        {view === "editor" && (<div className="h-full flex flex-col">
          <h2 className="text-white text-lg font-semibold mb-3">
            {currentNotebook?.name} {currentPage ? `> ${currentPage.title}` : ""}
          </h2>

          {currentPage ? (
            <>
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() =>
                    updateContent(currentPage.content + "**bold**")
                  }
                  className="text-xs px-2 py-1 bg-gray-700 rounded"
                >
                  B
                </button>
                <button
                  onClick={() =>
                    updateContent(currentPage.content + "_italic_")
                  }
                  className="text-xs px-2 py-1 bg-gray-700 rounded"
                >
                  I
                </button>
              </div>

              <textarea
                value={currentPage.content}
                onChange={(e) => {
                  updateContent(e.target.value);
                }}
                className="flex-1 w-full bg-gray-800 text-white rounded-lg p-4 focus:outline-none resize-none"
              />
              <button
                onClick={async() => {
                  try {
                    if (!activePage) return;
                    await updatePage(activePage, currentPage.content || "");
                    showToast({ message: "Saved Content", status: "success" }); 
                    //redirect to pages view after saving
                    setView("pages");
                    setActivePage(null);
                  } catch (error) {
                    showToast({ message: error.message || "Error Saving", status: "success" });
                  }
                }}
                className="mt-3 px-4 py-2 cursor-pointer bg-green-600 hover:bg-green-700 text-white rounded-lg self-end"
              >
                Save
              </button>
            </>
          ) : (
            <EmptyState
              icon={Edit}
              title="Select a page to start writing"
              description="Choose a page from the notebook list, or add a new page first."
              actionLabel={activeNotebook ? "Add Page" : undefined}
              onAction={activeNotebook ? addPage : undefined}
              testId="empty-editor-add-page-btn"
              className="border-0 bg-transparent shadow-none"
            />
          )}
        </div>)}
      </div>
    </div>
  );
};

export default Bag;
