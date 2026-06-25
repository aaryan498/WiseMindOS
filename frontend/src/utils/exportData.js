/**
 * Utility to export user workspace statistics and data structures as JSON
 */
export const exportWorkspaceData = (userData) => {
  try {
    if (!userData || Object.keys(userData).length === 0) {
      alert("No workspace data found to export!");
      return;
    }

    // Wrap metadata around the context tracking arrays
    const exportPayload = {
      project: "WiseMindOS",
      exportedAt: new Date().toISOString(),
      backupVersion: "1.0",
      data: userData
    };

    // Construct the data string and anchor elements for instant download
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `wisemindos_backup_${new Date().toISOString().split('T')[0]}.json`);
    
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
  } catch (error) {
    console.error("Failed to export workspace bundle:", error);
    alert("An error occurred while downloading your backup file.");
  }
};